import { createClient } from '@/lib/supabase/server'
import { getKaderById } from '@/app/actions/kader'
import { notFound, redirect } from 'next/navigation'
import { formatDate, formatNamaLengkap } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { ChevronLeft, Pencil } from 'lucide-react'
import type { KaderWithAnak } from '@/types/database'

interface PageProps {
  params: Promise<{ id: string }>
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-gray-50 last:border-0">
      <dt className="text-sm text-gray-500 sm:w-48 flex-shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-gray-800 mt-0.5 sm:mt-0">{value || '-'}</dd>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-green-50 border-b border-green-100 px-5 py-3">
        <h3 className="font-semibold text-green-800 text-sm">{title}</h3>
      </div>
      <dl className="px-5 py-1">{children}</dl>
    </div>
  )
}

export default async function KaderDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let kader: KaderWithAnak
  try {
    kader = await getKaderById(id)
  } catch {
    notFound()
  }

  const getMarhalahBadge = () => {
    if (kader.marhalah_ulya_skor) return <Badge variant="purple">Marhalah Ulya</Badge>
    if (kader.marhalah_wustho_skor) return <Badge variant="blue">Marhalah Wustho</Badge>
    if (kader.marhalah_ula_skor) return <Badge variant="green">Marhalah Ula</Badge>
    return <Badge variant="gray">Belum Marhalah</Badge>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/dashboard/kader"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-3"
          >
            <ChevronLeft size={16} />
            Kembali ke Data Kader
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {formatNamaLengkap(kader.nama_lengkap, kader.gelar_depan, kader.gelar_belakang)}
            </h1>
            {getMarhalahBadge()}
          </div>
          <p className="text-gray-500 text-sm mt-1">ID Kader: {kader.id_kader} · {kader.dpd}</p>
        </div>
        <Link
          href={`/dashboard/kader/${id}/edit`}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Pencil size={15} />
          Edit Data
        </Link>
      </div>

      {/* A. Data Pribadi */}
      <SectionCard title="A. Data Pribadi & Identitas Dasar">
        <DetailRow label="ID Kader" value={kader.id_kader} />
        <DetailRow label="Nama Lengkap" value={formatNamaLengkap(kader.nama_lengkap, kader.gelar_depan, kader.gelar_belakang)} />
        <DetailRow label="Jenis Kelamin" value={kader.jenis_kelamin === 'L' ? 'Laki-laki' : kader.jenis_kelamin === 'P' ? 'Perempuan' : null} />
        <DetailRow label="Tempat, Tanggal Lahir" value={kader.tempat_lahir && kader.tanggal_lahir ? `${kader.tempat_lahir}, ${formatDate(kader.tanggal_lahir)}` : kader.tempat_lahir || formatDate(kader.tanggal_lahir)} />
        <DetailRow label="Alamat Domisili" value={[kader.alamat_domisili, kader.kota_domisili, kader.provinsi_domisili].filter(Boolean).join(', ')} />
        <DetailRow label="Bergabung Hidayatullah" value={kader.tahun_bergabung ? `Tahun ${kader.tahun_bergabung}` : null} />
        <DetailRow label="No. HP / WhatsApp" value={kader.no_hp} />
        <DetailRow label="Email" value={kader.email} />
        <DetailRow label="DPD" value={kader.dpd} />
      </SectionCard>

      {/* B. Data Keluarga */}
      <SectionCard title="B. Data Keluarga">
        <DetailRow label="Status Pernikahan" value={kader.status_pernikahan} />
        <DetailRow label="Nama Suami/Istri" value={kader.nama_pasangan} />
        <DetailRow label="Jumlah Anak" value={kader.jumlah_anak} />
        {kader.anak_kader && kader.anak_kader.length > 0 && (
          <div className="py-3">
            <p className="text-sm text-gray-500 mb-3">Data Anak:</p>
            <div className="space-y-2">
              {kader.anak_kader.map((anak, i) => (
                <div key={anak.id} className="bg-gray-50 rounded-lg px-4 py-2.5">
                  <p className="text-sm font-semibold text-gray-700">Anak ke-{i + 1}: {anak.nama}</p>
                  {anak.tanggal_lahir && <p className="text-xs text-gray-500">Lahir: {formatDate(anak.tanggal_lahir)}</p>}
                  {anak.sekolah && <p className="text-xs text-gray-500">Sekolah: {anak.sekolah}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* C. Data Kompetensi */}
      <SectionCard title="C. Data Kompetensi & Profesionalisme">
        <DetailRow
          label="Pendidikan Terakhir"
          value={[kader.pendidikan_jenjang, kader.pendidikan_jurusan, kader.pendidikan_institusi].filter(Boolean).join(' — ')}
        />
        <DetailRow label="Keahlian Khusus" value={kader.keahlian_khusus} />
        <DetailRow label="Amanah di Amal Usaha" value={kader.amanah_amal_usaha} />
        <DetailRow label="Pelatihan Profesional" value={kader.pelatihan_profesional} />
        <DetailRow label="Amanah Organisasi" value={kader.amanah_organisasi} />
      </SectionCard>

      {/* D. Wilayah */}
      <SectionCard title="D. Wilayah Tugas & Penugasan Dakwah">
        <DetailRow label="Wilayah Tugas" value={kader.wilayah_tugas} />
        <DetailRow label="Riwayat Penugasan" value={kader.riwayat_penugasan} />
      </SectionCard>

      {/* E. Marhalah */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-green-50 border-b border-green-100 px-5 py-3">
          <h3 className="font-semibold text-green-800 text-sm">E. Metrik Pengukuran Jenjang Perkaderan</h3>
        </div>
        <div className="p-5 overflow-x-auto">
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
                <td className="px-4 py-3 text-gray-600 italic">Anggota/belum marhalah</td>
                <td colSpan={2} className="px-4 py-3 text-gray-400 text-xs">— tidak ada nilai —</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700">Marhalah Ula <span className="text-gray-400 font-normal">(Dasar)</span></td>
                <td className="px-4 py-3 text-gray-700">{kader.marhalah_ula_tahun || '-'}</td>
                <td className="px-4 py-3">
                  {kader.marhalah_ula_skor
                    ? <Badge variant="green">{kader.marhalah_ula_skor}</Badge>
                    : <span className="text-gray-400">-</span>}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700">Marhalah Wustho <span className="text-gray-400 font-normal">(Menengah)</span></td>
                <td className="px-4 py-3 text-gray-700">{kader.marhalah_wustho_tahun || '-'}</td>
                <td className="px-4 py-3">
                  {kader.marhalah_wustho_skor
                    ? <Badge variant="blue">{kader.marhalah_wustho_skor}</Badge>
                    : <span className="text-gray-400">-</span>}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700">Marhalah Ulya <span className="text-gray-400 font-normal">(Tinggi)</span></td>
                <td className="px-4 py-3 text-gray-700">{kader.marhalah_ulya_tahun || '-'}</td>
                <td className="px-4 py-3">
                  {kader.marhalah_ulya_skor
                    ? <Badge variant="purple">{kader.marhalah_ulya_skor}</Badge>
                    : <span className="text-gray-400">-</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 px-5 py-3">
        <div className="flex flex-wrap gap-6 text-xs text-gray-400">
          <span>Dibuat: {formatDate(kader.created_at)}</span>
          <span>Terakhir diperbarui: {formatDate(kader.updated_at)}</span>
        </div>
      </div>
    </div>
  )
}
