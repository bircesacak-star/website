import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/giris')

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || session.user.email !== adminEmail) redirect('/')

  return session
}

export function isAdminEmail(email: string) {
  return email === process.env.ADMIN_EMAIL
}
