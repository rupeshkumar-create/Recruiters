'use client'

import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'


interface SubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}



export default function SubmissionForm({ isOpen, onClose }: SubmissionFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    toolName: '',
    website: '',
    tagline: '',
    description: '',
    categories: [] as string[],
    logo: '',
    email: ''
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories?active=true')
      if (response.ok) {
        const categories = await response.json()
        setAvailableCategories(categories.map((cat: any) => cat.name))
      } else {
        console.error('Failed to load categories')
        // Fallback to empty array or show error
        setAvailableCategories([])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      setAvailableCategories([])
    }
  }




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    
    try {
      // Submit to Supabase via API
      const submissionData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        name: formData.toolName,
        url: formData.website,
        tagline: formData.tagline,
        description: formData.description,
        categories: formData.categories,
        logo: formData.logo,
        email: formData.email
      }
      
      const submissionResponse = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (!submissionResponse.ok) {
        const errorData = await submissionResponse.json()
        throw new Error(errorData.error || 'Failed to submit tool')
      }

      const submission = await submissionResponse.json()
      
      // Email is now sent automatically by the API endpoint
      
      setIsSubmitting(false)
      setSubmitted(true)
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ firstName: '', lastName: '', toolName: '', website: '', tagline: '', description: '', categories: [], logo: '', email: '' })
        setLogoFile(null)
        setLogoPreview('')
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Submission error:', error)
      setIsSubmitting(false)
      // You might want to show an error message to the user here
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setLogoPreview(result)
        setFormData(prev => ({ ...prev, logo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClose = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Submit New Tool</h2>
              <p className="text-gray-600 mt-1">Share your tool with the community</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-green-600 text-4xl">✓</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Submission Received!</h3>
              <p className="text-gray-600 text-lg">Your tool will be reviewed by our team and published once approved.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="toolName" className="block text-sm font-semibold text-gray-700">
                  Tool Name *
                </label>
                <input
                  type="text"
                  id="toolName"
                  name="toolName"
                  required
                  value={formData.toolName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter tool name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="website" className="block text-sm font-semibold text-gray-700">
                  Website URL *
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  required
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="your@email.com"
                />
                <p className="text-xs text-gray-500 mt-1">We'll send you updates about your submission status.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="tagline" className="block text-sm font-semibold text-gray-700">
                  Tagline *
                </label>
                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  required
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Brief one-line description of your tool"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="categories" className="block text-sm font-semibold text-gray-700">
                  Categories *
                </label>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-xl bg-gray-50">
                    {availableCategories.map((category) => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                categories: [...prev.categories, category]
                              }))
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                categories: prev.categories.filter(c => c !== category)
                              }))
                            }
                          }}
                          className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                  {formData.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.categories.map((category) => (
                        <span key={category} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {category}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                categories: prev.categories.filter(c => c !== category)
                              }))
                            }}
                            className="ml-1 text-orange-600 hover:text-orange-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                  Full Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                  placeholder="Detailed description of your tool's features and benefits"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="logo" className="block text-sm font-semibold text-gray-700">
                  Logo Upload
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:transition-colors"
                  />
                  {logoPreview && (
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain rounded-xl border-2 border-gray-200 bg-white p-1"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload a logo image (optional). If not provided, we'll generate one from your tool name.</p>
              </div>





              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Tool'
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-500 text-center leading-relaxed">
                All submissions are reviewed before being published to ensure quality and relevance.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}