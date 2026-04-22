const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// --- MONGODB BAĞLANTISI ---
// Senin linkin ve şifren birleştirildi:
const MONGO_URI = "mongodb+srv://duhantural2429_db_user:UEB1CV0H4yhV1Sei@cluster0.4x2bbc3.mongodb.net/doga_temizlik?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Bulut Veritabanına Kalıcı Olarak Bağlandık!"))
    .catch(err => console.log("❌ Bağlantı Hatası:", err));

// ÜRÜN ŞABLONU (Model)
const Urun = mongoose.model('Urun', new mongoose.Schema({
    isim: { type: String, required: true },
    fiyat: { type: String, required: true },
    aciklama: { type: String, required: true },
    resimUrl: { type: String, required: true },
    tarih: { type: Date, default: Date.now }
}));

// TÜM ÜRÜNLERİ GETİR
app.get('/api/urunler', async (req, res) => {
    try {
        const urunler = await Urun.find().sort({ tarih: -1 }); // En yeni en üstte
        res.json(urunler);
    } catch (err) {
        res.status(500).json({ mesaj: "Veriler çekilemedi" });
    }
});

// YENİ ÜRÜN EKLE
app.post('/api/urunler', async (req, res) => {
    try {
        const yeniUrun = new Urun(req.body);
        await yeniUrun.save();
        res.status(201).json({ mesaj: "Başarılı", urun: yeniUrun });
    } catch (err) {
        res.status(400).json({ mesaj: "Ekleme hatası" });
    }
});

// ÜRÜN SİL
app.delete('/api/urunler/:id', async (req, res) => {
    try {
        await Urun.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Ürün silindi" });
    } catch (err) {
        res.status(500).json({ mesaj: "Silme hatası" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda aktif.`));
