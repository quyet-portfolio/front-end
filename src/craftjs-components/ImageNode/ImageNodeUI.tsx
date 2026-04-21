import React from 'react'
import type { ImageNodeProps } from './ImageNode'

export const ImageNodeUI = ({
  src = 'https://placehold.co/600x400/1e293b/94a3b8?text=Image',
  alt = 'Placeholder image',
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  borderRadius = 0,
  href = '',
}: ImageNodeProps) => {
  const img = (
    <img
      src={src}
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

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {img}
      </a>
    )
  }

  return img
}
