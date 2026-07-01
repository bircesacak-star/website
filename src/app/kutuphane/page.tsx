import { requireStep } from '@/lib/access'
import { queryAll } from '@/lib/db'
import Link from 'next/link'
import type { HollandDimension } from '@/lib/holland-questions'
import { DIMENSION_LABELS } from '@/lib/holland-questions'

type CareerRow = {
  slug: string
  title: string
  cluster: string
  holland_codes: string
}

export default async function KutuphhanePage({
  searchParams,
}: {
  searchParams: Promise<{ cluster?: string; q?: string }>
}) {
  await requireStep('profile')

  const { cluster, q } = await searchParams

  let careers = await queryAll<CareerRow>(
    'SELECT slug, title, cluster, holland_codes FROM careers ORDER BY cluster, title'
  )

  if (cluster && cluster !== 'Tümü') {
    careers = careers.filter((c) => c.cluster === cluster)
  }
  if (q) {
    const lower = q.toLowerCase()
    careers = careers.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        c.cluster.toLowerCase().includes(lower)
    )
  }

  const clusterRows = await queryAll<{ cluster: string }>(
    'SELECT DISTINCT cluster FROM careers ORDER BY cluster'
  )
  const clusters = [...new Set(clusterRows.map((r) => r.cluster))]

  return (
    <div className="min-h-screen bg-muted/40 pb-16">
      <div className="mx-auto max-w-3xl px-4 pt-8 space-y-6">
        <div>
          <h1 className="text-lg font-semibold">Meslek Kütüphanesi</h1>
          <p className="text-sm text-muted-foreground">
            {careers.length} meslek — bir günü nasıl geçiyor, hangi dersleri görüyor, iş olanakları neler?
          </p>
        </div>

        {/* Arama */}
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Meslek ara…"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {cluster && <input type="hidden" name="cluster" value={cluster} />}
          <button
            type="submit"
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
          >
            Ara
          </button>
        </form>

        {/* Küme filtreleri */}
        <div className="flex flex-wrap gap-2">
          {['Tümü', ...clusters].map((cl) => (
            <Link
              key={cl}
              href={cl === 'Tümü' ? '/kutuphane' : `/kutuphane?cluster=${encodeURIComponent(cl)}`}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                (cl === 'Tümü' && !cluster) || cluster === cl
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:bg-muted'
              }`}
            >
              {cl}
            </Link>
          ))}
        </div>

        {/* Meslek kartları */}
        {careers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Meslek bulunamadı.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {careers.map((career) => {
              const codes = JSON.parse(career.holland_codes) as HollandDimension[]
              return (
                <Link
                  key={career.slug}
                  href={`/kutuphane/${career.slug}`}
                  className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow space-y-1"
                >
                  <p className="text-sm font-semibold">{career.title}</p>
                  <p className="text-xs text-muted-foreground">{career.cluster}</p>
                  <div className="flex gap-1 mt-1">
                    {codes.map((c) => (
                      <span key={c} className="text-xs rounded bg-muted px-1.5 py-0.5">
                        {c} · {DIMENSION_LABELS[c]}
                      </span>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
