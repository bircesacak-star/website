'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Hata izleme servisi buraya eklenebilir
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="space-y-2">
        <p className="text-5xl">⚠️</p>
        <h1 className="text-lg font-semibold">Bir hata oluştu</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Beklenmedik bir sorun çıktı. Lütfen tekrar dene veya sayfayı yenile.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className={cn(buttonVariants())}
        >
          Tekrar Dene
        </button>
        <Link href="/" className={cn(buttonVariants({ variant: 'outline' }))}>
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
