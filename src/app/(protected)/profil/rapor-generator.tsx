'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { SuitableCareer } from '@/types'
import { DIMENSION_COLORS, type HollandDimension } from '@/lib/holland-questions'
import { CareerCard } from './career-card'

type SSEEvent =
  | { type: 'careers'; data: SuitableCareer[] }
  | { type: 'chunk'; text: string }
  | { type: 'done' }
  | { type: 'error'; message: string }

type Props = { hollandCode: string }

export function RaporGenerator({ hollandCode }: Props) {
  const router = useRouter()
  const [careers, setCareers] = useState<SuitableCareer[]>([])
  const [reportText, setReportText] = useState('')
  const [status, setStatus] = useState<'generating' | 'done' | 'error'>('generating')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [step, setStep] = useState<'careers' | 'report'>('careers')
  const started = useRef(false)

  const dominant = hollandCode[0] as HollandDimension
  const accentColor = DIMENSION_COLORS[dominant] ?? '#6366f1'

  useEffect(() => {
    if (started.current) return
    started.current = true

    async function generate() {
      try {
        const res = await fetch('/api/report/generate', { method: 'POST' })

        if (res.status === 409) {
          router.refresh()
          return
        }

        if (!res.ok || !res.body) {
          setStatus('error')
          setErrorMsg('Rapor oluşturulamadı')
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            try {
              const event = JSON.parse(line.slice(6)) as SSEEvent
              if (event.type === 'careers') {
                setCareers(event.data)
                setStep('report')
              } else if (event.type === 'chunk') {
                setReportText((prev) => prev + event.text)
              } else if (event.type === 'done') {
                setStatus('done')
                router.refresh()
              } else if (event.type === 'error') {
                setStatus('error')
                setErrorMsg(event.message)
              }
            } catch {
              // JSON parse hatası — atla
            }
          }
        }
      } catch {
        setStatus('error')
        setErrorMsg('Bağlantı hatası oluştu')
      }
    }

    void generate()
  }, [router])

  if (status === 'error') {
    return (
      <div className="rounded-lg border bg-card p-6 text-center space-y-2">
        <p className="text-sm text-destructive">Rapor oluşturulurken hata oluştu.</p>
        {errorMsg && <p className="text-xs text-muted-foreground">{errorMsg}</p>}
        <button
          onClick={() => { started.current = false; setStatus('generating'); location.reload() }}
          className="text-sm text-primary underline"
        >
          Tekrar dene
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Yükleniyor */}
      {step === 'careers' && (
        <div className="rounded-lg border bg-card p-8 text-center space-y-4">
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-block w-2.5 h-2.5 rounded-full animate-bounce"
                style={{ backgroundColor: accentColor, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Yapay zeka raporun hazırlanıyor…</p>
            <p className="text-xs text-muted-foreground">Holland profilin analiz ediliyor</p>
          </div>
        </div>
      )}

      {/* Meslek kartları */}
      {careers.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-sm">Sana Uygun Meslekler</h2>
          <div className="space-y-3">
            {careers.map((career) => (
              <CareerCard key={career.title} career={career} />
            ))}
          </div>
        </section>
      )}

      {/* Akışlı rapor metni */}
      {reportText.length > 0 && (
        <section
          className="rounded-xl overflow-hidden border-2 shadow-sm"
          style={{ borderColor: accentColor + '60' }}
        >
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ backgroundColor: accentColor + '18' }}
          >
            <span
              className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              {dominant}
            </span>
            <p className="text-sm font-semibold">Kişilik Analizi Raporun</p>
            {status === 'generating' && (
              <span
                className="ml-auto inline-block w-1 h-4 rounded-full animate-pulse"
                style={{ backgroundColor: accentColor }}
              />
            )}
          </div>
          <div className="p-5 bg-card">
            <div className="prose prose-sm max-w-none text-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul>li]:mb-1.5 [&_strong]:font-semibold [&>h3]:font-semibold [&>h3]:mt-5 [&>h3]:mb-2 [&>h4]:font-semibold [&>h4]:mt-4 [&>h4]:mb-1.5">
              <ReactMarkdown>{reportText}</ReactMarkdown>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
