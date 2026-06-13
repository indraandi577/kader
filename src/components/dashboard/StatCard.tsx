import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color?: 'green' | 'blue' | 'yellow' | 'purple' | 'red'
  description?: string
}

export default function StatCard({ title, value, icon: Icon, color = 'green', description }: StatCardProps) {
  const colors = {
    green: { bg: 'bg-green-50', icon: 'bg-green-600 text-white', text: 'text-green-700', border: 'border-green-100' },
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-600 text-white', text: 'text-blue-700', border: 'border-blue-100' },
    yellow: { bg: 'bg-yellow-50', icon: 'bg-yellow-500 text-white', text: 'text-yellow-700', border: 'border-yellow-100' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-600 text-white', text: 'text-purple-700', border: 'border-purple-100' },
    red: { bg: 'bg-red-50', icon: 'bg-red-600 text-white', text: 'text-red-700', border: 'border-red-100' },
  }

  const c = colors[color]

  return (
    <div className={cn('rounded-xl border p-5 flex items-start gap-4', c.bg, c.border)}>
      <div className={cn('p-2.5 rounded-lg flex-shrink-0', c.icon)}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className={cn('text-2xl font-bold mt-0.5', c.text)}>{value}</p>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
    </div>
  )
}
