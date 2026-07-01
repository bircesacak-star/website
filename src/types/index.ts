import type { HollandDimension } from '@/lib/holland-questions'

export type { HollandDimension }

export type HollandScores = Record<HollandDimension, number>

export type User = {
  id: string
  email: string
  fullName: string
  grade: number | null
  consentGiven: boolean
  consentDate: number | null
  paidAt: number | null
  createdAt: number
}

export type HollandResult = {
  id: string
  userId: string
  answers: Record<number, 1 | 2 | 3>
  scores: HollandScores
  hollandCode: string
  createdAt: number
}

export type StudentProfile = {
  id: string
  userId: string
  gpa: number | null
  consideredDepartments: string[]
  likedCourses: string[]
  dislikedCourses: string[]
  interests: string[]
  workPreference: 'desk' | 'field' | 'creative' | 'social' | null
  extraNotes: string | null
  updatedAt: number
}

export type SuitableCareer = {
  title: string
  reason: string
  matchScore: number
}

export type Report = {
  id: string
  userId: string
  personalitySummary: string
  suitableCareers: SuitableCareer[]
  fullReport: string
  generatedAt: number
}

export type Career = {
  id: string
  slug: string
  title: string
  hollandCodes: HollandDimension[]
  cluster: string
  dailyLife: string
  universityCourses: string[]
  jobOpportunities: string
  avgSalaryRange: string | null
  createdAt: number
}

export type GpaCategory = 'orta' | 'iyi' | 'çok iyi' | 'mükemmel'

export function toGpaCategory(gpa: number): GpaCategory {
  if (gpa < 60) return 'orta'
  if (gpa < 75) return 'iyi'
  if (gpa < 90) return 'çok iyi'
  return 'mükemmel'
}
