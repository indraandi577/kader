import { createClient } from '@/lib/supabase/server'
import { getDashboardStats } from '@/app/actions/kader'
import StatCard from '@/components/dashboard/StatCard'
import Link from 'next/link'
import { Users, GraduationCap, BookOpen, Award, Building2, PlusCircle } from 'lucide-react'
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
      {p.role === 'pusat' && stats?.perDpd && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-green-50 border-b border-green-100 px-5 py-4 flex items-center gap-2">
            <Building2 size={18} className="text-green-700" />
            <h2 className="font-semibold text-green-800">Rekap Kader per DPD</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">DPD</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Jumlah Kader</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DPD_LIST.map(dpd => (
                  <tr key={dpd} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{dpd}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        (stats.perDpd[dpd] || 0) > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {stats.perDpd[dpd] || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/kader?dpd=${encodeURIComponent(dpd)}`}
                        className="text-green-600 hover:text-green-800 text-xs font-medium"
                      >
                        Lihat Data →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
