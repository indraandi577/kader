import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDashboardStats } from '@/app/actions/kader'
import { DPD_LIST } from '@/lib/constants'
import type { Profile, DpdEnum } from '@/types/database'
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

  // Only pusat can access this page
  if (p.role !== 'pusat') {
    redirect('/dashboard')
  }

  const stats = await getDashboardStats()

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rekap per DPD</h1>
        <p className="text-gray-500 text-sm mt-1">
          Ringkasan data kader seluruh DPD se-wilayah DIY-Jateng Bagian Selatan
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DPD_LIST.map(dpd => {
          const count = stats?.perDpd[dpd] || 0
          return (
            <Link
              key={dpd}
              href={`/dashboard/kader?dpd=${encodeURIComponent(dpd)}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Building2 size={20} className="text-green-700" />
                </div>
                <span className={`text-2xl font-bold ${count > 0 ? 'text-green-700' : 'text-gray-300'}`}>
                  {count}
                </span>
              </div>
              <p className="font-semibold text-gray-800 text-sm">{dpd}</p>
              <p className="text-xs text-gray-400 mt-1">{count} kader terdaftar</p>
            </Link>
          )
        })}
      </div>

      {/* Summary */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-green-700">{stats?.total || 0}</p>
            <p className="text-sm text-green-600">Total Kader</p>
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
        </div>
      </div>
    </div>
  )
}
