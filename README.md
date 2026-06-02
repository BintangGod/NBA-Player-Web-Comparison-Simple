# 🏀 NBA Compare — Premium Local Showcase & Player Stats Comparison

Aplikasi web modern untuk melakukan perbandingan statistik dua pemain NBA secara *head-to-head*, dilengkapi dengan visualisasi interaktif, lini masa perjalanan karir, dan daftar pencapaian penghargaan (*accolades*). 

Proyek ini dirancang khusus sebagai **Developer Portfolio & Local Showcase App** menggunakan arsitektur proxy lokal yang tangguh untuk menarik data statistik secara langsung dari server resmi NBA.

---

## 💡 Mengapa Proyek ini Dijalankan Secara Lokal? (API Restriction Details)

Server resmi NBA (`stats.nba.com`) menerapkan sistem keamanan yang sangat ketat untuk melindungi data statistik mereka:
1. **Memblokir IP Cloud Provider:** Server NBA mendeteksi dan memblokir permintaan data yang berasal dari IP Cloudflare, AWS, Vercel, dan penyedia cloud lainnya. Akibatnya, deployment serverless proxy di cloud akan menghasilkan error *blocking*.
2. **Tanpa Batasan di Localhost:** Di komputer lokal (localhost), kita dapat menggunakan **Vite Proxy** untuk mem-bypass batasan CORS. Dengan menyematkan header resmi (`User-Agent` & `Referer` dari browser asli), localhost dapat menarik data langsung dari server resmi NBA secara instan tanpa membutuhkan API Key premium yang berbayar!

Oleh karena itu, proyek ini adalah contoh nyata pemecahan masalah teknis (*CORS bypass via local proxy headers*) yang sangat cocok dijadikan sebagai **bahan demo portfolio teknis** Anda.

---

## 📷 Localhost Video Demo

Berikut adalah cuplikan jalannya aplikasi ketika dijalankan di localhost komputer Anda:

<!-- Di bawah ini akan merender video secara langsung di GitHub setelah Anda meletakkan file video Anda -->
<video src="assets/demo.mp4" controls width="100%" poster="public/profile.jpg" style="border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);">
  Browser Anda tidak mendukung tag video. Silakan lihat video demo langsung di folder `assets/demo.mp4`.
</video>

> 💡 **Petunjuk bagi Pengunjung Repo:** Untuk melihat aplikasi ini berjalan secara langsung dengan data ter-update, ikuti panduan instalasi di bawah ini untuk menjalankannya di localhost Anda.

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

Ikuti langkah mudah berikut untuk menjalankan proyek ini di komputer Anda:

### 1. Clone & Masuk ke Folder Proyek
```bash
git clone <url-repositori-anda>
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
Akses **[http://localhost:5173](http://localhost:5173)**. Anda siap melakukan analisis dan perbandingan pemain NBA secara real-time!

---

## 📹 Cara Membuat & Memasukkan Video Demo Anda

Agar halaman repositori Anda terlihat sangat profesional, Anda bisa merekam layar localhost Anda dan memasukkannya ke dalam repositori dengan langkah berikut:

### Langkah 1: Rekam Layar Komputer Anda
1. Jalankan aplikasi di localhost (`npm run dev`) dan buka di browser.
2. Di Windows, tekan **`Win + Alt + R`** untuk langsung mulai merekam layar menggunakan *Windows Game Bar*, atau gunakan aplikasi gratis seperti **OBS Studio** / **ShareX**.
3. Lakukan demo singkat (misal: mencari nama "LeBron James", membandingkannya dengan "Stephen Curry", mengganti grafik ke Radar Chart, dan melihat lini masa karir).
4. Selesai merekam, tekan tombol stop. Video biasanya tersimpan di folder `Videos/Captures`.

### Langkah 2: Pindahkan Video ke Project
1. Ubah nama file rekaman Anda menjadi **`demo.mp4`**.
2. Pindahkan atau salin file `demo.mp4` tersebut ke dalam folder **`assets/`** yang ada di dalam proyek ini.

### Langkah 3: Push ke GitHub
Lakukan commit dan push ke repositori GitHub Anda. Video tersebut akan langsung bisa diputar oleh siapa saja yang mengunjungi repositori Anda!
