import type { SuitableCareer } from '@/types'
import Link from 'next/link'

export function CareerCard({ career }: { career: SuitableCareer }) {
  const slug = career.title
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm space-y-2">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold">{career.title}</p>
        <span className="text-xs font-medium text-primary shrink-0">
          %{career.matchScore} uyum
        </span>
      </div>

      {/* Uyum çubuğu */}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${career.matchScore}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">{career.reason}</p>

      <Link
        href={`/kutuphane/${slug}`}
        className="text-xs text-primary hover:underline underline-offset-2"
      >
        Kütüphanede İncele →
      </Link>
    </div>
  )
}
