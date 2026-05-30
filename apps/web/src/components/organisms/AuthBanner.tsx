type AuthBannerProps = {
  imageSrc: string
  imageAlt: string
}

export function AuthBanner({ imageSrc, imageAlt }: Readonly<AuthBannerProps>) {
  // WebP é o asset servido (otimizado via scripts/optimize-images.mjs);
  // o PNG original fica como fallback para navegadores sem suporte a WebP.
  const webpSrc = imageSrc.replace(/\.png$/i, '.webp')

  return (
    <div className="relative h-52 md:h-full overflow-hidden">
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={imageSrc}
          alt={imageAlt}
          width={1344}
          height={896}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>
    </div>
  )
}
