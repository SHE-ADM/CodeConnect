type Provider = 'github' | 'google'

type SocialLoginButtonProps = {
  provider: Provider
  onClick?: () => void
}

const config: Record<Provider, { src: string; label: string }> = {
  github: { src: '/Github.png', label: 'Github' },
  google: { src: '/Google.png', label: 'Gmail' },
}

export function SocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
  const { src, label } = config[provider]
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Entrar com ${label}`}
      className="flex flex-col items-center gap-1.5 py-3 px-6 rounded-field bg-field hover:bg-edge transition-colors cursor-pointer"
    >
      <img src={src} alt="" aria-hidden="true" className="w-8 h-8 object-contain" />
      <span className="text-xs text-ink-muted">{label}</span>
    </button>
  )
}
