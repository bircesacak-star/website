import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { randomUUID } from 'crypto'
import { authOptions } from '@/lib/auth'
import { queryOne, execute } from '@/lib/db'
import { anthropic, MODEL } from '@/lib/anthropic'
import {
  buildCareersPrompt,
  buildReportPrompt,
  type ProfileContext,
  type ExtraProfileData,
} from '@/lib/prompts/profile-analysis'
import { toGpaCategory } from '@/types'
import type { HollandScores, SuitableCareer } from '@/types'

type HollandRow = {
  r_score: number; i_score: number; a_score: number
  s_score: number; e_score: number; c_score: number
  holland_code: string
}

type ProfileRow = {
  gpa: number | null
  considered_departments: string | null
  liked_courses: string | null
  disliked_courses: string | null
  interests: string | null
  work_preference: string | null
  extra_notes: string | null
}

type StoredExtraNotes = {
  topInterests?: string[]
  extraData?: ExtraProfileData
  freeText?: string
}

function safeParseArray(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed as string[] : []
  } catch {
    return []
  }
}

function parseWorkPreferences(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as string[]
    if (typeof parsed === 'string') return [parsed]
    return []
  } catch {
    return raw ? [raw] : []
  }
}

function parseExtraNotes(raw: string | null): StoredExtraNotes {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as StoredExtraNotes
    }
    return { freeText: String(raw) }
  } catch {
    return { freeText: raw }
  }
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Oturum açılmamış' }, { status: 401 })
  }

  const userId = session.user.id

  const existing = await queryOne('SELECT id FROM reports WHERE user_id = ?', [userId])
  if (existing) {
    return NextResponse.json({ error: 'Rapor zaten mevcut' }, { status: 409 })
  }

  const user = await queryOne<{ full_name: string }>(
    'SELECT full_name FROM users WHERE id = ?',
    [userId]
  )

  const holland = await queryOne<HollandRow>(
    'SELECT r_score, i_score, a_score, s_score, e_score, c_score, holland_code FROM holland_results WHERE user_id = ?',
    [userId]
  )

  const profile = await queryOne<ProfileRow>(
    'SELECT gpa, considered_departments, liked_courses, disliked_courses, interests, work_preference, extra_notes FROM student_profiles WHERE user_id = ?',
    [userId]
  )

  if (!holland || !profile) {
    return NextResponse.json({ error: 'Test veya profil verisi eksik' }, { status: 400 })
  }

  const scores: HollandScores = {
    R: Number(holland.r_score), I: Number(holland.i_score), A: Number(holland.a_score),
    S: Number(holland.s_score), E: Number(holland.e_score), C: Number(holland.c_score),
  }

  const extraNotesData = parseExtraNotes(profile.extra_notes)

  const ctx: ProfileContext = {
    studentName: user?.full_name ?? 'Öğrenci',
    hollandCode: String(holland.holland_code),
    scores,
    gpaCategory: toGpaCategory(Number(profile.gpa ?? 0)),
    consideredDepartments: safeParseArray(profile.considered_departments),
    likedCourses: safeParseArray(profile.liked_courses),
    dislikedCourses: safeParseArray(profile.disliked_courses),
    interests: safeParseArray(profile.interests),
    topInterests: extraNotesData.topInterests ?? [],
    workPreferences: parseWorkPreferences(profile.work_preference),
    extraData: extraNotesData.extraData,
    extraNotes: extraNotesData.freeText,
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))

      try {
        const careersMsg = await anthropic.messages.create({
          model: MODEL,
          max_tokens: 1024,
          messages: [{ role: 'user', content: buildCareersPrompt(ctx) }],
        })

        const careersRaw = careersMsg.content[0].type === 'text'
          ? careersMsg.content[0].text.trim()
          : '[]'

        let careers: SuitableCareer[] = []
        try {
          const maybeJson = careersRaw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
          careers = JSON.parse(maybeJson) as SuitableCareer[]
        } catch {
          careers = []
        }

        send({ type: 'careers', data: careers })

        const careersText = careers.map((c) => c.title).join(', ')
        let fullReport = ''

        const reportStream = anthropic.messages.stream({
          model: MODEL,
          max_tokens: 5000,
          messages: [{ role: 'user', content: buildReportPrompt(ctx, careersText) }],
        })

        for await (const event of reportStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            fullReport += event.delta.text
            send({ type: 'chunk', text: event.delta.text })
          }
        }

        const personalitySummary = fullReport
          .split('\n### ')[1]
          ?.split('\n').slice(1).join(' ')
          .trim()
          .slice(0, 600) ?? fullReport.slice(0, 600)

        await execute(
          `INSERT INTO reports (id, user_id, personality_summary, suitable_careers, full_report)
           VALUES (?, ?, ?, ?, ?)`,
          [randomUUID(), userId, personalitySummary, JSON.stringify(careers), fullReport]
        )

        send({ type: 'done' })
      } catch (err) {
        send({ type: 'error', message: err instanceof Error ? err.message : 'Bilinmeyen hata' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
