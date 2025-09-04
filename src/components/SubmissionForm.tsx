'use client'

import { useState } from 'react'
import { X, Upload } from 'lucide-react'

interface SubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

const categories = ['Resume Screening', 'Candidate Sourcing', 'Interview Prep', 'ATS Integrations']

export default function SubmissionForm({ isOpen, onClose }: SubmissionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    category: '',
    logo: ''
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Save to local storage
    const newTool = {
      id: Date.now().toString(),
      name: formData.name,
      url: formData.website,
      tagline: formData.description,
      content: formData.description,
      categories: formData.category,
      logo: formData.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=F26B21&color=fff&size=48`,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      featured: false
    }
    
    // Get existing tools from localStorage
    const existingTools = JSON.parse(localStorage.getItem('user_submitted_tools') || '[]')
    existingTools.push(newTool)
    localStorage.setItem('user_submitted_tools', JSON.stringify(existingTools))
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setSubmitted(true)
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', website: '', description: '', category: '', logo: '' })
      setLogoFile(null)
      setLogoPreview('')
      onClose()
      // Refresh the page to show the new tool
      window.location.reload()
    }, 2000)
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="muted-card rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold muted-text">Submit New Tool</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold muted-text mb-2">Submission Received!</h3>
              <p className="muted-text-light">Your tool will be reviewed by our team and published once approved.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium muted-text mb-1">
                  Tool Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter tool name"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium muted-text mb-1">
                  Website URL *
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  required
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium muted-text mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium muted-text mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Brief description of your tool"
                />
              </div>

              <div>
                <label htmlFor="logo" className="block text-sm font-medium muted-text mb-1">
                  Logo Upload
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                  />
                  {logoPreview && (
                    <div className="w-12 h-12 flex-shrink-0">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain rounded-lg border border-neutral-200"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs muted-text-light mt-1">Upload a logo image (optional). If not provided, we'll generate one from your tool name.</p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full orange-bg text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Tool'}
                </button>
              </div>

              <p className="text-xs muted-text-light text-center">
                All submissions are reviewed before being published to ensure quality and relevance.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}