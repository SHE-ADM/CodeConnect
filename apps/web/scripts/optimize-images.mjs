// Converts the heavy banner PNGs into optimized WebP for LCP.
// Source PNGs stay as a <picture> fallback; WebP becomes the served asset.
// Run: pnpm --filter web optimize:images
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { stat } from 'node:fs/promises'

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

// Banner renders at most ~half the viewport; 1600px covers retina comfortably.
const MAX_WIDTH = 1600
const WEBP_QUALITY = 80

const BANNERS = ['IMG_Login.png', 'IMG_Cadastro.png']

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`

for (const file of BANNERS) {
  const input = join(PUBLIC_DIR, file)
  const output = input.replace(/\.png$/i, '.webp')

  const image = sharp(input)
  const { width, height } = await image.metadata()
  const before = (await stat(input)).size

  await image
    .resize({ width: Math.min(width, MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(output)

  const after = (await stat(output)).size
  const saved = ((1 - after / before) * 100).toFixed(0)
  console.log(
    `${file}  ${width}x${height}  ${kb(before)} → ${kb(after)} webp  (-${saved}%)`,
  )
}
