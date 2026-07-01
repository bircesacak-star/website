'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    fullName: z.string().min(2, 'Ad en az 2 karakter olmalı'),
    email: z.string().email('Geçerli bir e-posta girin'),
    password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
    confirmPassword: z.string(),
    grade: z.string().refine((v) => ['9', '10', '11', '12'].includes(v), 'Sınıf seçiniz'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function KayitPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    setServerError(null)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        grade: parseInt(data.grade, 10),
      }),
    })

    const json = await res.json()

    if (!res.ok) {
      setServerError(json.error ?? 'Bir hata oluştu')
      return
    }

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setServerError('Kayıt başarılı ancak giriş yapılamadı. Lütfen giriş sayfasına gidin.')
      return
    }

    router.push('/odeme')
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Hesap Oluştur</CardTitle>
          <p className="text-sm text-muted-foreground">
            Teste başlamak için önce kayıt ol
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="fullName">Ad Soyad</Label>
              <Input id="fullName" placeholder="Ahmet Yılmaz" {...register('fullName')} />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" placeholder="ornek@mail.com" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="grade">Sınıf</Label>
              <select
                id="grade"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('grade')}
              >
                <option value="">Seç</option>
                {[9, 10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    {g}. Sınıf
                  </option>
                ))}
              </select>
              {errors.grade && (
                <p className="text-sm text-destructive">{errors.grade.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Şifre</Label>
              <Input id="password" type="password" placeholder="En az 8 karakter" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Kayıt yapılıyor…' : 'Kayıt Ol'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Zaten hesabın var mı?{' '}
              <a href="/giris" className="text-primary underline-offset-4 hover:underline">
                Giriş yap
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
