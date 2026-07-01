'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function OdemeForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [threeDsHtml, setThreeDsHtml] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const data = {
      cardHolderName: (form.elements.namedItem('cardHolderName') as HTMLInputElement).value,
      cardNumber: (form.elements.namedItem('cardNumber') as HTMLInputElement).value.replace(/\s/g, ''),
      expireMonth: (form.elements.namedItem('expireMonth') as HTMLInputElement).value,
      expireYear: (form.elements.namedItem('expireYear') as HTMLInputElement).value,
      cvc: (form.elements.namedItem('cvc') as HTMLInputElement).value,
    }

    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json() as { htmlContent?: string; error?: string }

      if (!res.ok) {
        setError(json.error ?? 'Ödeme işlemi başarısız oldu')
        return
      }

      if (json.htmlContent) {
        setThreeDsHtml(json.htmlContent)
      }
    } catch {
      setError('Bir hata oluştu, lütfen tekrar deneyin')
    } finally {
      setLoading(false)
    }
  }

  // Banka 3DS doğrulama ekranı
  if (threeDsHtml) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-medium">3D Güvenlik Doğrulama</p>
          <button
            onClick={() => setThreeDsHtml(null)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            İptal
          </button>
        </div>
        <iframe
          srcDoc={threeDsHtml}
          className="flex-1 border-0 w-full"
          title="Banka 3D Güvenlik Doğrulaması"
          sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
        />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
      <h2 className="font-medium">Kart Bilgileri</h2>

      <div className="space-y-1">
        <Label htmlFor="cardHolderName">Kart Üzerindeki Ad</Label>
        <Input id="cardHolderName" name="cardHolderName" placeholder="AD SOYAD" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="cardNumber">Kart Numarası</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          required
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
            e.target.value = digits.replace(/(.{4})/g, '$1 ').trim()
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="expireMonth">Ay</Label>
          <Input id="expireMonth" name="expireMonth" placeholder="MM" maxLength={2} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="expireYear">Yıl (YY)</Label>
          <Input id="expireYear" name="expireYear" placeholder="YY" maxLength={2} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cvc">CVC</Label>
          <Input id="cvc" name="cvc" placeholder="000" maxLength={3} required type="password" />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'İşleniyor…' : '₺299 Öde ve Başla'}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Kart bilgilerin tarafımızca saklanmaz.
      </p>
    </form>
  )
}
