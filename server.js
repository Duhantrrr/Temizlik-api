const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Güvenlik: Her yerden gelen isteğe izin ver (CORS)
app.use(cors({ origin: '*' }));
app.use(express.json());

// MongoDB Bağlantısı (Senin Bilgilerin)
const MONGO_URI = "mongodb+srv://duhantural2429_db_user:d8UKJ7gimz6tLUt5@cluster0.4x2bbc3.mongodb.net/doga_temizlik?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Baglantisi Basarili"))
    .catch(err => console.log("❌ MongoDB Hatasi: ", err.message));

// Ürün Şablonu
const Urun = mongoose.model('Urun', new mongoose.Schema({
    isim: String,
    fiyat: String,
    aciklama: String,
    resimUrl: String,
    tarih: { type: Date, default: Date.now }
}));

// Root dizini (Boş kalmasın diye hoşgeldin mesajı)
app.get('/', (req, res) => {
    res.send('Doga Temizlik API Calisiyor! Ürünler için /api/urunler adresine gidin.');
});

// Ürünleri Getir
app.get('/api/urunler', async (req, res) => {
    try {
        const urunler = await Urun.find().sort({ tarih: -1 });
        res.json(urunler);
    } catch (err) {
        res.status(500).json({ mesaj: "Hata", detay: err.message });
    }
});

// Ürün Ekle
app.post('/api/urunler', async (req, res) => {
    try {
        const yeni = new Urun(req.body);
        await yeni.save();
        res.status(201).json(yeni);
    } catch (err) {
        res.status(400).json({ mesaj: "Ekleme hatası", detay: err.message });
    }
});

// Ürün Sil
app.delete('/api/urunler/:id', async (req, res) => {
    try {
        await Urun.findByIdAndDelete(req.params.id);
        res.json({ mesaj: "Silindi" });
    } catch (err) {
        res.status(500).json({ mesaj: "Silme hatası", detay: err.message });
    }
});

// Railway için Dinamik Port ve IP Bağlaması (KRİTİK)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda aktif.`);
});
