import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="space-y-2">
        <p className="text-7xl font-bold text-muted-foreground/30">404</p>
        <h1 className="text-lg font-semibold">Sayfa bulunamadı</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Aradığın sayfa taşınmış veya silinmiş olabilir.
        </p>
      </div>
      <Link href="/" className={cn(buttonVariants({ variant: 'outline' }))}>
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}
