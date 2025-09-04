'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, User, Building, Briefcase, Linkedin, Mail, Shield } from 'lucide-react'

interface UserAuthFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (userData: UserData) => void
  title: string
  description: string
}

export interface UserData {
  firstName: string
  lastName: string
  company: string
  title: string
  linkedinUrl: string
  email: string
}

const businessEmailDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'live.com', 'msn.com', 'ymail.com', 'protonmail.com'
]

const isBusinessEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase()
  return Boolean(domain && !businessEmailDomains.includes(domain))
}

const isValidLinkedInUrl = (url: string): boolean => {
  const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9-]+\/?$/
  return linkedinRegex.test(url)
}

export default function UserAuthForm({ isOpen, onClose, onSubmit, title, description }: UserAuthFormProps) {
  const [formData, setFormData] = useState<UserData>({
    firstName: '',
    lastName: '',
    company: '',
    title: '',
    linkedinUrl: '',
    email: ''
  })
  
  const [errors, setErrors] = useState<Partial<UserData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [captchaQuestion, setCaptchaQuestion] = useState({ question: '', answer: 0 })
  const [captchaError, setCaptchaError] = useState('')

  // Generate simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    const operations = ['+', '-', '*']
    const operation = operations[Math.floor(Math.random() * operations.length)]
    
    let answer = 0
    let question = ''
    
    switch (operation) {
      case '+':
        answer = num1 + num2
        question = `${num1} + ${num2}`
        break
      case '-':
        answer = Math.max(num1, num2) - Math.min(num1, num2)
        question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`
        break
      case '*':
        answer = num1 * num2
        question = `${num1} × ${num2}`
        break
    }
    
    setCaptchaQuestion({ question, answer })
  }

  useEffect(() => {
    if (isOpen) {
      generateCaptcha()
    }
  }, [isOpen])

  const validateForm = (): boolean => {
    const newErrors: Partial<UserData> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    } else if (!isBusinessEmail(formData.email)) {
      newErrors.email = 'Please use a business email address (not personal email)'
    }

    if (!formData.linkedinUrl.trim()) {
      newErrors.linkedinUrl = 'LinkedIn URL is required'
    } else if (!isValidLinkedInUrl(formData.linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn profile URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      setCaptchaError('Please solve the math problem correctly to verify you are human')
      generateCaptcha()
      setCaptchaAnswer('')
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      handleClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      company: '',
      title: '',
      linkedinUrl: '',
      email: ''
    })
    setErrors({})
    setCaptchaAnswer('')
    onClose()
  }

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCaptchaChange = (value: string) => {
    setCaptchaAnswer(value)
    setCaptchaError('')
    
    // Real-time validation
    if (value && parseInt(value) !== captchaQuestion.answer) {
      setCaptchaError('Incorrect answer. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="muted-card rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold muted-text">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
        
        <p className="muted-text-light mb-6">{description}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium muted-text mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-300' : 'border-neutral-200'
                }`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium muted-text mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-300' : 'border-neutral-200'
                }`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium muted-text mb-2 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Company Name *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.company ? 'border-red-300' : 'border-neutral-200'
              }`}
              placeholder="Acme Corp"
            />
            {errors.company && (
              <p className="text-red-500 text-xs mt-1">{errors.company}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium muted-text mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-neutral-200'
              }`}
              placeholder="Software Engineer"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium muted-text mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Business Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.email ? 'border-red-300' : 'border-neutral-200'
              }`}
              placeholder="john@company.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
            <p className="text-xs muted-text-light mt-1">Please use your business email (not Gmail, Yahoo, etc.)</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium muted-text mb-2 flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn Profile URL *
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.linkedinUrl ? 'border-red-300' : 'border-neutral-200'
              }`}
              placeholder="https://linkedin.com/in/johndoe"
            />
            {errors.linkedinUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.linkedinUrl}</p>
            )}
          </div>
          
          {/* Human Verification */}
          <div className="bg-neutral-50 p-4 rounded-lg">
            <label className="block text-sm font-medium muted-text mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Human Verification *
            </label>
            <p className="text-sm muted-text-light mb-2">
              Please solve this math problem: <strong>{captchaQuestion.question} = ?</strong>
            </p>
            <input
              type="number"
              value={captchaAnswer}
              onChange={(e) => handleCaptchaChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                captchaError ? 'border-red-300' : 'border-neutral-200'
              }`}
              placeholder="Enter your answer"
              required
            />
            {captchaError && (
              <p className="text-red-500 text-xs mt-1">{captchaError}</p>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-neutral-200 muted-text-light rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 orange-bg text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}