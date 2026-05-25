import { useState, useCallback } from 'react'
import { Button } from '@/components/atoms/Button'
import { TextLink } from '@/components/atoms/TextLink'
import { ArrowForwardIcon } from '@/components/atoms/icons/ArrowForwardIcon'
import { AssignmentIcon } from '@/components/atoms/icons/AssignmentIcon'
import { FormField } from '@/components/molecules/FormField'
import { RememberMeRow } from '@/components/molecules/RememberMeRow'
import { DividerWithText } from '@/components/molecules/DividerWithText'
import { SocialLoginGroup } from '@/components/organisms/SocialLoginGroup'
import { useNavigation } from '@/contexts/NavigationContext'

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
  const { navigate } = useNavigation()
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

  const handleGoToCadastro = useCallback((e: { preventDefault(): void }) => {
    e.preventDefault()
    navigate('cadastro')
  }, [navigate])

  return (
    <div>
      <h1 className="text-3xl font-semibold text-ink mb-2">Login</h1>
      <p className="text-xl text-ink mb-6">Boas-vindas! Faça seu login.</p>

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
          Login <ArrowForwardIcon className="w-5 h-5" />
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        <DividerWithText>ou entre com outras contas</DividerWithText>
        <SocialLoginGroup />
        <div className="space-y-2">
          <p className="text-center text-sm text-ink">Ainda não tem conta?</p>
          <p className="text-center">
            <TextLink
              href="#"
              onClick={handleGoToCadastro}
              size="lg"
              className="inline-flex items-center gap-3"
            >
              Crie seu cadastro! <AssignmentIcon className="w-6 h-6" />
            </TextLink>
          </p>
        </div>
      </div>
    </div>
  )
}
