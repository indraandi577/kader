export type JenisKelamin = 'L' | 'P'
export type StatusNikah = 'Belum Menikah' | 'Menikah' | 'Duda' | 'Janda'
export type AmanahOrganisasi = 'Anggota' | 'Pengurus DPD' | 'Pengurus PD' | 'Pengurus DPW' | 'Pengurus DPP'
export type MarhalahSkor = 'A' | 'B' | 'C' | 'D'
export type WilayahTugas = 'Kampus Utama' | 'Kampus Madya' | 'Kampus Pratama' | 'Cabang'
export type UserRole = 'pusat' | 'dpd'

export type DpdEnum =
  | 'DPD CILACAP'
  | 'DPD BANYUMAS'
  | 'DPD KEBUMEN'
  | 'DPD PURWOREJO'
  | 'DPD MAGELANG KOTA'
  | 'DPD KABUPATEN MAGELANG'
  | 'DPD TEMANGGUNG'
  | 'DPD YOGYAKARTA'
  | 'DPD SLEMAN'
  | 'DPD BANTUL'
  | 'DPD KULONPROGO'
  | 'DPD GUNUNGKIDUL'
  | 'DPD KLATEN'
  | 'DPD WONOGIRI'
  | 'DPD SUKOHARJO'
  | 'DPD SURAKARTA'
  | 'DPD KARANGANYAR'
  | 'DPD SRAGEN'

export interface Profile {
  id: string
  full_name: string | null
  role: UserRole
  dpd: DpdEnum | null
  created_at: string
  updated_at: string
}

export interface Kader {
  id: string
  id_kader: string
  nama_lengkap: string
  gelar_depan: string | null
  gelar_belakang: string | null
  tempat_lahir: string | null
  tanggal_lahir: string | null
  jenis_kelamin: JenisKelamin | null
  alamat_domisili: string | null
  kota_domisili: string | null
  provinsi_domisili: string | null
  tahun_bergabung: number | null
  no_hp: string | null
  email: string | null
  status_pernikahan: StatusNikah | null
  nama_pasangan: string | null
  jumlah_anak: number
  pendidikan_jenjang: string | null
  pendidikan_jurusan: string | null
  pendidikan_institusi: string | null
  keahlian_khusus: string | null
  amanah_amal_usaha: string | null
  pelatihan_profesional: string | null
  amanah_organisasi: AmanahOrganisasi | null
  wilayah_tugas: WilayahTugas | null
  riwayat_penugasan: string | null
  marhalah_ula_tahun: number | null
  marhalah_ula_skor: MarhalahSkor | null
  marhalah_wustho_tahun: number | null
  marhalah_wustho_skor: MarhalahSkor | null
  marhalah_ulya_tahun: number | null
  marhalah_ulya_skor: MarhalahSkor | null
  dpd: DpdEnum
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface AnakKader {
  id: string
  kader_id: string
  urutan: number
  nama: string
  tanggal_lahir: string | null
  sekolah: string | null
  created_at: string
}

export interface KaderWithAnak extends Kader {
  anak_kader: AnakKader[]
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      kader: {
        Row: Kader
        Insert: Omit<Kader, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Kader, 'id' | 'created_at' | 'updated_at'>>
      }
      anak_kader: {
        Row: AnakKader
        Insert: Omit<AnakKader, 'id' | 'created_at'>
        Update: Partial<Omit<AnakKader, 'id' | 'created_at'>>
      }
    }
  }
}
