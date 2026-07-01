# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Bu projenin amacı

Lise öğrencilerine Holland Mesleki Tercih Envanteri (3'lü Likert) uygulatıp kişilik analizi ve üniversite bölüm/meslek önerisi sunan, tek seferlik ücretli kayıt sistemi olan bir web platformu. Anthropic Claude API raporları üretir; tüm veriler admin tarafından görüntülenebilir şekilde saklanır.

---

## Stack

- **Framework:** Next.js 14+ (App Router)
- **Dil:** TypeScript strict mode
- **Veritabanı:** SQLite + `better-sqlite3` (dev) → Turso / `@libsql/client` (prod)
- **Auth:** NextAuth.js (credentials provider — email + şifre)
- **AI:** Anthropic Claude API (`claude-sonnet-4-6`), streaming
- **UI:** Shadcn/ui + Tailwind CSS
- **Grafik:** Recharts (Holland sonuç grafiği)
- **Form:** react-hook-form + zod
- **Ödeme:** Iyzico veya Stripe (karar verilecek)

---

## Kod kuralları

- TypeScript strict mode, `any` yasak
- Functional component, class component asla
- Server component default; yalnızca gerektiğinde `"use client"`
- `async/await`, `Promise.then()` yok
- ESM imports, `require()` yok
- Değişken ve fonksiyon adları İngilizce; kullanıcıya gösterilen tüm metin Türkçe
- API route handler'ları ince tut — iş mantığı `src/lib/` içinde

---

## Dosya organizasyonu

```
src/
  app/
    (auth)/              # kayit, giris sayfaları
    (protected)/         # ödeme + onam sonrası erişilebilir sayfalar
    admin/               # öğrenci listesi + meslek CRUD
    api/                 # API route'ları
    kutuphane/           # meslek kütüphanesi + [slug] detay
    page.tsx             # landing
  components/
    ui/                  # shadcn bileşenleri
    holland/             # test wizard, sonuç grafiği
    profile/             # profil formu, rapor kartları
    careers/             # meslek liste ve detay bileşenleri
    admin/               # admin paneli bileşenleri
  lib/
    db.ts                # SQLite/Turso bağlantı singleton
    schema.sql           # tablo tanımları
    anthropic.ts         # Anthropic client
    scoring.ts           # Holland puanlama motoru
    holland-questions.ts # soru listesi + boyut eşleştirmesi
    prompts/
      profile-analysis.ts  # Claude sistem promptu (template fonksiyon)
  types/
    index.ts             # paylaşılan TypeScript tipleri
```

---

## Veritabanı

- Tüm sorgular `better-sqlite3` (dev) veya `@libsql/client` (prod) ile — raw SQL doğrudan sorgularda, ORM yok
- Migration'lar `lib/schema.sql` içinde `CREATE TABLE IF NOT EXISTS` olarak tutulur
- `DATABASE_URL` env var ile yol yapılandırılır
- Tablolar: `users`, `holland_results`, `student_profiles`, `reports`, `careers`, `payments`
- Kullanıcılar yalnızca kendi `user_id`'lerine ait satırlara erişebilir — route handler'da kontrol edilir

---

## Anthropic / AI

- Model: `claude-sonnet-4-6`
- Rapor üretimi her zaman streaming — `anthropic.messages.stream()` kullan, `ReadableStream` döndür
- Prompt'lar `src/lib/prompts/*.ts` içinde typed template fonksiyon olarak — route handler'a inline yazma
- Claude'a ham sayısal not gönderme; kategori olarak gönder (`"orta"`, `"iyi"`, `"çok iyi"`)
- Kullanıcı verisi (test cevapları, notlar) loglara veya hata mesajlarına asla yazılmaz

---

## Holland Envanteri

- 3'lü Likert: **Hoşlanırım = 3**, **Farketmez = 2**, **Hoşlanmam = 1**
- 6 boyut: R · I · A · S · E · C; her boyut için eşit sayıda soru
- Puanlama: her cevap değeri ilgili boyutun toplamına eklenir
- Holland Kodu: en yüksek toplam puana sahip 3 boyutun harfleri sırayla (örn: `"ISA"`)
- Sonuç grafiği: Recharts `BarChart`, 6 sütun, her boyut farklı renk, Türkçe etiket

---

## Kimlik doğrulama ve erişim akışı

Middleware aşağıdaki sırayı zorlar:

```
Kayıt / Giriş → Ödeme → KVKK Onamı → Test → Sonuç → Profil Formu → Profil
```

Her adım tamamlanmadan bir sonrakine geçilemez. Kontrol `users` tablosundaki alan değerlerine göre yapılır (`paid_at`, `consent_given`, `holland_results` kaydı varlığı vb.).

---

## Stiller

- Yalnızca Tailwind sınıfları, inline style yok
- Renkler: `bg-primary`, `text-foreground` (CSS variables, hardcoded hex yok)
- Spacing: `p-4`, `p-6`, `p-8` — tutarlı
- Typography: `text-sm`, `text-base`, `text-lg`
- Shadow: `shadow-sm`, `shadow-md`

---

## Form ve validasyon

- react-hook-form + zod şeması her form için
- Server Action varsa API route yazmadan önce Server Action dene
- Hata mesajları Türkçe

---

## Her değişiklikten sonra

1. `npm run lint` — 0 error
2. `npx tsc --noEmit` — 0 error
3. Değişikliği kısa Türkçe özetle

---

## Git

- Commit mesajı Türkçe, kısa: `"holland puanlama eklendi"`, `"fix onam yönlendirme"`
- `main` korumalı, `feature/` branch'te çalış
- PR öncesi lint + typecheck geçmeli

---

## Anti-patterns

- `console.log` commit etme
- TODO yorumu bırakma — ya yap ya issue aç
- Hard-coded API key — her zaman `.env.local`
- Kullanıcı verisini (GPA, test cevabı) hata mesajına veya log'a yazma
- Prompt metnini route handler içine inline yazma
- Yorum satırı olarak eski kodu bırakma

---

## Vercel Deployment

### Ortam değişkenleri (Vercel Dashboard → Settings → Environment Variables)

```
ANTHROPIC_API_KEY=...
NEXTAUTH_SECRET=...                      # openssl rand -base64 32
NEXTAUTH_URL=https://your-app.vercel.app
IYZICO_API_KEY=32fcf3d7-0fd1-4e31-8f6d-84fa0c9df0a0
IYZICO_SECRET_KEY=1ee70f18217c4149b0e9e073b1c6f67b
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com  # prod'da canlı URL
ADMIN_EMAIL=bircesacak@gmail.com
DATABASE_URL=libsql://your-db.turso.io   # Turso prod DB URL
TURSO_AUTH_TOKEN=...                     # Turso auth token
```

### Veritabanı (SQLite → Turso geçişi)

`better-sqlite3` Vercel serverless'ta çalışmaz (kalıcı dosya sistemi yok).
Turso (SQLite uyumlu cloud DB) kullan:

1. `npm install @libsql/client`
2. `src/lib/db.ts` dosyasını async Turso client'a geç:
   - `DATABASE_URL` → `libsql://...` formatındaysa `@libsql/client` kullan
   - Tüm DB çağrıları sync → async olacak (route handler'lar zaten async)
3. Turso CLI: `turso db create meslek-rehberi && turso db tokens create meslek-rehberi`

### Görseller / Next.js Image

- `/public` klasöründeki statik görseller Vercel CDN'den otomatik servis edilir
- `next/image` bileşeni Vercel'de yerleşik optimizasyon ile çalışır (AVIF + WebP)
- `next.config.ts`'de `serverExternalPackages: ['better-sqlite3', 'iyzipay']` zaten ayarlı
- Dış kaynaklı görseller için `next.config.ts` içindeki `remotePatterns` bloğunu aç

### Iyzico (Production)

- Sandbox: `https://sandbox-api.iyzipay.com`
- Canlı: `https://api.iyzipay.com` → `IYZICO_BASE_URL` değişkenini güncelle
- 3DS callback URL: `https://your-app.vercel.app/api/payment/callback`
- Lokal test için ngrok gerekli (banka localhost'a POST yapamaz)

### Görsel tasarım — UI / Frontend Design skill kuralları

`creative-design/frontend-design` ve `creative-design/ui-ux-pro-max` skill'leri yüklü.
Yeni sayfa/bileşen oluştururken:
- Shadcn/ui bileşenleri + Tailwind sınıfları kullan; inline style yok
- `bg-primary`, `text-foreground` gibi CSS variable renkleri kullan; hardcoded hex yok
- Responsive: mobil önce (`sm:`, `md:`) — Türk lise öğrencileri çoğunlukla mobil kullanır
- Spacing: `p-4 → p-6 → p-8` skalası; tutarlı `gap-4`/`gap-6`
- Tipografi: `text-sm` body, `text-base` önemli metin, `text-lg` başlık
- Kart container: `rounded-lg border bg-card p-5 shadow-sm` standardı
- Form input: `rounded-md border border-input bg-background px-3 py-2 text-sm`
