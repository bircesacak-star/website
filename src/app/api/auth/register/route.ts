import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { queryOne, execute } from '@/lib/db'

const schema = z.object({
  fullName: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
  grade: z.number().int().min(9).max(12),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const { fullName, email, password, grade } = parsed.data

  const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email])
  if (existing) {
    return NextResponse.json(
      { error: 'Bu e-posta adresi zaten kayıtlı' },
      { status: 409 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const id = randomUUID()

  await execute(
    'INSERT INTO users (id, email, password_hash, full_name, grade) VALUES (?, ?, ?, ?, ?)',
    [id, email, passwordHash, fullName, grade]
  )

  return NextResponse.json({ success: true }, { status: 201 })
}
