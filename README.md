# 🏀 NBA Compare — Premium Local Showcase & Player Stats Comparison

Aplikasi web modern untuk melakukan perbandingan statistik dua pemain NBA secara *head-to-head*, dilengkapi dengan visualisasi interaktif, lini masa perjalanan karir, dan daftar pencapaian penghargaan (*accolades*). 

Proyek ini dirancang khusus sebagai **Developer Portfolio & Local Showcase App** menggunakan arsitektur proxy lokal yang tangguh untuk menarik data statistik secara langsung dari server resmi NBA.

---

## 💡 Mengapa Proyek ini Dijalankan Secara Lokal? (API Restriction Details)

Server resmi NBA (`stats.nba.com`) menerapkan sistem keamanan yang sangat ketat untuk melindungi data statistik mereka:
1. **Memblokir IP Cloud Provider:** Server NBA mendeteksi dan memblokir permintaan data yang berasal dari IP Cloudflare, AWS, Vercel, dan penyedia cloud lainnya. Akibatnya, deployment serverless proxy di cloud akan menghasilkan error *blocking*.
2. **Tanpa Batasan di Localhost:** Di komputer lokal (localhost), kita dapat menggunakan **Vite Proxy** untuk mem-bypass batasan CORS. Dengan menyematkan header resmi (`User-Agent` & `Referer` dari browser asli), localhost dapat menarik data langsung dari server resmi NBA secara instan tanpa membutuhkan API Key premium yang berbayar!

Oleh karena itu, proyek ini adalah contoh nyata pemecahan masalah teknis (*CORS bypass via local proxy headers*) yang sangat cocok dijadikan sebagai bahan demo portofolio teknis.

---

## 📷 Localhost Video Demo

Berikut adalah cuplikan jalannya aplikasi ketika dijalankan di localhost:

<!-- Di bawah ini akan merender video secara langsung di GitHub setelah Anda meletakkan file video Anda -->
<video src="assets/demo.mp4" controls width="100%">
  Browser Anda tidak mendukung tag video. Silakan lihat video demo langsung di folder `assets/demo.mp4`.
</video>

> 💡 **Petunjuk bagi Pengunjung Repo:** Untuk melihat aplikasi ini berjalan secara langsung dengan data ter-update, ikuti panduan instalasi di bawah ini untuk menjalankannya secara lokal.

---

## ✨ Fitur Utama

- 🔍 **Pencarian Pemain Instan:** Menggunakan pencarian berbasis *fuzzy-search* dengan data pemain resmi yang di-*cache* secara lokal di browser untuk respon yang sangat cepat.
- 📊 **Perbandingan Statistik Head-to-Head:** Perbandingan interaktif untuk poin utama (PTS, AST, REB, FG%, 3P%, FT%, STL, BLK, TOV).
- 📈 **Visualisasi Interaktif:** Pilihan diagram batang (*Bar Chart*) dan diagram radar (*Radar Chart*) yang interaktif menggunakan `Recharts` untuk menganalisis kelebihan masing-masing pemain.
- 🗺️ **Perjalanan Karir Lengkap:** Menampilkan lini masa perjalanan tim yang pernah dibela pemain lengkap dengan tahun aktifnya.
- 🏆 **Seluruh Pencapaian Karir (*Accolades*):** Menampilkan semua pencapaian resmi seperti MVP, All-NBA Teams, All-Star, dll.
- 🏀 **Aset Grafis Resmi:** Menampilkan foto wajah (*headshot*) pemain dan logo klub NBA asli langsung dari CDN resmi NBA.
- 🌙 **Desain Glassmorphism Modern:** UI gelap (*dark mode*) yang premium dengan efek kaca buram dan animasi halus yang memanjakan mata.

---

## 🛠️ Tech Stack

- **Frontend Core:** React 19 + Vite 8
- **Styling:** TailwindCSS v4 (Modern & Cepat)
- **Visualisasi:** Recharts (Responsive SVG Charts)
- **Local Proxy:** Vite Dev Server Configuration (Header Spoofing)
- **Sumber Data:** Official NBA API (`stats.nba.com`)

---

## 🚀 Panduan Instalasi Lokal

Ikuti langkah mudah berikut untuk menjalankan proyek ini secara lokal:

### 1. Clone & Masuk ke Folder Proyek
```bash
git clone https://github.com/BintangGod/NBA-Player-Web-Comparison-Simple.git
cd nba-comparison
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Jalankan Server Lokal
```bash
npm run dev
```

### 4. Buka di Browser
Akses **[http://localhost:5173](http://localhost:5173)** untuk melakukan analisis dan perbandingan pemain NBA secara real-time!
