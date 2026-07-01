import { requireStep } from '@/lib/access'
import { TestWizard } from './test-wizard'
import { QUESTIONS_SORTED } from '@/lib/holland-questions'
import { FlowProgress } from '@/components/layout/flow-progress'

export default async function TestPage() {
  await requireStep('consent')

  return (
    <>
      <FlowProgress step={3} />
      <TestWizard questions={QUESTIONS_SORTED} />
    </>
  )
}
