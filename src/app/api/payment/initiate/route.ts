import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { randomUUID } from 'crypto'
import { authOptions } from '@/lib/auth'
import { queryOne, execute } from '@/lib/db'
import { threedsInitialize, PRICE } from '@/lib/iyzico'
import Iyzipay from 'iyzipay'

type CardPayload = {
  cardHolderName: string
  cardNumber: string
  expireMonth: string
  expireYear: string
  cvc: string
  identityNumber?: string
}

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Oturum açılmamış' }, { status: 401 })
  }

  const user = await queryOne<{ paid_at: number | null; full_name: string; email: string }>(
    'SELECT paid_at, full_name, email FROM users WHERE id = ?',
    [session.user.id]
  )

  if (user?.paid_at) {
    return NextResponse.json({ error: 'Zaten ödeme yapılmış' }, { status: 409 })
  }

  const body = (await req.json()) as CardPayload

  const expireYear = body.expireYear.length === 2
    ? `20${body.expireYear}`
    : body.expireYear

  const conversationId = randomUUID()
  const basketId = `B-${session.user.id.slice(0, 8)}`
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  const nameParts = (user?.full_name ?? 'Kullanici').split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ') || 'Soyad'

  try {
    const result = await threedsInitialize({
      locale: Iyzipay.LOCALE.TR,
      conversationId,
      price: PRICE,
      paidPrice: PRICE,
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId,
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${baseUrl}/api/payment/callback`,
      paymentCard: {
        cardHolderName: body.cardHolderName,
        cardNumber: body.cardNumber.replace(/\s/g, ''),
        expireMonth: body.expireMonth,
        expireYear,
        cvc: body.cvc,
        registerCard: '0',
      },
      buyer: {
        id: session.user.id,
        name: firstName,
        surname: lastName,
        gsmNumber: '+905000000000',
        email: user?.email ?? session.user.email ?? 'ornek@mail.com',
        identityNumber: body.identityNumber ?? '11111111111',
        registrationAddress: 'Türkiye',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: user?.full_name ?? 'Kullanici',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Türkiye',
      },
      billingAddress: {
        contactName: user?.full_name ?? 'Kullanici',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Türkiye',
      },
      basketItems: [
        {
          id: 'HOLLAND-TEST',
          name: 'Holland Mesleki Tercih Envanteri & Kariyer Raporu',
          category1: 'Eğitim',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: PRICE,
        },
      ],
    })

    if (result.status !== 'success' || !result.htmlContent) {
      return NextResponse.json(
        { error: result.errorMessage ?? 'Ödeme başlatılamadı' },
        { status: 402 }
      )
    }

    const htmlContent = Buffer.from(result.htmlContent, 'base64').toString('utf-8')

    await execute(
      'INSERT INTO payments (id, user_id, provider, provider_payment_id, amount, status) VALUES (?, ?, ?, ?, ?, ?)',
      [randomUUID(), session.user.id, 'iyzico', conversationId, PRICE_KURUS, 'pending']
    )

    return NextResponse.json({ htmlContent })
  } catch {
    return NextResponse.json(
      { error: 'Ödeme servisi şu an kullanılamıyor' },
      { status: 503 }
    )
  }
}

const PRICE_KURUS = 29900
