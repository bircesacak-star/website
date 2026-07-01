import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import { isAdminEmail } from '@/lib/admin'

type UserRow = {
  paid_at: number | null
  consent_given: number
}

export async function requireStep(
  requireStep: 'payment' | 'consent' | 'holland' | 'profile'
) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/giris')

  if (isAdminEmail(session.user.email)) return session

  const userId = session.user.id

  const user = await queryOne<UserRow>(
    'SELECT paid_at, consent_given FROM users WHERE id = ?',
    [userId]
  )

  if (!user) redirect('/giris')

  if (requireStep === 'payment') return session

  if (!user.paid_at) redirect('/odeme')
  if (requireStep === 'consent') return session

  if (!user.consent_given) redirect('/onam')
  if (requireStep === 'holland') return session

  const hollandDone = await queryOne(
    'SELECT id FROM holland_results WHERE user_id = ?',
    [userId]
  )

  if (!hollandDone) redirect('/test')
  if (requireStep === 'profile') return session

  const profileDone = await queryOne(
    'SELECT id FROM student_profiles WHERE user_id = ?',
    [userId]
  )

  if (!profileDone) redirect('/profil-formu')

  return session
}
