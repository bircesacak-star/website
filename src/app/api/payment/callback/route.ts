import { NextResponse } from 'next/server'
import { queryOne, execute } from '@/lib/db'
import { threedsPayment } from '@/lib/iyzico'
import Iyzipay from 'iyzipay'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const formData = await req.formData()
  const paymentId = formData.get('paymentId')?.toString()
  const conversationData = formData.get('conversationData')?.toString()
  const mdStatus = formData.get('mdStatus')?.toString()

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  if (!paymentId || mdStatus !== '1') {
    return NextResponse.redirect(`${baseUrl}/odeme?error=3ds`, { status: 302 })
  }

  try {
    const result = await threedsPayment({
      locale: Iyzipay.LOCALE.TR,
      conversationId: conversationData ?? paymentId,
      paymentId,
      conversationData: conversationData ?? '',
    })

    if (result.status !== 'success') {
      return NextResponse.redirect(
        `${baseUrl}/odeme?error=${encodeURIComponent(result.errorMessage ?? 'Ödeme başarısız')}`,
        { status: 302 }
      )
    }

    const payment = await queryOne<{ user_id: string }>(
      'SELECT user_id FROM payments WHERE provider = ? AND status = ?',
      ['iyzico', 'pending']
    )

    if (payment) {
      const now = Math.floor(Date.now() / 1000)
      await execute(
        'UPDATE payments SET status = ?, provider_payment_id = ? WHERE user_id = ? AND status = ?',
        ['success', paymentId, payment.user_id, 'pending']
      )
      await execute('UPDATE users SET paid_at = ? WHERE id = ?', [now, payment.user_id])
    }

    return NextResponse.redirect(`${baseUrl}/odeme/basarili`, { status: 302 })
  } catch {
    return NextResponse.redirect(`${baseUrl}/odeme?error=sunucu`, { status: 302 })
  }
}
