import React from 'react'
import type { ImageNodeProps } from './ImageNode'
import { safeUrl } from '../shared/url'

export const ImageNodeUI = ({
  src = 'https://placehold.co/600x400/1e293b/94a3b8?text=Image',
  alt = 'Placeholder image',
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  borderRadius = 0,
  href = '',
}: ImageNodeProps) => {
  const safeHref = safeUrl(href)
  const img = (
    <img
      src={safeUrl(src)}
      alt={alt}
      style={{
        width,
        height,
        objectFit,
        borderRadius,
        display: 'block',
      }}
    />
  )

  if (safeHref) {
    return (
      <a href={safeHref} target="_blank" rel="noopener noreferrer">
        {img}
      </a>
    )
  }

  return img
}
