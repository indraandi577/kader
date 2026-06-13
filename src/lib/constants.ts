import type { DpdEnum } from '@/types/database'

export const DPD_LIST: DpdEnum[] = [
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
  'DPD SRAGEN',
]

export const JENIS_KELAMIN_OPTIONS = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
]

export const STATUS_NIKAH_OPTIONS = [
  { value: 'Belum Menikah', label: 'Belum Menikah' },
  { value: 'Menikah', label: 'Menikah' },
  { value: 'Duda', label: 'Duda' },
  { value: 'Janda', label: 'Janda' },
]

export const AMANAH_ORGANISASI_OPTIONS = [
  { value: 'Anggota', label: 'Anggota' },
  { value: 'Pengurus DPD', label: 'Pengurus DPD' },
  { value: 'Pengurus PD', label: 'Pengurus PD' },
  { value: 'Pengurus DPW', label: 'Pengurus DPW' },
  { value: 'Pengurus DPP', label: 'Pengurus DPP' },
]

export const MARHALAH_SKOR_OPTIONS = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
]

export const WILAYAH_TUGAS_OPTIONS = [
  { value: 'Kampus Utama', label: 'Kampus Utama' },
  { value: 'Kampus Madya', label: 'Kampus Madya' },
  { value: 'Kampus Pratama', label: 'Kampus Pratama' },
  { value: 'Cabang', label: 'Cabang' },
]

export const PENDIDIKAN_JENJANG_OPTIONS = [
  'SD', 'SMP', 'SMA/SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3',
]
