import { SocialLoginButton } from '@/components/molecules/SocialLoginButton'

export function SocialLoginGroup() {
  return (
    <div className="flex justify-center gap-4">
      <SocialLoginButton provider="github" />
      <SocialLoginButton provider="google" />
    </div>
  )
}
