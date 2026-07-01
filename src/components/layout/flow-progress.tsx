'use client'

import { cn } from '@/lib/utils'

const STEPS = [
  { label: 'Ödeme' },
  { label: 'KVKK' },
  { label: 'Test' },
  { label: 'Profil' },
  { label: 'Rapor' },
]

export function FlowProgress({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="border-b bg-background">
      <div className="mx-auto max-w-2xl px-4 py-2">
        <ol className="flex items-center gap-0">
          {STEPS.map((s, i) => {
            const num = i + 1
            const done = num < step
            const active = num === step

            return (
              <li key={s.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      done && 'bg-primary text-primary-foreground',
                      active && 'bg-primary text-primary-foreground ring-2 ring-primary/30',
                      !done && !active && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {done ? '✓' : num}
                  </span>
                  <span
                    className={cn(
                      'text-xs hidden sm:block',
                      active ? 'font-semibold text-foreground' : done ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn('flex-1 h-px mx-2', done ? 'bg-primary' : 'bg-border')} />
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
