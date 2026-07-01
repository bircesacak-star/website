'use client'

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import type { SuitableCareer } from '@/types'
import { DIMENSION_COLORS, type HollandDimension } from '@/lib/holland-questions'
import { CareerCard } from './career-card'
import { HollandTablo1, HollandTablo2 } from '@/components/holland/tablolar'

type Section = {
  title: string
  content: string
  subsections?: { title: string; content: string }[]
}

function parseMarkdownSections(markdown: string): Section[] {
  const sections: Section[] = []
  const parts = ('\n' + markdown).split('\n### ')

  for (const part of parts.slice(1)) {
    const firstNewline = part.indexOf('\n')
    const title = firstNewline === -1 ? part.trim() : part.slice(0, firstNewline).trim()
    const rest = firstNewline === -1 ? '' : part.slice(firstNewline + 1).trim()

    const subParts = ('\n' + rest).split('\n#### ')

    if (subParts.length > 1) {
      const subsections = subParts.slice(1).map((sub) => {
        const firstNL = sub.indexOf('\n')
        return {
          title: firstNL === -1 ? sub.trim() : sub.slice(0, firstNL).trim(),
          content: firstNL === -1 ? '' : sub.slice(firstNL + 1).trim(),
        }
      })
      sections.push({ title, content: subParts[0].trim(), subsections })
    } else {
      sections.push({ title, content: rest })
    }
  }

  return sections
}

function Md({ children }: { children: string }) {
  return (
    <div className="prose prose-sm max-w-none text-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:mb-3 [&>ul>li]:mb-1.5 [&_strong]:font-semibold">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  )
}

type Props = {
  personalitySummary: string
  suitableCareers: SuitableCareer[]
  fullReport: string
  hollandCode: string
}

export function RaporDisplay({ suitableCareers, fullReport, hollandCode }: Props) {
  const sections = useMemo(() => parseMarkdownSections(fullReport), [fullReport])
  const dominant = hollandCode[0] as HollandDimension
  const accentColor = DIMENSION_COLORS[dominant] ?? '#6366f1'

  const find = (matcher: (t: string) => boolean) =>
    sections.find((s) => matcher(s.title))

  const personalitySection = find((t) => t.startsWith('Dominant Kişilik') || t.startsWith('Baskın Kişilik'))
  const codeSection = find((t) => t.startsWith('Holland Kodum') || t.startsWith('Holland Kodun'))
  const clustersSection = find((t) => t.startsWith('Kariyer Kümeleri'))
  const universitiesSection = find((t) => t.startsWith('Üniversite'))
  const strengthsSection = find((t) => t.startsWith('Güçlü Yönlerin'))
  const adviceSection = find((t) => t.startsWith('Kariyer Yolculuğun'))

  if (sections.length === 0) {
    return (
      <div className="space-y-6">
        <CareersSection careers={suitableCareers} />
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <Md>{fullReport}</Md>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Baskın kişilik tipi — renkli banner */}
      {personalitySection && (
        <section
          className="rounded-xl overflow-hidden border-2 shadow-sm"
          style={{ borderColor: accentColor + '60' }}
        >
          <div
            className="px-5 py-3 flex items-center gap-3"
            style={{ backgroundColor: accentColor + '18' }}
          >
            <span
              className="w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              {dominant}
            </span>
            <h2 className="font-semibold text-sm">{personalitySection.title}</h2>
          </div>
          <div className="p-5 bg-card">
            <Md>{personalitySection.content}</Md>
          </div>
        </section>
      )}

      {/* Holland kodu & ikili kombinasyon */}
      {codeSection && (
        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl font-bold tracking-widest" style={{ color: accentColor }}>
              {hollandCode}
            </span>
            <h2 className="font-semibold text-sm">{codeSection.title}</h2>
          </div>
          <Md>{codeSection.content}</Md>
        </section>
      )}

      {/* Kariyer kümeleri */}
      {clustersSection && (clustersSection.subsections?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-sm">Kariyer Kümeleri</h2>
          {clustersSection.subsections!.map((sub, i) => (
            <div key={sub.title} className="rounded-lg border bg-card overflow-hidden shadow-sm">
              <div
                className="px-4 py-2.5 flex items-center gap-3"
                style={{ backgroundColor: accentColor + '12' }}
              >
                <span
                  className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                  style={{ backgroundColor: accentColor }}
                >
                  {i + 1}
                </span>
                <h3 className="font-semibold text-sm">{sub.title}</h3>
              </div>
              <div className="p-4">
                <Md>{sub.content}</Md>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Meslek kartları */}
      <CareersSection careers={suitableCareers} />

      {/* Üniversite bölüm önerileri */}
      {universitiesSection && (
        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span>🎓</span>
            <h2 className="font-semibold text-sm">{universitiesSection.title}</h2>
          </div>
          <Md>{universitiesSection.content}</Md>
        </section>
      )}

      {/* Güçlü yönler */}
      {strengthsSection && (
        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span>⭐</span>
            <h2 className="font-semibold text-sm">{strengthsSection.title}</h2>
          </div>
          <Md>{strengthsSection.content}</Md>
        </section>
      )}

      {/* Kariyer önerileri */}
      {adviceSection && (
        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span>🗺️</span>
            <h2 className="font-semibold text-sm">{adviceSection.title}</h2>
          </div>
          <Md>{adviceSection.content}</Md>
        </section>
      )}

      {/* Tablo 1 ve Tablo 2 */}
      <HollandTablo1 />
      <HollandTablo2 />

      {/* O*NET kaynaklar */}
      <section className="rounded-lg border bg-muted/40 p-5">
        <h2 className="font-semibold text-sm mb-2">📚 Holland Kodunu Daha Fazla Keşfet</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">O*NET Online</strong> ve{' '}
          <strong className="text-foreground">My Next Move</strong> sitelerinde{' '}
          <span className="font-semibold" style={{ color: accentColor }}>{hollandCode}</span>{' '}
          kodunu aratarak dünya genelinde bu profile uyan yüzlerce mesleği keşfedebilirsin.
        </p>
      </section>
    </div>
  )
}

function CareersSection({ careers }: { careers: SuitableCareer[] }) {
  return (
    <section className="space-y-3">
      <h2 className="font-semibold text-sm">Sana Uygun Meslekler</h2>
      <div className="space-y-3">
        {careers.map((career) => (
          <CareerCard key={career.title} career={career} />
        ))}
      </div>
    </section>
  )
}
