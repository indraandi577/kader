-- ============================================================
-- SCHEMA: Pendataan Kaderisasi Hidayatullah DIY-JATENG SELATAN
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================
CREATE TYPE jenis_kelamin_enum AS ENUM ('L', 'P');
CREATE TYPE status_nikah_enum AS ENUM ('Belum Menikah', 'Menikah', 'Duda', 'Janda');
CREATE TYPE amanah_organisasi_enum AS ENUM ('Anggota', 'Pengurus DPD', 'Pengurus PD', 'Pengurus DPW', 'Pengurus DPP');
CREATE TYPE marhalah_skor_enum AS ENUM ('A', 'B', 'C', 'D');
CREATE TYPE wilayah_tugas_enum AS ENUM ('Kampus Utama', 'Kampus Madya', 'Kampus Pratama', 'Cabang');
CREATE TYPE user_role_enum AS ENUM ('pusat', 'dpd');

CREATE TYPE dpd_enum AS ENUM (
  'DPD CILACAP',
  'DPD BANYUMAS',
  'DPD KEBUMEN',
  'DPD PURWOREJO',
  'DPD MAGELANG KOTA',
  'DPD KABUPATEN MAGELANG',
  'DPD TEMANGGUNG',
  'DPD YOGYAKARTA',
  'DPD SLEMAN',
  'DPD BANTUL',
  'DPD KULONPROGO',
  'DPD GUNUNGKIDUL',
  'DPD KLATEN',
  'DPD WONOGIRI',
  'DPD SUKOHARJO',
  'DPD SURAKARTA',
  'DPD KARANGANYAR',
  'DPD SRAGEN'
);

-- ============================================================
-- TABLE: profiles (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role user_role_enum NOT NULL DEFAULT 'dpd',
  dpd dpd_enum,  -- NULL if role = 'pusat'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: kader (Data Utama Kader)
-- ============================================================
CREATE TABLE kader (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- A. Data Pribadi & Identitas Dasar
  id_kader TEXT UNIQUE NOT NULL,
  nama_lengkap TEXT NOT NULL,
  gelar_depan TEXT,
  gelar_belakang TEXT,
  tempat_lahir TEXT,
  tanggal_lahir DATE,
  jenis_kelamin jenis_kelamin_enum,
  alamat_domisili TEXT,
  kota_domisili TEXT,
  provinsi_domisili TEXT,
  tahun_bergabung INTEGER,
  no_hp TEXT,
  email TEXT,
  
  -- B. Data Keluarga
  status_pernikahan status_nikah_enum,
  nama_pasangan TEXT,
  jumlah_anak INTEGER DEFAULT 0,
  
  -- C. Data Kompetensi & Profesionalisme
  pendidikan_jenjang TEXT,
  pendidikan_jurusan TEXT,
  pendidikan_institusi TEXT,
  keahlian_khusus TEXT,
  amanah_amal_usaha TEXT,
  pelatihan_profesional TEXT,
  amanah_organisasi amanah_organisasi_enum,
  
  -- D. Wilayah & Penugasan
  wilayah_tugas wilayah_tugas_enum,
  riwayat_penugasan TEXT,
  
  -- E. Jenjang Perkaderan
  marhalah_ula_tahun INTEGER,
  marhalah_ula_skor marhalah_skor_enum,
  marhalah_wustho_tahun INTEGER,
  marhalah_wustho_skor marhalah_skor_enum,
  marhalah_ulya_tahun INTEGER,
  marhalah_ulya_skor marhalah_skor_enum,

  -- F. Data Halaqoh
  nama_halaqoh TEXT,
  nama_murobbi TEXT,
  jenis_halaqoh TEXT CHECK (jenis_halaqoh IN ('Ula', 'Wustho')),
  
  -- Metadata
  dpd dpd_enum NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: anak_kader (Data Anak - relasi ke kader)
-- ============================================================
CREATE TABLE anak_kader (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kader_id UUID NOT NULL REFERENCES kader(id) ON DELETE CASCADE,
  urutan INTEGER NOT NULL,
  nama TEXT NOT NULL,
  tanggal_lahir DATE,
  sekolah TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kader ENABLE ROW LEVEL SECURITY;
ALTER TABLE anak_kader ENABLE ROW LEVEL SECURITY;

-- Profiles: user bisa baca profilnya sendiri
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Kader: pusat bisa akses semua, dpd hanya bisa akses DPD-nya
CREATE POLICY "Pusat can view all kader"
  ON kader FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'pusat'
    )
  );

CREATE POLICY "DPD can view own kader"
  ON kader FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'dpd'
      AND profiles.dpd = kader.dpd
    )
  );

CREATE POLICY "Pusat can insert kader"
  ON kader FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'pusat'
    )
  );

CREATE POLICY "DPD can insert own kader"
  ON kader FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'dpd'
      AND profiles.dpd = kader.dpd
    )
  );

CREATE POLICY "Pusat can update all kader"
  ON kader FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'pusat'
    )
  );

CREATE POLICY "DPD can update own kader"
  ON kader FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'dpd'
      AND profiles.dpd = kader.dpd
    )
  );

CREATE POLICY "Pusat can delete all kader"
  ON kader FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'pusat'
    )
  );

CREATE POLICY "DPD can delete own kader"
  ON kader FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'dpd'
      AND profiles.dpd = kader.dpd
    )
  );

-- Anak kader: mengikuti policy kader induknya
CREATE POLICY "Can view anak_kader if can view kader"
  ON anak_kader FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM kader k
      JOIN profiles p ON p.id = auth.uid()
      WHERE k.id = anak_kader.kader_id
      AND (p.role = 'pusat' OR p.dpd = k.dpd)
    )
  );

CREATE POLICY "Can insert anak_kader if can insert kader"
  ON anak_kader FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM kader k
      JOIN profiles p ON p.id = auth.uid()
      WHERE k.id = anak_kader.kader_id
      AND (p.role = 'pusat' OR p.dpd = k.dpd)
    )
  );

CREATE POLICY "Can update anak_kader if can update kader"
  ON anak_kader FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM kader k
      JOIN profiles p ON p.id = auth.uid()
      WHERE k.id = anak_kader.kader_id
      AND (p.role = 'pusat' OR p.dpd = k.dpd)
    )
  );

CREATE POLICY "Can delete anak_kader if can delete kader"
  ON anak_kader FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM kader k
      JOIN profiles p ON p.id = auth.uid()
      WHERE k.id = anak_kader.kader_id
      AND (p.role = 'pusat' OR p.dpd = k.dpd)
    )
  );

-- ============================================================
-- FUNCTION: auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role_enum, 'dpd')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- FUNCTION: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER kader_updated_at
  BEFORE UPDATE ON kader
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
