'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ToolImageProps {
  src: string
  alt: string
  name: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showFallback?: boolean
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm', 
  lg: 'w-16 h-16 text-xl'
}

export default function ToolImage({ 
  src, 
  alt, 
  name, 
  className = '', 
  size = 'md',
  showFallback = true 
}: ToolImageProps) {
  const [imageError, setImageError] = useState(false)
  const [proxyError, setProxyError] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  
  // Reset image state when src changes
  useEffect(() => {
    setImageError(false)
    setProxyError(false)
    setRefreshKey(prev => prev + 1)
  }, [src])
  
  // Listen for refresh events to update images
  useEffect(() => {
    const handleRefresh = () => {
      setRefreshKey(prev => prev + 1)
      setImageError(false)
      setProxyError(false)
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('refreshTools', handleRefresh)
      return () => window.removeEventListener('refreshTools', handleRefresh)
    }
  }, [])

  // Enhanced image URL processing
  const getOptimizedImageUrl = (originalSrc: string) => {
    if (!originalSrc) return ''
    
    // Handle direct URLs that don't need proxying
    if (originalSrc.includes('ui-avatars.com')) {
      return originalSrc
    }
    
    // Handle LinkedIn images with proxy
    if (originalSrc.includes('linkedin.com') || originalSrc.includes('licdn.com')) {
      const dimensions = size === 'lg' ? '64' : size === 'md' ? '48' : '32'
      return `https://images.weserv.nl/?url=${encodeURIComponent(originalSrc)}&w=${dimensions}&h=${dimensions}&fit=contain&bg=white&output=webp&q=85`
    }
    
    // Handle other external images that might need proxy
    if (originalSrc.startsWith('http') && typeof window !== 'undefined' && !originalSrc.includes(window.location.hostname) && !originalSrc.includes('ui-avatars.com')) {
      const dimensions = size === 'lg' ? '64' : size === 'md' ? '48' : '32'
      return `https://images.weserv.nl/?url=${encodeURIComponent(originalSrc)}&w=${dimensions}&h=${dimensions}&fit=contain&bg=white&output=webp&q=85`
    }
    
    return originalSrc
  }

  const handleImageError = () => {
    if (!proxyError && src.includes('weserv.nl')) {
      // First try: fallback to original URL
      setProxyError(true)
      return
    }
    // Second try failed: show fallback
    setImageError(true)
  }

  const baseImageUrl = proxyError ? src : getOptimizedImageUrl(src)
  // Add cache-busting for external URLs when refreshed
  const imageUrl = baseImageUrl && refreshKey > 0 && baseImageUrl.startsWith('http')
    ? `${baseImageUrl}?v=${refreshKey}` 
    : baseImageUrl
  const fallbackLetter = name.charAt(0).toUpperCase()

  if (imageError && !showFallback) {
    return null
  }

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 relative ${className}`}>
      {!imageError ? (
        <motion.img 
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-contain rounded-lg bg-gray-50"
          onError={handleImageError}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      ) : (
        <motion.div 
          className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {fallbackLetter}
        </motion.div>
      )}
    </div>
  )
}