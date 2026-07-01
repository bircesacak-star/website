import { requireStep } from '@/lib/access'
import { OnamForm } from './onam-form'
import { FlowProgress } from '@/components/layout/flow-progress'

export default async function OnamPage() {
  await requireStep('payment')

  return (
    <>
      <FlowProgress step={2} />
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-lg font-semibold">Veri Kullanım Onamı</h1>
          <p className="text-sm text-muted-foreground">
            Devam etmeden önce lütfen aşağıdaki bilgileri oku
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm prose prose-sm max-w-none text-foreground">
          <h2 className="text-base font-medium">Hangi verileri topluyoruz?</h2>
          <ul className="text-sm text-muted-foreground">
            <li>Holland Mesleki Tercih Envanteri cevapların</li>
            <li>Not ortalaması ve ders tercihleri</li>
            <li>Bölüm ve ilgi alanı tercihlerin</li>
            <li>Ad soyad ve e-posta adresi</li>
          </ul>

          <h2 className="text-base font-medium mt-4">Bu veriler nasıl kullanılıyor?</h2>
          <p className="text-sm text-muted-foreground">
            Toplanan veriler yalnızca sana özel kişilik analizi ve meslek önerisi raporu
            üretmek amacıyla kullanılır. Test cevapların ve profil bilgilerin, Anthropic
            Claude yapay zeka modeline anonim ve şifrelenmiş kanallar üzerinden iletilir;
            bu veriler Anthropic tarafından model eğitiminde kullanılmaz.
          </p>

          <h2 className="text-base font-medium mt-4">Veriler kimlere aktarılıyor?</h2>
          <p className="text-sm text-muted-foreground">
            Verilerini üçüncü taraflarla pazarlama, reklam veya profilleme amacıyla
            paylaşmıyoruz. Yalnızca rapor üretimi için Anthropic API&apos;sine işlem bazlı
            veri iletimi gerçekleşir.
          </p>

          <h2 className="text-base font-medium mt-4">Ne kadar süre saklanıyor?</h2>
          <p className="text-sm text-muted-foreground">
            Verilerini hesabına bağlı olduğu sürece saklarız. Hesabını silmek için
            bizimle iletişime geçebilirsin; 30 gün içinde tüm verilerini sistemden
            kalıcı olarak sileriz.
          </p>

          <h2 className="text-base font-medium mt-4">Hakların</h2>
          <p className="text-sm text-muted-foreground">
            KVKK kapsamında verilerine erişme, düzeltme ve silme hakkına sahipsin.
            Bu haklarını kullanmak için uygulama içinden bizimle iletişime geçebilirsin.
          </p>
        </div>

        <OnamForm />
      </div>
    </div>
    </>
  )
}
