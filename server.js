const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const DB_FILE = './veritabani.json';

// ÜRÜNLERİ GETİR
app.get('/api/urunler', (req, res) => {
    if (fs.existsSync(DB_FILE)) {
        const veriler = fs.readFileSync(DB_FILE, 'utf8');
        res.json(veriler ? JSON.parse(veriler) : []);
    } else {
        res.json([]);
    }
});

// ÜRÜN EKLE
app.post('/api/urunler', (req, res) => {
    let urunler = [];
    if (fs.existsSync(DB_FILE)) {
        const veriler = fs.readFileSync(DB_FILE, 'utf8');
        if (veriler) urunler = JSON.parse(veriler);
    }
    const yeniUrun = req.body;
    yeniUrun.id = Date.now().toString(); // Her ürüne benzersiz ID veriyoruz
    urunler.push(yeniUrun);
    fs.writeFileSync(DB_FILE, JSON.stringify(urunler, null, 2));
    res.status(201).json({ mesaj: "Başarılı", urun: yeniUrun });
});

// ÜRÜN SİL (YENİ EKLENDİ)
app.delete('/api/urunler/:id', (req, res) => {
    const id = req.params.id;
    if (fs.existsSync(DB_FILE)) {
        let urunler = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        const yeniListe = urunler.filter(u => u.id !== id);
        fs.writeFileSync(DB_FILE, JSON.stringify(yeniListe, null, 2));
        res.json({ mesaj: "Ürün silindi" });
    } else {
        res.status(404).json({ mesaj: "Dosya bulunamadı" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API aktif: ${PORT}`));
