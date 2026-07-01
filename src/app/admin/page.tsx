import { requireAdmin } from '@/lib/admin'
import { queryAll } from '@/lib/db'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type StudentRow = {
  id: string
  full_name: string
  email: string
  grade: number
  paid_at: number | null
  consent_given: number
  created_at: string
  has_holland: number
  has_profile: number
}

export default async function AdminPage() {
  await requireAdmin()

  const students = await queryAll<StudentRow>(
    `SELECT
      u.id, u.full_name, u.email, u.grade, u.paid_at, u.consent_given, u.created_at,
      (SELECT COUNT(*) FROM holland_results hr WHERE hr.user_id = u.id) AS has_holland,
      (SELECT COUNT(*) FROM student_profiles sp WHERE sp.user_id = u.id) AS has_profile
     FROM users u
     ORDER BY u.created_at DESC`
  )

  return (
    <div className="min-h-screen bg-muted/40 pb-16">
      <div className="mx-auto max-w-4xl px-4 pt-8 space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Admin Paneli</h1>
            <p className="text-sm text-muted-foreground">{students.length} kayıtlı öğrenci</p>
          </div>
          <div className="flex gap-2">
            <Link href="/test" className={cn(buttonVariants({ variant: 'outline' }), 'text-sm')}>
              Testi Dene
            </Link>
            <Link href="/admin/meslekler" className={cn(buttonVariants({ variant: 'outline' }), 'text-sm')}>
              Meslek Yönetimi →
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-xs text-muted-foreground">
                <th className="px-4 py-2 text-left font-medium">Ad Soyad</th>
                <th className="px-4 py-2 text-left font-medium">E-posta</th>
                <th className="px-4 py-2 text-center font-medium">Sınıf</th>
                <th className="px-4 py-2 text-center font-medium">Ödeme</th>
                <th className="px-4 py-2 text-center font-medium">Test</th>
                <th className="px-4 py-2 text-center font-medium">Profil</th>
                <th className="px-4 py-2 text-right font-medium">Detay</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-xs text-muted-foreground">
                    Henüz kayıtlı öğrenci yok.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-2 font-medium">{s.full_name}</td>
                    <td className="px-4 py-2 text-muted-foreground">{s.email}</td>
                    <td className="px-4 py-2 text-center">{s.grade}. sınıf</td>
                    <td className="px-4 py-2 text-center">
                      {s.paid_at ? '✓' : '—'}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {s.has_holland ? '✓' : '—'}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {s.has_profile ? '✓' : '—'}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/admin/ogrenci/${s.id}`}
                        className="text-xs text-primary underline hover:no-underline"
                      >
                        Görüntüle
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
