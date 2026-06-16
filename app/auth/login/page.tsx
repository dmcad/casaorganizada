'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthShell } from '@/components/auth/AuthShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Introduza um email válido.'),
  password: z.string().min(6, 'A palavra-passe deve ter pelo menos 6 caracteres.'),
})
type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    const supabase = createClient()
    if (!supabase) {
      // Demo mode — no Supabase configured.
      router.push('/dashboard')
      return
    }
    const { error } = await supabase.auth.signInWithPassword(values)
    if (error) {
      setServerError('Email ou palavra-passe incorretos.')
      return
    }
    router.push('/dashboard')
  }

  return (
    <AuthShell
      title="Bem-vindo de volta"
      subtitle="Entre para gerir a vida da sua casa."
      footer={
        <>
          Ainda não tem conta?{' '}
          <Link href="/auth/register" className="font-medium text-brand-600 hover:underline">
            Criar conta grátis
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && <Alert variant="danger">{serverError}</Alert>}
        <Input label="Email" type="email" placeholder="o.seu@email.pt" {...register('email')} error={errors.email?.message} />
        <Input label="Palavra-passe" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'A entrar…' : 'Entrar'}
        </Button>
      </form>
    </AuthShell>
  )
}
