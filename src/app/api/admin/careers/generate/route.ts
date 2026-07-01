import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { isAdminEmail } from '@/lib/admin'
import { queryOne, execute } from '@/lib/db'
import { generateText } from '@/lib/anthropic'
import { buildCareerContentPrompt } from '@/lib/prompts/career-content'

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  cluster: z.string().min(1),
  hollandCodes: z.array(z.string()).min(1),
})

type CareerContent = {
  dailyLife: string
  universityCourses: string[]
  jobOpportunities: string
  avgSalaryRange: string
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Oturum yok' }, { status: 401 })
  if (!isAdminEmail(session.user.email))
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })

  const { slug, title, cluster, hollandCodes } = parsed.data

  const raw = await generateText(buildCareerContentPrompt(title, cluster, hollandCodes), 2000)

  let content: CareerContent
  try {
    const maybeJson = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    content = JSON.parse(maybeJson) as CareerContent
  } catch {
    return NextResponse.json({ error: 'Gemini geçersiz JSON döndürdü' }, { status: 500 })
  }

  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM careers WHERE slug = ?',
    [slug]
  )

  if (existing) {
    await execute(
      `UPDATE careers SET title=?, cluster=?, holland_codes=?, daily_life=?,
       university_courses=?, job_opportunities=?, avg_salary_range=?
       WHERE slug=?`,
      [
        title, cluster, JSON.stringify(hollandCodes),
        content.dailyLife, JSON.stringify(content.universityCourses),
        content.jobOpportunities, content.avgSalaryRange ?? null,
        slug,
      ]
    )
  } else {
    await execute(
      `INSERT INTO careers (id, slug, title, holland_codes, cluster, daily_life, university_courses, job_opportunities, avg_salary_range)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        randomUUID(), slug, title,
        JSON.stringify(hollandCodes), cluster,
        content.dailyLife, JSON.stringify(content.universityCourses),
        content.jobOpportunities, content.avgSalaryRange ?? null,
      ]
    )
  }

  return NextResponse.json({ success: true, slug })
}
