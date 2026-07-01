import { requireStep } from '@/lib/access'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function OdemeBasariliPage() {
  await requireStep('consent')

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="text-4xl">✓</div>
        <h1 className="text-lg font-semibold">Ödeme Alındı</h1>
        <p className="text-sm text-muted-foreground">
          Harika! Teste erişimin aktifleşti. Devam etmeden önce veri kullanımı
          hakkında seni bilgilendirmemiz gerekiyor.
        </p>
        <Link href="/onam" className={cn(buttonVariants(), 'w-full')}>
          Devam Et
        </Link>
      </div>
    </div>
  )
}
