import { DIMENSION_LABELS, type HollandDimension } from '@/lib/holland-questions'
import type { HollandScores, GpaCategory } from '@/types'

type ScoreCategory = 'düşük' | 'orta' | 'yüksek' | 'çok yüksek'

function toScoreCategory(score: number): ScoreCategory {
  if (score <= 20) return 'düşük'
  if (score <= 30) return 'orta'
  if (score <= 38) return 'yüksek'
  return 'çok yüksek'
}

export type ExtraProfileData = {
  hollandWorkStyle?: string[]
  hollandWorkWith?: string[]
  hollandActions?: string[]
  hollandGoal?: string[]
  hollandEnvironment?: string[]
  selfCategory?: string
  freeTime?: string
  topicsHours?: string
  recentLearning?: string
  talentDescription?: string
  talentMeslek?: string
  talentBasari?: string
}

export type ProfileContext = {
  studentName: string
  hollandCode: string
  scores: HollandScores
  gpaCategory: GpaCategory
  consideredDepartments: string[]
  likedCourses: string[]
  dislikedCourses: string[]
  interests: string[]
  topInterests: string[]
  workPreferences: string[]
  extraData?: ExtraProfileData
  extraNotes?: string
}

const WORK_PREF_LABELS: Record<string, string> = {
  desk:     'Masa Başı & Analiz (veri, hesap, strateji)',
  field:    'Sahada & Hareket (seyahat, saha çalışması)',
  creative: 'Yaratıcı & Üretim (tasarım, yazarlık, sanat)',
  social:   'İnsanlarla & Sosyal (eğitim, danışmanlık, ekip)',
}

const TYPE_PROFILES: Record<HollandDimension, string> = {
  R: 'Pratik, mekanik ve fiziksel etkinlikleri seven; elle çalışmayı, alet ve makinelerle uğraşmayı tercih eden',
  I: 'Entelektüel ve analitik; araştırma, gözlem ve bağımsız problem çözmeden zevk alan, meraklı',
  A: 'Yaratıcı, sezgisel ve hayal gücü güçlü; sanat, müzik, yazarlık ve tasarımda kendini ifade eden',
  S: 'Sosyal, empatik ve yardımsever; insanlara öğretmek, rehberlik etmek ve hizmet etmekten hoşlanan',
  E: 'Girişimci ve liderlik yeteneğine sahip; ikna edici, enerjik, hedef odaklı ve hırslı',
  C: 'Düzenli, titiz ve sistematik; veri, sayı ve kayıtlarla çalışmayı seven, güvenilir ve kurallara uyan',
}

function nonEmpty(arr: string[] | undefined): string {
  if (!arr || arr.length === 0) return 'belirtilmedi'
  return arr.join(', ')
}

function line(label: string, value: string | undefined): string {
  if (!value || value.trim() === '') return ''
  return `${label}: ${value}`
}

export function buildCareersPrompt(ctx: ProfileContext): string {
  const scoreLines = (Object.entries(ctx.scores) as [HollandDimension, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([dim, score]) => `  - ${dim} (${DIMENSION_LABELS[dim]}): ${toScoreCategory(score)}`)
    .join('\n')

  const workPrefLabels = ctx.workPreferences
    .map((p) => WORK_PREF_LABELS[p] ?? p)
    .join(', ')

  return `Sen bir mesleki rehberlik uzmanısın. Aşağıdaki öğrenci profiline göre uygun meslekler öner.

## Öğrenci Profili

Holland Kodu: ${ctx.hollandCode}

Holland Boyut Skorları (yüksekten düşüğe):
${scoreLines}

Not Ortalaması: ${ctx.gpaCategory}
Düşündüğü Bölümler: ${nonEmpty(ctx.consideredDepartments)}
Sevdiği Dersler: ${nonEmpty(ctx.likedCourses)}
Sevmediği Dersler: ${nonEmpty(ctx.dislikedCourses)}
İlgi Alanları: ${nonEmpty(ctx.interests)}
${ctx.topInterests.length > 0 ? `En Çok Zaman Ayırdığı Alanlar (sırasıyla): ${ctx.topInterests.join(' > ')}` : ''}
Çalışma Ortamı Tercihleri: ${workPrefLabels || 'belirtilmedi'}
${ctx.extraNotes ? `Öğrenci Notu: ${ctx.extraNotes}` : ''}

## Görev

Yalnızca geçerli bir JSON dizisi döndür, başka hiçbir şey yazma. Format:

[
  {
    "title": "Meslek Adı",
    "reason": "Bu mesleğin neden uygun olduğunu 1-2 cümleyle açıkla.",
    "matchScore": 85
  }
]

Kurallar:
- Tam olarak 8 meslek öner
- matchScore 60–99 arasında olsun, gerçekçi dağılım yap
- Listeyi matchScore'a göre azalan sırala
- reason Türkçe ve kişiselleştirilmiş olsun
- Yalnızca JSON, açıklama veya markdown bloku olmadan`
}

export function buildReportPrompt(ctx: ProfileContext, careers: string): string {
  const dims = ctx.hollandCode.split('') as HollandDimension[]
  const dominant = dims[0]
  const second = dims[1]
  const firstName = ctx.studentName.split(' ')[0]

  const scoreLines = (Object.entries(ctx.scores) as [HollandDimension, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([dim, score]) => `  - ${dim} (${DIMENSION_LABELS[dim]}): ${toScoreCategory(score)}`)
    .join('\n')

  const workPrefLabels = ctx.workPreferences
    .map((p) => WORK_PREF_LABELS[p] ?? p)
    .join(', ')

  const ex = ctx.extraData ?? {}

  const additionalContext = [
    ctx.topInterests.length > 0 ? `En Çok Zaman Ayırdığı Alanlar (sırasıyla): ${ctx.topInterests.join(' > ')}` : '',
    ex.hollandWorkStyle?.length ? `Çalışma Biçimi Tercihi: ${ex.hollandWorkStyle.join(', ')}` : '',
    ex.hollandWorkWith?.length ? `Birlikte Çalışma Tercihi: ${ex.hollandWorkWith.join(', ')}` : '',
    ex.hollandActions?.length ? `Motivasyon Eylemleri: ${ex.hollandActions.join(', ')}` : '',
    ex.hollandGoal?.length ? `Kariyer Hedefi / Değerleri: ${ex.hollandGoal.join(', ')}` : '',
    ex.hollandEnvironment?.length ? `Tercih Ettiği Çalışma Ortamı (insan tipi): ${ex.hollandEnvironment.join(', ')}` : '',
    line('Kariyer Seçim Durumu (öz değerlendirme)', ex.selfCategory),
    line('Boş Zaman Aktiviteleri', ex.freeTime),
    line('Tutkuyla Konuştuğu Konular', ex.topicsHours),
    line('Son 6 Ayda Kendi İsteğiyle Öğrendiği', ex.recentLearning),
    line('Öz Bildirilen Yetenekler', ex.talentDescription),
    line('Yetenek-Meslek Bağlantısı (kendi görüşü)', ex.talentMeslek),
    line('Başarı Öz Değerlendirmesi', ex.talentBasari),
    ctx.extraNotes ? `Ek Notlar: ${ctx.extraNotes}` : '',
  ].filter(Boolean).join('\n')

  return `Sen deneyimli bir mesleki rehberlik uzmanısın. ${firstName} için kapsamlı ve kişiselleştirilmiş bir Holland Mesleki İlgi Raporu hazırlıyorsun.

## Öğrenci Profili
Ad: ${firstName}
Holland Kodu: ${ctx.hollandCode}
Baskın Tip: ${dominant} — ${DIMENSION_LABELS[dominant]} (${TYPE_PROFILES[dominant]})
İkinci Tip: ${second} — ${DIMENSION_LABELS[second]} (${TYPE_PROFILES[second]})

Holland Boyut Skorları (yüksekten düşüğe):
${scoreLines}

Not Ortalaması: ${ctx.gpaCategory}
Çalışma Ortamı Tercihleri: ${workPrefLabels || 'belirtilmedi'}
Sevdiği Dersler: ${nonEmpty(ctx.likedCourses)}
Sevmediği Dersler: ${nonEmpty(ctx.dislikedCourses)}
İlgi Alanları: ${nonEmpty(ctx.interests)}
Düşündüğü Bölümler: ${nonEmpty(ctx.consideredDepartments)}
Önerilen Meslekler: ${careers}
${additionalContext ? `\n## Ek Bağlam\n${additionalContext}` : ''}

## Rapor Formatı

Aşağıdaki başlıkları TAM OLARAK bu şekilde yaz. Her bölümü eksiksiz doldur.

### Baskın Kişilik Tipin: ${DIMENSION_LABELS[dominant]} (${dominant})

"Sevgili ${firstName}," ile başla. ${DIMENSION_LABELS[dominant]} tipinin özelliklerini, dünyaya bakış açısını ve güçlü yönlerini 3-4 paragrafta samimi, sıcak "sen" diliyle anlat. Öğrencinin ilgi alanlarını, sevdiği dersleri ve çalışma tercihini içeriğe yansıt. Motivasyonu artıracak, güçlü yönleri ön plana çıkaran bir ton kullan.

### Holland Kodun: ${ctx.hollandCode}

${ctx.hollandCode} kodunun ne anlama geldiğini 2-3 cümle kısaca açıkla. Ardından ${dominant}${second} ikili kombinasyonu için yaratıcı ve anlamlı bir Türkçe isim üret. TAM OLARAK şu formatı kullan:
**İkili Kombinasyon Adın: [İsim]**
Ardından bu kombinasyonun karakterini 2 cümle açıkla.

### Kariyer Kümeleri

${ctx.hollandCode} koduna uygun 3 farklı kariyer kümesi belirle. Her küme için TAM OLARAK şu formatı kullan:

#### [Küme Adı]
**Bu alanda ne yapılır?** 2 cümle açıklama.
**İlgi alanları:** alan 1, alan 2, alan 3, alan 4
**Kariyer örnekleri:** Meslek 1, Meslek 2, Meslek 3, Meslek 4, Meslek 5
**Önerilen lise dersleri:** Ders 1, Ders 2, Ders 3

### Üniversite Bölüm Önerileri

${ctx.hollandCode} koduna ve bu öğrencinin profiline göre Türk üniversitelerinde bulunan 8-10 bölümü listele. Her satırda şu formatı kullan: **Bölüm Adı** — neden uygun olduğunu 1 cümle açıkla. Öğrencinin düşündüğü bölümler (${nonEmpty(ctx.consideredDepartments)}) varsa bunları değerlendir.

### Güçlü Yönlerin

${dominant} ve ${second} tipinin kombinasyonundan gelen 5-6 güçlü özelliği, öğrencinin profiliyle ilişkilendirerek madde madde yaz. Her madde 1-2 cümle.

### Kariyer Yolculuğun İçin Öneriler

Öğrenciye özel, hemen uygulanabilecek 5 somut öneri. Sevdiği dersleri, ilgi alanlarını ve çalışma tercihini göz önünde bulundur. Madde madde yaz.

---
Tüm metni Türkçe yaz. Sıcak, samimi ve motive edici bir dil kullan; "sen" diliyle hitap et. Başa veya sona kod bloğu, JSON veya meta açıklama ekleme.`
}
