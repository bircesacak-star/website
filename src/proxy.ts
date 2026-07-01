import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Giriş gerektirmeyen sayfalar
const PUBLIC_PATHS = ['/', '/kayit', '/giris', '/kutuphane']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Giriş yapmış kullanıcı auth sayfalarına gitmeye çalışırsa yönlendir
  if (token && (pathname.startsWith('/kayit') || pathname.startsWith('/giris'))) {
    const isAdmin = token.email === process.env.ADMIN_EMAIL
    return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/odeme', req.url))
  }

  // Oturum yoksa giriş sayfasına
  if (!token) {
    const url = new URL('/giris', req.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth|api/careers).*)'],
}
