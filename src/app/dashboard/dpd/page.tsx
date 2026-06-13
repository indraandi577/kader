import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDashboardStats } from '@/app/actions/kader'
import { DPD_LIST } from '@/lib/constants'
import type { Profile } from '@/types/database'
import Link from 'next/link'
import { Building2 } from 'lucide-react'

export default async function DpdRekapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const p = profile as unknown as Profile

  if (p.role !== 'pusat') redirect('/dashboard')

  const stats = await getDashboardStats()

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rekap per DPD</h1>
        <p className="text-gray-500 text-sm mt-1">
          Ringkasan data kader seluruh DPD se-wilayah DIY-Jateng Bagian Selatan
        </p>
      </div>

      {/* Summary total */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-green-700">{stats?.total || 0}</p>
            <p className="text-sm text-green-600 font-medium">Total Kader</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">{stats?.marhalahUlya || 0}</p>
            <p className="text-sm text-purple-600">Marhalah Ulya</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">{stats?.marhalahWustho || 0}</p>
            <p className="text-sm text-blue-600">Marhalah Wustho</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-600">{stats?.marhalahUla || 0}</p>
            <p className="text-sm text-yellow-600">Marhalah Ula</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-400">{stats?.belumMarhalah || 0}</p>
            <p className="text-sm text-gray-500">Belum Marhalah</p>
          </div>
        </div>
      </div>

      {/* Tabel detail per DPD */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-green-50 border-b border-green-100 px-5 py-3 flex items-center gap-2">
          <Building2 size={18} className="text-green-700" />
          <h2 className="font-semibold text-green-800 text-sm">Detail per DPD</h2>
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
                const d = stats?.perDpdDetail?.[dpd] || { total: 0, belum: 0, ula: 0, wustho: 0, ulya: 0 }
                return (
                  <tr key={dpd} className="hover:bg-gray-50 transition-colors">
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
                        Lihat Data →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-green-50 border-t-2 border-green-200 font-semibold">
                <td className="px-4 py-3 text-green-800">TOTAL</td>
                <td className="px-4 py-3 text-center text-green-700">{stats?.total || 0}</td>
                <td className="px-4 py-3 text-center text-purple-700">{stats?.marhalahUlya || 0}</td>
                <td className="px-4 py-3 text-center text-blue-700">{stats?.marhalahWustho || 0}</td>
                <td className="px-4 py-3 text-center text-yellow-700">{stats?.marhalahUla || 0}</td>
                <td className="px-4 py-3 text-center text-gray-500">{stats?.belumMarhalah || 0}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
