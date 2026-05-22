import { useState, useCallback } from 'react'
import { Button } from '@/components/atoms/Button'
import { TextLink } from '@/components/atoms/TextLink'
import { FormField } from '@/components/molecules/FormField'
import { RememberMeRow } from '@/components/molecules/RememberMeRow'
import { DividerWithText } from '@/components/molecules/DividerWithText'
import { SocialLoginGroup } from '@/components/organisms/SocialLoginGroup'

type LoginData = {
  identifier: string
  password: string
  remember: boolean
}

type LoginFormProps = {
  onSubmit: (data: LoginData) => void
}

type FormErrors = {
  identifier?: string
  password?: string
}

export function LoginForm({ onSubmit }: Readonly<LoginFormProps>) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = useCallback((): boolean => {
    const next: FormErrors = {}
    if (!identifier.trim()) next.identifier = 'Informe seu email ou usuário.'
    if (password.length < 6) next.password = 'Senha deve ter ao menos 6 caracteres.'
    setErrors(next)
    return Object.keys(next).length === 0
  }, [identifier, password])

  const handleSubmit = useCallback((e: { preventDefault(): void }) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({ identifier, password, remember })
    }
  }, [identifier, password, remember, onSubmit, validate])

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-1">Login</h1>
      <p className="text-sm text-ink-muted mb-6">Boas-vindas! Faça seu login.</p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          id="identifier"
          label="Email ou usuário"
          type="text"
          placeholder="usuario123"
          value={identifier}
          onChange={setIdentifier}
          autoComplete="username"
          invalid={!!errors.identifier}
          errorMessage={errors.identifier}
        />
        <FormField
          id="password"
          label="Senha"
          type="password"
          placeholder="••••••"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          invalid={!!errors.password}
          errorMessage={errors.password}
        />
        <RememberMeRow
          remember={remember}
          onRememberChange={setRemember}
          forgotHref="/esqueci-senha"
        />
        <Button type="submit" variant="primary" fullWidth>
          Login →
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        <DividerWithText>ou entre com outras contas</DividerWithText>
        <SocialLoginGroup />
        <p className="text-center text-sm text-ink-muted">
          Ainda não tem conta?{' '}
          <TextLink href="/cadastro">
            Crie seu cadastro! <span aria-hidden="true">📋</span>
          </TextLink>
        </p>
      </div>
    </div>
  )
}
