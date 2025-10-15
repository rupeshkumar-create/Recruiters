'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, User, Building, Mail, Phone, MapPin, Calendar, Award, Briefcase, Globe, Users, CheckCircle, TrendingUp } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface SubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface WorkExperience {
  jobTitle: string
  company: string
  duration: string
  description?: string
}

export default function SubmissionForm({ isOpen, onClose }: SubmissionFormProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState({
    // Basic Information (Required)
    name: '',
    jobTitle: '',
    company: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    location: '',
    experience: '',
    bio: '',
    avatar: '',
    
    // Specialization (Required - min 1, max 3)
    specializations: [] as string[],
    
    // Performance Metrics (Required - min 4)
    performanceMetrics: {
      placements: '',
      avgTimeToHire: '',
      candidateSatisfaction: '',
      clientRetention: ''
    },
    
    // Professional Details (Required)
    achievements: [] as string[], // min 1, max 6
    workExperience: [] as WorkExperience[], // min 1, max 3
    rolesPlaced: [] as string[], // min 1, max 7
    industries: [] as string[], // min 1, max 5
    keywords: [] as string[], // min 1, max 5
    languages: [] as string[], // min 1, max 3
    seniorityLevels: [] as string[], // min 1, max 3
    employmentTypes: [] as string[], // min 1, max 2
    regions: [] as string[], // min 1, max 2
    
    // Optional fields
    certifications: [] as string[],
    availability: {
      accepting: true,
      nextAvailable: ''
    },
    socialProof: {
      linkedinFollowers: '',
      featuredIn: [] as string[]
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Predefined options
  const specializationOptions = [
    'Software Engineering', 'Data Science', 'Product Management', 'Design & UX',
    'Marketing', 'Sales', 'Finance', 'Operations', 'Human Resources',
    'Executive Leadership', 'Healthcare', 'Legal', 'Consulting'
  ]

  const seniorityOptions = [
    'Entry Level', 'Mid Level', 'Senior Level', 'Executive Level', 'C-Suite'
  ]

  const employmentTypeOptions = [
    'Full-time', 'Part-time', 'Contract', 'Freelance', 'Temporary'
  ]

  const regionOptions = [
    'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa',
    'Remote/Global', 'United States', 'Canada', 'United Kingdom', 'Germany',
    'France', 'Australia', 'Singapore', 'Japan', 'India'
  ]

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Dutch', 'Russian', 'Chinese (Mandarin)', 'Japanese', 'Korean',
    'Arabic', 'Hindi', 'Other'
  ]

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('basic')
      setErrors({})
      setSubmitted(false)
    }
  }, [isOpen])
  // Helper functions for array manipulation
  const addArrayItem = (field: keyof typeof formData, value: string, maxLength: number) => {
    if (!value.trim()) return
    const currentArray = formData[field] as string[]
    if (currentArray.length >= maxLength) return
    if (!currentArray.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, value.trim()]
      }))
    }
  }

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    const currentArray = formData[field] as string[]
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index)
    }))
  }

  const addWorkExperience = () => {
    if (formData.workExperience.length >= 3) return
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        jobTitle: '',
        company: '',
        duration: '',
        description: ''
      }]
    }))
  }

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }))
  }

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Basic Information validation
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required'
    if (!formData.company.trim()) newErrors.company = 'Company is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.linkedin.trim()) newErrors.linkedin = 'LinkedIn URL is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.experience.trim()) newErrors.experience = 'Years of experience is required'
    
    // Bio validation (200-500 words)
    const bioWordCount = formData.bio.trim().split(/\s+/).length
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required'
    } else if (bioWordCount < 200) {
      newErrors.bio = `Bio must be at least 200 words (currently ${bioWordCount} words)`
    } else if (bioWordCount > 500) {
      newErrors.bio = `Bio must not exceed 500 words (currently ${bioWordCount} words)`
    }

    // Specializations validation (min 1, max 3)
    if (formData.specializations.length === 0) {
      newErrors.specializations = 'At least 1 specialization is required'
    } else if (formData.specializations.length > 3) {
      newErrors.specializations = 'Maximum 3 specializations allowed'
    }

    // Performance Metrics validation (all 4 required)
    if (!formData.performanceMetrics.placements) newErrors.placements = 'Total placements is required'
    if (!formData.performanceMetrics.avgTimeToHire) newErrors.avgTimeToHire = 'Average time to hire is required'
    if (!formData.performanceMetrics.candidateSatisfaction) newErrors.candidateSatisfaction = 'Candidate satisfaction is required'
    if (!formData.performanceMetrics.clientRetention) newErrors.clientRetention = 'Client retention is required'

    // Achievements validation (min 1, max 6)
    if (formData.achievements.length === 0) {
      newErrors.achievements = 'At least 1 achievement is required'
    } else if (formData.achievements.length > 6) {
      newErrors.achievements = 'Maximum 6 achievements allowed'
    }

    // Work Experience validation (min 1, max 3)
    if (formData.workExperience.length === 0) {
      newErrors.workExperience = 'At least 1 work experience is required'
    } else if (formData.workExperience.length > 3) {
      newErrors.workExperience = 'Maximum 3 work experiences allowed'
    }

    // Validate each work experience
    formData.workExperience.forEach((exp, index) => {
      if (!exp.jobTitle.trim()) newErrors[`workExp${index}JobTitle`] = 'Job title is required'
      if (!exp.company.trim()) newErrors[`workExp${index}Company`] = 'Company is required'
      if (!exp.duration.trim()) newErrors[`workExp${index}Duration`] = 'Duration is required'
    })

    // Other required arrays validation
    if (formData.rolesPlaced.length === 0) newErrors.rolesPlaced = 'At least 1 role placed is required'
    if (formData.rolesPlaced.length > 7) newErrors.rolesPlaced = 'Maximum 7 roles allowed'
    
    if (formData.industries.length === 0) newErrors.industries = 'At least 1 industry is required'
    if (formData.industries.length > 5) newErrors.industries = 'Maximum 5 industries allowed'
    
    if (formData.keywords.length === 0) newErrors.keywords = 'At least 1 keyword/skill is required'
    if (formData.keywords.length > 5) newErrors.keywords = 'Maximum 5 keywords allowed'
    
    if (formData.languages.length === 0) newErrors.languages = 'At least 1 language is required'
    if (formData.languages.length > 3) newErrors.languages = 'Maximum 3 languages allowed'
    
    if (formData.seniorityLevels.length === 0) newErrors.seniorityLevels = 'At least 1 seniority level is required'
    if (formData.seniorityLevels.length > 3) newErrors.seniorityLevels = 'Maximum 3 seniority levels allowed'
    
    if (formData.employmentTypes.length === 0) newErrors.employmentTypes = 'At least 1 employment type is required'
    if (formData.employmentTypes.length > 2) newErrors.employmentTypes = 'Maximum 2 employment types allowed'
    
    if (formData.regions.length === 0) newErrors.regions = 'At least 1 region is required'
    if (formData.regions.length > 2) newErrors.regions = 'Maximum 2 regions allowed'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Prepare submission data
      const submissionData = {
        // Basic info
        name: formData.name,
        jobTitle: formData.jobTitle,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        linkedin: formData.linkedin,
        website: formData.website,
        location: formData.location,
        experience: formData.experience,
        bio: formData.bio,
        avatar: formData.avatar,
        
        // Specializations
        specializations: formData.specializations,
        
        // Performance metrics
        placements: parseInt(formData.performanceMetrics.placements) || 0,
        avgTimeToHire: parseInt(formData.performanceMetrics.avgTimeToHire) || 30,
        candidateSatisfaction: parseInt(formData.performanceMetrics.candidateSatisfaction) || 90,
        clientRetention: parseInt(formData.performanceMetrics.clientRetention) || 85,
        
        // Professional details
        achievements: formData.achievements,
        workExperience: formData.workExperience,
        rolesPlaced: formData.rolesPlaced,
        industries: formData.industries,
        keywords: formData.keywords,
        languages: formData.languages,
        seniorityLevels: formData.seniorityLevels,
        employmentTypes: formData.employmentTypes,
        regions: formData.regions,
        
        // Optional fields
        certifications: formData.certifications,
        availability: formData.availability,
        socialProof: {
          linkedinFollowers: parseInt(formData.socialProof.linkedinFollowers) || 0,
          featuredIn: formData.socialProof.featuredIn
        },
        
        // Status
        status: 'pending',
        approved: false,
        hidden: true // Hidden until approved
      }
      
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit profile')
      }

      setIsSubmitting(false)
      setSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        // Reset form data
        setFormData({
          name: '', jobTitle: '', company: '', email: '', phone: '', linkedin: '',
          website: '', location: '', experience: '', bio: '', avatar: '',
          specializations: [], performanceMetrics: { placements: '', avgTimeToHire: '', candidateSatisfaction: '', clientRetention: '' },
          achievements: [], workExperience: [], rolesPlaced: [], industries: [], keywords: [],
          languages: [], seniorityLevels: [], employmentTypes: [], regions: [], certifications: [],
          availability: { accepting: true, nextAvailable: '' },
          socialProof: { linkedinFollowers: '', featuredIn: [] }
        })
        onClose()
      }, 3000)
    } catch (error) {
      console.error('Submission error:', error)
      setIsSubmitting(false)
      setErrors({ submit: 'Failed to submit profile. Please try again.' })
    }
  }

  const handleClose = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Submit Recruiter Profile</h2>
              <p className="text-gray-600 mt-1">Join our directory of top recruiters</p>
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
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Profile Submitted Successfully!</h3>
              <p className="text-gray-600 text-lg mb-4">
                Your recruiter profile has been submitted for review.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-orange-800">
                  <strong>Next Steps:</strong> Our admin team will review your profile and approve it within 24-48 hours. 
                  You'll receive an email notification once your profile is live.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
                {[
                  { id: 'basic', label: 'Basic Info', icon: User },
                  { id: 'performance', label: 'Performance', icon: TrendingUp },
                  { id: 'professional', label: 'Professional', icon: Briefcase },
                  { id: 'optional', label: 'Optional', icon: Award }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700 border-b-2 border-orange-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{errors.submit}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        
                        <div>
                          <Label>Full Name *</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your full name"
                            className={errors.name ? 'border-red-500' : ''}
                          />
                          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        
                        <div>
                          <Label>Job Title *</Label>
                          <Input
                            value={formData.jobTitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                            placeholder="e.g., Senior Technical Recruiter"
                            className={errors.jobTitle ? 'border-red-500' : ''}
                          />
                          {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
                        </div>
                        
                        <div>
                          <Label>Company *</Label>
                          <Input
                            value={formData.company}
                            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="Company name"
                            className={errors.company ? 'border-red-500' : ''}
                          />
                          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                        </div>
                        
                        <div>
                          <Label>Email *</Label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="your@email.com"
                            className={errors.email ? 'border-red-500' : ''}
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        
                        <div>
                          <Label>Phone *</Label>
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1 (555) 123-4567"
                            className={errors.phone ? 'border-red-500' : ''}
                          />
                          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
                        
                        <div>
                          <Label>LinkedIn URL *</Label>
                          <Input
                            value={formData.linkedin}
                            onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                            placeholder="https://linkedin.com/in/username"
                            className={errors.linkedin ? 'border-red-500' : ''}
                          />
                          {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}
                        </div>
                        
                        <div>
                          <Label>Website (Optional)</Label>
                          <Input
                            value={formData.website}
                            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                        
                        <div>
                          <Label>Location *</Label>
                          <Input
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="City, State/Country"
                            className={errors.location ? 'border-red-500' : ''}
                          />
                          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                        </div>
                        
                        <div>
                          <Label>Years of Experience *</Label>
                          <Input
                            value={formData.experience}
                            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                            placeholder="e.g., 8 years"
                            className={errors.experience ? 'border-red-500' : ''}
                          />
                          {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                        </div>
                        
                        <div>
                          <Label>Avatar URL (Optional)</Label>
                          <Input
                            value={formData.avatar}
                            onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Professional Bio * (200-500 words)</Label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Write a comprehensive bio describing your experience, expertise, and approach to recruiting..."
                        className={`h-32 ${errors.bio ? 'border-red-500' : ''}`}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                        <p className="text-gray-500 text-sm">
                          {formData.bio.trim().split(/\s+/).length} words
                        </p>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div>
                      <Label>Specializations * (Min: 1, Max: 3)</Label>
                      <div className="space-y-2">
                        <Select onValueChange={(value) => addArrayItem('specializations', value, 3)}>
                          <SelectTrigger className={errors.specializations ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select specializations" />
                          </SelectTrigger>
                          <SelectContent>
                            {specializationOptions.map(spec => (
                              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.specializations && <p className="text-red-500 text-sm">{errors.specializations}</p>}
                        <div className="flex flex-wrap gap-2">
                          {formData.specializations.map((spec, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                              {spec}
                              <button
                                type="button"
                                onClick={() => removeArrayItem('specializations', index)}
                                className="ml-2 text-orange-600 hover:text-orange-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Metrics Tab */}
                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Metrics (All Required)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Total Placements *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.performanceMetrics.placements}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            performanceMetrics: { ...prev.performanceMetrics, placements: e.target.value }
                          }))}
                          placeholder="e.g., 150"
                          className={errors.placements ? 'border-red-500' : ''}
                        />
                        {errors.placements && <p className="text-red-500 text-sm mt-1">{errors.placements}</p>}
                      </div>
                      
                      <div>
                        <Label>Average Time to Hire (days) *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={formData.performanceMetrics.avgTimeToHire}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            performanceMetrics: { ...prev.performanceMetrics, avgTimeToHire: e.target.value }
                          }))}
                          placeholder="e.g., 30"
                          className={errors.avgTimeToHire ? 'border-red-500' : ''}
                        />
                        {errors.avgTimeToHire && <p className="text-red-500 text-sm mt-1">{errors.avgTimeToHire}</p>}
                      </div>
                      
                      <div>
                        <Label>Candidate Satisfaction (%) *</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.performanceMetrics.candidateSatisfaction}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            performanceMetrics: { ...prev.performanceMetrics, candidateSatisfaction: e.target.value }
                          }))}
                          placeholder="e.g., 95"
                          className={errors.candidateSatisfaction ? 'border-red-500' : ''}
                        />
                        {errors.candidateSatisfaction && <p className="text-red-500 text-sm mt-1">{errors.candidateSatisfaction}</p>}
                      </div>
                      
                      <div>
                        <Label>Client Retention (%) *</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.performanceMetrics.clientRetention}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            performanceMetrics: { ...prev.performanceMetrics, clientRetention: e.target.value }
                          }))}
                          placeholder="e.g., 85"
                          className={errors.clientRetention ? 'border-red-500' : ''}
                        />
                        {errors.clientRetention && <p className="text-red-500 text-sm mt-1">{errors.clientRetention}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Professional Details Tab */}
                {activeTab === 'professional' && (
                  <div className="space-y-8">
                    {/* Achievements */}
                    <div>
                      <Label>Achievements * (Min: 1, Max: 6)</Label>
                      <div className="space-y-2">
                        {formData.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={achievement}
                              onChange={(e) => {
                                const newAchievements = [...formData.achievements]
                                newAchievements[index] = e.target.value
                                setFormData(prev => ({ ...prev, achievements: newAchievements }))
                              }}
                              placeholder="Describe your achievement"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayItem('achievements', index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {formData.achievements.length < 6 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addArrayItem('achievements', 'New achievement', 6)}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Achievement
                          </Button>
                        )}
                        {errors.achievements && <p className="text-red-500 text-sm">{errors.achievements}</p>}
                      </div>
                    </div>

                    {/* Work Experience */}
                    <div>
                      <Label>Work Experience * (Min: 1, Max: 3)</Label>
                      <div className="space-y-4">
                        {formData.workExperience.map((exp, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="font-medium">Experience #{index + 1}</h4>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeWorkExperience(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Job Title *</Label>
                                  <Input
                                    value={exp.jobTitle}
                                    onChange={(e) => updateWorkExperience(index, 'jobTitle', e.target.value)}
                                    placeholder="Job title"
                                    className={errors[`workExp${index}JobTitle`] ? 'border-red-500' : ''}
                                  />
                                  {errors[`workExp${index}JobTitle`] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[`workExp${index}JobTitle`]}</p>
                                  )}
                                </div>
                                <div>
                                  <Label>Company *</Label>
                                  <Input
                                    value={exp.company}
                                    onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                                    placeholder="Company name"
                                    className={errors[`workExp${index}Company`] ? 'border-red-500' : ''}
                                  />
                                  {errors[`workExp${index}Company`] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[`workExp${index}Company`]}</p>
                                  )}
                                </div>
                                <div>
                                  <Label>Duration *</Label>
                                  <Input
                                    value={exp.duration}
                                    onChange={(e) => updateWorkExperience(index, 'duration', e.target.value)}
                                    placeholder="e.g., 2020-2023"
                                    className={errors[`workExp${index}Duration`] ? 'border-red-500' : ''}
                                  />
                                  {errors[`workExp${index}Duration`] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[`workExp${index}Duration`]}</p>
                                  )}
                                </div>
                                <div className="md:col-span-2">
                                  <Label>Description (Optional)</Label>
                                  <Textarea
                                    value={exp.description || ''}
                                    onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                                    placeholder="Job description..."
                                    className="h-20"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {formData.workExperience.length < 3 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addWorkExperience}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Work Experience
                          </Button>
                        )}
                        {errors.workExperience && <p className="text-red-500 text-sm">{errors.workExperience}</p>}
                      </div>
                    </div>

                    {/* Required Arrays */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Roles Placed */}
                      <div>
                        <Label>Roles Placed * (Min: 1, Max: 7)</Label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add role"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  const input = e.target as HTMLInputElement
                                  addArrayItem('rolesPlaced', input.value, 7)
                                  input.value = ''
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).parentElement?.querySelector('input')
                                if (input?.value) {
                                  addArrayItem('rolesPlaced', input.value, 7)
                                  input.value = ''
                                }
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.rolesPlaced.map((role, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                {role}
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('rolesPlaced', index)}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          {errors.rolesPlaced && <p className="text-red-500 text-sm">{errors.rolesPlaced}</p>}
                        </div>
                      </div>

                      {/* Industries */}
                      <div>
                        <Label>Industries * (Min: 1, Max: 5)</Label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add industry"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  const input = e.target as HTMLInputElement
                                  addArrayItem('industries', input.value, 5)
                                  input.value = ''
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).parentElement?.querySelector('input')
                                if (input?.value) {
                                  addArrayItem('industries', input.value, 5)
                                  input.value = ''
                                }
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.industries.map((industry, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                {industry}
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('industries', index)}
                                  className="ml-2 text-green-600 hover:text-green-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          {errors.industries && <p className="text-red-500 text-sm">{errors.industries}</p>}
                        </div>
                      </div>

                      {/* Keywords & Skills */}
                      <div>
                        <Label>Keywords & Skills * (Min: 1, Max: 5)</Label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add keyword/skill"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  const input = e.target as HTMLInputElement
                                  addArrayItem('keywords', input.value, 5)
                                  input.value = ''
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).parentElement?.querySelector('input')
                                if (input?.value) {
                                  addArrayItem('keywords', input.value, 5)
                                  input.value = ''
                                }
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.keywords.map((keyword, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                                {keyword}
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('keywords', index)}
                                  className="ml-2 text-purple-600 hover:text-purple-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          {errors.keywords && <p className="text-red-500 text-sm">{errors.keywords}</p>}
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <Label>Languages * (Min: 1, Max: 3)</Label>
                        <div className="space-y-2">
                          <Select onValueChange={(value) => addArrayItem('languages', value, 3)}>
                            <SelectTrigger className={errors.languages ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select languages" />
                            </SelectTrigger>
                            <SelectContent>
                              {languageOptions.map(lang => (
                                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2">
                            {formData.languages.map((language, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                                {language}
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('languages', index)}
                                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          {errors.languages && <p className="text-red-500 text-sm">{errors.languages}</p>}
                        </div>
                      </div>

                      {/* Seniority Levels */}
                      <div>
                        <Label>Seniority Levels * (Min: 1, Max: 3)</Label>
                        <div className="space-y-2">
                          <Select onValueChange={(value) => addArrayItem('seniorityLevels', value, 3)}>
                            <SelectTrigger className={errors.seniorityLevels ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select seniority levels" />
                            </SelectTrigger>
                            <SelectContent>
                              {seniorityOptions.map(level => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2">
                            {formData.seniorityLevels.map((level, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                                {level}
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('seniorityLevels', index)}
                                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          {errors.seniorityLevels && <p className="text-red-500 text-sm">{errors.seniorityLevels}</p>}
                        </div>
                      </div>

                      {/* Employment Types */}
                      <div>
                        <Label>Employment Types * (Min: 1, Max: 2)</Label>
                        <div className="space-y-2">
                          <Select onValueChange={(value) => addArrayItem('employmentTypes', value, 2)}>
                            <SelectTrigger className={errors.employmentTypes ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select employment types" />
                            </SelectTrigger>
                            <SelectContent>
                              {employmentTypeOptions.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2">
                            {formData.employmentTypes.map((type, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800">
                                {type}
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('employmentTypes', index)}
                                  className="ml-2 text-teal-600 hover:text-teal-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          {errors.employmentTypes && <p className="text-red-500 text-sm">{errors.employmentTypes}</p>}
                        </div>
                      </div>

                      {/* Regions */}
                      <div>
                        <Label>Regions * (Min: 1, Max: 2)</Label>
                        <div className="space-y-2">
                          <Select onValueChange={(value) => addArrayItem('regions', value, 2)}>
                            <SelectTrigger className={errors.regions ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select regions" />
                            </SelectTrigger>
                            <SelectContent>
                              {regionOptions.map(region => (
                                <SelectItem key={region} value={region}>{region}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2">
                            {formData.regions.map((region, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800">
                                {region}
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('regions', index)}
                                  className="ml-2 text-pink-600 hover:text-pink-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          {errors.regions && <p className="text-red-500 text-sm">{errors.regions}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional Fields Tab */}
                {activeTab === 'optional' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Optional Information</h3>
                    
                    {/* Certifications */}
                    <div>
                      <Label>Certifications (Optional)</Label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add certification"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                const input = e.target as HTMLInputElement
                                addArrayItem('certifications', input.value, 10)
                                input.value = ''
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                              const input = (e.target as HTMLElement).parentElement?.querySelector('input')
                              if (input?.value) {
                                addArrayItem('certifications', input.value, 10)
                                input.value = ''
                              }
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.certifications.map((cert, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                              {cert}
                              <button
                                type="button"
                                onClick={() => removeArrayItem('certifications', index)}
                                className="ml-2 text-gray-600 hover:text-gray-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Availability</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox
                            id="accepting"
                            checked={formData.availability.accepting}
                            onCheckedChange={(checked) => setFormData(prev => ({ 
                              ...prev, 
                              availability: { ...prev.availability, accepting: !!checked }
                            }))}
                          />
                          <Label htmlFor="accepting">Currently accepting new clients</Label>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Next Available Date (Optional)</Label>
                        <Input
                          value={formData.availability.nextAvailable}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            availability: { ...prev.availability, nextAvailable: e.target.value }
                          }))}
                          placeholder="e.g., January 2024"
                        />
                      </div>
                    </div>

                    {/* Social Proof */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>LinkedIn Followers (Optional)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.socialProof.linkedinFollowers}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            socialProof: { ...prev.socialProof, linkedinFollowers: e.target.value }
                          }))}
                          placeholder="Number of LinkedIn followers"
                        />
                      </div>
                      
                      <div>
                        <Label>Featured In (Optional)</Label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add publication"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  const input = e.target as HTMLInputElement
                                  if (input.value.trim()) {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      socialProof: { 
                                        ...prev.socialProof, 
                                        featuredIn: [...prev.socialProof.featuredIn, input.value.trim()]
                                      }
                                    }))
                                    input.value = ''
                                  }
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).parentElement?.querySelector('input')
                                if (input?.value.trim()) {
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    socialProof: { 
                                      ...prev.socialProof, 
                                      featuredIn: [...prev.socialProof.featuredIn, input.value.trim()]
                                    }
                                  }))
                                  input.value = ''
                                }
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.socialProof.featuredIn.map((publication, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                {publication}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      socialProof: { 
                                        ...prev.socialProof, 
                                        featuredIn: prev.socialProof.featuredIn.filter((_, i) => i !== index)
                                      }
                                    }))
                                  }}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-4 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting Profile...
                      </div>
                    ) : (
                      'Submit Recruiter Profile'
                    )}
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center mt-4 leading-relaxed">
                    All submissions are reviewed by our admin team before being published. 
                    You'll receive an email notification once your profile is approved and live.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}