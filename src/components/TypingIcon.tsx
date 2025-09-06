'use client'

import { motion } from 'framer-motion'

interface TypingIconProps {
  className?: string
  size?: number
}

export default function TypingIcon({ className = '', size = 20 }: TypingIconProps) {
  return (
    <motion.div 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-current"
      >
        {/* Keyboard base */}
        <rect
          x="2"
          y="14"
          width="20"
          height="6"
          rx="2"
          fill="currentColor"
          opacity="0.3"
        />
        
        {/* Keys */}
        <rect x="4" y="16" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5" />
        <rect x="7" y="16" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5" />
        <rect x="10" y="16" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5" />
        <rect x="13" y="16" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5" />
        <rect x="16" y="16" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5" />
        
        {/* Animated fingers */}
        <motion.g
          animate={{
            y: [0, -2, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0
          }}
        >
          {/* Left finger */}
          <ellipse
            cx="6"
            cy="12"
            rx="1"
            ry="3"
            fill="currentColor"
            opacity="0.7"
          />
        </motion.g>
        
        <motion.g
          animate={{
            y: [0, -2, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        >
          {/* Middle finger */}
          <ellipse
            cx="12"
            cy="11"
            rx="1"
            ry="3.5"
            fill="currentColor"
            opacity="0.7"
          />
        </motion.g>
        
        <motion.g
          animate={{
            y: [0, -2, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6
          }}
        >
          {/* Right finger */}
          <ellipse
            cx="18"
            cy="12"
            rx="1"
            ry="3"
            fill="currentColor"
            opacity="0.7"
          />
        </motion.g>
        
        {/* Typing dots animation */}
        <motion.g>
          <motion.circle
            cx="8"
            cy="6"
            r="1"
            fill="currentColor"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0
            }}
          />
          <motion.circle
            cx="12"
            cy="6"
            r="1"
            fill="currentColor"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.circle
            cx="16"
            cy="6"
            r="1"
            fill="currentColor"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </motion.g>
      </svg>
    </motion.div>
  )
}