import { createClient } from '@/lib/supabase/server'
import { getKaderList } from '@/app/actions/kader'
import KaderTable from '@/components/kader/KaderTable'
import Link from 'next/link'
import type { Profile, DpdEnum } from '@/types/database'
import { DPD_LIST } from '@/lib/constants'
import { PlusCircle, Users } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ dpd?: string }>
}

export default async function KaderPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const p = profile as unknown as Profile

  // Determine DPD filter
  let dpdFilter: DpdEnum | undefined
  if (p.role === 'dpd') {
    dpdFilter = p.dpd!
  } else if (params.dpd && DPD_LIST.includes(params.dpd as DpdEnum)) {
    dpdFilter = params.dpd as DpdEnum
  }

  const kaderList = await getKaderList(dpdFilter)

  const isPusat = p.role === 'pusat'

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Kader</h1>
          <p className="text-gray-500 text-sm mt-1">
            {dpdFilter ? dpdFilter : isPusat ? 'Semua DPD' : p.dpd}
            {' '}— {kaderList?.length ?? 0} kader
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

      {/* DPD Filter (hanya untuk pusat) */}
      {isPusat && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Filter per DPD</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/kader"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !dpdFilter
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              Semua DPD
            </Link>
            {DPD_LIST.map(dpd => (
              <Link
                key={dpd}
                href={`/dashboard/kader?dpd=${encodeURIComponent(dpd)}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  dpdFilter === dpd
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                {dpd.replace('DPD ', '')}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!kaderList || kaderList.length === 0) ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-gray-600 font-semibold mb-2">Belum ada data kader</h3>
          <p className="text-gray-400 text-sm mb-4">Mulai tambahkan data kader untuk {dpdFilter || 'DPD ini'}</p>
          <Link
            href="/dashboard/kader/tambah"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            <PlusCircle size={16} />
            Tambah Kader Pertama
          </Link>
        </div>
      ) : (
        <KaderTable data={kaderList} showDpd={isPusat && !dpdFilter} />
      )}
    </div>
  )
}
