import { requireStep } from '@/lib/access'
import { ProfilFormuClient } from './profil-formu-client'
import { FlowProgress } from '@/components/layout/flow-progress'

export default async function ProfilFormuPage() {
  await requireStep('holland')

  return (
    <>
      <FlowProgress step={4} />
      <div className="min-h-screen bg-muted/40 pb-16">
        <div className="mx-auto max-w-2xl px-4 pt-8 space-y-2">
          <h1 className="text-lg font-semibold">Seni Daha İyi Tanıyalım</h1>
          <p className="text-sm text-muted-foreground">
            Bu bilgiler kişiselleştirilmiş rapor ve meslek önerilerini oluşturmak için kullanılır.
          </p>
        </div>
        <ProfilFormuClient />
      </div>
    </>
  )
}
