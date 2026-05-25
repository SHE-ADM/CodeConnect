import { Checkbox } from '@/components/atoms/Checkbox'
import { TextLink } from '@/components/atoms/TextLink'

type RememberMeRowProps = {
  remember: boolean
  onRememberChange: (value: boolean) => void
  forgotHref: string
}

export function RememberMeRow({
  remember,
  onRememberChange,
  forgotHref,
}: Readonly<RememberMeRowProps>) {
  return (
    <div className="flex items-center justify-between">
      <Checkbox
        id="remember-me"
        checked={remember}
        onChange={onRememberChange}
        label="Lembrar-me"
      />
      <TextLink href={forgotHref} tone="ink" underline>
        Esqueci a senha
      </TextLink>
    </div>
  )
}
