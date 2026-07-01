import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { queryOne, execute } from '@/lib/db'

const extraDataSchema = z.object({
  hollandWorkStyle: z.array(z.string()).default([]),
  hollandWorkWith: z.array(z.string()).default([]),
  hollandActions: z.array(z.string()).default([]),
  hollandGoal: z.array(z.string()).default([]),
  hollandEnvironment: z.array(z.string()).default([]),
  selfCategory: z.string().default(''),
  freeTime: z.string().default(''),
  topicsHours: z.string().default(''),
  recentLearning: z.string().default(''),
  talentDescription: z.string().default(''),
  talentMeslek: z.string().default(''),
  talentBasari: z.string().default(''),
})

const schema = z.object({
  gpa: z.number().min(0).max(100),
  consideredDepartments: z.array(z.string()).max(5).default([]),
  likedCourses: z.array(z.string()).default([]),
  dislikedCourses: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  topInterests: z.array(z.string()).max(3).default([]),
  workPreferences: z.array(z.string()).min(1, 'En az bir çalışma ortamı tercihi seç'),
  extraData: extraDataSchema.optional(),
  extraNotes: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Oturum açılmamış' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri' },
      { status: 400 }
    )
  }

  const {
    gpa,
    consideredDepartments,
    likedCourses,
    dislikedCourses,
    interests,
    topInterests,
    workPreferences,
    extraNotes,
  } = parsed.data

  const extraData = parsed.data.extraData ?? {}

  const extraNotesJson = JSON.stringify({
    topInterests,
    extraData,
    freeText: extraNotes ?? '',
  })

  const userId = session.user.id

  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM student_profiles WHERE user_id = ?',
    [userId]
  )

  if (existing) {
    await execute(
      `UPDATE student_profiles
       SET gpa = ?, considered_departments = ?, liked_courses = ?,
           disliked_courses = ?, interests = ?, work_preference = ?,
           extra_notes = ?, updated_at = unixepoch()
       WHERE user_id = ?`,
      [
        gpa,
        JSON.stringify(consideredDepartments),
        JSON.stringify(likedCourses),
        JSON.stringify(dislikedCourses),
        JSON.stringify(interests),
        JSON.stringify(workPreferences),
        extraNotesJson,
        userId,
      ]
    )
  } else {
    await execute(
      `INSERT INTO student_profiles
       (id, user_id, gpa, considered_departments, liked_courses,
        disliked_courses, interests, work_preference, extra_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        randomUUID(),
        userId,
        gpa,
        JSON.stringify(consideredDepartments),
        JSON.stringify(likedCourses),
        JSON.stringify(dislikedCourses),
        JSON.stringify(interests),
        JSON.stringify(workPreferences),
        extraNotesJson,
      ]
    )
  }

  return NextResponse.json({ success: true })
}
