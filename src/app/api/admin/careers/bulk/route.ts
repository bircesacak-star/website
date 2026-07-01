import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { randomUUID } from 'crypto'
import { authOptions } from '@/lib/auth'
import { isAdminEmail } from '@/lib/admin'
import { CAREER_SEEDS } from '@/lib/career-seeds'
import { queryAll, execute } from '@/lib/db'
import { generateText } from '@/lib/anthropic'
import { buildCareerContentPrompt } from '@/lib/prompts/career-content'

type CareerContent = {
  dailyLife: string
  universityCourses: string[]
  jobOpportunities: string
  avgSalaryRange: string
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Oturum yok' }, { status: 401 })
  if (!isAdminEmail(session.user.email))
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const existingRows = await queryAll<{ slug: string }>('SELECT slug FROM careers')
  const existing = new Set(existingRows.map((r) => r.slug))

  const seeds = CAREER_SEEDS.filter((s) => !existing.has(s.slug))
  const results: { slug: string; status: 'ok' | 'error'; message?: string }[] = []

  for (const seed of seeds) {
    try {
      const raw = await generateText(buildCareerContentPrompt(seed.title, seed.cluster, seed.hollandCodes), 2000)
      const maybeJson = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      const content = JSON.parse(maybeJson) as CareerContent

      await execute(
        `INSERT INTO careers (id, slug, title, holland_codes, cluster, daily_life, university_courses, job_opportunities, avg_salary_range)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          randomUUID(), seed.slug, seed.title,
          JSON.stringify(seed.hollandCodes), seed.cluster,
          content.dailyLife, JSON.stringify(content.universityCourses),
          content.jobOpportunities, content.avgSalaryRange ?? null,
        ]
      )

      results.push({ slug: seed.slug, status: 'ok' })
    } catch (err) {
      results.push({ slug: seed.slug, status: 'error', message: String(err) })
    }

    await new Promise((r) => setTimeout(r, 600))
  }

  return NextResponse.json({ results })
}
