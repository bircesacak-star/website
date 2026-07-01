'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function OnamForm() {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!checked) {
      setError('Devam etmek için onam kutusunu işaretlemelisin')
      return
    }

    setLoading(true)
    setError(null)

    const res = await fetch('/api/consent', { method: 'POST' })

    if (!res.ok) {
      setError('Bir hata oluştu, lütfen tekrar dene')
      setLoading(false)
      return
    }

    router.push('/test')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg border p-4">
        <Checkbox
          id="consent"
          checked={checked}
          onCheckedChange={(v) => setChecked(v === true)}
        />
        <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
          Yukarıdaki veri kullanım koşullarını okudum ve anladım. Belirtilen amaçlar
          doğrultusunda verilerimin işlenmesine onay veriyorum.
        </Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading || !checked}>
        {loading ? 'Kaydediliyor…' : 'Onam Veriyorum — Teste Başla'}
      </Button>
    </form>
  )
}
