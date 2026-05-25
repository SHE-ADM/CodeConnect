import { useCallback } from 'react'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { AuthBanner } from '@/components/organisms/AuthBanner'
import { CadastroForm } from '@/components/organisms/CadastroForm'

export default function CadastroPage() {
  const handleCadastro = useCallback(
    (_data: { name: string; email: string; password: string; remember: boolean }) => {
      // TODO: integrate with authentication API
    },
    []
  )

  return (
    <AuthLayout
      banner={
        <AuthBanner
          imageSrc="/IMG2_Tablet.png"
          imageAlt="Ilustração CodeConnect — pessoa programando"
        />
      }
      form={<CadastroForm onSubmit={handleCadastro} />}
    />
  )
}
