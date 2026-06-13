import { createClient } from '@/lib/supabase/server'
import { getDashboardStats } from '@/app/actions/kader'
import StatCard from '@/components/dashboard/StatCard'
import Link from 'next/link'
import { Users, GraduationCap, BookOpen, Award, Building2, PlusCircle, UserX } from 'lucide-react'
import type { Profile } from '@/types/database'
import { DPD_LIST } from '@/lib/constants'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const p = profile as unknown as Profile

  const stats = await getDashboardStats(
    p.role === 'dpd' ? p.dpd! : undefined
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {p.role === 'pusat'
              ? 'Pengurus DPW — Seluruh DPD Se-Wilayah DIY-Jateng Bagian Selatan'
              : `Data Kader ${p.dpd}`}
          </p>
        </div>
        <Link
          href="/dashboard/kader/tambah"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <PlusCircle size={16} />
          Tambah Kader
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Kader"
          value={stats?.total ?? 0}
          icon={Users}
          color="green"
          description={p.role === 'pusat' ? 'Seluruh DPD' : p.dpd || ''}
        />
        <StatCard
          title="Marhalah Ulya"
          value={stats?.marhalahUlya ?? 0}
          icon={Award}
          color="purple"
          description="Jenjang Tinggi"
        />
        <StatCard
          title="Marhalah Wustho"
          value={stats?.marhalahWustho ?? 0}
          icon={GraduationCap}
          color="blue"
          description="Jenjang Menengah"
        />
        <StatCard
          title="Marhalah Ula"
          value={stats?.marhalahUla ?? 0}
          icon={BookOpen}
          color="yellow"
          description="Jenjang Dasar"
        />
      </div>

      {/* Per-DPD table (hanya untuk pusat) */}
      {p.role === 'pusat' && stats?.perDpdDetail && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-green-50 border-b border-green-100 px-5 py-4 flex items-center gap-2">
            <Building2 size={18} className="text-green-700" />
            <h2 className="font-semibold text-green-800">Rekap Kader per DPD</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">DPD</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-purple-500 uppercase">Ulya</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Wustho</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-yellow-500 uppercase">Ula</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Belum</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DPD_LIST.map(dpd => {
                  const d = stats.perDpdDetail[dpd] || { total: 0, belum: 0, ula: 0, wustho: 0, ulya: 0 }
                  return (
                    <tr key={dpd} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700">{dpd}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-full text-xs font-bold ${
                          d.total > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {d.total}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-full text-xs font-bold ${
                          d.ulya > 0 ? 'bg-purple-100 text-purple-700' : 'text-gray-300'
                        }`}>
                          {d.ulya || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-full text-xs font-bold ${
                          d.wustho > 0 ? 'bg-blue-100 text-blue-700' : 'text-gray-300'
                        }`}>
                          {d.wustho || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-full text-xs font-bold ${
                          d.ula > 0 ? 'bg-yellow-100 text-yellow-700' : 'text-gray-300'
                        }`}>
                          {d.ula || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-full text-xs font-bold ${
                          d.belum > 0 ? 'bg-gray-100 text-gray-500' : 'text-gray-300'
                        }`}>
                          {d.belum || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/dashboard/kader?dpd=${encodeURIComponent(dpd)}`}
                          className="text-green-600 hover:text-green-800 text-xs font-medium"
                        >
                          Lihat →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              {/* Total row */}
              <tfoot>
                <tr className="bg-green-50 border-t-2 border-green-200 font-semibold">
                  <td className="px-4 py-3 text-green-800 text-sm">TOTAL</td>
                  <td className="px-4 py-3 text-center text-green-700">{stats.total}</td>
                  <td className="px-4 py-3 text-center text-purple-700">{stats.marhalahUlya}</td>
                  <td className="px-4 py-3 text-center text-blue-700">{stats.marhalahWustho}</td>
                  <td className="px-4 py-3 text-center text-yellow-700">{stats.marhalahUla}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{stats.belumMarhalah}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Untuk role DPD: tampilkan breakdown marhalah sendiri */}
      {p.role === 'dpd' && stats && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-green-50 border-b border-green-100 px-5 py-4 flex items-center gap-2">
            <Users size={18} className="text-green-700" />
            <h2 className="font-semibold text-green-800">Breakdown Marhalah — {p.dpd}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            <div className="p-5 text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.marhalahUlya}</p>
              <p className="text-sm text-gray-500 mt-1">Marhalah Ulya</p>
              <p className="text-xs text-gray-400">Jenjang Tinggi</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.marhalahWustho}</p>
              <p className="text-sm text-gray-500 mt-1">Marhalah Wustho</p>
              <p className="text-xs text-gray-400">Jenjang Menengah</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.marhalahUla}</p>
              <p className="text-sm text-gray-500 mt-1">Marhalah Ula</p>
              <p className="text-xs text-gray-400">Jenjang Dasar</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-3xl font-bold text-gray-400">{stats.belumMarhalah}</p>
              <p className="text-sm text-gray-500 mt-1">Belum Marhalah</p>
              <p className="text-xs text-gray-400">Anggota</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/kader"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-sm transition-all flex items-center gap-4"
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <Users size={24} className="text-green-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Lihat Data Kader</p>
            <p className="text-sm text-gray-500">Tabel lengkap seluruh kader</p>
          </div>
        </Link>
        <Link
          href="/dashboard/kader/tambah"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-sm transition-all flex items-center gap-4"
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <PlusCircle size={24} className="text-green-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Input Kader Baru</p>
            <p className="text-sm text-gray-500">Tambah data kader baru ke sistem</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
