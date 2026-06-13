import { createClient } from '@/lib/supabase/server'
import { getKaderById } from '@/app/actions/kader'
import { notFound, redirect } from 'next/navigation'
import KaderForm from '@/components/kader/KaderForm'
import type { Profile, KaderWithAnak } from '@/types/database'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditKaderPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  let kader: KaderWithAnak | undefined
  try {
    kader = await getKaderById(id)
  } catch {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <Link
          href={`/dashboard/kader/${id}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-3"
        >
          <ChevronLeft size={16} />
          Kembali ke Detail Kader
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Data Kader</h1>
        <p className="text-gray-500 text-sm mt-1">
          {kader!.nama_lengkap} · {kader!.id_kader}
        </p>
      </div>

      <KaderForm kader={kader!} profile={profile as unknown as Profile} />
    </div>
  )
}
