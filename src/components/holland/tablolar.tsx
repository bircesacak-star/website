import { DIMENSION_COLORS, DIMENSION_LABELS, type HollandDimension } from '@/lib/holland-questions'

const TABLO1: {
  dim: HollandDimension
  ilgi: string
  isAktivite: string
  beceriler: string
  degerler: string
}[] = [
  {
    dim: 'R',
    ilgi: 'Makineler, bilgisayar ağları, atletizm, açık hava çalışmaları',
    isAktivite: 'Ekipman çalıştırmak, alet kullanmak, inşa etmek, tamir yapmak, güvenlik sağlamak',
    beceriler: 'Mekanik beceri ve çeviklik, fiziksel koordinasyon',
    degerler: 'Gelenek, pratiklik, sağduyu',
  },
  {
    dim: 'I',
    ilgi: 'Bilim, tıp, matematik, araştırma',
    isAktivite: 'Laboratuvar çalışmaları yapmak, soyut problemleri çözmek, araştırma yürütmek',
    beceriler: 'Matematiksel yetenek, araştırma yapma, yazma, analiz',
    degerler: 'Bağımsızlık, merak, öğrenme',
  },
  {
    dim: 'A',
    ilgi: 'Kendini ifade etme, sanatı değerlendirme, iletişim, kültür',
    isAktivite: 'Müzik besteleme, sahne sanatları, yazma, görsel sanatlar yaratma',
    beceriler: 'Yaratıcılık, müzikal yetenek, sanatsal ifade',
    degerler: 'Güzellik, özgünlük, bağımsızlık, hayal gücü',
  },
  {
    dim: 'S',
    ilgi: 'İnsanlar, takım çalışması, yardım etme, topluma hizmet',
    isAktivite: 'Öğretmek, insanlara bakım sağlamak, danışmanlık yapmak, çalışanları eğitmek',
    beceriler: 'İnsan ilişkileri, sözlü iletişim, dinleme, anlayış gösterme',
    degerler: 'İş birliği, cömertlik, başkalarına hizmet',
  },
  {
    dim: 'E',
    ilgi: 'İş dünyası, politika, liderlik, girişimcilik',
    isAktivite: 'Satış yapmak, yönetmek, ikna etmek, pazarlama',
    beceriler: 'Sözlü iletişim, başkalarını motive etme ve yönlendirme becerisi',
    degerler: 'Risk alma, statü, rekabet, etki',
  },
  {
    dim: 'C',
    ilgi: 'Organizasyon, veri yönetimi, muhasebe, yatırım, bilgi sistemleri',
    isAktivite: 'Prosedür ve sistem kurmak, organizasyon yapmak, kayıt tutmak, bilgisayar uygulamaları geliştirmek',
    beceriler: 'Sayılarla çalışma, veri analizi, finans, detaylara dikkat etmek',
    degerler: 'Doğruluk, istikrar, verimlilik',
  },
]

const TABLO2: {
  dim: HollandDimension
  clusters: string[]
}[] = [
  {
    dim: 'R',
    clusters: [
      'Tarım, Gıda ve Doğal Kaynaklar',
      'Mimarlık ve İnşaat',
      'Üretim ve İmalat',
      'Ulaşım, Dağıtım ve Lojistik',
    ],
  },
  {
    dim: 'I',
    clusters: [
      'Sağlık Bilimleri',
      'Bilim, Teknoloji, Mühendislik ve Matematik (STEM)',
    ],
  },
  {
    dim: 'A',
    clusters: [
      'Sanat, Ses/Video Teknolojisi ve İletişim',
    ],
  },
  {
    dim: 'S',
    clusters: [
      'Eğitim ve Öğretim',
      'Konaklama ve Turizm',
      'İnsan Hizmetleri',
      'Hukuk, Kamu Güvenliği ve Güvenlik',
    ],
  },
  {
    dim: 'E',
    clusters: [
      'İşletme Yönetimi ve İdare',
      'Pazarlama, Satış ve Hizmet',
    ],
  },
  {
    dim: 'C',
    clusters: [
      'Finans',
      'Kamu Yönetimi ve İdare',
      'Bilgi Teknolojileri',
    ],
  },
]

export function HollandTablo1() {
  return (
    <section className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b bg-muted/40">
        <h2 className="font-semibold text-sm">
          Tablo 1 — Holland&apos;ın 6 Kişilik Tipi ile İlgili İş Aktiviteleri, Beceriler ve Değerler
        </h2>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted/30 text-left">
              <th className="border-b border-r px-3 py-2.5 font-semibold w-28">TİP</th>
              <th className="border-b border-r px-3 py-2.5 font-semibold">İLGİ ALANLARI</th>
              <th className="border-b border-r px-3 py-2.5 font-semibold">İŞ AKTİVİTELERİ</th>
              <th className="border-b border-r px-3 py-2.5 font-semibold">BECERİLER</th>
              <th className="border-b px-3 py-2.5 font-semibold">DEĞERLER</th>
            </tr>
          </thead>
          <tbody>
            {TABLO1.map((row, i) => {
              const color = DIMENSION_COLORS[row.dim]
              return (
                <tr key={row.dim} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/10'}>
                  <td className="border-b border-r px-3 py-2.5 align-top">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        {row.dim}
                      </span>
                      <span className="font-semibold" style={{ color }}>
                        {DIMENSION_LABELS[row.dim]}
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-r px-3 py-2.5 text-muted-foreground align-top leading-relaxed">
                    {row.ilgi}
                  </td>
                  <td className="border-b border-r px-3 py-2.5 text-muted-foreground align-top leading-relaxed">
                    {row.isAktivite}
                  </td>
                  <td className="border-b border-r px-3 py-2.5 text-muted-foreground align-top leading-relaxed">
                    {row.beceriler}
                  </td>
                  <td className="border-b px-3 py-2.5 text-muted-foreground align-top leading-relaxed">
                    {row.degerler}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y">
        {TABLO1.map((row) => {
          const color = DIMENSION_COLORS[row.dim]
          return (
            <div key={row.dim} className="p-4 space-y-2.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {row.dim}
                </span>
                <span className="font-semibold text-sm" style={{ color }}>
                  {DIMENSION_LABELS[row.dim]}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">İlgi Alanları</p>
                  <p className="text-muted-foreground leading-relaxed">{row.ilgi}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">İş Aktiviteleri</p>
                  <p className="text-muted-foreground leading-relaxed">{row.isAktivite}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">Beceriler</p>
                  <p className="text-muted-foreground leading-relaxed">{row.beceriler}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">Değerler</p>
                  <p className="text-muted-foreground leading-relaxed">{row.degerler}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function HollandTablo2() {
  return (
    <section className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b bg-muted/40">
        <h2 className="font-semibold text-sm">
          Tablo 2 — Holland&apos;ın 6 Kişilik Tipi ile Uyumlu Çalışma Alanları
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TABLO2.map((item) => {
            const color = DIMENSION_COLORS[item.dim]
            return (
              <div
                key={item.dim}
                className="rounded-lg border-2 overflow-hidden"
                style={{ borderColor: color + '50' }}
              >
                <div
                  className="px-3 py-2 flex items-center gap-2"
                  style={{ backgroundColor: color + '18' }}
                >
                  <span
                    className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {item.dim}
                  </span>
                  <span className="text-xs font-semibold" style={{ color }}>
                    {DIMENSION_LABELS[item.dim]}
                  </span>
                </div>
                <ul className="px-3 py-2.5 space-y-1.5">
                  {item.clusters.map((cluster) => (
                    <li key={cluster} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {cluster}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
