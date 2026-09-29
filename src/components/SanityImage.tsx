// src/components/SanityImage.tsx
//
// Drop-in replacement for next/image's <Image> when the src is a Sanity-hosted
// image. Sanity's own CDN already resizes, compresses, and converts format via
// the urlFor() width/height/format params baked into the URL -- routing that
// already-optimized image through Vercel's separate Image Optimization pipeline
// on top re-processes it a second time for no real benefit.
//
// That double-processing is also what burns through Vercel's Image Optimization
// quota fast: Hobby includes only 5,000 transformations/month, counted per
// unique source image + size/format combination. With 30+ experiences each
// carrying 20-45+ gallery photos, that quota was being exhausted well before
// month's end -- new images then fail with a 402 and silently show alt text
// instead of the photo (confirmed against Vercel's current docs, not assumed).
//
// `unoptimized` tells next/image to skip Vercel's re-processing and render the
// given src directly, while keeping next/image's other real benefits (layout
// stability via width/height/fill, lazy loading, blur placeholders, etc).
//
// Not for genuinely local /public assets (e.g. the site logo in Header/Footer)
// -- those are cheap to optimize since there's only ever one of each, and
// Vercel's optimizer is a real, free benefit there. Only swap this in for
// Sanity-sourced images.
import Image, {type ImageProps} from 'next/image'

export default function SanityImage(props: ImageProps) {
  // alt is spread from props and already required by ImageProps at every call
  // site; eslint just can't see through the spread to confirm that statically.
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} unoptimized />
}
