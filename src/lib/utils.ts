import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function jenisLabel(jenis: string) {
  switch (jenis) {
    case 'survei':
      return 'Survei'
    case 'sensus':
      return 'Sensus'
    case 'kompromin':
      return 'Kompromin'
    default:
      return jenis
  }
}

export function statusLabel(status: string) {
  switch (status) {
    case 'draft':
      return 'Draf'
    case 'in_progress':
      return 'Berjalan'
    case 'ready_for_review':
      return 'Siap ditinjau'
    case 'archived':
      return 'Arsip'
    default:
      return status
  }
}
