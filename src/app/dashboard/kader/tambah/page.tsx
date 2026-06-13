import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import KaderForm from '@/components/kader/KaderForm'
import type { Profile } from '@/types/database'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function TambahKaderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/kader"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-3"
        >
          <ChevronLeft size={16} />
          Kembali ke Data Kader
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Data Kader</h1>
        <p className="text-gray-500 text-sm mt-1">
          Isi formulir berikut sesuai data kader yang akan didaftarkan
        </p>
      </div>

      <KaderForm profile={profile as unknown as Profile} />
    </div>
  )
}
