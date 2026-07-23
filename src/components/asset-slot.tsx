import fs from 'node:fs'
import path from 'node:path'

/**
 * Placeholder slot for an asset that does not exist yet.
 *
 * Drop the real file into /public at exactly `src` and the slot renders the
 * image instead of the dashed spec box — no code change needed.
 * (Server component: checks the filesystem at render/build time.)
 */
export function AssetSlot({
  src,
  spec,
  alt = '',
  className = '',
  imgClassName = '',
  silent = false,
}: {
  /** public path, e.g. /assets/cat/cat-sleep.png */
  src: string
  /** short human-readable spec shown inside the placeholder */
  spec: string
  alt?: string
  /** applied to placeholder box and to the image (positioning/size) */
  className?: string
  /** applied to the image only (e.g. object-contain) */
  imgClassName?: string
  /** render nothing while the asset is missing (for decorative layers) */
  silent?: boolean
}) {
  const exists = fs.existsSync(path.join(process.cwd(), 'public', src))

  if (exists) {
    // eslint-disable-next-line @next/next/no-img-element -- dimensions unknown until assets land; switch to next/image afterwards
    return <img src={src} alt={alt} className={`${className} ${imgClassName}`} />
  }
  if (silent) return null

  return (
    <div className={`slot ${className}`} role="img" aria-label={spec}>
      <span className="slot__name">{src}</span>
      <span className="slot__spec">{spec}</span>
    </div>
  )
}
