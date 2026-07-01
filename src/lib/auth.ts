import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { queryOne } from '@/lib/db'

type UserRow = {
  id: string
  email: string
  password_hash: string
  full_name: string
  paid_at: number | null
  consent_given: number
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/giris',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'E-posta', type: 'email' },
        password: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await queryOne<UserRow>(
          'SELECT id, email, password_hash, full_name, paid_at, consent_given FROM users WHERE email = ?',
          [credentials.email]
        )

        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.password_hash)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
          paidAt: user.paid_at,
          consentGiven: user.consent_given === 1,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.paidAt = user.paidAt ?? null
        token.consentGiven = user.consentGiven ?? false
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.paidAt = token.paidAt as number | null
        session.user.consentGiven = token.consentGiven as boolean
      }
      return session
    },
  },
}
