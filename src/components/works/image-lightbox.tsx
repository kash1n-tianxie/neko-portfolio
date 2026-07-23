'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import type { WorkGalleryItem } from '@/content/works'
import { CloseIcon } from '../ui/icons'

export function ImageLightbox({
  items,
  locale,
  closeLabel,
  openLabel,
}: {
  items: WorkGalleryItem[]
  locale: 'ja' | 'en'
  closeLabel: string
  openLabel: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState(0)

  const open = (index: number) => {
    setActive(index)
    dialogRef.current?.showModal()
  }

  const close = () => dialogRef.current?.close()

  return (
    <>
      <div className="case-gallery">
        {items.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => open(index)}
            className="case-gallery__item"
            aria-label={`${openLabel}: ${item.alt[locale]}`}
          >
            <Image
              src={item.src}
              alt={item.alt[locale]}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        onClick={(event) => {
          if (event.currentTarget === event.target) close()
        }}
        onClose={() => setActive(0)}
      >
        <button type="button" className="lightbox__close" onClick={close} aria-label={closeLabel}>
          <CloseIcon className="h-5 w-5" />
        </button>
        {items[active] && (
          <div className="lightbox__image">
            <Image
              src={items[active].src}
              alt={items[active].alt[locale]}
              fill
              sizes="95vw"
              className="object-contain"
              priority
            />
          </div>
        )}
      </dialog>
    </>
  )
}
