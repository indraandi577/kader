'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/database'
import { LayoutDashboard, Users, PlusCircle, Building2 } from 'lucide-react'

interface SidebarProps {
  profile: Profile | null
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/dashboard/kader',
      label: 'Data Kader',
      icon: Users,
    },
    {
      href: '/dashboard/kader/tambah',
      label: 'Tambah Kader',
      icon: PlusCircle,
    },
  ]

  // Pusat-only
  if (profile?.role === 'pusat') {
    navItems.push({
      href: '/dashboard/dpd',
      label: 'Rekap per DPD',
      icon: Building2,
    })
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-full hidden md:block">
      <div className="p-4">
        {profile?.role === 'pusat' ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-green-600 font-medium">Akses</p>
            <p className="text-sm font-bold text-green-800">Admin Pusat</p>
            <p className="text-xs text-green-600">Seluruh DPD</p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-green-600 font-medium">DPD Anda</p>
            <p className="text-sm font-bold text-green-800">{profile?.dpd}</p>
          </div>
        )}

        <nav className="space-y-1">
          {navItems.map(item => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) && item.href !== '/dashboard'

            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
