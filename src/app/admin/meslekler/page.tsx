import { requireAdmin } from '@/lib/admin'
import { queryAll } from '@/lib/db'
import { CAREER_SEEDS } from '@/lib/career-seeds'
import { MesleklerClient } from './meslekler-client'

type CareerRow = { id: string; slug: string; title: string; cluster: string }

export default async function AdminMesleklerPage() {
  await requireAdmin()

  const careers = await queryAll<CareerRow>(
    'SELECT id, slug, title, cluster FROM careers ORDER BY title'
  )

  const existingSlugs = new Set(careers.map((c) => c.slug))
  const pending = CAREER_SEEDS.filter((s) => !existingSlugs.has(s.slug))

  return (
    <div className="min-h-screen bg-muted/40 pb-16">
      <div className="mx-auto max-w-3xl px-4 pt-8 space-y-6">
        <div>
          <h1 className="text-lg font-semibold">Meslek Yönetimi</h1>
          <p className="text-sm text-muted-foreground">
            {careers.length} meslek DB&apos;de · {pending.length} meslek üretilmeyi bekliyor
          </p>
        </div>

        <MesleklerClient careers={careers} pendingCount={pending.length} />
      </div>
    </div>
  )
}
