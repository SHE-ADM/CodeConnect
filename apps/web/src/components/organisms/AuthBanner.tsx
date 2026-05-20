type AuthBannerProps = {
  imageSrc: string
  imageAlt: string
}

export function AuthBanner({ imageSrc, imageAlt }: AuthBannerProps) {
  return (
    <div className="relative h-52 md:h-full overflow-hidden">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  )
}
