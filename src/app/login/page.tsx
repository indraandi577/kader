'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

// Username dikonversi ke format email internal
const toEmail = (username: string) =>
  `${username.trim().toLowerCase()}@hidayatullah.internal`

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const email = toEmail(username)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Username atau password salah. Silakan coba lagi.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-green-700 font-bold text-4xl">H</span>
          </div>
          <h1 className="text-white text-2xl font-bold">HIDAYATULLAH</h1>
          <p className="text-green-200 text-sm mt-1">Sistem Pendataan Kaderisasi</p>
          <p className="text-green-300 text-xs mt-1">DPW DIY-Jateng Bagian Selatan</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-gray-800 text-xl font-bold text-center mb-6">Masuk ke Sistem</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700 flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-3 top-9 text-gray-400" />
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Masukkan username"
                className="pl-9"
                autoComplete="username"
                autoCapitalize="none"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-9 text-gray-400" />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Masukkan password"
                className="pl-9 pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
            >
              Masuk
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Akun dikelola oleh Admin Pusat.<br />
            Hubungi pengurus DPW jika ada masalah login.
          </p>
        </div>

        <p className="text-center text-green-300 text-xs mt-6">
          © {new Date().getFullYear()} Hidayatullah DIY-Jateng Selatan
        </p>
      </div>
    </div>
  )
}
