'use client'

import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface FeaturedTagProps {
  className?: string
  size?: 'sm' | 'md'
}

const FeaturedTag = ({ className = '', size = 'md' }: FeaturedTagProps) => {
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-sm py-1 px-2'
  }

  return (
    <motion.div
      className={`absolute top-2 right-2 z-10 flex items-center gap-1 bg-amber-50 text-amber-700 font-medium rounded-md border border-amber-200 ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <Star className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill="currentColor" />
      Featured
    </motion.div>
  )
}

export default FeaturedTag