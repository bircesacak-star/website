import { requireStep } from '@/lib/access'
import { queryOne } from '@/lib/db'
import { DIMENSION_LABELS, DIMENSION_COLORS, type HollandDimension } from '@/lib/holland-questions'
import type { SuitableCareer } from '@/types'
import { RaporDisplay } from './rapor-display'
import { RaporGenerator } from './rapor-generator'
import { FlowProgress } from '@/components/layout/flow-progress'

type HollandRow = { holland_code: string; r_score: number; i_score: number; a_score: number; s_score: number; e_score: number; c_score: number }
type ReportRow = { personality_summary: string; suitable_careers: string; full_report: string }

export default async function ProfilPage() {
  const session = await requireStep('profile')
  const userId = session.user.id

  const holland = await queryOne<HollandRow>(
    'SELECT holland_code, r_score, i_score, a_score, s_score, e_score, c_score FROM holland_results WHERE user_id = ?',
    [userId]
  )

  if (!holland) return null

  const report = await queryOne<ReportRow>(
    'SELECT personality_summary, suitable_careers, full_report FROM reports WHERE user_id = ?',
    [userId]
  )

  const scores: Record<HollandDimension, number> = {
    R: holland.r_score, I: holland.i_score, A: holland.a_score,
    S: holland.s_score, E: holland.e_score, C: holland.c_score,
  }

  const topDims = holland.holland_code.split('') as HollandDimension[]

  return (
    <>
      <FlowProgress step={5} />
    <div className="min-h-screen bg-muted/40 pb-16">
      <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">

        {/* Holland Kodu başlık kartı */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-xs text-muted-foreground mb-3">Kişilik Profilin</p>
          <div className="flex items-center gap-6">
            <div className="flex gap-3">
              {topDims.map((dim) => (
                <div key={dim} className="text-center">
                  <span className="text-3xl font-bold" style={{ color: DIMENSION_COLORS[dim] }}>
                    {dim}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">{DIMENSION_LABELS[dim]}</p>
                </div>
              ))}
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              {(Object.entries(scores) as [HollandDimension, number][])
                .sort((a, b) => b[1] - a[1])
                .map(([dim, score]) => (
                  <div key={dim} className="flex items-center gap-1 text-xs">
                    <span className="font-semibold" style={{ color: DIMENSION_COLORS[dim] }}>{dim}</span>
                    <span className="text-muted-foreground">{score}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {report ? (
          <RaporDisplay
            personalitySummary={report.personality_summary}
            suitableCareers={JSON.parse(report.suitable_careers) as SuitableCareer[]}
            fullReport={report.full_report}
            hollandCode={holland.holland_code}
          />
        ) : (
          <RaporGenerator hollandCode={holland.holland_code} />
        )}
      </div>
    </div>
    </>
  )
}
