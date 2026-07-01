import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import { isAdminEmail } from '@/lib/admin'
import { OdemeForm } from './odeme-form'
import { FlowProgress } from '@/components/layout/flow-progress'

export default async function OdemePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/giris')

  if (isAdminEmail(session.user.email)) redirect('/admin')

  const user = await queryOne<{ paid_at: number | null }>(
    'SELECT paid_at FROM users WHERE id = ?',
    [session.user.id]
  )

  if (user?.paid_at) redirect('/onam')

  return (
    <>
      <FlowProgress step={1} />
    <div className="flex flex-1 items-center justify-center p-4 bg-muted/40">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-lg font-semibold">Teste Erişim</h1>
          <p className="text-sm text-muted-foreground">
            Tek seferlik ödeme ile Holland Mesleki Tercih Envanteri&apos;ne ve
            kişiselleştirilmiş raporuna erişim kazan.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
          <h2 className="font-medium">Paket içeriği</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              '90 soruluk Holland Mesleki Tercih Envanteri',
              '6 boyutlu kişilik grafiği ve Holland kodu',
              'Claude AI ile kişiselleştirilmiş kişilik analizi',
              'Sana uygun meslek önerileri ve kariyer yolları',
              'Meslek kütüphanesine sınırsız erişim',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="flex items-baseline justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">Tek seferlik ücret</span>
            <span className="text-lg font-semibold">₺299</span>
          </div>
        </div>

        <OdemeForm />

        <p className="text-center text-xs text-muted-foreground">
          Ödeme Iyzico altyapısıyla güvenli şekilde işlenir.
          Kart bilgilerin tarafımızca saklanmaz.
        </p>
      </div>
    </div>
    </>
  )
}
