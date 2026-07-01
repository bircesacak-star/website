'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// ── Statik listeler ───────────────────────────────────────────────────────────

const COURSES = [
  'Matematik', 'Fizik', 'Kimya', 'Biyoloji',
  'Türk Dili ve Edebiyatı', 'Tarih', 'Coğrafya', 'Felsefe',
  'Psikoloji', 'Yabancı Dil', 'Bilgisayar / Teknoloji',
  'Sanat / Resim', 'Müzik', 'Beden Eğitimi', 'Din Kültürü',
]

const INTEREST_CATEGORIES = [
  {
    emoji: '📚', label: 'Akademik',
    items: ['Psikoloji', 'Biyoloji', 'Matematik', 'Tarih', 'Felsefe', 'Sosyoloji', 'Hukuk', 'Ekonomi', 'Fizik', 'Kimya'],
  },
  {
    emoji: '💻', label: 'Teknoloji',
    items: ['Yapay Zekâ', 'Yazılım / Kodlama', 'Oyun Geliştirme', 'Siber Güvenlik', 'Robotik', 'Veri Bilimi', 'Web Tasarımı'],
  },
  {
    emoji: '🎨', label: 'Sanat & Yaratıcılık',
    items: ['Resim / Çizim', 'Grafik Tasarım', 'Dijital Sanat', 'El Sanatları', 'Moda Tasarımı', 'Fotoğrafçılık', 'Videografi'],
  },
  {
    emoji: '🎵', label: 'Müzik',
    items: ['Enstrüman Çalmak', 'Şarkı Söylemek', 'Müzik Prodüksiyonu', 'Konser Dinlemek'],
  },
  {
    emoji: '🏃', label: 'Spor',
    items: ['Futbol', 'Basketbol', 'Yüzme', 'Koşu / Atletizm', 'Dövüş Sporları', 'Fitness', 'Doğa Sporları', 'Voleybol'],
  },
  {
    emoji: '📖', label: 'Kitaplar & Okuma',
    items: ['Roman / Edebiyat', 'Bilim Kurgu', 'Kişisel Gelişim', 'Tarih / Biyografi', 'Bilim & Teknoloji', 'Şiir'],
  },
  {
    emoji: '🎬', label: 'Film & Dizi & Belgesel',
    items: ['Aksiyon / Macera', 'Bilim Kurgu', 'Belgesel', 'Animasyon', 'Dram', 'Komedi'],
  },
  {
    emoji: '🎮', label: 'Oyunlar',
    items: ['Bilgisayar Oyunları', 'Mobil Oyunlar', 'Konsol Oyunları', 'Masa Oyunları', 'E-Spor'],
  },
  {
    emoji: '🌍', label: 'Seyahat & Kültür',
    items: ['Farklı Ülkeler Keşfetmek', 'Tarih & Kültür', 'Dil Öğrenimi', 'Yurt İçi Seyahat'],
  },
  {
    emoji: '🤝', label: 'Sosyal & Gönüllülük',
    items: ['Kulüp Aktiviteleri', 'Gönüllü Çalışmalar', 'Topluluk Projeleri', 'Öğrenci Konseyi'],
  },
  {
    emoji: '🍳', label: 'Yemek & Mutfak',
    items: ['Yemek Yapmak', 'Pastacılık / Fırıncılık', 'Farklı Mutfaklar Denemek'],
  },
  {
    emoji: '🌱', label: 'Doğa & Hayvanlar',
    items: ['Evcil Hayvanlar', 'Bitkiler / Bahçecilik', 'Çevre Koruma', 'Kampçılık / Doğa Yürüyüşü'],
  },
  {
    emoji: '💼', label: 'Kariyer & Girişimcilik',
    items: ['Startup Kurmak', 'İş Dünyası', 'Liderlik / Yöneticilik', 'Freelance Çalışma'],
  },
  {
    emoji: '💰', label: 'Finans & Yatırım',
    items: ['Borsa / Hisse Senedi', 'Kişisel Finans / Tasarruf', 'Kripto Para', 'Girişim Finansmanı'],
  },
]

const WORK_PREFERENCES = [
  { value: 'desk',     label: 'Masa Başı & Analiz',   desc: 'Veri, hesap, strateji, araştırma' },
  { value: 'field',    label: 'Sahada & Hareket',      desc: 'Seyahat, saha çalışması, fiziksel aktivite' },
  { value: 'creative', label: 'Yaratıcı & Üretim',    desc: 'Tasarım, yazarlık, sanat, icat' },
  { value: 'social',   label: 'İnsanlarla & Sosyal',  desc: 'Eğitim, danışmanlık, ekip çalışması' },
]

const HOLLAND_WORK_STYLE_OPTIONS = [
  { value: 'el', label: 'Ellerimi kullanarak (pratik, fiziksel)' },
  { value: 'beyin', label: 'Beynimle (fikirler, analiz, düşünme)' },
  { value: 'kalp', label: 'Kalbimle (duygular, empati, ilişkiler)' },
]

const HOLLAND_WORK_WITH_OPTIONS = [
  { value: 'nesneler', label: 'Nesnelerle (aletler, makineler, materyaller)' },
  { value: 'insanlar', label: 'İnsanlarla (takım, öğretme, danışmanlık)' },
  { value: 'fikirler', label: 'Fikirlerle (araştırma, yaratıcılık, soyut düşünce)' },
]

const HOLLAND_ACTIONS = ['KEŞFET', 'PAYLAŞ', 'YAP', 'DEVAM ET', 'İCAT ET', 'BAŞLA']

const HOLLAND_GOAL_OPTIONS = [
  'Dünyaya bir güzellik katmak',
  'Dünyaya doğruluk ve dürüstlük katmak',
  'Dünyaya sevgi, barış ve hoşgörü katmak',
  'Dünyaya daha etik davranışlar ve karakter katmak',
]

const HOLLAND_ENVIRONMENT_OPTIONS = [
  'Doğayı, sporu, araçları ya da makineleri seven insanlar',
  'Bilimsel, meraklı, araştırmayı veya analiz etmeyi seven insanlar',
  'Sanatçı, hayalperest ve yenilikçi insanlar',
  'İnsanlara yardım etmeyi, öğretmeyi veya onlara hizmet etmeyi seven insanlar',
  'Projeleri başlatmayı ve insanları etkilemeyi ya da ikna etmeyi seven insanlar',
  'Ayrıntılı işleri, ödev veya projeleri tamamlamayı seven, titiz, düzenli insanlar',
]

const SELF_CATEGORY_OPTIONS = [
  'Hiçbir seçim yapmamış (meslek konusunda hiç düşünmedim)',
  'Seçiminde kararsız (aklımda seçenekler var ama kararsızım)',
  'Seçiminde realistik olmayan (isteklerim ile gerçeklik örtüşmüyor olabilir)',
  'İlgileri ve yetenekleri arasında farklılık olan (ilgilerim yeteneklerimle örtüşmüyor)',
]

// ── Zod şeması ────────────────────────────────────────────────────────────────

const schema = z.object({
  gpa: z
    .string()
    .min(1, 'Not ortalaması gir')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 100, {
      message: 'Not 0–100 arasında olmalı',
    }),
  dept1: z.string().optional(),
  dept2: z.string().optional(),
  dept3: z.string().optional(),
  dept4: z.string().optional(),
  dept5: z.string().optional(),
  extraNotes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

// ── Bileşen ───────────────────────────────────────────────────────────────────

export function ProfilFormuClient() {
  const router = useRouter()

  // Dersler
  const [likedCourses, setLikedCourses] = useState<string[]>([])
  const [dislikedCourses, setDislikedCourses] = useState<string[]>([])
  const [customLiked, setCustomLiked] = useState('')
  const [customDisliked, setCustomDisliked] = useState('')

  // İlgi alanları
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [topInterests, setTopInterests] = useState<string[]>([])
  const [customInterest, setCustomInterest] = useState('')
  const [expandedCats, setExpandedCats] = useState<string[]>([])

  // Çalışma ortamı
  const [workPreferences, setWorkPreferences] = useState<string[]>([])

  // Holland öz değerlendirme soruları
  const [hollandWorkStyle, setHollandWorkStyle] = useState<string[]>([])
  const [hollandWorkWith, setHollandWorkWith] = useState<string[]>([])
  const [hollandActions, setHollandActions] = useState<string[]>([])
  const [hollandGoal, setHollandGoal] = useState<string[]>([])
  const [hollandEnvironment, setHollandEnvironment] = useState<string[]>([])
  const [selfCategory, setSelfCategory] = useState('')

  // Serbest metin
  const [freeTime, setFreeTime] = useState('')
  const [topicsHours, setTopicsHours] = useState('')
  const [recentLearning, setRecentLearning] = useState('')

  // Yetenekler
  const [talentDescription, setTalentDescription] = useState('')
  const [talentMeslek, setTalentMeslek] = useState('')
  const [talentBasari, setTalentBasari] = useState('')

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  // ── Yardımcı fonksiyonlar ─────────────────────────────────────────────────

  function toggleItem(item: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(item) ? list.filter((c) => c !== item) : [...list, item])
  }

  function addCustomCourse(type: 'liked' | 'disliked') {
    const val = type === 'liked' ? customLiked.trim() : customDisliked.trim()
    if (!val) return
    if (type === 'liked') {
      if (!likedCourses.includes(val)) setLikedCourses([...likedCourses, val])
      setCustomLiked('')
    } else {
      if (!dislikedCourses.includes(val)) setDislikedCourses([...dislikedCourses, val])
      setCustomDisliked('')
    }
  }

  function toggleInterest(item: string) {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item))
      setTopInterests(topInterests.filter((i) => i !== item))
    } else {
      setSelectedInterests([...selectedInterests, item])
    }
  }

  function toggleTopInterest(item: string) {
    if (topInterests.includes(item)) {
      setTopInterests(topInterests.filter((i) => i !== item))
    } else if (topInterests.length < 3) {
      setTopInterests([...topInterests, item])
    }
  }

  function addCustomInterest() {
    const val = customInterest.trim()
    if (!val || selectedInterests.includes(val)) return
    setSelectedInterests([...selectedInterests, val])
    setCustomInterest('')
  }

  function toggleMulti(item: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  function toggleCat(label: string) {
    setExpandedCats((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    )
  }

  // ── Gönderim ──────────────────────────────────────────────────────────────

  async function onSubmit(data: FormValues) {
    if (workPreferences.length === 0) {
      setServerError('En az bir çalışma ortamı tercihi seçmelisin')
      return
    }
    setServerError(null)

    const depts = [data.dept1, data.dept2, data.dept3, data.dept4, data.dept5]
      .map((d) => d?.trim())
      .filter((d): d is string => Boolean(d))

    const payload = {
      gpa: parseFloat(data.gpa),
      consideredDepartments: depts,
      likedCourses,
      dislikedCourses,
      interests: selectedInterests,
      topInterests,
      workPreferences,
      extraData: {
        hollandWorkStyle,
        hollandWorkWith,
        hollandActions,
        hollandGoal,
        hollandEnvironment,
        selfCategory,
        freeTime,
        topicsHours,
        recentLearning,
        talentDescription,
        talentMeslek,
        talentBasari,
      },
      extraNotes: data.extraNotes ?? '',
    }

    const res = await fetch('/api/profile/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const json = await res.json()

    if (!res.ok) {
      setServerError(json.error ?? 'Bir hata oluştu')
      return
    }

    router.push('/profil')
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-2xl px-4 pt-6 pb-16 space-y-10"
    >
      {/* ── Not Ortalaması ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeader title="Not Ortalaması" />
        <div className="space-y-1">
          <Label htmlFor="gpa">Genel not ortalaması (0–100)</Label>
          <Input
            id="gpa"
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="örn: 82.5"
            className="max-w-[160px]"
            {...register('gpa')}
          />
          {errors.gpa && <p className="text-sm text-destructive">{errors.gpa.message}</p>}
        </div>
      </section>

      {/* ── Düşündüğün Bölümler ────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeader
          title="Düşündüğün Bölümler"
          subtitle="Üniversitede okumayı düşündüğün bölümleri yaz — tamamı opsiyonel, en fazla 5"
        />
        <div className="space-y-2">
          {(['dept1', 'dept2', 'dept3', 'dept4', 'dept5'] as const).map((field, i) => (
            <div key={field} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
              <Input
                placeholder={i === 0 ? 'örn: Psikoloji' : i === 1 ? 'örn: Sosyoloji' : 'opsiyonel'}
                className="flex-1"
                {...register(field)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Sevdiğin Dersler ───────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeader title="Sevdiğin Dersler" subtitle="Seçmek zorunda değilsin" />
        <ChipGrid
          items={COURSES}
          selected={likedCourses}
          onToggle={(c) => toggleItem(c, likedCourses, setLikedCourses)}
          color="green"
        />
        <CustomAdd
          value={customLiked}
          onChange={setCustomLiked}
          onAdd={() => addCustomCourse('liked')}
          placeholder="Listede olmayan bir ders ekle…"
        />
        {likedCourses.filter((c) => !COURSES.includes(c)).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {likedCourses.filter((c) => !COURSES.includes(c)).map((c) => (
              <Chip key={c} label={c} active color="green" onClick={() => toggleItem(c, likedCourses, setLikedCourses)} />
            ))}
          </div>
        )}
      </section>

      {/* ── Sevmediğin Dersler ─────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeader title="Sevmediğin Dersler" subtitle="Seçmek zorunda değilsin" />
        <ChipGrid
          items={COURSES}
          selected={dislikedCourses}
          onToggle={(c) => toggleItem(c, dislikedCourses, setDislikedCourses)}
          color="red"
        />
        <CustomAdd
          value={customDisliked}
          onChange={setCustomDisliked}
          onAdd={() => addCustomCourse('disliked')}
          placeholder="Listede olmayan bir ders ekle…"
        />
        {dislikedCourses.filter((c) => !COURSES.includes(c)).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dislikedCourses.filter((c) => !COURSES.includes(c)).map((c) => (
              <Chip key={c} label={c} active color="red" onClick={() => toggleItem(c, dislikedCourses, setDislikedCourses)} />
            ))}
          </div>
        )}
      </section>

      {/* ── İlgi Alanları ──────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeader
          title="İlgi Alanların"
          subtitle={`5–10 ilgi alanı seçmeni öneririz · ${selectedInterests.length} seçildi`}
        />

        <div className="space-y-2">
          {INTEREST_CATEGORIES.map((cat) => {
            const catSelected = cat.items.filter((i) => selectedInterests.includes(i)).length
            const open = expandedCats.includes(cat.label)
            return (
              <div key={cat.label} className="rounded-lg border bg-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleCat(cat.label)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium">
                    {cat.emoji} {cat.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {catSelected > 0 && (
                      <span className="rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5">
                        {catSelected}
                      </span>
                    )}
                    <span className="text-muted-foreground text-xs">{open ? '▲' : '▼'}</span>
                  </div>
                </button>
                {open && (
                  <div className="px-4 pb-3 flex flex-wrap gap-2 border-t">
                    {cat.items.map((item) => (
                      <Chip
                        key={item}
                        label={item}
                        active={selectedInterests.includes(item)}
                        color="blue"
                        onClick={() => toggleInterest(item)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Diğer ilgi alanı */}
        <div className="rounded-lg border bg-card px-4 py-3 space-y-2">
          <p className="text-sm font-medium">🧩 Diğer İlgi Alanları</p>
          <CustomAdd
            value={customInterest}
            onChange={setCustomInterest}
            onAdd={addCustomInterest}
            placeholder="Kendi ilgi alanını yaz ve ekle…"
          />
        </div>

        {/* Top-3 sıralama */}
        {selectedInterests.length >= 2 && (
          <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
            <p className="text-sm font-semibold">En çok zaman ayırdığın 3 alanı seç</p>
            <p className="text-xs text-muted-foreground">
              Seçtiklerinden tıklayarak 1, 2, 3 sırasıyla işaretle
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((item) => {
                const rank = topInterests.indexOf(item)
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleTopInterest(item)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-sm transition-colors flex items-center gap-1.5',
                      rank >= 0
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-foreground hover:bg-muted'
                    )}
                  >
                    {rank >= 0 && (
                      <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-bold">
                        {rank + 1}
                      </span>
                    )}
                    {item}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* ── Holland Öz Değerlendirme ────────────────────────────────────────── */}
      <section className="space-y-5">
        <SectionHeader
          title="Kendinizi Tanıyın"
          subtitle="Aşağıdaki soruları içtenlikle yanıtlayın — birden fazla seçebilirsiniz"
        />

        <HollandQ
          label="Zamanını nasıl çalışarak geçirmekten hoşlanıyorsun?"
          options={HOLLAND_WORK_STYLE_OPTIONS.map((o) => o.label)}
          selected={hollandWorkStyle}
          onToggle={(v) => toggleMulti(v, hollandWorkStyle, setHollandWorkStyle)}
        />

        <HollandQ
          label="En çok neyle çalışmaktan hoşlanıyorsun?"
          options={HOLLAND_WORK_WITH_OPTIONS.map((o) => o.label)}
          selected={hollandWorkWith}
          onToggle={(v) => toggleMulti(v, hollandWorkWith, setHollandWorkWith)}
        />

        <HollandQ
          label="Seni harekete geçiren eylem fiiллeri (birden fazla seçebilirsin):"
          options={HOLLAND_ACTIONS}
          selected={hollandActions}
          onToggle={(v) => toggleMulti(v, hollandActions, setHollandActions)}
          grid
        />

        <HollandQ
          label="Bu dünyada en çok ulaşmak istediğin hedef nedir?"
          options={HOLLAND_GOAL_OPTIONS}
          selected={hollandGoal}
          onToggle={(v) => toggleMulti(v, hollandGoal, setHollandGoal)}
        />

        <HollandQ
          label="Ne tip insanlarla bir arada olmak istersin?"
          options={HOLLAND_ENVIRONMENT_OPTIONS}
          selected={hollandEnvironment}
          onToggle={(v) => toggleMulti(v, hollandEnvironment, setHollandEnvironment)}
        />

        {/* Kariyer seçim durumu */}
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <p className="text-sm font-medium">Kendinizi şu an hangi kategoride görüyorsunuz?</p>
          <div className="space-y-2">
            {SELF_CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelfCategory(selfCategory === opt ? '' : opt)}
                className={cn(
                  'w-full text-left rounded-md border px-3 py-2.5 text-sm transition-colors',
                  selfCategory === opt
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border bg-background hover:bg-muted text-muted-foreground'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Serbest metin soruları */}
        <div className="space-y-3">
          <TextQ
            label="Boş zamanlarının çoğunu nasıl geçiriyorsun?"
            placeholder="Boş zamanlarımı genellikle…"
            value={freeTime}
            onChange={setFreeTime}
          />
          <TextQ
            label="Hakkında saatlerce konuşabileceğin konular nelerdir?"
            placeholder="Bu konularda saatler geçer…"
            value={topicsHours}
            onChange={setTopicsHours}
          />
          <TextQ
            label="Son 6 ay içinde kendi isteğinle öğrenmeye başladığın bir konu oldu mu? Neydi?"
            placeholder="Evet / Hayır, ve konu…"
            value={recentLearning}
            onChange={setRecentLearning}
          />
        </div>
      </section>

      {/* ── Yetenekler ─────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionHeader
          title="Yeteneklerini Keşfet"
          subtitle="Akranlarına göre öne çıktığını düşündüğün yönleri düşün"
        />
        <TextQ
          label="Akranlarına göre neleri daha iyi yapabildiğini düşünüyorsun? Hangi yönlerden kapasitenin onlardan üstün olduğunu düşünüyorsun?"
          placeholder="Örn: Analitik düşünme, yaratıcı çizim, hızlı öğrenme…"
          value={talentDescription}
          onChange={setTalentDescription}
        />
        <TextQ
          label="Bu yetenekleri kullanmayı gerektiren birkaç meslek adı düşün. Bu mesleklerde bu yetenekleri kullanmak önemli mi?"
          placeholder="Örn: Mühendis, tasarımcı, araştırmacı… Evet çünkü…"
          value={talentMeslek}
          onChange={setTalentMeslek}
        />
        <TextQ
          label="Bu mesleklerden birini seçersen başarılı olup olamayacağını değerlendir."
          placeholder="Başarılı olabilirim / olamam çünkü…"
          value={talentBasari}
          onChange={setTalentBasari}
        />
      </section>

      {/* ── Çalışma Ortamı ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeader
          title="Çalışma Ortamı Tercihin"
          subtitle="Sana uyanları seç — birden fazla olabilir"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {WORK_PREFERENCES.map((opt) => {
            const active = workPreferences.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleMulti(opt.value, workPreferences, setWorkPreferences)}
                className={cn(
                  'rounded-lg border p-4 text-left transition-colors',
                  active
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:bg-muted'
                )}
              >
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
              </button>
            )
          })}
        </div>
        {serverError?.includes('çalışma') && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}
      </section>

      {/* ── Eklemek İstediklerin ───────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionHeader
          title="Eklemek İstediklerin"
          subtitle="Kendinden bahsetmek istediğin başka bir şey var mı? (opsiyonel)"
        />
        <textarea
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Örn: Sanat çizimi yapıyorum, müzikle ilgileniyorum…"
          {...register('extraNotes')}
        />
      </section>

      {serverError && !serverError.includes('çalışma') && (
        <p className="text-sm text-destructive">{serverError}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Kaydediliyor…' : 'Raporumu Oluştur →'}
      </Button>
    </form>
  )
}

// ── Alt Bileşenler ────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-0.5">
      <h2 className="font-semibold text-base">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function Chip({
  label,
  active,
  color,
  onClick,
}: {
  label: string
  active: boolean
  color: 'green' | 'red' | 'blue'
  onClick: () => void
}) {
  const activeClass = {
    green: 'border-green-600 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300',
    red:   'border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300',
    blue:  'border-primary bg-primary/10 text-primary',
  }[color]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-sm transition-colors',
        active ? activeClass : 'border-border bg-background text-foreground hover:bg-muted'
      )}
    >
      {label}
    </button>
  )
}

function ChipGrid({
  items,
  selected,
  onToggle,
  color,
}: {
  items: string[]
  selected: string[]
  onToggle: (item: string) => void
  color: 'green' | 'red' | 'blue'
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          active={selected.includes(item)}
          color={color}
          onClick={() => onToggle(item)}
        />
      ))}
    </div>
  )
}

function CustomAdd({
  value,
  onChange,
  onAdd,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  onAdd: () => void
  placeholder: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd() } }}
        placeholder={placeholder}
        className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        Ekle
      </Button>
    </div>
  )
}

function HollandQ({
  label,
  options,
  selected,
  onToggle,
  grid,
}: {
  label: string
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
  grid?: boolean
}) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <p className="text-sm font-medium leading-relaxed">{label}</p>
      <div className={cn('gap-2', grid ? 'flex flex-wrap' : 'space-y-2')}>
        {options.map((opt) => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={cn(
                'text-left transition-colors',
                grid
                  ? cn('rounded-full border px-3 py-1 text-sm', active ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background hover:bg-muted')
                  : cn('w-full rounded-md border px-3 py-2.5 text-sm flex items-center gap-2.5', active ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted text-muted-foreground')
              )}
            >
              {!grid && (
                <span className={cn(
                  'w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[10px]',
                  active ? 'bg-primary border-primary text-primary-foreground' : 'border-border'
                )}>
                  {active && '✓'}
                </span>
              )}
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TextQ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium leading-relaxed">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[72px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}
