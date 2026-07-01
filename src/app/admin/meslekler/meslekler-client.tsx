'use client'

import { useState } from 'react'

type CareerRow = { id: string; slug: string; title: string; cluster: string }

type Props = {
  careers: CareerRow[]
  pendingCount: number
}

export function MesleklerClient({ careers, pendingCount }: Props) {
  const [bulkStatus, setBulkStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [bulkLog, setBulkLog] = useState<string>('')
  const [genStatus, setGenStatus] = useState<Record<string, 'loading' | 'ok' | 'error'>>({})

  async function handleBulkGenerate() {
    if (!confirm(`${pendingCount} meslek için Claude içeriği üretilecek. Bu işlem birkaç dakika sürebilir. Devam edilsin mi?`)) return
    setBulkStatus('running')
    setBulkLog('')

    try {
      const res = await fetch('/api/admin/careers/bulk', { method: 'POST' })
      const json = (await res.json()) as {
        results: { slug: string; status: 'ok' | 'error'; message?: string }[]
      }

      const lines = json.results.map((r) =>
        r.status === 'ok' ? `✓ ${r.slug}` : `✗ ${r.slug}: ${r.message ?? 'hata'}`
      )
      setBulkLog(lines.join('\n'))
      setBulkStatus('done')
    } catch (err) {
      setBulkLog(String(err))
      setBulkStatus('error')
    }
  }

  async function handleSingleGenerate(career: CareerRow) {
    setGenStatus((prev) => ({ ...prev, [career.slug]: 'loading' }))
    try {
      const res = await fetch('/api/admin/careers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: career.slug,
          title: career.title,
          cluster: career.cluster,
          hollandCodes: [],
        }),
      })
      if (!res.ok) throw new Error('Hata')
      setGenStatus((prev) => ({ ...prev, [career.slug]: 'ok' }))
    } catch {
      setGenStatus((prev) => ({ ...prev, [career.slug]: 'error' }))
    }
  }

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`"${title}" mesleki silinecek. Emin misiniz?`)) return
    const res = await fetch(`/api/admin/careers?slug=${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      window.location.reload()
    } else {
      alert('Silme başarısız.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Toplu üretim */}
      <div className="rounded-lg border bg-card p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Toplu İçerik Üret</p>
            <p className="text-xs text-muted-foreground">
              DB&apos;de içeriği olmayan {pendingCount} meslek için Claude ile içerik oluşturulur.
            </p>
          </div>
          <button
            onClick={handleBulkGenerate}
            disabled={bulkStatus === 'running' || pendingCount === 0}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {bulkStatus === 'running' ? 'Üretiliyor…' : 'Toplu Üret'}
          </button>
        </div>

        {bulkLog && (
          <pre className="rounded bg-muted p-3 text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">
            {bulkLog}
          </pre>
        )}
      </div>

      {/* Mevcut meslekler */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-xs text-muted-foreground">
              <th className="px-4 py-2 text-left font-medium">Meslek</th>
              <th className="px-4 py-2 text-left font-medium">Küme</th>
              <th className="px-4 py-2 text-right font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {careers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-xs text-muted-foreground">
                  Henüz meslek eklenmemiş.
                </td>
              </tr>
            ) : (
              careers.map((c) => {
                const status = genStatus[c.slug]
                return (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-2 font-medium">{c.title}</td>
                    <td className="px-4 py-2 text-muted-foreground">{c.cluster}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => handleSingleGenerate(c)}
                        disabled={status === 'loading'}
                        className="text-xs text-primary underline hover:no-underline disabled:opacity-50"
                      >
                        {status === 'loading'
                          ? 'Üretiliyor…'
                          : status === 'ok'
                          ? '✓ Güncellendi'
                          : status === 'error'
                          ? '✗ Hata'
                          : 'Yeniden Üret'}
                      </button>
                      <button
                        onClick={() => handleDelete(c.slug, c.title)}
                        className="text-xs text-destructive underline hover:no-underline"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
