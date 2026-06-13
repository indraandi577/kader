'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import { LogOut, Menu, X, User } from 'lucide-react'

interface NavbarProps {
  profile: Profile | null
}

export default function Navbar({ profile }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-700 font-bold text-lg">H</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-sm leading-tight">HIDAYATULLAH</p>
              <p className="text-green-200 text-xs">DIY-Jateng Bagian Selatan</p>
            </div>
          </div>

          {/* Center title */}
          <div className="hidden md:block text-center">
            <p className="text-sm font-semibold">Sistem Pendataan Kaderisasi</p>
          </div>

          {/* User info & logout */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-green-200">
                {profile?.role === 'pusat' ? 'Admin Pusat' : profile?.dpd}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-lg text-sm transition-colors"
              aria-label="Keluar"
            >
              <LogOut size={15} />
              <span>Keluar</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-green-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-green-600 px-4 py-3 space-y-2">
          <div className="flex items-center gap-2 pb-2 border-b border-green-600">
            <User size={16} />
            <div>
              <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-green-200">
                {profile?.role === 'pusat' ? 'Admin Pusat' : profile?.dpd}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 w-full text-sm hover:bg-green-600 px-2 py-1.5 rounded"
          >
            <LogOut size={15} />
            Keluar
          </button>
        </div>
      )}
    </nav>
  )
}
