'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Kader } from '@/types/database'
import { formatDate, formatNamaLengkap } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react'

interface KaderTableProps {
  data: Kader[]
  showDpd?: boolean
}

const PAGE_SIZE = 10

export default function KaderTable({ data, showDpd = false }: KaderTableProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const filtered = data.filter(k =>
    k.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
    k.id_kader.toLowerCase().includes(search.toLowerCase()) ||
    (k.dpd && k.dpd.toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Yakin ingin menghapus data kader "${nama}"? Tindakan ini tidak dapat dibatalkan.`)) return

    setDeletingId(id)
    const supabase = createClient()
    const { error } = await supabase.from('kader').delete().eq('id', id)

    if (error) {
      alert('Gagal menghapus data: ' + error.message)
    } else {
      router.refresh()
    }
    setDeletingId(null)
  }

  const getMarhalahBadge = (k: Kader) => {
    if (k.marhalah_ulya_skor) return <Badge variant="purple">Marhalah Ulya</Badge>
    if (k.marhalah_wustho_skor) return <Badge variant="blue">Marhalah Wustho</Badge>
    if (k.marhalah_ula_skor) return <Badge variant="green">Marhalah Ula</Badge>
    return <Badge variant="gray">Belum Marhalah</Badge>
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Search bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, ID, atau DPD..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-50 border-b border-green-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">ID Kader</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Nama Lengkap</th>
              {showDpd && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">DPD</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Jenis Kelamin</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Marhalah</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Bergabung</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-green-800 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={showDpd ? 7 : 6} className="px-4 py-8 text-center text-gray-400">
                  {search ? 'Tidak ada data yang cocok' : 'Belum ada data kader'}
                </td>
              </tr>
            ) : (
              paginated.map(kader => (
                <tr key={kader.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{kader.id_kader}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {formatNamaLengkap(kader.nama_lengkap, kader.gelar_depan, kader.gelar_belakang)}
                  </td>
                  {showDpd && (
                    <td className="px-4 py-3 text-gray-600 text-xs">{kader.dpd}</td>
                  )}
                  <td className="px-4 py-3 text-gray-600">
                    {kader.jenis_kelamin === 'L' ? 'Laki-laki' : kader.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
                  </td>
                  <td className="px-4 py-3">{getMarhalahBadge(kader)}</td>
                  <td className="px-4 py-3 text-gray-600">{kader.tahun_bergabung || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`/dashboard/kader/${kader.id}`}>
                        <Button variant="ghost" size="sm" title="Detail">
                          <Eye size={15} />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/kader/${kader.id}/edit`}>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Pencil size={15} className="text-blue-600" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Hapus"
                        loading={deletingId === kader.id}
                        onClick={() => handleDelete(kader.id, kader.nama_lengkap)}
                      >
                        <Trash2 size={15} className="text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Menampilkan {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} data
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
                  p === page ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
