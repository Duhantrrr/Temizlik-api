const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Güvenlik ve Erişim İzinleri (CORS)
app.use(cors());
app.use(express.json());

// --- MONGODB BAĞLANTISI (Doğrulanmış Link) ---
const MONGO_URI = "mongodb+srv://duhantural2429_db_user:d8UKJ7gimz6tLUt5@cluster0.4x2bbc3.mongodb.net/doga_temizlik?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Bulutuna Başarıyla Bağlanıldı!"))
    .catch(err => console.log("❌ Bağlantı Hatası:", err));

// Ürün Şablonu
const Urun = mongoose.model('Urun', new mongoose.Schema({
    isim: { type: String, required: true },
    fiyat: { type: String, required: true },
    aciklama: { type: String, required: true },
    resimUrl: { type: String, required: true },
    tarih: { type: Date, default: Date.now }
}));

// API YOLLARI (ROUTES)

// 1. Tüm Ürünleri Getir
app.get('/api/urunler', async (req, res) => {
    try {
        const urunler = await Urun.find().sort({ tarih: -1 });
        res.json(urunler);
    } catch (err) {
        res.status(500).json({ mesaj: "Hata oluştu", detay: err.message });
    }
});

// 2. Yeni Ürün Ekle
app.post('/api/urunler', async (req, res) => {
    try {
        const yeniUrun = new Urun(req.body);
        await yeniUrun.save();
        res.status(201).json(yeniUrun);
    } catch (err) {
        res.status(400).json({ mesaj: "Ekleme hatası", detay: err.message });
    }
});

// 3. Ürün Sil (MongoDB _id'ye göre)
app.delete('/api/urunler/:id', async (req, res) => {
    try {
        await Urun.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Ürün başarıyla silindi" });
    } catch (err) {
        res.status(500).json({ mesaj: "Silme hatası", detay: err.message });
    }
});

// Railway için dinamik Port ayarı
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda aktif.`);
});
