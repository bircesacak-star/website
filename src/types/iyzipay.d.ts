// Ambient module declaration — bu dosyada top-level export yok
declare module 'iyzipay' {
  interface IyzipayConfig {
    apiKey: string
    secretKey: string
    uri: string
  }

  interface IyzipayResult {
    status: 'success' | 'failure'
    locale?: string
    systemTime?: number
    conversationId?: string
    errorCode?: string
    errorMessage?: string
    errorGroup?: string
  }

  interface ThreedsInitializeResult extends IyzipayResult {
    htmlContent?: string
    paymentId?: string
  }

  interface ThreedsPaymentResult extends IyzipayResult {
    paymentId?: string
    price?: string
    paidPrice?: string
    currency?: string
    basketId?: string
    binNumber?: string
    lastFourDigits?: string
    transactionId?: string
  }

  interface Resource<TResult> {
    create(
      request: Record<string, unknown>,
      callback: (err: unknown, result: TResult) => void
    ): void
  }

  class Iyzipay {
    constructor(config: IyzipayConfig)
    threedsInitialize: Resource<ThreedsInitializeResult>
    threedsPayment: Resource<ThreedsPaymentResult>
    static LOCALE: { readonly TR: 'tr'; readonly EN: 'en' }
    static CURRENCY: { readonly TRY: 'TRY'; readonly USD: 'USD'; readonly EUR: 'EUR'; readonly GBP: 'GBP' }
    static PAYMENT_CHANNEL: { readonly WEB: 'WEB'; readonly MOBILE: 'MOBILE'; readonly MOBILE_WEB: 'MOBILE_WEB' }
    static PAYMENT_GROUP: { readonly PRODUCT: 'PRODUCT'; readonly LISTING: 'LISTING'; readonly SUBSCRIPTION: 'SUBSCRIPTION' }
    static BASKET_ITEM_TYPE: { readonly PHYSICAL: 'PHYSICAL'; readonly VIRTUAL: 'VIRTUAL' }
  }

  export = Iyzipay
}
