import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    paidAt?: number | null
    consentGiven?: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      paidAt: number | null
      consentGiven: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    paidAt: number | null
    consentGiven: boolean
  }
}
