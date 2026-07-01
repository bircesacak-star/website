import { HOLLAND_QUESTIONS, type HollandDimension } from '@/lib/holland-questions'
import type { HollandScores } from '@/types'

export function scoreHolland(answers: Record<number, 1 | 2 | 3>): {
  scores: HollandScores
  hollandCode: string
} {
  const scores: HollandScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

  for (const q of HOLLAND_QUESTIONS) {
    scores[q.dimension] += answers[q.id] ?? 2
  }

  const hollandCode = (Object.entries(scores) as [HollandDimension, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([dim]) => dim)
    .join('')

  return { scores, hollandCode }
}
