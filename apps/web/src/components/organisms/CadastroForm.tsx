import { useState, useCallback } from 'react'
import { Button } from '@/components/atoms/Button'
import { Checkbox } from '@/components/atoms/Checkbox'
import { TextLink } from '@/components/atoms/TextLink'
import { ArrowForwardIcon } from '@/components/atoms/icons/ArrowForwardIcon'
import { LoginIcon } from '@/components/atoms/icons/LoginIcon'
import { FormField } from '@/components/molecules/FormField'
import { DividerWithText } from '@/components/molecules/DividerWithText'
import { SocialLoginGroup } from '@/components/organisms/SocialLoginGroup'
import { useNavigation } from '@/contexts/NavigationContext'

type CadastroData = {
  name: string
  email: string
  password: string
  remember: boolean
}

type CadastroFormProps = {
  onSubmit: (data: CadastroData) => void
}

type FormErrors = {
  name?: string
  email?: string
  password?: string
}

const EMAIL_REGEX = /^\S+@\S+\.\S+$/

export function CadastroForm({ onSubmit }: Readonly<CadastroFormProps>) {
  const { navigate } = useNavigation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = useCallback((): boolean => {
    const next: FormErrors = {}
    if (!name.trim()) next.name = 'Informe seu nome.'
    if (!EMAIL_REGEX.test(email)) next.email = 'E-mail inválido.'
    if (password.length < 6) next.password = 'Senha deve ter ao menos 6 caracteres.'
    setErrors(next)
    return Object.keys(next).length === 0
  }, [name, email, password])

  const handleSubmit = useCallback((e: { preventDefault(): void }) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({ name, email, password, remember })
    }
  }, [name, email, password, remember, onSubmit, validate])

  const handleGoToLogin = useCallback((e: { preventDefault(): void }) => {
    e.preventDefault()
    navigate('login')
  }, [navigate])

  return (
    <div>
      <h1 className="text-3xl font-semibold text-ink mb-2">Cadastro</h1>
      <p className="text-xl text-ink mb-6">Olá! Preencha seus dados.</p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          id="name"
          label="Nome"
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={setName}
          autoComplete="name"
          invalid={!!errors.name}
          errorMessage={errors.name}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          invalid={!!errors.email}
          errorMessage={errors.email}
        />
        <div className="space-y-2">
          <FormField
            id="password"
            label="Senha"
            type="password"
            placeholder="******"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            invalid={!!errors.password}
            errorMessage={errors.password}
          />
          <Checkbox
            id="remember"
            checked={remember}
            onChange={setRemember}
            label="Lembrar-me"
          />
        </div>
        <Button type="submit" variant="primary" fullWidth>
          Cadastrar <ArrowForwardIcon className="w-5 h-5" />
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        <DividerWithText>ou entre com outras contas</DividerWithText>
        <SocialLoginGroup />
        <p className="flex items-center gap-2 text-lg text-ink">
          Já tem conta?{' '}
          <TextLink
            href="#"
            onClick={handleGoToLogin}
            size="lg"
            className="inline-flex items-center gap-1.5"
          >
            Faça seu login! <LoginIcon className="w-5 h-5" />
          </TextLink>
        </p>
      </div>
    </div>
  )
}
