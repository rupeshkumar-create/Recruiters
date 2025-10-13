'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Save, ArrowLeft, Image, FileText } from 'lucide-react'
import Link from 'next/link'
import { addTool, getUniqueCategories } from '../../../lib/data'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Checkbox } from '../../../components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog'
import { Card, CardContent } from '../../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import LogoUpload from '../../../components/LogoUpload'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

export default function AddToolPage() {
  const [formData, setFormData] = useState({ 
    name: '', 
    logo: '', 
    tagline: '', 
    description: '', 
    categories: '', 
    url: '',
    featured: false,
    hidden: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [availableCategories, setAvailableCategories] = useState<string[]>([])

  useEffect(() => {
    setAvailableCategories(getUniqueCategories())
  }, [])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) newErrors.name = 'Tool name is required'
    if (!formData.url.trim()) newErrors.url = 'Website URL is required'
    if (!formData.tagline.trim()) newErrors.tagline = 'Tagline is required'
    if (!formData.categories.trim()) newErrors.categories = 'At least one category is required'
    
    // URL validation
    if (formData.url && !formData.url.match(/^https?:\/\/.+/)) {
      newErrors.url = 'Please enter a valid URL starting with http:// or https://'
    }
    
    // Logo validation - no longer needed as upload handles this
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSaving(true)
    try {
      // Generate slug from name
      const slug = formData.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      const newTool = {
        name: formData.name.trim(),
        url: formData.url.trim(),
        tagline: formData.tagline.trim(),
        content: formData.description.trim() || formData.tagline.trim(),
        description: formData.description.trim(),
        categories: formData.categories.trim(),
        logo: formData.logo.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=F26B21&color=fff&size=64`,
        slug: slug,
        featured: formData.featured,
        hidden: formData.hidden
      }
      
      // Submit to API instead of local storage
      try {
        const response = await fetch('/api/tools', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            url: formData.url.trim(),
            tagline: formData.tagline.trim(),
            content: formData.description.trim() || formData.tagline.trim(),
            description: formData.description.trim(),
            categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean),
            logo: formData.logo.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=F26B21&color=fff&size=64`,
            featured: formData.featured,
            hidden: formData.hidden
          }),
        })

        if (response.ok) {
          setShowSuccess(true)
          // Reset form
          setFormData({
            name: '', 
            logo: '', 
            tagline: '', 
            description: '', 
            categories: '', 
            url: '',
            featured: false,
            hidden: false
          })
          setErrors({})
          
          // Trigger comprehensive refresh
          window.dispatchEvent(new CustomEvent('refreshTools'))
          
          // Also refresh after a short delay to ensure data is updated
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('refreshTools'))
          }, 1000)
        } else {
          const errorData = await response.json()
          console.error('Failed to add tool:', errorData)
          alert('Failed to add tool. Please try again.')
        }
      } catch (error) {
        console.error('Error adding tool:', error)
        alert('Error adding tool. Please try again.')
      }
    } catch (error) {
      console.error('Error adding tool:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <div className="flex items-center justify-center mb-6">
            <Link 
              href="/admin" 
              className="absolute left-4 top-4 bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-4">
              <Plus className="w-8 h-8 text-[#F26B21]" />
              <h1 className="text-4xl font-bold text-gray-900">Add New Tool</h1>
            </div>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Add a new tool to the directory
          </p>
        </motion.div>

        {/* Form */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tool Name */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Tool Name *
                    </Label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter tool name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  {/* Website URL */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL *
                    </Label>
                    <Input
                      type="url"
                      value={formData.url}
                      onChange={(e) => handleInputChange('url', e.target.value)}
                      placeholder="https://example.com"
                      className={errors.url ? 'border-red-500' : ''}
                    />
                    {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
                  </div>
                </div>
                
                {/* Tagline */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline *
                  </Label>
                  <Input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder="Brief description of what the tool does"
                    className={errors.tagline ? 'border-red-500' : ''}
                  />
                  {errors.tagline && <p className="text-red-500 text-sm mt-1">{errors.tagline}</p>}
                </div>
                
                {/* Categories */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </Label>
                  <Select value={formData.categories} onValueChange={(value) => handleInputChange('categories', value)}>
                    <SelectTrigger className={errors.categories ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categories && <p className="text-red-500 text-sm mt-1">{errors.categories}</p>}
                  <p className="text-gray-500 text-sm mt-1">Select the most appropriate category for this tool</p>
                </div>
                
                {/* Logo Upload */}
                <LogoUpload
                  currentLogo={formData.logo}
                  onLogoChange={(logoUrl) => {
                    handleInputChange('logo', logoUrl)
                    // Trigger refresh event for real-time updates
                    if (typeof window !== 'undefined') {
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('refreshTools'))
                      }, 500)
                    }
                  }}
                />
                
                {/* Full Description */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Full Description (Optional)
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="h-32 resize-none"
                    placeholder="Detailed description of the tool, its features, and benefits..."
                  />
                </div>
                
                {/* Checkboxes */}
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', !!checked)}
                    />
                    <Label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Featured Tool
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hidden"
                      checked={formData.hidden}
                      onCheckedChange={(checked) => handleInputChange('hidden', !!checked)}
                    />
                    <Label htmlFor="hidden" className="text-sm font-medium text-gray-700">
                      Hide from Directory
                    </Label>
                  </div>
                </div>
                
                {/* Preview */}
                {(formData.name || formData.tagline) && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 flex-shrink-0">
                        {formData.logo ? (
                          <img 
                            src={formData.logo}
                            alt="Preview"
                            className="w-full h-full object-contain rounded bg-white"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full bg-[#F26B21] rounded items-center justify-center text-white font-bold text-xs ${formData.logo ? 'hidden' : 'flex'}`}>
                          {formData.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{formData.name || 'Tool Name'}</h5>
                        <p className="text-sm text-gray-600 mt-1">{formData.tagline || 'Tool tagline will appear here'}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Link href="/admin" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-[#F26B21] text-white hover:bg-[#F26B21]/90"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Adding Tool...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Add Tool
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">Tool Added Successfully!</DialogTitle>
                <DialogDescription className="text-gray-600">The new tool has been added to the directory</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <p className="text-gray-700 mb-6">
            The tool has been successfully added to the directory and is now available for users to discover.
          </p>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setShowSuccess(false)}
              className="flex-1 bg-[#F26B21] text-white hover:bg-[#F26B21]/90"
            >
              Add Another Tool
            </Button>
            <Link href="/admin" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Admin
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}