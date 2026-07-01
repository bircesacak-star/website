import Iyzipay from 'iyzipay'

export const iyzico = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  uri: process.env.IYZICO_BASE_URL ?? 'https://sandbox-api.iyzipay.com',
})

type ThreedsInitResult = {
  status: 'success' | 'failure'
  htmlContent?: string
  paymentId?: string
  errorMessage?: string
  errorCode?: string
}

type ThreedsPayResult = {
  status: 'success' | 'failure'
  paymentId?: string
  price?: string
  paidPrice?: string
  currency?: string
  errorMessage?: string
  errorCode?: string
}

export function threedsInitialize(request: Record<string, unknown>): Promise<ThreedsInitResult> {
  return new Promise((resolve, reject) => {
    iyzico.threedsInitialize.create(request, (err: unknown, result: ThreedsInitResult) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

export function threedsPayment(request: Record<string, unknown>): Promise<ThreedsPayResult> {
  return new Promise((resolve, reject) => {
    iyzico.threedsPayment.create(request, (err: unknown, result: ThreedsPayResult) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

export const PRICE = '299.00'
export const PRICE_KURUS = 29900
