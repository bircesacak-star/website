'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LIKERT_OPTIONS, type Question, type LikertValue } from '@/lib/holland-questions'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'holland_answers'
const PAGE_SIZE = 10

type Answers = Record<number, LikertValue>

function loadFromStorage(): Answers {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Answers) : {}
  } catch {
    return {}
  }
}

function saveToStorage(answers: Answers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
}

export function TestWizard({ questions }: { questions: Question[] }) {
  const router = useRouter()
  const totalPages = Math.ceil(questions.length / PAGE_SIZE)

  const [page, setPage] = useState(0)
  const [answers, setAnswers] = useState<Answers>(loadFromStorage)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pageQuestions = questions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const answeredOnPage = pageQuestions.filter((q) => answers[q.id] !== undefined).length
  const pageComplete = answeredOnPage === pageQuestions.length
  const totalAnswered = Object.keys(answers).length
  const progressPct = (totalAnswered / questions.length) * 100
  const isLastPage = page === totalPages - 1

  function handleSelect(questionId: number, value: LikertValue) {
    const updated = { ...answers, [questionId]: value }
    setAnswers(updated)
    saveToStorage(updated)
  }

  function handleNext() {
    if (!pageComplete) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setPage((p) => p + 1)
  }

  function handleBack() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setPage((p) => p - 1)
  }

  async function handleSubmit() {
    if (!pageComplete) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/holland/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Bir hata oluştu')
        setSubmitting(false)
        return
      }

      localStorage.removeItem(STORAGE_KEY)
      router.push('/sonuc')
    } catch {
      setError('Bağlantı hatası, lütfen tekrar dene')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/40 pb-16">
      {/* Başlık + progress */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 shadow-sm">
        <div className="mx-auto max-w-2xl space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Holland Mesleki Tercih Envanteri</span>
            <span>
              {totalAnswered} / {questions.length} soru
            </span>
          </div>
          <Progress value={progressPct} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Sayfa {page + 1} / {totalPages}
          </p>
        </div>
      </div>

      {/* Sorular */}
      <div className="mx-auto max-w-2xl px-4 pt-6 space-y-4">
        {pageQuestions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            selected={answers[q.id]}
            onSelect={(v) => handleSelect(q.id, v)}
          />
        ))}
      </div>

      {/* Hata */}
      {error && (
        <p className="mx-auto max-w-2xl px-4 mt-4 text-sm text-destructive">{error}</p>
      )}

      {/* Navigasyon */}
      <div className="mx-auto max-w-2xl px-4 mt-6 flex gap-3">
        {page > 0 && (
          <Button variant="outline" onClick={handleBack} className="flex-1">
            ← Geri
          </Button>
        )}
        {isLastPage ? (
          <Button
            onClick={handleSubmit}
            disabled={!pageComplete || submitting}
            className="flex-1"
          >
            {submitting ? 'Hesaplanıyor…' : 'Sonuçlarımı Hesapla →'}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!pageComplete} className="flex-1">
            Devam Et →
          </Button>
        )}
      </div>

      {!pageComplete && (
        <p className="mx-auto max-w-2xl px-4 mt-2 text-xs text-muted-foreground">
          Bu sayfadaki tüm soruları yanıtla ({answeredOnPage}/{pageQuestions.length})
        </p>
      )}
    </div>
  )
}

function QuestionCard({
  question,
  selected,
  onSelect,
}: {
  question: Question
  selected: LikertValue | undefined
  onSelect: (v: LikertValue) => void
}) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm space-y-3">
      <p className="text-sm font-medium leading-relaxed">
        <span className="text-muted-foreground mr-2">{question.id}.</span>
        {question.text}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {LIKERT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value as LikertValue)}
            className={cn(
              'rounded-md border px-3 py-2 text-sm font-medium transition-colors',
              selected === opt.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted border-border text-foreground'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
