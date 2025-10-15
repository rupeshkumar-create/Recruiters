'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Check, AlertCircle } from 'lucide-react'

interface EmailSubscriptionProps {
  className?: string
}

export default function EmailSubscription({ className = '' }: EmailSubscriptionProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    
    try {
      // Simulate API call (in a real app, this would be sent to your email service)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store subscription in localStorage (in a real app, this would be sent to a server)
      const subscriptions = JSON.parse(localStorage.getItem('emailSubscriptions') || '[]')
      
      // Check if email already exists
      if (subscriptions.some((sub: any) => sub.email === email)) {
        setStatus('error')
        setMessage('This email is already subscribed')
        return
      }
      
      subscriptions.push({
        email,
        timestamp: Date.now(),
        status: 'active'
      })
      
      localStorage.setItem('emailSubscriptions', JSON.stringify(subscriptions))
      
      setStatus('success')
      setMessage('Successfully subscribed! You\'ll receive updates about new recruiters and job opportunities.')
      setEmail('')
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
      
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <motion.div
      className={`bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-t-2xl p-8 text-white relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle light effect overlay - reduced opacity for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/10 via-transparent to-transparent opacity-30 pointer-events-none" />
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Mail className="w-8 h-8" />
        </motion.div>
        
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Stay Connected with Top Recruiters
        </motion.h2>
        
        <motion.p
          className="text-lg text-white/90 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Get notified when new recruiters join our directory and discover exclusive job opportunities.
          Join thousands of professionals advancing their careers.
        </motion.p>
        
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              disabled={status === 'loading'}
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-6 py-3 orange-bg text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={status === 'idle' ? { scale: 1.02 } : {}}
            whileTap={status === 'idle' ? { scale: 0.98 } : {}}
          >
            {status === 'loading' && (
              <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            )}
            {status === 'success' && <Check className="w-4 h-4" />}
            {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </motion.button>
        </motion.form>
        
        <AnimatePresence>
          {message && (
            <motion.div
              className={`mt-4 p-3 rounded-lg flex items-center gap-2 justify-center ${
                status === 'success' 
                  ? 'bg-green-500/20 text-green-100' 
                  : 'bg-red-500/20 text-red-100'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {status === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{message}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.p
          className="text-sm text-white/70 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          We respect your privacy. Unsubscribe at any time.
        </motion.p>
      </div>
    </motion.div>
  )
}