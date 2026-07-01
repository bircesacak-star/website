import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { isAdminEmail } from '@/lib/admin'
import { queryAll, execute } from '@/lib/db'

function guard(email: string) {
  if (!isAdminEmail(email))
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  return null
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Oturum yok' }, { status: 401 })
  const err = guard(session.user.email)
  if (err) return err

  const careers = await queryAll(
    'SELECT id, slug, title, cluster, holland_codes, avg_salary_range, created_at FROM careers ORDER BY title'
  )

  return NextResponse.json({ careers })
}

const createSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  cluster: z.string().min(1),
  hollandCodes: z.array(z.string()).min(1),
  dailyLife: z.string().min(1),
  universityCourses: z.array(z.string()).min(1),
  jobOpportunities: z.string().min(1),
  avgSalaryRange: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Oturum yok' }, { status: 401 })
  const err = guard(session.user.email)
  if (err) return err

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })

  const { slug, title, cluster, hollandCodes, dailyLife, universityCourses, jobOpportunities, avgSalaryRange } = parsed.data

  await execute(
    `INSERT INTO careers (id, slug, title, holland_codes, cluster, daily_life, university_courses, job_opportunities, avg_salary_range)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      randomUUID(), slug, title,
      JSON.stringify(hollandCodes), cluster,
      dailyLife, JSON.stringify(universityCourses), jobOpportunities,
      avgSalaryRange ?? null,
    ]
  )

  return NextResponse.json({ success: true }, { status: 201 })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Oturum yok' }, { status: 401 })
  const err = guard(session.user.email)
  if (err) return err

  const { id } = (await req.json()) as { id: string }
  if (!id) return NextResponse.json({ error: 'id gerekli' }, { status: 400 })

  await execute('DELETE FROM careers WHERE id = ?', [id])
  return NextResponse.json({ success: true })
}
