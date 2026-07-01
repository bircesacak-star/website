import type { HollandDimension } from '@/lib/holland-questions'

export type CareerSeed = {
  title: string
  slug: string
  cluster: string
  hollandCodes: HollandDimension[]
}

export const CAREER_SEEDS: CareerSeed[] = [
  // Sayısal
  { title: 'Bilgisayar Mühendisi',    slug: 'bilgisayar-muhendisi',    cluster: 'Sayısal',  hollandCodes: ['I','R','C'] },
  { title: 'Elektrik Mühendisi',      slug: 'elektrik-muhendisi',      cluster: 'Sayısal',  hollandCodes: ['R','I','C'] },
  { title: 'Makine Mühendisi',        slug: 'makine-muhendisi',        cluster: 'Sayısal',  hollandCodes: ['R','I','C'] },
  { title: 'İnşaat Mühendisi',        slug: 'insaat-muhendisi',        cluster: 'Sayısal',  hollandCodes: ['R','I','C'] },
  { title: 'Çevre Mühendisi',         slug: 'cevre-muhendisi',         cluster: 'Sayısal',  hollandCodes: ['I','R','S'] },
  { title: 'Veri Bilimci',            slug: 'veri-bilimci',            cluster: 'Sayısal',  hollandCodes: ['I','C','E'] },
  { title: 'Matematikçi',             slug: 'matematikci',             cluster: 'Sayısal',  hollandCodes: ['I','C','R'] },
  { title: 'Kimyager',                slug: 'kimyager',                cluster: 'Sayısal',  hollandCodes: ['I','R','C'] },
  { title: 'Fizikçi',                 slug: 'fizikci',                 cluster: 'Sayısal',  hollandCodes: ['I','R','C'] },

  // Sağlık
  { title: 'Doktor',                  slug: 'doktor',                  cluster: 'Sağlık',   hollandCodes: ['I','S','R'] },
  { title: 'Diş Hekimi',             slug: 'dis-hekimi',              cluster: 'Sağlık',   hollandCodes: ['I','R','S'] },
  { title: 'Eczacı',                  slug: 'eczaci',                  cluster: 'Sağlık',   hollandCodes: ['I','C','S'] },
  { title: 'Hemşire',                 slug: 'hemsire',                 cluster: 'Sağlık',   hollandCodes: ['S','R','I'] },
  { title: 'Fizyoterapist',           slug: 'fizyoterapist',           cluster: 'Sağlık',   hollandCodes: ['S','R','I'] },
  { title: 'Psikolog',                slug: 'psikolog',                cluster: 'Sağlık',   hollandCodes: ['S','I','A'] },
  { title: 'Diyetisyen',              slug: 'diyetisyen',              cluster: 'Sağlık',   hollandCodes: ['I','S','C'] },
  { title: 'Veteriner',               slug: 'veteriner',               cluster: 'Sağlık',   hollandCodes: ['I','R','S'] },

  // Sosyal / Eğitim
  { title: 'Öğretmen',               slug: 'ogretmen',                cluster: 'Eğitim',   hollandCodes: ['S','A','E'] },
  { title: 'Psikolojik Danışman',    slug: 'psikolojik-danisман',     cluster: 'Eğitim',   hollandCodes: ['S','A','I'] },
  { title: 'Sosyal Hizmet Uzmanı',   slug: 'sosyal-hizmet-uzmani',   cluster: 'Sosyal',   hollandCodes: ['S','E','C'] },
  { title: 'İnsan Kaynakları Uzmanı',slug: 'insan-kaynaklari-uzmani',cluster: 'İşletme',  hollandCodes: ['S','E','C'] },

  // Hukuk / Ekonomi
  { title: 'Avukat',                  slug: 'avukat',                  cluster: 'Hukuk',    hollandCodes: ['E','S','I'] },
  { title: 'Hakim / Savcı',          slug: 'hakim-savci',             cluster: 'Hukuk',    hollandCodes: ['E','I','C'] },
  { title: 'Ekonomist',               slug: 'ekonomist',               cluster: 'Ekonomi',  hollandCodes: ['I','E','C'] },
  { title: 'Muhasebeci',              slug: 'muhasebeci',              cluster: 'Ekonomi',  hollandCodes: ['C','E','I'] },
  { title: 'Bankacı',                 slug: 'bankaci',                 cluster: 'Ekonomi',  hollandCodes: ['C','E','I'] },
  { title: 'Girişimci',               slug: 'girisimci',               cluster: 'İşletme',  hollandCodes: ['E','I','A'] },
  { title: 'Pazarlama Uzmanı',        slug: 'pazarlama-uzmani',        cluster: 'İşletme',  hollandCodes: ['E','A','S'] },

  // Sanat / Tasarım / İletişim
  { title: 'Grafik Tasarımcı',       slug: 'grafik-tasarimci',        cluster: 'Tasarım',  hollandCodes: ['A','I','E'] },
  { title: 'İç Mimar',               slug: 'ic-mimar',                cluster: 'Tasarım',  hollandCodes: ['A','R','E'] },
  { title: 'Mimar',                   slug: 'mimar',                   cluster: 'Tasarım',  hollandCodes: ['A','R','I'] },
  { title: 'Gazeteci',               slug: 'gazeteci',                cluster: 'İletişim', hollandCodes: ['A','E','S'] },
  { title: 'Reklamcı / Kreatif Direktör', slug: 'reklamci',          cluster: 'İletişim', hollandCodes: ['A','E','I'] },
  { title: 'Çevirmen',               slug: 'cevirmen',                cluster: 'Dil',      hollandCodes: ['A','I','C'] },
  { title: 'Yazar',                   slug: 'yazar',                   cluster: 'Sanat',    hollandCodes: ['A','I','E'] },
  { title: 'Müzisyen',               slug: 'muzisyen',                cluster: 'Sanat',    hollandCodes: ['A','E','S'] },
  { title: 'Oyuncu',                  slug: 'oyuncu',                  cluster: 'Sanat',    hollandCodes: ['A','S','E'] },
  { title: 'Film Yönetmeni',         slug: 'film-yonetmeni',          cluster: 'Sanat',    hollandCodes: ['A','E','I'] },
  { title: 'Fotoğrafçı',             slug: 'fotografci',              cluster: 'Sanat',    hollandCodes: ['A','R','I'] },
  { title: 'Oyun Tasarımcısı',       slug: 'oyun-tasarimcisi',        cluster: 'Teknoloji',hollandCodes: ['A','I','R'] },

  // Diğer
  { title: 'Turizm Rehberi',         slug: 'turizm-rehberi',          cluster: 'Turizm',   hollandCodes: ['E','S','A'] },
  { title: 'Pilot',                   slug: 'pilot',                   cluster: 'Teknik',   hollandCodes: ['R','I','E'] },
  { title: 'Tarih Öğretmeni / Akademisyen', slug: 'akademisyen',      cluster: 'Akademi',  hollandCodes: ['I','S','A'] },
]
