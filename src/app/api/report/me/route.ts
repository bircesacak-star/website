import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { queryOne } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Oturum açılmamış' }, { status: 401 })
  }

  const report = await queryOne<{
    personality_summary: string
    suitable_careers: string
    full_report: string
    generated_at: number
  }>(
    'SELECT personality_summary, suitable_careers, full_report, generated_at FROM reports WHERE user_id = ?',
    [session.user.id]
  )

  if (!report) {
    return NextResponse.json({ report: null })
  }

  return NextResponse.json({
    report: {
      personalitySummary: report.personality_summary,
      suitableCareers: JSON.parse(report.suitable_careers),
      fullReport: report.full_report,
      generatedAt: report.generated_at,
    },
  })
}
