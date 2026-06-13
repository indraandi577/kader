# Sistem Pendataan Kader Hidayatullah
## DPW DIY-Jateng Bagian Selatan

Website pendataan kaderisasi berbasis Next.js + Supabase.

---

## 🚀 Cara Setup

### 1. Clone & Install Dependencies

```bash
git clone <repo-url>
cd kader-hidayatullah
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Masuk ke **SQL Editor** di dashboard Supabase
3. Copy seluruh isi file `supabase/schema.sql` dan jalankan di SQL Editor
4. Ambil **Project URL** dan **anon/public key** dari **Settings → API**

### 3. Konfigurasi Environment

Edit file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Buat User Admin

Di Supabase dashboard → **Authentication → Users → Add User**:

- Buat user untuk **Admin Pusat**
- Setelah dibuat, masuk ke **Table Editor → profiles**
- Set `role = 'pusat'` untuk admin pusat
- Set `role = 'dpd'` dan pilih `dpd` yang sesuai untuk admin per-DPD

### 5. Jalankan di Lokal

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy ke Vercel

1. Push ke GitHub/GitLab
2. Import project di [vercel.com](https://vercel.com)
3. Set Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

---

## 📋 Fitur

- **Login** dengan autentikasi Supabase
- **Role Pusat** — akses semua 18 DPD, lihat rekap per DPD
- **Role DPD** — hanya bisa akses data DPD-nya sendiri
- **Dashboard** dengan statistik kader dan marhalah
- **CRUD Kader** — Tambah, lihat detail, edit, hapus
- **Form lengkap** sesuai formulir Data Utama Kader Hidayatullah:
  - Data Pribadi & Identitas
  - Data Keluarga & Data Anak
  - Kompetensi & Profesionalisme
  - Wilayah Tugas & Penugasan
  - Jenjang Perkaderan (Marhalah Ula/Wustho/Ulya)
- **Filter per DPD** di halaman data kader
- **Pencarian** nama/ID kader
- **Paginasi** tabel data

---

## 🏢 18 DPD Wilayah

| No | DPD |
|----|-----|
| 1 | DPD CILACAP |
| 2 | DPD BANYUMAS |
| 3 | DPD KEBUMEN |
| 4 | DPD PURWOREJO |
| 5 | DPD MAGELANG KOTA |
| 6 | DPD KABUPATEN MAGELANG |
| 7 | DPD TEMANGGUNG |
| 8 | DPD YOGYAKARTA |
| 9 | DPD SLEMAN |
| 10 | DPD BANTUL |
| 11 | DPD KULONPROGO |
| 12 | DPD GUNUNGKIDUL |
| 13 | DPD KLATEN |
| 14 | DPD WONOGIRI |
| 15 | DPD SUKOHARJO |
| 16 | DPD SURAKARTA |
| 17 | DPD KARANGANYAR |
| 18 | DPD SRAGEN |

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deploy**: Vercel
