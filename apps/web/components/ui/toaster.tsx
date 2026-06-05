'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

const toastQueue: Toast[] = []
let listeners: Array<(toasts: Toast[]) => void> = []

export function toast(message: string, type: ToastType = 'info') {
  const t: Toast = { id: Date.now().toString(), message, type }
  toastQueue.push(t)
  listeners.forEach((l) => l([...toastQueue]))
  setTimeout(() => {
    const idx = toastQueue.findIndex((x) => x.id === t.id)
    if (idx > -1) toastQueue.splice(idx, 1)
    listeners.forEach((l) => l([...toastQueue]))
  }, 4000)
}

const ICONS = { success: CheckCircle, error: XCircle, info: AlertCircle }
const COLORS = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    listeners.push(setToasts)
    return () => { listeners = listeners.filter((l) => l !== setToasts) }
  }, [])

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      {toasts.map((t) => {
        const Icon = ICONS[t.type]
        return (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm max-w-sm animate-slide-in ${COLORS[t.type]}`}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{t.message}</span>
            <button onClick={() => {
              const idx = toastQueue.findIndex((x) => x.id === t.id)
              if (idx > -1) toastQueue.splice(idx, 1)
              setToasts([...toastQueue])
            }}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
