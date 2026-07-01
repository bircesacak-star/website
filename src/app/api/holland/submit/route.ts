import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { queryOne, execute } from '@/lib/db'
import { scoreHolland } from '@/lib/scoring'
import { HOLLAND_QUESTIONS } from '@/lib/holland-questions'

const schema = z.object({
  answers: z.record(z.coerce.number(), z.union([z.literal(1), z.literal(2), z.literal(3)])),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Oturum açılmamış' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz cevap formatı' }, { status: 400 })
  }

  const { answers } = parsed.data

  const missingIds = HOLLAND_QUESTIONS.map((q) => q.id).filter(
    (id) => answers[id] === undefined
  )
  if (missingIds.length > 0) {
    return NextResponse.json(
      { error: `${missingIds.length} soru cevaplanmamış` },
      { status: 400 }
    )
  }

  const { scores, hollandCode } = scoreHolland(
    answers as Record<number, 1 | 2 | 3>
  )

  const userId = session.user.id

  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM holland_results WHERE user_id = ?',
    [userId]
  )

  if (existing) {
    await execute(
      `UPDATE holland_results
       SET answers = ?, r_score = ?, i_score = ?, a_score = ?,
           s_score = ?, e_score = ?, c_score = ?, holland_code = ?,
           created_at = unixepoch()
       WHERE user_id = ?`,
      [
        JSON.stringify(answers),
        scores.R, scores.I, scores.A, scores.S, scores.E, scores.C,
        hollandCode,
        userId,
      ]
    )
  } else {
    await execute(
      `INSERT INTO holland_results
       (id, user_id, answers, r_score, i_score, a_score, s_score, e_score, c_score, holland_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        randomUUID(), userId,
        JSON.stringify(answers),
        scores.R, scores.I, scores.A, scores.S, scores.E, scores.C,
        hollandCode,
      ]
    )
  }

  return NextResponse.json({ success: true, hollandCode, scores })
}
