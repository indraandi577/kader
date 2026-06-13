'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { createKader, updateKader } from '@/app/actions/kader'
import type { KaderWithAnak, Profile } from '@/types/database'
import {
  DPD_LIST,
  JENIS_KELAMIN_OPTIONS,
  STATUS_NIKAH_OPTIONS,
  AMANAH_ORGANISASI_OPTIONS,
  MARHALAH_SKOR_OPTIONS,
  WILAYAH_TUGAS_OPTIONS,
  PENDIDIKAN_JENJANG_OPTIONS,
} from '@/lib/constants'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface AnakForm {
  nama: string
  tanggal_lahir: string
  sekolah: string
}

interface KaderFormProps {
  kader?: KaderWithAnak
  profile: Profile
}

const SECTION_CLASS = 'bg-white border border-gray-200 rounded-xl overflow-hidden'
const SECTION_HEADER = 'bg-green-50 border-b border-green-100 px-5 py-3 flex items-center justify-between cursor-pointer'
const SECTION_TITLE = 'font-semibold text-green-800 text-sm'
const SECTION_BODY = 'p-5'
const GRID_2 = 'grid grid-cols-1 sm:grid-cols-2 gap-4'
const GRID_3 = 'grid grid-cols-1 sm:grid-cols-3 gap-4'

export default function KaderForm({ kader, profile }: KaderFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!kader

  // Collapsible sections
  const [openSections, setOpenSections] = useState({
    pribadi: true,
    keluarga: true,
    kompetensi: true,
    penugasan: true,
    marhalah: true,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Anak state
  const [anakList, setAnakList] = useState<AnakForm[]>(
    kader?.anak_kader?.map(a => ({
      nama: a.nama,
      tanggal_lahir: a.tanggal_lahir || '',
      sekolah: a.sekolah || '',
    })) || []
  )

  const addAnak = () => {
    setAnakList(prev => [...prev, { nama: '', tanggal_lahir: '', sekolah: '' }])
  }

  const removeAnak = (index: number) => {
    setAnakList(prev => prev.filter((_, i) => i !== index))
  }

  const updateAnak = (index: number, field: keyof AnakForm, value: string) => {
    setAnakList(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    // Override jumlah_anak with actual anak list count
    formData.set('jumlah_anak', String(anakList.length))
    // Add anak data
    anakList.forEach((anak, i) => {
      formData.set(`anak_${i}_nama`, anak.nama)
      formData.set(`anak_${i}_tanggal_lahir`, anak.tanggal_lahir)
      formData.set(`anak_${i}_sekolah`, anak.sekolah)
    })

    startTransition(async () => {
      const result = isEdit
        ? await updateKader(kader!.id, formData)
        : await createKader(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard/kader')
        router.refresh()
      }
    })
  }

  const dpdOptions = DPD_LIST.map(d => ({ value: d, label: d }))
  const pendidikanOptions = PENDIDIKAN_JENJANG_OPTIONS.map(p => ({ value: p, label: p }))

  // For DPD users, lock DPD to their own
  const defaultDpd = profile.role === 'dpd' ? profile.dpd! : (kader?.dpd || '')

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── A. DATA PRIBADI ── */}
      <div className={SECTION_CLASS}>
        <div className={SECTION_HEADER} onClick={() => toggleSection('pribadi')}>
          <h2 className={SECTION_TITLE}>A. Data Pribadi &amp; Identitas Dasar</h2>
          {openSections.pribadi ? <ChevronUp size={16} className="text-green-600" /> : <ChevronDown size={16} className="text-green-600" />}
        </div>
        {openSections.pribadi && (
          <div className={SECTION_BODY}>
            <div className="space-y-4">
              <div className={GRID_2}>
                <Input
                  label="ID Kader"
                  name="id_kader"
                  defaultValue={kader?.id_kader}
                  required
                  placeholder="Contoh: 330501008355"
                />
                {profile.role === 'pusat' ? (
                  <Select
                    label="DPD"
                    name="dpd"
                    defaultValue={defaultDpd}
                    options={dpdOptions}
                    placeholder="Pilih DPD..."
                    required
                  />
                ) : (
                  <>
                    <Input label="DPD" value={defaultDpd} readOnly className="bg-gray-50" />
                    <input type="hidden" name="dpd" value={defaultDpd} />
                  </>
                )}
              </div>

              <div className={GRID_2}>
                <Input
                  label="Gelar Depan"
                  name="gelar_depan"
                  defaultValue={kader?.gelar_depan || ''}
                  placeholder="Contoh: Dr., H."
                />
                <Input
                  label="Nama Lengkap"
                  name="nama_lengkap"
                  defaultValue={kader?.nama_lengkap}
                  required
                  placeholder="Nama tanpa gelar"
                />
              </div>

              <div className={GRID_2}>
                <Input
                  label="Gelar Belakang"
                  name="gelar_belakang"
                  defaultValue={kader?.gelar_belakang || ''}
                  placeholder="Contoh: S.E.I., M.Pd."
                />
                <Select
                  label="Jenis Kelamin"
                  name="jenis_kelamin"
                  defaultValue={kader?.jenis_kelamin || ''}
                  options={JENIS_KELAMIN_OPTIONS}
                  placeholder="Pilih..."
                />
              </div>

              <div className={GRID_2}>
                <Input
                  label="Tempat Lahir"
                  name="tempat_lahir"
                  defaultValue={kader?.tempat_lahir || ''}
                  placeholder="Kota/Kabupaten"
                />
                <Input
                  label="Tanggal Lahir"
                  name="tanggal_lahir"
                  type="date"
                  defaultValue={kader?.tanggal_lahir || ''}
                />
              </div>

              <Textarea
                label="Alamat Domisili"
                name="alamat_domisili"
                defaultValue={kader?.alamat_domisili || ''}
                placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                rows={2}
              />

              <div className={GRID_3}>
                <Input
                  label="Kota/Kabupaten"
                  name="kota_domisili"
                  defaultValue={kader?.kota_domisili || ''}
                />
                <Input
                  label="Provinsi"
                  name="provinsi_domisili"
                  defaultValue={kader?.provinsi_domisili || ''}
                />
                <Input
                  label="Tahun Bergabung"
                  name="tahun_bergabung"
                  type="number"
                  defaultValue={kader?.tahun_bergabung || ''}
                  placeholder="Contoh: 2010"
                  min="1990"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className={GRID_2}>
                <Input
                  label="No. HP / WhatsApp"
                  name="no_hp"
                  defaultValue={kader?.no_hp || ''}
                  placeholder="08xxxxxxxxxx"
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  defaultValue={kader?.email || ''}
                  placeholder="email@contoh.com"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── B. DATA KELUARGA ── */}
      <div className={SECTION_CLASS}>
        <div className={SECTION_HEADER} onClick={() => toggleSection('keluarga')}>
          <h2 className={SECTION_TITLE}>B. Data Keluarga</h2>
          {openSections.keluarga ? <ChevronUp size={16} className="text-green-600" /> : <ChevronDown size={16} className="text-green-600" />}
        </div>
        {openSections.keluarga && (
          <div className={SECTION_BODY}>
            <div className="space-y-4">
              <div className={GRID_2}>
                <Select
                  label="Status Pernikahan"
                  name="status_pernikahan"
                  defaultValue={kader?.status_pernikahan || ''}
                  options={STATUS_NIKAH_OPTIONS}
                  placeholder="Pilih..."
                />
                <Input
                  label="Nama Suami/Istri"
                  name="nama_pasangan"
                  defaultValue={kader?.nama_pasangan || ''}
                  placeholder="Kosongkan jika belum menikah"
                />
              </div>

              {/* Data Anak */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Data Anak <span className="text-gray-400">({anakList.length} anak)</span>
                  </label>
                  <Button type="button" variant="outline" size="sm" onClick={addAnak}>
                    <Plus size={14} />
                    Tambah Anak
                  </Button>
                </div>

                {anakList.length === 0 && (
                  <p className="text-sm text-gray-400 italic">Belum ada data anak. Klik tombol di atas untuk menambahkan.</p>
                )}

                <div className="space-y-3">
                  {anakList.map((anak, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Anak ke-{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeAnak(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Hapus anak"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className={GRID_3}>
                        <Input
                          label="Nama"
                          value={anak.nama}
                          onChange={e => updateAnak(index, 'nama', e.target.value)}
                          required
                          placeholder="Nama anak"
                        />
                        <Input
                          label="Tanggal Lahir"
                          type="date"
                          value={anak.tanggal_lahir}
                          onChange={e => updateAnak(index, 'tanggal_lahir', e.target.value)}
                        />
                        <Input
                          label="Sekolah"
                          value={anak.sekolah}
                          onChange={e => updateAnak(index, 'sekolah', e.target.value)}
                          placeholder="Nama sekolah / jenjang"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── C. DATA KOMPETENSI ── */}
      <div className={SECTION_CLASS}>
        <div className={SECTION_HEADER} onClick={() => toggleSection('kompetensi')}>
          <h2 className={SECTION_TITLE}>C. Data Kompetensi &amp; Profesionalisme</h2>
          {openSections.kompetensi ? <ChevronUp size={16} className="text-green-600" /> : <ChevronDown size={16} className="text-green-600" />}
        </div>
        {openSections.kompetensi && (
          <div className={SECTION_BODY}>
            <div className="space-y-4">
              <div className={GRID_3}>
                <Select
                  label="Jenjang Pendidikan"
                  name="pendidikan_jenjang"
                  defaultValue={kader?.pendidikan_jenjang || ''}
                  options={pendidikanOptions}
                  placeholder="Pilih..."
                />
                <Input
                  label="Jurusan"
                  name="pendidikan_jurusan"
                  defaultValue={kader?.pendidikan_jurusan || ''}
                  placeholder="Contoh: Ekonomi Islam"
                />
                <Input
                  label="Nama Institusi"
                  name="pendidikan_institusi"
                  defaultValue={kader?.pendidikan_institusi || ''}
                  placeholder="Nama sekolah/universitas"
                />
              </div>

              <Textarea
                label="Keahlian Khusus (Skill)"
                name="keahlian_khusus"
                defaultValue={kader?.keahlian_khusus || ''}
                placeholder="Contoh: Dai, Thibbun Nabawi, Pertanian, IT, dll."
                rows={2}
              />

              <Textarea
                label="Amanah di Amal Usaha"
                name="amanah_amal_usaha"
                defaultValue={kader?.amanah_amal_usaha || ''}
                placeholder="Jabatan dan nama amal usaha"
                rows={2}
              />

              <Textarea
                label="Pelatihan Profesional"
                name="pelatihan_profesional"
                defaultValue={kader?.pelatihan_profesional || ''}
                placeholder="Daftar pelatihan yang pernah diikuti"
                rows={2}
              />

              <Select
                label="Amanah Organisasi"
                name="amanah_organisasi"
                defaultValue={kader?.amanah_organisasi || ''}
                options={AMANAH_ORGANISASI_OPTIONS}
                placeholder="Pilih..."
              />
            </div>
          </div>
        )}
      </div>

      {/* ── D. WILAYAH & PENUGASAN ── */}
      <div className={SECTION_CLASS}>
        <div className={SECTION_HEADER} onClick={() => toggleSection('penugasan')}>
          <h2 className={SECTION_TITLE}>D. Wilayah Tugas &amp; Penugasan Dakwah</h2>
          {openSections.penugasan ? <ChevronUp size={16} className="text-green-600" /> : <ChevronDown size={16} className="text-green-600" />}
        </div>
        {openSections.penugasan && (
          <div className={SECTION_BODY}>
            <div className="space-y-4">
              <Select
                label="Wilayah Tugas"
                name="wilayah_tugas"
                defaultValue={kader?.wilayah_tugas || ''}
                options={WILAYAH_TUGAS_OPTIONS}
                placeholder="Pilih..."
              />
              <Textarea
                label="Riwayat Penugasan / Tugas Dakwah"
                name="riwayat_penugasan"
                defaultValue={kader?.riwayat_penugasan || ''}
                placeholder="Daftar daerah/pesantren yang pernah ditempati"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── E. MARHALAH ── */}
      <div className={SECTION_CLASS}>
        <div className={SECTION_HEADER} onClick={() => toggleSection('marhalah')}>
          <h2 className={SECTION_TITLE}>E. Metrik Pengukuran Jenjang Perkaderan</h2>
          {openSections.marhalah ? <ChevronUp size={16} className="text-green-600" /> : <ChevronDown size={16} className="text-green-600" />}
        </div>
        {openSections.marhalah && (
          <div className={SECTION_BODY}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-green-50">
                    <th className="px-4 py-3 text-left font-semibold text-green-800 border-b border-green-100">Jenjang Perkaderan</th>
                    <th className="px-4 py-3 text-left font-semibold text-green-800 border-b border-green-100">Tahun Pelaksanaan</th>
                    <th className="px-4 py-3 text-left font-semibold text-green-800 border-b border-green-100">Skor/Nilai Kelulusan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-600 italic">Anggota/belum marhalah</td>
                    <td colSpan={2} className="px-4 py-3 text-xs text-gray-400">— tidak ada nilai —</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      Marhalah Ula <span className="text-gray-400 font-normal">(Dasar)</span>
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        name="marhalah_ula_tahun"
                        type="number"
                        defaultValue={kader?.marhalah_ula_tahun || ''}
                        placeholder="Contoh: 2018"
                        min="1990"
                        max={new Date().getFullYear()}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        name="marhalah_ula_skor"
                        defaultValue={kader?.marhalah_ula_skor || ''}
                        options={MARHALAH_SKOR_OPTIONS}
                        placeholder="Pilih..."
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      Marhalah Wustho <span className="text-gray-400 font-normal">(Menengah)</span>
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        name="marhalah_wustho_tahun"
                        type="number"
                        defaultValue={kader?.marhalah_wustho_tahun || ''}
                        placeholder="Contoh: 2020"
                        min="1990"
                        max={new Date().getFullYear()}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        name="marhalah_wustho_skor"
                        defaultValue={kader?.marhalah_wustho_skor || ''}
                        options={MARHALAH_SKOR_OPTIONS}
                        placeholder="Pilih..."
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      Marhalah Ulya <span className="text-gray-400 font-normal">(Tinggi)</span>
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        name="marhalah_ulya_tahun"
                        type="number"
                        defaultValue={kader?.marhalah_ulya_tahun || ''}
                        placeholder="Contoh: 2022"
                        min="1990"
                        max={new Date().getFullYear()}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        name="marhalah_ulya_skor"
                        defaultValue={kader?.marhalah_ulya_skor || ''}
                        options={MARHALAH_SKOR_OPTIONS}
                        placeholder="Pilih..."
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" size="lg" loading={isPending}>
          {isEdit ? 'Simpan Perubahan' : 'Simpan Data Kader'}
        </Button>
      </div>
    </form>
  )
}
