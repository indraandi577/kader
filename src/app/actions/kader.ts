'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { DpdEnum, Kader, KaderWithAnak } from '@/types/database'

export async function getKaderList(dpd?: DpdEnum): Promise<Kader[]> {
  const supabase = await createClient()

  let query = supabase
    .from('kader')
    .select('*')
    .order('created_at', { ascending: false })

  if (dpd) {
    query = query.eq('dpd', dpd)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as Kader[]
}

export async function getKaderById(id: string): Promise<KaderWithAnak> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('kader')
    .select('*, anak_kader(*)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as unknown as KaderWithAnak
}

export async function createKader(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi' }

  // Parse anak data
  const anakData: { nama: string; tanggal_lahir: string | null; sekolah: string | null }[] = []
  const jumlahAnak = parseInt(formData.get('jumlah_anak') as string) || 0

  for (let i = 0; i < jumlahAnak; i++) {
    const namaAnak = formData.get(`anak_${i}_nama`) as string
    if (namaAnak) {
      anakData.push({
        nama: namaAnak,
        tanggal_lahir: (formData.get(`anak_${i}_tanggal_lahir`) as string) || null,
        sekolah: (formData.get(`anak_${i}_sekolah`) as string) || null,
      })
    }
  }

  const kaderPayload = {
    id_kader: formData.get('id_kader') as string,
    nama_lengkap: formData.get('nama_lengkap') as string,
    gelar_depan: (formData.get('gelar_depan') as string) || null,
    gelar_belakang: (formData.get('gelar_belakang') as string) || null,
    tempat_lahir: (formData.get('tempat_lahir') as string) || null,
    tanggal_lahir: (formData.get('tanggal_lahir') as string) || null,
    jenis_kelamin: (formData.get('jenis_kelamin') as 'L' | 'P') || null,
    alamat_domisili: (formData.get('alamat_domisili') as string) || null,
    kota_domisili: (formData.get('kota_domisili') as string) || null,
    provinsi_domisili: (formData.get('provinsi_domisili') as string) || null,
    tahun_bergabung: formData.get('tahun_bergabung') ? parseInt(formData.get('tahun_bergabung') as string) : null,
    no_hp: (formData.get('no_hp') as string) || null,
    email: (formData.get('email') as string) || null,
    status_pernikahan: (formData.get('status_pernikahan') as string) || null,
    nama_pasangan: (formData.get('nama_pasangan') as string) || null,
    jumlah_anak: jumlahAnak,
    pendidikan_jenjang: (formData.get('pendidikan_jenjang') as string) || null,
    pendidikan_jurusan: (formData.get('pendidikan_jurusan') as string) || null,
    pendidikan_institusi: (formData.get('pendidikan_institusi') as string) || null,
    keahlian_khusus: (formData.get('keahlian_khusus') as string) || null,
    amanah_amal_usaha: (formData.get('amanah_amal_usaha') as string) || null,
    pelatihan_profesional: (formData.get('pelatihan_profesional') as string) || null,
    amanah_organisasi: (formData.get('amanah_organisasi') as string) || null,
    wilayah_tugas: (formData.get('wilayah_tugas') as string) || null,
    riwayat_penugasan: (formData.get('riwayat_penugasan') as string) || null,
    marhalah_ula_tahun: formData.get('marhalah_ula_tahun') ? parseInt(formData.get('marhalah_ula_tahun') as string) : null,
    marhalah_ula_skor: (formData.get('marhalah_ula_skor') as string) || null,
    marhalah_wustho_tahun: formData.get('marhalah_wustho_tahun') ? parseInt(formData.get('marhalah_wustho_tahun') as string) : null,
    marhalah_wustho_skor: (formData.get('marhalah_wustho_skor') as string) || null,
    marhalah_ulya_tahun: formData.get('marhalah_ulya_tahun') ? parseInt(formData.get('marhalah_ulya_tahun') as string) : null,
    marhalah_ulya_skor: (formData.get('marhalah_ulya_skor') as string) || null,
    nama_halaqoh: (formData.get('nama_halaqoh') as string) || null,
    nama_murobbi: (formData.get('nama_murobbi') as string) || null,
    jenis_halaqoh: (formData.get('jenis_halaqoh') as string) || null,
    dpd: formData.get('dpd') as DpdEnum,
    created_by: user.id,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: kader, error: kaderError } = await (supabase as any)
    .from('kader')
    .insert(kaderPayload)
    .select()
    .single()

  if (kaderError) return { error: kaderError.message }

  const insertedKader = kader as Kader

  // Insert anak kader
  if (anakData.length > 0) {
    const anakPayload = anakData.map((anak, index) => ({
      kader_id: insertedKader.id,
      urutan: index + 1,
      ...anak,
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: anakError } = await (supabase as any)
      .from('anak_kader')
      .insert(anakPayload)

    if (anakError) return { error: anakError.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/kader')
  return { success: true, id: insertedKader.id }
}

export async function updateKader(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi' }

  const jumlahAnak = parseInt(formData.get('jumlah_anak') as string) || 0

  const kaderPayload = {
    id_kader: formData.get('id_kader') as string,
    nama_lengkap: formData.get('nama_lengkap') as string,
    gelar_depan: (formData.get('gelar_depan') as string) || null,
    gelar_belakang: (formData.get('gelar_belakang') as string) || null,
    tempat_lahir: (formData.get('tempat_lahir') as string) || null,
    tanggal_lahir: (formData.get('tanggal_lahir') as string) || null,
    jenis_kelamin: (formData.get('jenis_kelamin') as 'L' | 'P') || null,
    alamat_domisili: (formData.get('alamat_domisili') as string) || null,
    kota_domisili: (formData.get('kota_domisili') as string) || null,
    provinsi_domisili: (formData.get('provinsi_domisili') as string) || null,
    tahun_bergabung: formData.get('tahun_bergabung') ? parseInt(formData.get('tahun_bergabung') as string) : null,
    no_hp: (formData.get('no_hp') as string) || null,
    email: (formData.get('email') as string) || null,
    status_pernikahan: (formData.get('status_pernikahan') as string) || null,
    nama_pasangan: (formData.get('nama_pasangan') as string) || null,
    jumlah_anak: jumlahAnak,
    pendidikan_jenjang: (formData.get('pendidikan_jenjang') as string) || null,
    pendidikan_jurusan: (formData.get('pendidikan_jurusan') as string) || null,
    pendidikan_institusi: (formData.get('pendidikan_institusi') as string) || null,
    keahlian_khusus: (formData.get('keahlian_khusus') as string) || null,
    amanah_amal_usaha: (formData.get('amanah_amal_usaha') as string) || null,
    pelatihan_profesional: (formData.get('pelatihan_profesional') as string) || null,
    amanah_organisasi: (formData.get('amanah_organisasi') as string) || null,
    wilayah_tugas: (formData.get('wilayah_tugas') as string) || null,
    riwayat_penugasan: (formData.get('riwayat_penugasan') as string) || null,
    marhalah_ula_tahun: formData.get('marhalah_ula_tahun') ? parseInt(formData.get('marhalah_ula_tahun') as string) : null,
    marhalah_ula_skor: (formData.get('marhalah_ula_skor') as string) || null,
    marhalah_wustho_tahun: formData.get('marhalah_wustho_tahun') ? parseInt(formData.get('marhalah_wustho_tahun') as string) : null,
    marhalah_wustho_skor: (formData.get('marhalah_wustho_skor') as string) || null,
    marhalah_ulya_tahun: formData.get('marhalah_ulya_tahun') ? parseInt(formData.get('marhalah_ulya_tahun') as string) : null,
    marhalah_ulya_skor: (formData.get('marhalah_ulya_skor') as string) || null,
    nama_halaqoh: (formData.get('nama_halaqoh') as string) || null,
    nama_murobbi: (formData.get('nama_murobbi') as string) || null,
    jenis_halaqoh: (formData.get('jenis_halaqoh') as string) || null,
    dpd: formData.get('dpd') as DpdEnum,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: kaderError } = await (supabase as any)
    .from('kader')
    .update(kaderPayload)
    .eq('id', id)

  if (kaderError) return { error: kaderError.message }

  // Hapus anak lama dan insert baru
  await supabase.from('anak_kader' as never).delete().eq('kader_id' as never, id)

  const anakData: { nama: string; tanggal_lahir: string | null; sekolah: string | null }[] = []
  for (let i = 0; i < jumlahAnak; i++) {
    const namaAnak = formData.get(`anak_${i}_nama`) as string
    if (namaAnak) {
      anakData.push({
        nama: namaAnak,
        tanggal_lahir: (formData.get(`anak_${i}_tanggal_lahir`) as string) || null,
        sekolah: (formData.get(`anak_${i}_sekolah`) as string) || null,
      })
    }
  }

  if (anakData.length > 0) {
    const anakPayload = anakData.map((anak, index) => ({
      kader_id: id,
      urutan: index + 1,
      ...anak,
    }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: anakError } = await (supabase as any).from('anak_kader').insert(anakPayload)
    if (anakError) return { error: anakError.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/kader')
  revalidatePath(`/dashboard/kader/${id}`)
  return { success: true }
}

export async function deleteKader(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('kader' as never).delete().eq('id' as never, id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/kader')
  return { success: true }
}

export async function getDashboardStats(dpd?: DpdEnum) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('kader')
    .select('dpd, marhalah_ula_skor, marhalah_wustho_skor, marhalah_ulya_skor')

  if (dpd) query = query.eq('dpd', dpd)

  const { data, error } = await query
  if (error) return null

  const rows = data as Array<{
    dpd: string
    marhalah_ula_skor: string | null
    marhalah_wustho_skor: string | null
    marhalah_ulya_skor: string | null
  }>

  const total = rows.length
  const belumMarhalah = rows.filter(k => !k.marhalah_ula_skor && !k.marhalah_wustho_skor && !k.marhalah_ulya_skor).length
  const marhalahUla = rows.filter(k => k.marhalah_ula_skor && !k.marhalah_wustho_skor).length
  const marhalahWustho = rows.filter(k => k.marhalah_wustho_skor && !k.marhalah_ulya_skor).length
  const marhalahUlya = rows.filter(k => k.marhalah_ulya_skor).length

  const perDpd: Record<string, number> = {}
  const perDpdDetail: Record<string, { total: number; belum: number; ula: number; wustho: number; ulya: number }> = {}

  rows.forEach(k => {
    perDpd[k.dpd] = (perDpd[k.dpd] || 0) + 1

    if (!perDpdDetail[k.dpd]) {
      perDpdDetail[k.dpd] = { total: 0, belum: 0, ula: 0, wustho: 0, ulya: 0 }
    }
    perDpdDetail[k.dpd].total += 1

    if (k.marhalah_ulya_skor) {
      perDpdDetail[k.dpd].ulya += 1
    } else if (k.marhalah_wustho_skor) {
      perDpdDetail[k.dpd].wustho += 1
    } else if (k.marhalah_ula_skor) {
      perDpdDetail[k.dpd].ula += 1
    } else {
      perDpdDetail[k.dpd].belum += 1
    }
  })

  return { total, belumMarhalah, marhalahUla, marhalahWustho, marhalahUlya, perDpd, perDpdDetail }
}
