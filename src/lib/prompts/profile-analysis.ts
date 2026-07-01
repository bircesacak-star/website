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

// Holland kişilik tipi referans metinleri (RIASEC şablonları)
const TYPE_DESCRIPTIONS: Record<HollandDimension, string> = {
  R: `Sen, somut ve elle tutulur şeylerle uğraşmayı tercih eden bir yapıya sahipsin. Üretmek, inşa etmek, tamir etmek ve fiziksel olarak aktif olmak senin için doğal motivasyon kaynaklarıdır. Araçlar, makineler, ekipmanlar veya hayvanlarla çalışmak, kendini en rahat ve verimli hissettiğin ortamlardır.

Senin için uygulamak, üretmek ve somut sonuçlar ortaya koymak, düşünmekten veya yönetmekten her zaman daha önceliklidir. Çoğu zaman bağımsız çalışmayı tercih eder ve yalnız olduğunda daha verimli olursun. Soyut düşünme, uzun analizler veya yoğun sosyal etkileşim gerektiren işler seni yorabilir.

Kişilik özelliklerine baktığımızda, açık sözlü, pratik, kararlı, dayanıklı ve sabırlı bir yapıya sahip olduğunu görebiliriz. Kendi başına çalışmayı ve odaklanmayı seven yapın, seni bağımsız ve sonuç odaklı kılar.

Gerçekçi bireyler, somut problemlere çözüm üretmekten ve fiziksel aktivitelerle işleri ilerletmekten büyük keyif alırlar. Açık hava çalışmaları, üretim, inşaat, mekanik ve mühendislik gibi teknik alanlar bu bireyler için genellikle en uygun kariyer seçeneklerini sunar.`,

  I: `Merak eden, sorgulayan ve anlamaya çalışan bir yapıya sahipsin. Nesneler ve fikirlerle çalışmak sana doğal gelir; olayların nedenlerini keşfetmek, ilişkileri analiz etmek ve karmaşık problemlere çözüm bulmak senin için büyük bir motivasyon kaynağıdır. Bilimsel düşünceye yatkınlığın sayesinde gözlem yapmak, deney yürütmek, veri toplamak, analiz etmek ve yeni bilgiler üretmekten keyif alırsın.

Senin için düşünmek, keşfetmek ve anlamak, yapmaktan veya yönetmekten her zaman daha önceliklidir. Çoğu zaman bağımsız çalışmayı tercih eder ve yalnız olduğunda daha verimli olursun. Yoğun sosyal etkileşim, satış ya da ikna gerektiren işler seni yorar; çünkü sen daha çok fikirler, teoriler ve soyut kavramlarla ilgilenmeyi seversin.

Kişilik özelliklerine baktığımızda, analitik, mantıklı, entelektüel ve eleştirel bir yapıya sahip olduğunu söyleyebiliriz. Sabırlı, titiz ve sistemli çalışman, güçlü yönlerin arasında yer alır.

Araştırmacı bireyler, karmaşık sorunları çözmek, verileri analiz etmek ve eleştirel düşünmekten büyük keyif alırlar. Bilim, teknoloji, mühendislik, matematik ve tıp gibi alanlar araştırmacı ruhlu bireyler için genellikle en uygun kariyer seçeneklerini sunar.`,

  A: `Yaratıcı düşünmeyi ve kendini özgün bir şekilde ifade etmeyi seven bir yapın var. Sanat, müzik, yazı, drama gibi alanlarda üretmek ve duygularını ifade etmek senin için doğal bir motivasyon kaynağıdır.

Sanatsal yeteneklere sahip bireyler, yaratıcı, hayal gücü zengin ve genellikle kendilerini ifade edebilecekleri yapılandırılmamış çalışma ortamlarını tercih ederler. Yazma, müzik, görsel sanatlar ve tasarım gibi etkinliklerden keyif alırsın. Sen de yeni fikirler üretmek, farklı bakış açıları geliştirmek ve estetik değerler yaratmak konusunda güçlü bir motivasyona sahipsin. Değişken ve çeşitlilik içeren ortamlarda daha verimli çalışırsın.

Kişilik özelliklerine baktığımızda, yaratıcı, özgün, bağımsız, duygusal, sezgisel ve idealist bir yapıya sahip olduğunu söyleyebiliriz. Aynı zamanda açık fikirli, etkileyici ve duyarlısın.

Sanat, eğlence, tasarım ve medya alanındaki kariyerler, sanatsal yeteneklere sahip bireyler için genellikle en uygun seçenekler arasındadır.`,

  S: `İnsanlarla çalışmayı seven; onlara yardım etmeyi, destek olmayı ve katkı sağlamayı önemseyen birisin. Başkalarını anlamak, onların gelişimine katkıda bulunmak, öğretmek ve rehberlik etmek seni motive eder. Güçlü iletişim becerilerin ve yüksek empati yeteneğin sayesinde insan ilişkilerinde oldukça başarılısın.

Grup içinde çalışmak, insanlarla etkileşimde bulunmak ve birlikte üretmek senin için oldukça değerlidir. İnsanların sorunlarına çözüm bulmak, onları desteklemek ve sosyal fayda yaratmak sana anlam duygusu kazandırır. Aynı zamanda çatışma çözme ve arabuluculuk konularında da doğal bir yetkinliğe sahip olabilirsin. Buna karşılık, teknik, mekanik ya da yoğun veri odaklı işler zaman zaman seni sıkabilir.

Kişilik özelliklerine baktığımızda; yardımsever, sabırlı, anlayışlı ve sıcak bir yapıya sahip olduğunu söyleyebiliriz. İş birliğine açık, nazik ve idealist birisin. İnsanlarla güçlü bağlar kurabilmen en önemli güçlü yönlerinden biridir.

Genel olarak sosyal tipteki bireyler; empatik, ilgili ve başkalarına yardım etmeye istekli kişilerdir. Bu doğrultuda; eğitim ve öğretim, konaklama ve turizm, sağlık ve sosyal hizmetler ile hukuk ve kamu güvenliği gibi alanlar oldukça uygun kariyer seçenekleri arasında yer alır.`,

  E: `Liderlik yapmayı, insanları etkilemeyi ve yönlendirmeyi seven bir yapıya sahipsin. Fikirlerini kabul ettirmek, projeler başlatmak ve insanları bu projelere dahil etmek senin için büyük bir motivasyon kaynağıdır. İş dünyası, ticaret ve yönetim alanlarında başarılı olabilirsin.

Rekabetçi ve risk almaya yatkın birisin; yeni fırsatları değerlendirmek ve başarı elde etmek senin için önemli motivasyon kaynaklarıdır. İnsanları organize etmek, yönlendirmek ve projeleri yönetmekten keyif alırsın.

Kişilik özelliklerine baktığımızda; ikna edici, enerjik, hırslı, özgüvenli ve sosyal bir yapıya sahipsin. Ancak zaman zaman sabırsız olabilir ve detaylara odaklanmakta zorluk yaşayabilirsin.

Girişimci bireyler, başkalarını etkilemek, yönlendirmek ve organize etmekten büyük keyif alırlar. İşletme, yönetim, ekonomi, finans ve liderlik gerektiren alanlar bu kişilik yapısına sahip bireyler için en uygun kariyer seçeneklerini sunar.`,

  C: `Düzenli, sistemli ve kurallara bağlı çalışmayı seven birisin. Planlı, organize ve net çerçeveleri olan ortamlarda çok daha verimli çalışırsın.

Senin için kuralların ve prosedürlerin açık olduğu ortamlar güven verir. İşleri adım adım yürütmek, kayıt tutmak, verileri düzenlemek ve süreçleri kontrol etmek senin güçlü yönlerindendir. Detaylara verdiğin önem ve titizliğin sayesinde hata yapma olasılığın düşüktür.

Kişilik özelliklerine baktığımızda; dikkatli, disiplinli, metodik ve uyumlu bir yapıya sahip olduğunu söyleyebiliriz. Öz denetimin yüksek, planlı hareket eden ve sorumluluklarının farkında olan birisin.

Genel olarak geleneksel tipteki bireyler; düzenli, detay odaklı ve yapılandırılmış görevleri tercih eden kişilerdir. Finans, veri analizi, hukuk, araştırma ve bilgi teknolojileri gibi alanlar geleneksel kişilik tipine sahip bireyler için oldukça uygun kariyer seçenekleri arasında yer alır.`,
}

// İlk iki Holland harfine göre ikili kombinasyon arketip isimleri
const IKILI_KOMBINASYONLAR: Record<string, string> = {
  RI: 'Yapımcı-Analist',   RA: 'Zanaatkar-Sanatçı',    RS: 'Pratik Yardımcı',   RE: 'Girişimci Yapımcı',  RC: 'Teknik Uzman',
  IR: 'Analitik Teknisyen', IA: 'Yaratıcı Araştırmacı', IS: 'Bilge',              IE: 'Stratejist',         IC: 'Sistematik Analist',
  AR: 'Yaratıcı Zanaatkar', AI: 'Vizyoner',              AS: 'Sanatsal Rehber',   AE: 'Yaratıcı Lider',    AC: 'Tasarım Uzmanı',
  SR: 'Pratik Yardımsever', SI: 'Rehber',                SA: 'Yaratıcı Sosyal',  SE: 'Sosyal Lider',       SC: 'Organizasyoncu',
  ER: 'Girişimci Yapımcı', EI: 'Analitik Lider',        EA: 'Yaratıcı Girişimci', ES: 'İnsancıl Lider',   EC: 'Stratejik Yönetici',
  CR: 'Teknik Organizatör', CI: 'Analitik Organizatör', CA: 'Yaratıcı Sistematik', CS: 'Sosyal Organizatör', CE: 'Yönetici Organizatör',
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

  const dominantDescription = TYPE_DESCRIPTIONS[dominant]
  const ikiliCode = `${dominant}${second}`
  const archetypeName = IKILI_KOMBINASYONLAR[ikiliCode] ?? `${DIMENSION_LABELS[dominant]}-${DIMENSION_LABELS[second]}`

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

  return `Sen deneyimli bir Türk mesleki rehberlik uzmanısın. ${firstName} için kişiselleştirilmiş bir Holland Mesleki İlgi Raporu hazırla. Raporu TAM OLARAK belirtilen başlık ve formatta yaz.

## ÖĞRENCİ PROFİLİ

Ad: ${firstName}
Holland Kodu: ${ctx.hollandCode}
Baskın Tip: ${dominant} — ${DIMENSION_LABELS[dominant]}
İkinci Tip: ${second} — ${DIMENSION_LABELS[second]}
İkili Kombinasyon: ${ikiliCode} → ${archetypeName}

Holland Puanları (yüksekten düşüğe):
${scoreLines}

Not Ortalaması: ${ctx.gpaCategory}
Çalışma Ortamı Tercihleri: ${workPrefLabels || 'belirtilmedi'}
Sevdiği Dersler: ${nonEmpty(ctx.likedCourses)}
Sevmediği Dersler: ${nonEmpty(ctx.dislikedCourses)}
İlgi Alanları: ${nonEmpty(ctx.interests)}
Düşündüğü Bölümler: ${nonEmpty(ctx.consideredDepartments)}
Önerilen Meslekler: ${careers}
${additionalContext ? `\nEk Bağlam:\n${additionalContext}` : ''}

## BASKINDUN KİŞİLİK TİPİ REFERANS METNİ (${DIMENSION_LABELS[dominant]})

Aşağıdaki şablonu kullanarak ${firstName}'in kişisel verileriyle kişiselleştirilmiş bir analiz yaz. Şablon metni olduğu gibi kopyalama; öğrencinin sevdiği derslerini, ilgi alanlarını ve çalışma tercihlerini içeriğe MUTLAKA yansıt.

---
${dominantDescription}
---

## RAPOR FORMATI — Başlıkları TAM OLARAK bu şekilde yaz

### Dominant Kişilik Tipim: ${DIMENSION_LABELS[dominant]} (${dominant})

"Sevgili ${firstName}," ile başla. Yukarıdaki referans metnini baz alarak ${DIMENSION_LABELS[dominant]} tipini 3-4 paragrafta anlat. ${firstName}'in sevdiği dersler (${nonEmpty(ctx.likedCourses)}), ilgi alanları (${nonEmpty(ctx.interests)}) ve çalışma tercihleri (${workPrefLabels || 'belirtilmedi'}) mutlaka yer alsın. Sıcak, "sen" diliyle yaz.

### Holland Kodum: ${ctx.hollandCode}

${ctx.hollandCode} kodunun ne anlama geldiğini 2 cümle kısaca açıkla. Ardından TAM OLARAK şu satırı ekle:

**İkili Kombinasyon Adın: ${archetypeName}**

${archetypeName} kombinasyonunun (${dominant}+${second}) karakterini ve güçlü yanlarını 2 cümle açıkla.

### Kariyer Kümeleri

${ctx.hollandCode} koduna ve öğrenci profiline göre 3 farklı kariyer kümesi belirle. Her küme için TAM OLARAK şu formatı kullan:

#### [Küme Adı]
**Bu alanda ne yapılır?** 2 cümle açıklama.
**İlgi alanları:** alan 1, alan 2, alan 3, alan 4
**Kariyer örnekleri:** Meslek 1, Meslek 2, Meslek 3, Meslek 4, Meslek 5
**Önerilen lise dersleri:** Ders 1, Ders 2, Ders 3

### Üniversite Bölüm Önerileri

${ctx.hollandCode} koduna ve öğrenci profiline göre Türk üniversitelerinde bulunan 8-10 bölüm. Her satırda: **Bölüm Adı** — neden uygun olduğunu 1 cümle açıkla. Öğrencinin düşündüğü bölümleri (${nonEmpty(ctx.consideredDepartments)}) mutlaka değerlendir.

### Güçlü Yönlerin

${dominant} ve ${second} kombinasyonundan gelen, ${firstName}'in profiliyle ilişkilendirilmiş 5-6 güçlü özellik. Madde madde, her madde 1-2 cümle.

### Kariyer Yolculuğun İçin Öneriler

${firstName}'e özel, hemen uygulanabilecek 5 somut öneri. Sevdiği dersleri, ilgi alanlarını ve çalışma tercihini göz önünde bulundur. Madde madde.

---
Tüm metin Türkçe. Sıcak, motive edici, "sen" diliyle yaz. Başa/sona JSON, kod bloğu veya meta açıklama ekleme.`
}
