import { requireStep } from '@/lib/access'
import { queryOne } from '@/lib/db'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { HollandDimension } from '@/lib/holland-questions'
import { DIMENSION_LABELS, DIMENSION_COLORS } from '@/lib/holland-questions'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CareerRow = {
  title: string
  cluster: string
  holland_codes: string
  daily_life: string
  university_courses: string
  job_opportunities: string
  avg_salary_range: string | null
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await requireStep('profile')

  const { slug } = await params

  const career = await queryOne<CareerRow>(
    'SELECT title, cluster, holland_codes, daily_life, university_courses, job_opportunities, avg_salary_range FROM careers WHERE slug = ?',
    [slug]
  )

  if (!career) notFound()

  const hollandCodes = JSON.parse(career.holland_codes) as HollandDimension[]
  const courses = JSON.parse(career.university_courses) as string[]

  return (
    <div className="min-h-screen bg-muted/40 pb-16">
      <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">

        {/* Başlık */}
        <div className="space-y-2">
          <Link href="/kutuphane" className="text-xs text-muted-foreground hover:text-foreground">
            ← Kütüphane
          </Link>
          <h1 className="text-xl font-bold">{career.title}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-muted-foreground">{career.cluster}</span>
            <div className="flex gap-1">
              {hollandCodes.map((c) => (
                <span
                  key={c}
                  className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: DIMENSION_COLORS[c] }}
                >
                  {c} · {DIMENSION_LABELS[c]}
                </span>
              ))}
            </div>
            {career.avg_salary_range && (
              <span className="text-xs rounded bg-muted px-2 py-0.5">
                💰 {career.avg_salary_range}
              </span>
            )}
          </div>
        </div>

        {/* Bir günü nasıl geçiyor */}
        <section className="rounded-lg border bg-card p-6 shadow-sm space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <span>📅</span> Bir Günü Nasıl Geçiyor?
          </h2>
          <div className="prose prose-sm max-w-none text-foreground">
            <ReactMarkdown>{career.daily_life}</ReactMarkdown>
          </div>
        </section>

        {/* Üniversitede ne okuyor */}
        <section className="rounded-lg border bg-card p-6 shadow-sm space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <span>🎓</span> Üniversitede Ne Okuyorlar?
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {courses.map((course) => (
              <li key={course} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5">›</span>
                {course}
              </li>
            ))}
          </ul>
        </section>

        {/* Mezuniyet sonrası */}
        <section className="rounded-lg border bg-card p-6 shadow-sm space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <span>💼</span> Mezuniyet Sonrası İş Olanakları
          </h2>
          <div className="prose prose-sm max-w-none text-foreground">
            <ReactMarkdown>{career.job_opportunities}</ReactMarkdown>
          </div>
        </section>

        <Link href="/kutuphane" className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
          ← Tüm Mesleklere Dön
        </Link>
      </div>
    </div>
  )
}
