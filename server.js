const express = require('express');
const cors = require('cors');
const fs = require('fs'); // JSON dosyasına yazıp okumak için

const app = express();

// Sitenin API'ye erişebilmesi için güvenlik izni (CORS)
app.use(cors()); 
// Gelen JSON verilerini okuyabilmek için
app.use(express.json()); 

const DB_FILE = './veritabani.json'; // Verilerimizin duracağı dosya

// 1. GET İsteği: Ana sayfa ürünleri çekmek istediğinde çalışır
app.get('/api/urunler', (req, res) => {
    if (fs.existsSync(DB_FILE)) {
        const veriler = fs.readFileSync(DB_FILE, 'utf8');
        res.json(JSON.parse(veriler));
    } else {
        res.json([]); // Dosya yoksa boş liste gönder
    }
});

// 2. POST İsteği: Admin panelinden yeni ürün eklendiğinde çalışır
app.post('/api/urunler', (req, res) => {
    const yeniUrun = req.body;
    let urunler =[];

    // Önce eski ürünleri oku
    if (fs.existsSync(DB_FILE)) {
        const veriler = fs.readFileSync(DB_FILE, 'utf8');
        // Eğer dosya boşsa hata vermemesi için kontrol
        if (veriler) urunler = JSON.parse(veriler);
    }

    // Yeni ürüne benzersiz bir ID ekle
    yeniUrun.id = Date.now().toString();
    
    // Yeni ürünü listeye ekle
    urunler.push(yeniUrun);

    // Listeyi tekrar JSON dosyasına yaz
    fs.writeFileSync(DB_FILE, JSON.stringify(urunler, null, 2));

    // Başarı mesajı gönder
    res.status(201).json({ mesaj: "Ürün başarıyla API'ye kaydedildi!", urun: yeniUrun });
});

// RENDER İÇİN ÇOK ÖNEMLİ: Render kendi portunu atar, yoksa 3000 kullan.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Süper API'miz ${PORT} portunda çalışıyor!`);
});
