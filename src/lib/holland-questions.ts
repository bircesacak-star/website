export type HollandDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'

export type Question = {
  id: number
  text: string
  dimension: HollandDimension
}

export const LIKERT_OPTIONS = [
  { value: 3, label: 'Hoşlanırım' },
  { value: 2, label: 'Farketmez' },
  { value: 1, label: 'Hoşlanmam' },
] as const

export type LikertValue = 1 | 2 | 3

// 90 soru — her boyut 15 soru
// R: Gerçekçi    · I: Araştırmacı · A: Sanatsal
// S: Sosyal      · E: Girişimci   · C: Geleneksel

export const HOLLAND_QUESTIONS: Question[] = [
  // ── I: Araştırmacı ────────────────────────────────────────────────────────
  { id: 1,  dimension: 'I', text: 'Kuşların nasıl göç ettiğini öğrenmek' },
  { id: 3,  dimension: 'I', text: 'Hava durumu tahmini için kişisel gözlemlerimi kullanmak' },
  { id: 4,  dimension: 'I', text: 'Bitki hastalıklarını incelemek' },
  { id: 8,  dimension: 'I', text: 'Bir bilim müzesini incelemek' },
  { id: 11, dimension: 'I', text: 'Mikroskop gibi laboratuvar aletlerini kullanmak' },
  { id: 17, dimension: 'I', text: 'Vitaminlerin hayvanlar üzerindeki etkisini araştırmak' },
  { id: 22, dimension: 'I', text: 'Yeni bir cerrahi işlem hakkında yazılar okumak' },
  { id: 34, dimension: 'I', text: 'Biyoloji çalışmak' },
  { id: 39, dimension: 'I', text: "Dünya'nın merkezi, güneş ve yıldızlar hakkında kitaplar okumak" },
  { id: 41, dimension: 'I', text: 'Beynin nasıl çalıştığını öğrenmek' },
  { id: 47, dimension: 'I', text: 'Depremin nedenlerini araştırmak' },
  { id: 48, dimension: 'I', text: 'Ünlü bir bilim insanının dersine katılmak' },
  { id: 68, dimension: 'I', text: 'Yıldızların oluşumunu öğrenmek' },
  { id: 71, dimension: 'I', text: 'Kelebekleri gözlemlemek ve sınıflandırmak' },
  { id: 80, dimension: 'I', text: 'Bir havuz veya gölde yabani hayatı araştırmak' },

  // ── A: Sanatsal ───────────────────────────────────────────────────────────
  { id: 6,  dimension: 'A', text: 'Resimler tasarlamak ve çizmek' },
  { id: 10, dimension: 'A', text: 'Modern yazarların yazı stillerini araştırmak' },
  { id: 14, dimension: 'A', text: 'Bir oyun için takım oluşturma' },
  { id: 31, dimension: 'A', text: 'Müzik eseri bestelemek veya düzenlemek' },
  { id: 32, dimension: 'A', text: 'Filmler için konu müziği bestelemek' },
  { id: 42, dimension: 'A', text: 'Yaratıcı fotoğraflar çekmek' },
  { id: 44, dimension: 'A', text: 'Bir bandoda çalmak' },
  { id: 45, dimension: 'A', text: 'Bir orkestrada caz müziği çalmak' },
  { id: 50, dimension: 'A', text: 'Bir sinema filmi senaryosu yazmak' },
  { id: 62, dimension: 'A', text: 'Bir magazin hikayesini anlatan çizimler yapmak' },
  { id: 72, dimension: 'A', text: 'Metal bir heykel tasarlamak' },
  { id: 74, dimension: 'A', text: 'Kısa hikayeler yazmak' },
  { id: 77, dimension: 'A', text: 'Sertifika, plaket veya taktir belgesi kazanmak' },
  { id: 78, dimension: 'A', text: 'Tiyatro oyunu, müzikaller gibi sanatsal etkinliklerin eleştirilerini yazmak' },
  { id: 81, dimension: 'A', text: 'Bir tiyatro oyununda rol almak' },

  // ── S: Sosyal ─────────────────────────────────────────────────────────────
  { id: 2,  dimension: 'S', text: 'İnsanlara yeni bir hobi öğretmek' },
  { id: 21, dimension: 'S', text: 'Küçük grup tartışmalarına katılmak' },
  { id: 29, dimension: 'S', text: 'Acil durumlarda insanlara yardım etmek' },
  { id: 37, dimension: 'S', text: 'Bir toplum geliştirme projesinde çalışmak' },
  { id: 49, dimension: 'S', text: 'Bir proje üzerinde başkaları ile beraber çalışmak' },
  { id: 55, dimension: 'S', text: 'Yerel bir radyo istasyonunda çalınması için müzik parçaları seçmek' },
  { id: 58, dimension: 'S', text: 'Tehlikedeki bir insana yardım etmeye çalışmak' },
  { id: 60, dimension: 'S', text: 'Çocuklara nasıl oyun oynanacağını veya spor yapılacağını göstermek' },
  { id: 64, dimension: 'S', text: 'Diğer insanların bir problemin çözülebileceğine nasıl inandıklarını öğrenmek' },
  { id: 65, dimension: 'S', text: 'Bir sergiye gezi düzenlemek' },
  { id: 66, dimension: 'S', text: 'Uyuşturucu kullanan insanlara danışmanlık yapmak' },
  { id: 73, dimension: 'S', text: 'İnsanlara kanuni doğruları açıklamak' },
  { id: 87, dimension: 'S', text: 'Arkadaşlar arasındaki bir tartışmayı yatıştırmak' },
  { id: 88, dimension: 'S', text: 'Birine önemli bir karar vermesinde yardım etmek' },
  { id: 90, dimension: 'S', text: 'Fıkralar ve hikayeler anlatarak insanları eğlendirmek' },

  // ── E: Girişimci ──────────────────────────────────────────────────────────
  { id: 7,  dimension: 'E', text: 'Bir iş yaptırmak için parayla adam tutmak' },
  { id: 15, dimension: 'E', text: 'Yeni bir satış kampanyası düzenlemek' },
  { id: 16, dimension: 'E', text: 'Bir toplantıyı yönetmek' },
  { id: 18, dimension: 'E', text: 'Küçük bir işletmeyi idare etmek' },
  { id: 20, dimension: 'E', text: 'Diğer insanlar için iş planlamak' },
  { id: 28, dimension: 'E', text: 'Telefonla iş idare etmek' },
  { id: 33, dimension: 'E', text: 'Yeni kurallar veya politikalar geliştirmek' },
  { id: 35, dimension: 'E', text: 'Politik bir kurum için kampanyaya katılmak' },
  { id: 51, dimension: 'E', text: 'Şirket hakkındaki şikayetleri konusunda işçilerle röportaj yapmak' },
  { id: 56, dimension: 'E', text: 'İl genel meclisinde çalışmak' },
  { id: 63, dimension: 'E', text: 'Ziyaretçilere yol göstermek' },
  { id: 67, dimension: 'E', text: 'İş gazeteleri veya dergileri okumak' },
  { id: 75, dimension: 'E', text: 'İnsanların mali kararlar vermelerine yardımcı olmak' },
  { id: 83, dimension: 'E', text: 'İş gezilerine çıkmak' },
  { id: 85, dimension: 'E', text: 'Yeni alışveriş merkezinin tanıtımını yapmak' },

  // ── C: Geleneksel ─────────────────────────────────────────────────────────
  { id: 5,  dimension: 'C', text: 'Bankaya yatırılan paranın faizini hesaplamak' },
  { id: 12, dimension: 'C', text: 'Bir dükkanda envanter tutmak' },
  { id: 23, dimension: 'C', text: 'Mali bir hesaptaki hataları bulmak' },
  { id: 24, dimension: 'C', text: 'Bir rapor taslağındaki hataları bulmak ve incelemek' },
  { id: 27, dimension: 'C', text: 'Kusurları bulmak için mamulleri incelemek' },
  { id: 30, dimension: 'C', text: "Bir kuruluşun parayla ilgili bütün işlerini idare etmek" },
  { id: 36, dimension: 'C', text: 'Maddeleri ayırmak, biriktirmek ve saklamak' },
  { id: 43, dimension: 'C', text: 'Masraflara ait hesap kayıtları tutmak' },
  { id: 46, dimension: 'C', text: 'Bir grup veya kulüp için bütçe hazırlamak' },
  { id: 57, dimension: 'C', text: 'Mali raporları hazırlamak ve yorumlamak' },
  { id: 69, dimension: 'C', text: 'Taksit ödemelerini tahsil etmek' },
  { id: 76, dimension: 'C', text: 'Gelir vergisi kazancını düzenlemek' },
  { id: 79, dimension: 'C', text: 'Aylık bütçe planı yapmak' },
  { id: 86, dimension: 'C', text: 'Bir muhasebecilik sistemi kurmak' },
  { id: 89, dimension: 'C', text: 'Taşıma için nakil maliyetlerini hesaplamak' },

  // ── R: Gerçekçi ───────────────────────────────────────────────────────────
  { id: 9,  dimension: 'R', text: 'Gözlük için mercekleri parlatmak' },
  { id: 13, dimension: 'R', text: 'Bir kuş yemliği tasarlamak' },
  { id: 19, dimension: 'R', text: 'Bir makinenin nasıl kullanılacağı konusunda talimatlar yazmak' },
  { id: 25, dimension: 'R', text: 'Planlar ve grafikler yapmak' },
  { id: 26, dimension: 'R', text: 'Fırtınadan sonra zarar görmüş bir ağacı onarmak' },
  { id: 38, dimension: 'R', text: 'Bir daktilonun nasıl tamir edileceğini öğrenmek' },
  { id: 40, dimension: 'R', text: 'Tam doğru zaman tutmak için bir saati ayarlamak' },
  { id: 52, dimension: 'R', text: 'Mobilya yapmak' },
  { id: 53, dimension: 'R', text: 'Değerli taşları kesmeyi ve parlatmayı öğrenmek' },
  { id: 54, dimension: 'R', text: 'Yaralı bir insana ilk yardım yapmak' },
  { id: 59, dimension: 'R', text: 'Elektronik alet çalıştırmak' },
  { id: 61, dimension: 'R', text: 'Bir ustayı televizyon tamir ederken seyretmek' },
  { id: 70, dimension: 'R', text: 'Bir slayt veya film projektörünü çalıştırmak' },
  { id: 82, dimension: 'R', text: 'Bir resim çerçevesi yapmak' },
  { id: 84, dimension: 'R', text: 'Orman yangınları için gözetleme yapmak' },
]

// Test sırasında orijinal sıra (id'ye göre) kullanılır
export const QUESTIONS_SORTED = [...HOLLAND_QUESTIONS].sort((a, b) => a.id - b.id)

export const DIMENSION_LABELS: Record<HollandDimension, string> = {
  R: 'Gerçekçi',
  I: 'Araştırmacı',
  A: 'Sanatsal',
  S: 'Sosyal',
  E: 'Girişimci',
  C: 'Geleneksel',
}

export const DIMENSION_COLORS: Record<HollandDimension, string> = {
  R: '#dc2626',   // Kırmızı
  I: '#ea580c',   // Turuncu
  A: '#ca8a04',   // Sarı
  S: '#16a34a',   // Yeşil
  E: '#2563eb',   // Mavi
  C: '#7c3aed',   // Mor
}
