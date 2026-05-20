import { useState } from 'react'
import type { FormEvent } from 'react'
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

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit({ identifier, password, remember })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-1">Login</h1>
      <p className="text-sm text-ink-muted mb-6">Boas-vindas! Faça seu login.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="identifier"
          label="Email ou usuário"
          type="text"
          placeholder="usuario123"
          value={identifier}
          onChange={setIdentifier}
          autoComplete="username"
          required
        />
        <FormField
          id="password"
          label="Senha"
          type="password"
          placeholder="••••••"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />
        <RememberMeRow
          remember={remember}
          onRememberChange={setRemember}
          forgotHref="#"
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
          <TextLink href="#">Crie seu cadastro! 📋</TextLink>
        </p>
      </div>
    </div>
  )
}
