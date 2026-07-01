import { redirect } from 'next/navigation'
import { requireStep } from '@/lib/access'
import { queryOne } from '@/lib/db'
import { DIMENSION_LABELS, DIMENSION_COLORS, type HollandDimension } from '@/lib/holland-questions'
import { HollandChart } from './holland-chart'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FlowProgress } from '@/components/layout/flow-progress'

type ResultRow = {
  r_score: number
  i_score: number
  a_score: number
  s_score: number
  e_score: number
  c_score: number
  holland_code: string
}

const DIMENSION_DESC: Record<HollandDimension, string> = {
  R: 'Elle çalışmayı, makine ve aletleri kullanmayı seven, pratik ve teknik işlere yatkın kişiler.',
  I: 'Araştırmayı, analiz etmeyi ve problem çözmeyi seven, bilimsel düşünceye yakın kişiler.',
  A: 'Yaratıcılığını ifade etmekten zevk alan, sanat, müzik ve edebiyata ilgi duyan kişiler.',
  S: 'İnsanlarla çalışmayı, öğretmeyi ve yardım etmeyi seven, sosyal ilişkilere önem veren kişiler.',
  E: 'Liderlik etmeyi, ikna etmeyi ve girişimde bulunmayı seven, hırslı ve enerjik kişiler.',
  C: 'Düzen ve sistemlere önem veren, kayıt tutmayı ve organizasyonu tercih eden kişiler.',
}

export default async function SonucPage() {
  const session = await requireStep('profile')

  const result = await queryOne<ResultRow>(
    'SELECT r_score, i_score, a_score, s_score, e_score, c_score, holland_code FROM holland_results WHERE user_id = ?',
    [session.user.id]
  )

  if (!result) redirect('/test')

  const scores: Record<HollandDimension, number> = {
    R: result.r_score,
    I: result.i_score,
    A: result.a_score,
    S: result.s_score,
    E: result.e_score,
    C: result.c_score,
  }

  const topDimensions = result.holland_code.split('') as HollandDimension[]

  const chartData = (Object.entries(scores) as [HollandDimension, number][]).map(
    ([dim, score]) => ({
      dim,
      label: DIMENSION_LABELS[dim],
      score,
      color: DIMENSION_COLORS[dim],
    })
  )

  const sortedScores = (Object.entries(scores) as [HollandDimension, number][]).sort(
    (a, b) => b[1] - a[1]
  )

  return (
    <>
      <FlowProgress step={3} />
      <div className="min-h-screen bg-muted/40 pb-16">
        <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">

          {/* Başlık */}
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Kişilik Profili Sonucu</p>
            <h1 className="text-xl font-bold">Holland Grafiğim</h1>
          </div>

          {/* Baskın Holland Kodu */}
          <div className="rounded-xl border bg-card p-6 shadow-sm text-center space-y-5">
            <p className="text-xs text-muted-foreground">Baskın Holland Kodun</p>

            <div className="flex justify-center gap-6">
              {topDimensions.map((dim, i) => (
                <div key={dim} className="flex flex-col items-center gap-2">
                  <span
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm"
                    style={{ backgroundColor: DIMENSION_COLORS[dim] }}
                  >
                    {dim}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {i === 0 ? '1. Baskın' : i === 1 ? '2. Baskın' : '3. Baskın'}
                  </span>
                  <span className="text-sm font-semibold">{DIMENSION_LABELS[dim]}</span>
                  <span className="text-xs text-muted-foreground font-medium">{scores[dim]} puan</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t">
              <span className="text-3xl font-bold tracking-[0.35em]">
                {topDimensions.map((dim) => (
                  <span key={dim} style={{ color: DIMENSION_COLORS[dim] }}>{dim}</span>
                ))}
              </span>
            </div>
          </div>

          {/* Puan grafiği */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-sm font-semibold">6 Boyut Puan Dağılımı</h2>
              <span className="text-xs text-muted-foreground">Maks. 45 puan</span>
            </div>
            <HollandChart data={chartData} />
          </div>

          {/* Puan sıralaması */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/40">
              <h2 className="text-sm font-semibold">Puan Sıralaması</h2>
            </div>
            <div className="divide-y">
              {sortedScores.map(([dim, score], i) => {
                const pct = Math.round((score / 45) * 100)
                return (
                  <div key={dim} className="px-4 py-3 flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                    <span
                      className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                      style={{ backgroundColor: DIMENSION_COLORS[dim] }}
                    >
                      {dim}
                    </span>
                    <span className="text-sm font-medium flex-1">{DIMENSION_LABELS[dim]}</span>
                    <div className="flex items-center gap-2 w-36">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: DIMENSION_COLORS[dim] }}
                        />
                      </div>
                      <span className="text-sm font-bold w-8 text-right" style={{ color: DIMENSION_COLORS[dim] }}>
                        {score}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Boyut açıklamaları */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">Kişilik Tiplerinin Anlamı</h2>
            {(Object.entries(DIMENSION_LABELS) as [HollandDimension, string][]).map(
              ([dim, label]) => (
                <div key={dim} className="rounded-lg border bg-card p-3.5 shadow-sm flex gap-3 items-start">
                  <span
                    className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: DIMENSION_COLORS[dim] }}
                  >
                    {dim}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{DIMENSION_DESC[dim]}</p>
                  </div>
                  <span className="text-sm font-bold shrink-0" style={{ color: DIMENSION_COLORS[dim] }}>
                    {scores[dim]}
                  </span>
                </div>
              )
            )}
          </div>

          <Link href="/profil-formu" className={cn(buttonVariants(), 'w-full')}>
            Profil Sorularına Geç →
          </Link>
        </div>
      </div>
    </>
  )
}
