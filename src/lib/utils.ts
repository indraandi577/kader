import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatNamaLengkap(
  nama: string,
  gelarDepan?: string | null,
  gelarBelakang?: string | null
): string {
  const parts = []
  if (gelarDepan) parts.push(gelarDepan)
  parts.push(nama)
  if (gelarBelakang) parts.push(gelarBelakang)
  return parts.join(' ')
}
