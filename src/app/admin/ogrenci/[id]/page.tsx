import { requireAdmin } from '@/lib/admin'
import { queryOne } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { HollandDimension } from '@/lib/holland-questions'
import { DIMENSION_LABELS, DIMENSION_COLORS } from '@/lib/holland-questions'

type UserRow = {
  id: string
  full_name: string
  email: string
  grade: number
  paid_at: number | null
  consent_given: number
  created_at: number
}

type HollandRow = {
  r_score: number
  i_score: number
  a_score: number
  s_score: number
  e_score: number
  c_score: number
  holland_code: string
  created_at: number
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

type ReportRow = {
  personality_summary: string
  suitable_careers: string
  full_report: string
  generated_at: number
}

function safeParseArray(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as string[]) : []
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

const WORK_PREF_LABELS: Record<string, string> = {
  desk: 'Masa Başı & Analiz',
  field: 'Sahada & Hareket',
  creative: 'Yaratıcı & Üretim',
  social: 'İnsanlarla & Sosyal',
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params

  const user = await queryOne<UserRow>(
    'SELECT id, full_name, email, grade, paid_at, consent_given, created_at FROM users WHERE id = ?',
    [id]
  )

  if (!user) notFound()

  const holland = await queryOne<HollandRow>(
    'SELECT r_score, i_score, a_score, s_score, e_score, c_score, holland_code, created_at FROM holland_results WHERE user_id = ? LIMIT 1',
    [id]
  )

  const profile = await queryOne<ProfileRow>(
    'SELECT gpa, considered_departments, liked_courses, disliked_courses, interests, work_preference, extra_notes FROM student_profiles WHERE user_id = ? LIMIT 1',
    [id]
  )

  const report = await queryOne<ReportRow>(
    'SELECT personality_summary, suitable_careers, full_report, generated_at FROM reports WHERE user_id = ? ORDER BY generated_at DESC LIMIT 1',
    [id]
  )

  const hollandScores: Record<HollandDimension, number> | null = holland
    ? { R: holland.r_score, I: holland.i_score, A: holland.a_score, S: holland.s_score, E: holland.e_score, C: holland.c_score }
    : null

  const depts = safeParseArray(profile?.considered_departments ?? null)
  const likedCourses = safeParseArray(profile?.liked_courses ?? null)
  const dislikedCourses = safeParseArray(profile?.disliked_courses ?? null)
  const interests = safeParseArray(profile?.interests ?? null)
  const workPrefs = parseWorkPreferences(profile?.work_preference ?? null)

  return (
    <div className="min-h-screen bg-muted/40 pb-16">
      <div className="mx-auto max-w-2xl px-4 pt-8 space-y-6">

        <div className="space-y-1">
          <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground">
            ← Admin Paneli
          </Link>
          <h1 className="text-lg font-semibold">{user.full_name}</h1>
          <p className="text-sm text-muted-foreground">{user.email} · {user.grade}. sınıf</p>
        </div>

        {/* Durum */}
        <section className="rounded-lg border bg-card p-5 shadow-sm space-y-2">
          <h2 className="text-sm font-semibold">Durum</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kayıt:</span>
              <span>{new Date(user.created_at * 1000).toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ödeme:</span>
              <span>{user.paid_at ? new Date(user.paid_at * 1000).toLocaleDateString('tr-TR') : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">KVKK Onamı:</span>
              <span>{user.consent_given ? 'Verildi' : 'Verilmedi'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Holland Testi:</span>
              <span>{holland ? 'Tamamlandı' : 'Yapılmadı'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profil:</span>
              <span>{profile ? 'Dolduruldu' : 'Doldurulmadı'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rapor:</span>
              <span>{report ? 'Oluşturuldu' : 'Oluşturulmadı'}</span>
            </div>
          </div>
        </section>

        {/* Holland Sonuçları */}
        {holland && hollandScores && (
          <section className="rounded-lg border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Holland Sonuçları</h2>
              <span className="text-xs text-muted-foreground">
                {new Date(holland.created_at * 1000).toLocaleDateString('tr-TR')}
              </span>
            </div>
            <p className="text-2xl font-bold tracking-widest text-primary">{holland.holland_code}</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(hollandScores) as [HollandDimension, number][]).map(([dim, score]) => (
                <div
                  key={dim}
                  className="rounded-lg border p-2.5 text-center"
                  style={{ borderColor: DIMENSION_COLORS[dim] + '50' }}
                >
                  <p className="text-xs font-bold" style={{ color: DIMENSION_COLORS[dim] }}>{dim}</p>
                  <p className="text-xs text-muted-foreground">{DIMENSION_LABELS[dim]}</p>
                  <p className="font-semibold text-sm mt-1">{score}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Profil Bilgileri */}
        {profile && (
          <section className="rounded-lg border bg-card p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold">Profil Bilgileri</h2>
            <div className="space-y-2.5 text-sm">
              {profile.gpa != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Not Ortalaması:</span>
                  <span className="font-medium">{profile.gpa.toFixed(1)}</span>
                </div>
              )}
              {workPrefs.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Çalışma Tercihi:</span>
                  <span className="text-right">{workPrefs.map((p) => WORK_PREF_LABELS[p] ?? p).join(', ')}</span>
                </div>
              )}
              {depts.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1">Tercih Edilen Bölümler:</p>
                  <div className="flex flex-wrap gap-1">
                    {depts.map((d) => (
                      <span key={d} className="rounded bg-muted text-xs px-2 py-0.5">{d}</span>
                    ))}
                  </div>
                </div>
              )}
              {likedCourses.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1">Sevdiği Dersler:</p>
                  <div className="flex flex-wrap gap-1">
                    {likedCourses.map((c) => (
                      <span key={c} className="rounded bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 text-xs px-2 py-0.5">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {dislikedCourses.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1">Sevmediği Dersler:</p>
                  <div className="flex flex-wrap gap-1">
                    {dislikedCourses.map((c) => (
                      <span key={c} className="rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-xs px-2 py-0.5">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {interests.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1">İlgi Alanları:</p>
                  <div className="flex flex-wrap gap-1">
                    {interests.map((i) => (
                      <span key={i} className="rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs px-2 py-0.5">{i}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Rapor */}
        {report && (
          <section className="rounded-lg border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">AI Raporu</h2>
              <span className="text-xs text-muted-foreground">
                {new Date(report.generated_at * 1000).toLocaleDateString('tr-TR')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{report.personality_summary}</p>
            <details className="text-sm">
              <summary className="cursor-pointer text-primary underline hover:no-underline text-xs">
                Tam Raporu Göster
              </summary>
              <div className="mt-3 prose prose-sm max-w-none whitespace-pre-wrap border-t pt-3 text-foreground text-xs">
                {report.full_report}
              </div>
            </details>
          </section>
        )}

        {!holland && !profile && !report && (
          <p className="text-sm text-muted-foreground text-center py-6">
            Bu öğrenci henüz testi tamamlamamış.
          </p>
        )}

        <Link href="/admin" className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
          ← Listeye Dön
        </Link>
      </div>
    </div>
  )
}
