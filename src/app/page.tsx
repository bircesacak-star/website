import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STEPS = [
  { icon: '📝', title: 'Kayıt Ol', desc: 'Tek seferlik ücret ile platforma erişim kazan.' },
  { icon: '🧠', title: 'Holland Testini Çöz', desc: '90 soruluk envanter ile 6 boyutlu kişilik profilini öğren.' },
  { icon: '✍️', title: 'Profilini Tamamla', desc: 'Not ortalaması, dersler ve ilgi alanlarını gir.' },
  { icon: '🤖', title: 'AI Raporunu Al', desc: 'Claude yapay zekasından sana özel analiz ve meslek önerileri.' },
]

const FEATURES = [
  { icon: '📊', title: 'Kişilik Haritası', desc: '6 boyutlu Holland grafiği ve 3 haneli kodun.' },
  { icon: '🎯', title: 'Meslek Eşleşmesi', desc: 'Sana en uygun 8 meslek, eşleşme yüzdesi ile.' },
  { icon: '📚', title: '40+ Meslek Profili', desc: 'Her meslekte günlük hayat, dersler, iş olanakları.' },
]

const STATS = [
  { value: '90', label: 'Soru' },
  { value: '6', label: 'Kişilik Boyutu' },
  { value: '40+', label: 'Meslek Profili' },
  { value: 'AI', label: 'Destekli Rapor' },
]

const HOLLAND_TYPES = [
  {
    code: 'R',
    name: 'Gerçekçi',
    color: '#dc2626',
    description: 'Pratik, mekanik ve fiziksel aktiviteleri seven bireyler. Elle çalışmayı, alet ve makinelerle uğraşmayı, somut problemler çözmeyi tercih ederler.',
    strengths: ['Teknik beceriler', 'El-göz koordinasyonu', 'Dayanıklılık', 'Problem çözme'],
    careers: ['Mühendis', 'Mimar', 'Teknisyen', 'Pilot', 'Ziraat Mühendisi'],
    clusters: 'Tarım · Gıda · Doğal Kaynaklar · Mühendislik · Teknoloji · İnşaat',
  },
  {
    code: 'I',
    name: 'Araştırmacı',
    color: '#ea580c',
    description: 'Entelektüel ve analitik bireyler. Araştırma, gözlem ve bağımsız düşünmeden zevk alır; meraklı ve sorgulayıcı yapıya sahiptirler.',
    strengths: ['Analitik düşünce', 'Araştırma yeteneği', 'Matematik & Bilim', 'Eleştirel bakış'],
    careers: ['Doktor', 'Bilim İnsanı', 'Yazılımcı', 'Psikolog', 'Akademisyen'],
    clusters: 'Sağlık Bilimleri · Bilim-Teknoloji · Matematik · Araştırma & Geliştirme',
  },
  {
    code: 'A',
    name: 'Sanatsal',
    color: '#ca8a04',
    description: 'Yaratıcı, sezgisel ve hayal gücü güçlü bireyler. Sanat, müzik, yazarlık ve tasarım alanlarında kendilerini özgürce ifade ederler.',
    strengths: ['Yaratıcılık', 'Estetik duyarlılık', 'Hayal gücü', 'Özgün ifade'],
    careers: ['Grafik Tasarımcı', 'Mimar', 'Müzisyen', 'Yazar', 'Film Yapımcısı'],
    clusters: 'Görsel Sanatlar · Performans Sanatları · Tasarım · Medya & İletişim',
  },
  {
    code: 'S',
    name: 'Sosyal',
    color: '#16a34a',
    description: 'İnsanlarla çalışmaktan zevk alan, empatik ve yardımsever bireyler. Öğretme, rehberlik etme ve topluma hizmet etmeyi severler.',
    strengths: ['Empati', 'İletişim', 'Öğretme & Rehberlik', 'Takım çalışması'],
    careers: ['Öğretmen', 'Psikolog', 'Sosyal Hizmet Uzmanı', 'Hemşire', 'İK Uzmanı'],
    clusters: 'Eğitim & Öğretim · Sağlık & Sosyal Hizmetler · Turizm · İnsan Kaynakları',
  },
  {
    code: 'E',
    name: 'Girişimci',
    color: '#2563eb',
    description: 'Liderlik yeteneğine sahip, enerjik ve hırslı bireyler. İkna etmeyi, organize etmeyi ve sonuç odaklı çalışmayı seven girişimci ruhlu kişiler.',
    strengths: ['Liderlik', 'İkna yeteneği', 'Girişimcilik', 'Risk yönetimi'],
    careers: ['Yönetici', 'Avukat', 'Girişimci', 'Satış Direktörü', 'Politikacı'],
    clusters: 'İşletme & Yönetim · Hukuk · Satış & Pazarlama · Finans & Bankacılık',
  },
  {
    code: 'C',
    name: 'Geleneksel',
    color: '#7c3aed',
    description: 'Düzenli, titiz ve sistematik çalışmayı seven bireyler. Veri, sayı ve kayıtlarla çalışmaktan hoşlanan, güvenilir ve kurallara uyan kişiler.',
    strengths: ['Dikkat & Titizlik', 'Organizasyon', 'Sayısal beceriler', 'Güvenilirlik'],
    careers: ['Muhasebeci', 'Bankacı', 'Mali Analist', 'Veri Bilimci', 'Aktüer'],
    clusters: 'Muhasebe & Finans · Bilgi Teknolojileri · Kamu Yönetimi · İstatistik',
  },
]

const REPORT_SECTIONS = [
  { icon: '👤', title: 'Baskın Kişilik Tipin', desc: 'Kişilik tipine özel, "Sevgili [İsim]" ile başlayan kişiselleştirilmiş analiz' },
  { icon: '🔤', title: 'Holland Kodun & İkili Kombinasyon', desc: 'Üç harfli kodun anlamı ve ikili kombinasyonunun yaratıcı Türkçe ismi' },
  { icon: '🗂️', title: 'Kariyer Kümeleri', desc: '3 kariyer kümesi — her küme için ilgi alanları, meslekler ve önerilen dersler' },
  { icon: '🎓', title: 'Üniversite Bölüm Önerileri', desc: 'Türk üniversitelerinde Holland koduna uyan 8-10 bölüm, neden uygun olduğu açıklamasıyla' },
  { icon: '⭐', title: 'Güçlü Yönlerin', desc: 'Kişilik kombinasyonundan gelen güçlü özellikler, profilinle ilişkilendirilmiş' },
  { icon: '🗺️', title: 'Kariyer Yolculuğu Önerileri', desc: 'İlgi alanların ve derslerinle bağlantılı, uygulanabilir 5 somut öneri' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative bg-background border-b overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-6 relative">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="text-primary">◆</span>
            Lise Öğrencileri için Meslek Rehberi
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-foreground">
            Hangi meslek <span className="text-primary">sana uygun?</span>
            <br />Holland testi ile keşfet.
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Bilimsel temelli Holland Mesleki Tercih Envanteri, yapay zeka destekli kişilik analizi
            ve 40+ meslek profili ile geleceğini planla.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/kayit" className={cn(buttonVariants({ size: 'lg' }), 'px-8 h-11')}>
              Hemen Başla →
            </Link>
            <Link href="/giris" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-11')}>
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="space-y-0.5">
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nasıl çalışır */}
      <section className="bg-background border-b">
        <div className="mx-auto max-w-2xl px-4 py-14 space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold">Nasıl Çalışır?</h2>
            <p className="text-sm text-muted-foreground">4 adımda kişisel meslek rehberin hazır</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-4 rounded-lg border bg-card p-5 shadow-sm">
                <div className="flex-none">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                    {step.icon}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{i + 1}</span>
                    <p className="text-sm font-semibold">{step.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-2xl px-4 py-14 space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold">Neler Sunuyor?</h2>
            <p className="text-sm text-muted-foreground">Tek ödeme, ömür boyu erişim</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-lg border bg-card p-5 shadow-sm space-y-3 text-center">
                <div className="text-3xl">{f.icon}</div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Holland teorisi — özet */}
      <section className="bg-background border-b">
        <div className="mx-auto max-w-3xl px-4 py-14 space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-lg font-semibold">Holland Mesleki İlgi Kuramı</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed text-left">
              Psikolog John L. Holland tarafından geliştirilen bu kuram, bireylerin kişilik özellikleri
              ile uyumlu çalışma ortamlarını eşleştirmeyi amaçlar. Bu kurama göre insanlar ve meslekler
              belirli kategoriler altında sınıflandırılabilir; kişi, kendi ilgi ve özelliklerine en
              uygun alanlarda daha başarılı olma eğilimindedir.
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed text-left">
              Bireylerin ilgi alanları genellikle altı kategoriden iki veya üç tanesinin birleşimiyle
              ifade edilir ve bu kombinasyon <strong className="text-foreground">&ldquo;Holland Kodu&rdquo;</strong> olarak adlandırılır.
              İş aktiviteleri, beceriler ve değerlerle doğrudan ilişkili olan bu temalar sayesinde
              kişinin ilgi alanları ile eğitim ve kariyer seçenekleri arasında güçlü bir bağ kurulur.
            </p>
          </div>

          {/* 6 tip kartları */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOLLAND_TYPES.map((type) => (
              <div
                key={type.code}
                className="rounded-xl border-2 bg-card shadow-sm overflow-hidden"
                style={{ borderColor: type.color + '50' }}
              >
                {/* Başlık şeridi */}
                <div
                  className="px-4 py-3 flex items-center gap-3"
                  style={{ backgroundColor: type.color + '18' }}
                >
                  <span
                    className="w-9 h-9 rounded-full text-white font-bold text-base flex items-center justify-center shrink-0"
                    style={{ backgroundColor: type.color }}
                  >
                    {type.code}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{type.name}</p>
                    <p className="text-xs text-muted-foreground">{type.clusters}</p>
                  </div>
                </div>

                {/* İçerik */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{type.description}</p>

                  <div className="space-y-1">
                    <p className="text-xs font-medium">Güçlü yönler:</p>
                    <div className="flex flex-wrap gap-1">
                      {type.strengths.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] px-2 py-0.5 rounded-full text-white font-medium"
                          style={{ backgroundColor: type.color }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium">Örnek meslekler:</p>
                    <p className="text-xs text-muted-foreground">{type.careers.join(' · ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Örnek rapor içeriği */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-2xl px-4 py-14 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold">Raporunda Neler Var?</h2>
            <p className="text-sm text-muted-foreground">
              Yapay zeka destekli kapsamlı analizin 6 bölümü
            </p>
          </div>
          <div className="rounded-xl border-2 border-primary/20 bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-primary/8 border-b border-primary/15">
              <p className="text-xs font-semibold text-primary">ÖRNEK — Holland Mesleki İlgi Raporun</p>
            </div>
            <div className="divide-y">
              {REPORT_SECTIONS.map((section) => (
                <div key={section.title} className="flex gap-4 px-5 py-4">
                  <span className="text-xl shrink-0 mt-0.5">{section.icon}</span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">{section.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{section.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-muted/40 border-t">
              <p className="text-xs text-muted-foreground text-center">
                + 8 kişiselleştirilmiş meslek önerisi · Üniversite bölümleri · O*NET kaynakları
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-2xl px-4 py-14 text-center space-y-4">
          <h2 className="text-lg font-semibold">Geleceğini planlamaya hazır mısın?</h2>
          <p className="text-sm text-primary-foreground/80">
            Holland testi ile kişilik tipini keşfet, sana özel AI raporu al.
          </p>
          <Link
            href="/kayit"
            className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'h-11 px-8')}
          >
            Hemen Başla →
          </Link>
        </div>
      </section>

      <footer className="border-t bg-background">
        <div className="mx-auto max-w-2xl px-4 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Meslek Rehberi</span>
          <span>Ödeme altyapısı: Iyzico · AI: Anthropic Claude</span>
        </div>
      </footer>
    </div>
  )
}
