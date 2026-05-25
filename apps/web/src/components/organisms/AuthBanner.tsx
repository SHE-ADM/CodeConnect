type AuthBannerProps = {
  imageSrc: string
  imageAlt: string
}

export function AuthBanner({ imageSrc, imageAlt }: Readonly<AuthBannerProps>) {
  return (
    <div className="relative h-52 md:h-full overflow-hidden">
      <img
        src={imageSrc}
        alt={imageAlt}
        width={1920}
        height={1080}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  )
}
