'use client'

import { useState } from 'react'
import { ImageOff } from 'lucide-react'

type Props = {
  src?: string
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
}

export function ProductMedia({ src, alt, className, loading = 'lazy' }: Props) {
  const [failed, setFailed] = useState(!src)
  if (failed || !src) {
    return <div className={`product-media-fallback ${className ?? ''}`} role="img" aria-label={`${alt}: фото временно недоступно`}>
      <ImageOff size={22}/><span>Фото из каталога</span><small>обновится при синхронизации</small>
    </div>
  }
  return <img className={className} src={src} alt={alt} loading={loading} onError={() => setFailed(true)}/>
}
