import { useCallback } from 'react'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { AuthBanner } from '@/components/organisms/AuthBanner'
import { LoginForm } from '@/components/organisms/LoginForm'

export default function LoginPage() {
  const handleLogin = useCallback((_data: { identifier: string; password: string; remember: boolean }) => {
    // TODO: integrate with authentication API
  }, [])

  return (
    <AuthLayout
      banner={
        <AuthBanner
          imageSrc="/IMG_Login.png"
          imageAlt="Ilustração CodeConnect — pessoa programando"
        />
      }
      form={<LoginForm onSubmit={handleLogin} />}
    />
  )
}
