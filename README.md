# NBA Compare — Player Stats Comparison App

Aplikasi web untuk membandingkan statistik dua pemain NBA secara head-to-head, lengkap dengan histori karir dan daftar pencapaian, dibangun dengan React + Vite + TailwindCSS.

## Tech Stack

- **React 19** + **Vite 8**
- **TailwindCSS v4**
- **Recharts** — Bar Chart & Radar Chart
- **Cloudflare Pages Functions** — Serverless proxy backend
- **Official NBA API (stats.nba.com)** — Sumber data live statistik NBA

---

## Setup Lokal

### 1. Clone & install

```bash
git clone <repo-url>
cd nba-comparison
npm install
```

### 2. Jalankan dev server

```bash
npm run dev
```

Buka **http://localhost:5173**

> **Catatan:** Untuk mode lokal, `vite.config.js` sudah dilengkapi dengan *proxy* ke `stats.nba.com` sehingga tidak akan terjadi error CORS. Anda tidak membutuhkan API Key apa pun.

---

## Deploy ke Cloudflare Pages

Karena aplikasi ini menggunakan `functions/api/[[path]].js` sebagai serverless backend (untuk membypass blokir CORS dari server NBA), platform paling ideal untuk deployment adalah **Cloudflare Pages**.

### 1. Push ke GitHub

Pastikan Anda membuat repository baru di GitHub, lalu jalankan perintah berikut di terminal:

```bash
git remote add origin https://github.com/<username>/<repo>.git
git branch -M main
git push -u origin main
```

### 2. Buat Cloudflare Pages project

1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pergi ke **Workers & Pages → Create → Pages → Connect to Git**
3. Pilih repository GitHub yang baru saja Anda buat.
4. Konfigurasi build (biasanya terdeteksi otomatis):
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

### 3. Deploy

Klik **Save and Deploy** — Cloudflare Pages akan otomatis mem-build frontend React Anda *sekaligus* men-deploy folder `functions/` menjadi API backend Anda.  
Setiap push ke `main` di masa depan akan memicu deploy ulang secara otomatis.

---

## Features

- 🔍 Live search pemain NBA (menggunakan caching lokal untuk respon instan)
- 📊 Stat comparison head-to-head (PTS, AST, REB, FG%, 3P%, FT%, STL, BLK, TOV)
- 📈 Bar Chart & Radar Chart yang bisa di-switch
- 🏆 Timeline Karir & Seluruh Daftar Pencapaian Pemain (MVP, All-NBA, dll)
- 🏀 Menampilkan foto pemain (headshot) & logo tim asli langsung dari NBA CDN
- 🌙 Dark mode glassmorphism design
- 📅 Season picker (2000 – sekarang)
