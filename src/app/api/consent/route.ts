import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { execute } from '@/lib/db'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Oturum açılmamış' }, { status: 401 })
  }

  const now = Math.floor(Date.now() / 1000)

  await execute(
    'UPDATE users SET consent_given = 1, consent_date = ? WHERE id = ?',
    [now, session.user.id]
  )

  return NextResponse.json({ success: true })
}
