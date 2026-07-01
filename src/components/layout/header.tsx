import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdminEmail } from '@/lib/admin'
import { LogoutButton } from './logout-button'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export async function Header() {
  const session = await getServerSession(authOptions)
  const isAdmin = isAdminEmail(session?.user?.email ?? '')

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-primary font-bold text-lg leading-none">◆</span>
          <span className="font-semibold text-sm">Meslek Rehberi</span>
        </Link>

        {/* Sağ taraf */}
        <div className="flex items-center gap-1 sm:gap-3">
          {isAdmin && (
            <>
              <Link
                href="/admin"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Admin Paneli
              </Link>
              <Link
                href="/admin/meslekler"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Meslekler
              </Link>
              <div className="w-px h-4 bg-border hidden sm:block" />
              <span className="text-xs text-muted-foreground hidden sm:block">
                {session?.user?.email}
              </span>
              <LogoutButton />
            </>
          )}

          {!isAdmin && session && (
            <>
              <Link
                href="/kutuphane"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Kütüphane
              </Link>
              <Link
                href="/profil"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Profilim
              </Link>
              <div className="w-px h-4 bg-border hidden sm:block" />
              <span className="text-xs text-muted-foreground hidden sm:block max-w-[120px] truncate">
                {session.user?.name ?? session.user?.email}
              </span>
              <LogoutButton />
            </>
          )}

          {!session && (
            <>
              <Link
                href="/giris"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                className={cn(buttonVariants({ size: 'sm' }), 'h-8 text-xs')}
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
