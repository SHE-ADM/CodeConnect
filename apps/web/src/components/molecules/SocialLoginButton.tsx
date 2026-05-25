type Provider = 'github' | 'google'

type SocialLoginButtonProps = {
  provider: Provider
  onClick?: () => void
}

const config: Record<Provider, { src: string; label: string }> = {
  github: { src: '/Github.png', label: 'Github' },
  google: { src: '/Google.png', label: 'Gmail' },
}

export function SocialLoginButton({ provider, onClick }: Readonly<SocialLoginButtonProps>) {
  const { src, label } = config[provider]
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Entrar com ${label}`}
      className="flex flex-col items-center gap-1 py-2 px-4 rounded-button cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-card"
    >
      <img src={src} alt="" aria-hidden="true" className="w-8 h-8 object-contain" />
      <span className="text-xs text-ink">{label}</span>
    </button>
  )
}
