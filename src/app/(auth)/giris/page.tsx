'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z.string().min(1, 'Şifre gerekli'),
})

type FormValues = z.infer<typeof schema>

function GirisForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/odeme'
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    setServerError(null)

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setServerError('E-posta veya şifre hatalı')
      return
    }

    router.push(callbackUrl)
  }

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Giriş Yap</CardTitle>
        <p className="text-sm text-muted-foreground">
          Hesabına giriş yap ve teste devam et
        </p>
      </CardHeader>
      <CardContent>
        {searchParams.get('error') === 'SessionRequired' && (
          <p className="mb-4 rounded-md bg-muted p-3 text-sm">
            Bu sayfaya erişmek için önce giriş yapman gerekiyor.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" placeholder="ornek@mail.com" {...register('email')} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Şifre</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Giriş yapılıyor…' : 'Giriş Yap'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Hesabın yok mu?{' '}
            <a href="/kayit" className="text-primary underline-offset-4 hover:underline">
              Kayıt ol
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

export default function GirisPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="w-full max-w-md h-64 rounded-lg bg-muted animate-pulse" />}>
        <GirisForm />
      </Suspense>
    </div>
  )
}
