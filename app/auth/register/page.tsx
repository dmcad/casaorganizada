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
  familyName: z.string().min(2, 'Indique o nome da família.'),
  email: z.string().email('Introduza um email válido.'),
  password: z.string().min(6, 'A palavra-passe deve ter pelo menos 6 caracteres.'),
})
type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
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
      router.push('/dashboard/onboarding')
      return
    }
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { family_name: values.familyName } },
    })
    if (error) {
      setServerError('Não foi possível criar a conta. Tente novamente.')
      return
    }
    router.push('/dashboard/onboarding')
  }

  return (
    <AuthShell
      title="Criar conta grátis"
      subtitle="Sem cartão de crédito. Comece em menos de um minuto."
      footer={
        <>
          Já tem conta?{' '}
          <Link href="/auth/login" className="font-medium text-brand-600 hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && <Alert variant="danger">{serverError}</Alert>}
        <Input label="Nome da família" placeholder="Família Silva" {...register('familyName')} error={errors.familyName?.message} />
        <Input label="Email" type="email" placeholder="o.seu@email.pt" {...register('email')} error={errors.email?.message} />
        <Input label="Palavra-passe" type="password" placeholder="Mínimo 6 caracteres" {...register('password')} error={errors.password?.message} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'A criar conta…' : 'Criar conta grátis'}
        </Button>
        <p className="text-center text-xs text-slate-400">
          Ao criar conta concorda com os Termos e a Política de Privacidade.
        </p>
      </form>
    </AuthShell>
  )
}
