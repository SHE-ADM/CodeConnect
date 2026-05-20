import { AuthLayout } from '@/components/templates/AuthLayout'
import { AuthBanner } from '@/components/organisms/AuthBanner'
import { LoginForm } from '@/components/organisms/LoginForm'

export default function LoginPage() {
  function handleLogin(data: { identifier: string; password: string; remember: boolean }) {
    console.log('login submit', data)
  }

  return (
    <AuthLayout
      banner={
        <AuthBanner
          imageSrc="/IMG2_Tablet.png"
          imageAlt="Ilustração CodeConnect — pessoa programando"
        />
      }
      form={<LoginForm onSubmit={handleLogin} />}
    />
  )
}
