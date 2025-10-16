'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save, ArrowLeft, Search, Plus, Trash2, X, Eye, EyeOff, Star, Loader2, User, MapPin, Calendar, Briefcase, CheckCircle, TrendingUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Recruiter, WorkExperience, Testimonial } from '../../../lib/data'
import { RecruiterStorage } from '../../../lib/recruiterStorage'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Checkbox } from '../../../components/ui/checkbox'
import { Badge } from '../../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Card, CardContent } from '../../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import HeadshotManager from '../../../components/HeadshotManager'

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

export default function EditRecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingRecruiter, setEditingRecruiter] = useState<Recruiter | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('basic')
  
  // Form state for all recruiter fields
  const [editForm, setEditForm] = useState({
    // Basic Information
    name: '',
    jobTitle: '',
    company: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    specialization: '',
    experience: '',
    location: '',
    remoteAvailable: false,
    bio: '',
    avatar: '',
    slug: '',
    featured: false,
    hidden: false,
    
    // Performance Metrics
    rating: 0,
    reviewCount: 0,
    placements: 0,
    avgTimeToHire: 30,
    candidateSatisfaction: 90,
    clientRetention: 85,
    badge: undefined as 'verified' | 'top-rated' | 'rising-star' | undefined,
    
    // Professional Details
    achievements: [] as string[],
    workExperience: [] as WorkExperience[],
    rolesPlaced: [] as string[],
    industries: [] as string[],
    keywords: [] as string[],
    languages: [] as string[],
    seniorityLevels: [] as string[],
    employmentTypes: [] as string[],
    regions: [] as string[],
    certifications: [] as string[],
    
    // Testimonials
    testimonials: [] as Testimonial[],
    
    // Availability & Social Proof
    availability: {
      accepting: true,
      nextAvailable: ''
    },
    socialProof: {
      linkedinFollowers: 0,
      featuredIn: [] as string[]
    }
  })

  useEffect(() => {
    refreshRecruiters()
    
    // Listen for visibility changes to refresh when tab becomes active
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshRecruiters()
      }
    }
    
    // Listen for custom events from other parts of the app
    const handleRecruitersUpdated = () => {
      refreshRecruiters()
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('recruitersUpdated', handleRecruitersUpdated)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('recruitersUpdated', handleRecruitersUpdated)
    }
  }, [])

  const refreshRecruiters = async () => {
    try {
      setLoading(true)
      // Load from API to get the latest data including approved recruiters
      const response = await fetch('/api/recruiters')
      if (response.ok) {
        const recruiters = await response.json()
        setRecruiters(recruiters)
      } else {
        console.error('Failed to load recruiters from API')
        // Fallback to RecruiterStorage
        const recruiters = await RecruiterStorage.getAll()
        setRecruiters(recruiters)
      }
    } catch (error) {
      console.error('Error fetching recruiters:', error)
      // Fallback to sync storage
      const recruiters = RecruiterStorage.getAllSync()
      setRecruiters(recruiters)
    } finally {
      setLoading(false)
    }
  }

  const filteredRecruiters = recruiters.filter(recruiter => 
    recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recruiter.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recruiter.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recruiter.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditRecruiter = (recruiter: Recruiter) => {
    setEditingRecruiter(recruiter)
    setEditForm({
      // Basic Information
      name: recruiter.name,
      jobTitle: recruiter.jobTitle || '',
      company: recruiter.company,
      email: recruiter.email,
      phone: recruiter.phone,
      linkedin: recruiter.linkedin,
      website: recruiter.website || '',
      specialization: recruiter.specialization,
      experience: recruiter.experience,
      location: recruiter.location,
      remoteAvailable: recruiter.remoteAvailable || false,
      bio: recruiter.bio,
      avatar: recruiter.avatar,
      slug: recruiter.slug,
      featured: recruiter.featured,
      hidden: recruiter.hidden || false,
      
      // Performance Metrics
      rating: recruiter.rating || 0,
      reviewCount: recruiter.reviewCount || 0,
      placements: recruiter.placements || 0,
      avgTimeToHire: recruiter.avgTimeToHire || 30,
      candidateSatisfaction: recruiter.candidateSatisfaction || 90,
      clientRetention: recruiter.clientRetention || 85,
      badge: recruiter.badge || undefined,
      
      // Professional Details
      achievements: recruiter.achievements || [],
      workExperience: recruiter.workExperience || [],
      rolesPlaced: recruiter.rolesPlaced || [],
      industries: recruiter.industries || [],
      keywords: recruiter.keywords || [],
      languages: recruiter.languages || [],
      seniorityLevels: recruiter.seniorityLevels || [],
      employmentTypes: recruiter.employmentTypes || [],
      regions: recruiter.regions || [],
      certifications: recruiter.certifications || [],
      
      // Testimonials
      testimonials: recruiter.testimonials || [],
      
      // Availability & Social Proof
      availability: {
        accepting: recruiter.availability?.accepting ?? true,
        nextAvailable: recruiter.availability?.nextAvailable || ''
      },
      socialProof: {
        linkedinFollowers: recruiter.socialProof?.linkedinFollowers || 0,
        featuredIn: recruiter.socialProof?.featuredIn || []
      }
    })
    setActiveTab('basic')
  }

  // Helper functions for array manipulation
  const addArrayItem = (field: keyof typeof editForm, value: string) => {
    if (!value.trim()) return
    const currentArray = editForm[field] as string[]
    if (!currentArray.includes(value.trim())) {
      setEditForm(prev => ({
        ...prev,
        [field]: [...currentArray, value.trim()]
      }))
    }
  }

  const removeArrayItem = (field: keyof typeof editForm, index: number) => {
    const currentArray = editForm[field] as string[]
    setEditForm(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index)
    }))
  }

  const addWorkExperience = () => {
    setEditForm(prev => ({
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
    setEditForm(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeWorkExperience = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }))
  }

  const addTestimonial = () => {
    setEditForm(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, {
        quote: '',
        reviewer: '',
        rating: 5
      }]
    }))
  }

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) => 
        i === index ? { ...testimonial, [field]: value } : testimonial
      )
    }))
  }

  const removeTestimonial = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }))
  }

  const handleSaveEdit = async () => {
    if (!editingRecruiter) return
    
    setIsSaving(true)
    try {
      console.log('Saving recruiter data:', editForm)
      
      // Save to API
      const response = await fetch(`/api/recruiters/${editingRecruiter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      })

      if (!response.ok) {
        throw new Error('Failed to save recruiter data')
      }

      const result = await response.json()
      console.log('API response:', result)
      
      // Close the edit modal first
      setEditingRecruiter(null)
      
      // Refresh the recruiters list from API to get the latest data
      console.log('Refreshing recruiters data...')
      await refreshRecruiters()
      
      // Get the fresh data from API and notify all components
      const apiResponse = await fetch('/api/recruiters')
      let freshRecruiters = []
      if (apiResponse.ok) {
        freshRecruiters = await apiResponse.json()
        console.log('Fresh recruiters loaded:', freshRecruiters.length)
        
        // Dispatch events to update all components
        console.log('Dispatching update events...')
        window.dispatchEvent(new CustomEvent('recruitersUpdated', {
          detail: { recruiters: freshRecruiters }
        }))
      }
      
      // Force homepage refresh
      window.dispatchEvent(new CustomEvent('refreshTools'))
      
      // Trigger storage event for cross-tab updates
      if (typeof window !== 'undefined') {
        localStorage.setItem('recruiters_data', JSON.stringify(freshRecruiters))
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'recruiters_data',
          newValue: JSON.stringify(freshRecruiters),
          oldValue: null,
          storageArea: localStorage,
          url: window.location.href
        }))
      }
      
      alert('Recruiter profile updated successfully!')
      
    } catch (error) {
      console.error('Error updating recruiter:', error)
      alert('Failed to update recruiter profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingRecruiter(null)
    setActiveTab('basic')
  }

  const handleDeleteRecruiter = async (recruiterId: string) => {
    try {
      // In production, this would make an API call
      setRecruiters(prev => prev.filter(r => r.id !== recruiterId))
      setShowDeleteConfirm(null)
      alert('Recruiter deleted successfully!')
    } catch (error) {
      console.error('Error deleting recruiter:', error)
      alert('Failed to delete recruiter')
    }
  }

  const handleToggleVisibility = async (recruiterId: string) => {
    try {
      setRecruiters(prev => prev.map(recruiter => 
        recruiter.id === recruiterId 
          ? { ...recruiter, hidden: !recruiter.hidden }
          : recruiter
      ))
    } catch (error) {
      console.error('Error toggling recruiter visibility:', error)
    }
  }

  const handleToggleFeatured = async (recruiterId: string) => {
    try {
      setRecruiters(prev => prev.map(recruiter => 
        recruiter.id === recruiterId 
          ? { ...recruiter, featured: !recruiter.featured }
          : recruiter
      ))
    } catch (error) {
      console.error('Error toggling recruiter featured status:', error)
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-orange-600">👥</span>
                  Edit Recruiters
                </h1>
                <p className="text-gray-600 mt-2">Manage recruiter profiles and information</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-xl font-medium">
              Total Recruiters: {recruiters.length}
            </div>
          </div>
        </motion.div>

        {/* Search and Controls */}
        <motion.div className="mb-8 flex items-center gap-4" variants={itemVariants}>
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search recruiters by name, company, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-full border-gray-300 rounded-xl focus:border-orange-600 focus:ring-orange-600 text-base"
            />
          </div>
          <Button
            onClick={refreshRecruiters}
            disabled={loading}
            variant="outline"
            className="px-4 py-3 border-gray-300 hover:border-orange-600 hover:text-orange-600"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              '↻'
            )}
          </Button>
        </motion.div>

        {/* Recruiters List */}
        <motion.div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden" variants={itemVariants}>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-3 text-gray-600">Loading recruiters...</span>
            </div>
          ) : filteredRecruiters.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recruiters found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {filteredRecruiters.map((recruiter, index) => (
                <motion.div 
                  key={recruiter.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-150"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex gap-6">
                    {/* Recruiter Information */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img 
                            src={recruiter.avatar}
                            alt={recruiter.name}
                            className="w-full h-full object-cover rounded-full bg-gray-50"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{recruiter.name}</h3>
                            {recruiter.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800">⭐ Featured</Badge>
                            )}
                            {recruiter.badge && (
                              <Badge className="bg-green-100 text-green-800">
                                {recruiter.badge === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                                {recruiter.badge === 'top-rated' && <Star className="w-3 h-3 mr-1" />}
                                {recruiter.badge === 'rising-star' && <TrendingUp className="w-3 h-3 mr-1" />}
                                {recruiter.badge.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            )}
                          </div>
                          <p className="text-orange-600 font-medium">{recruiter.jobTitle}</p>
                          <p className="text-gray-600">{recruiter.company}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {recruiter.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {recruiter.specialization}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {recruiter.experience}
                            </span>
                            {recruiter.rating && (
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                {recruiter.rating}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => window.open(`/tool/${recruiter.slug}`, '_blank')}
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 border-blue-300 text-blue-700 hover:bg-blue-50"
                        title="View live profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleToggleFeatured(recruiter.id)}
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                        title={recruiter.featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        {recruiter.featured ? '⭐' : '☆'}
                      </Button>
                      <Button
                        onClick={() => handleEditRecruiter(recruiter)}
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 border-orange-300 text-orange-700 hover:bg-orange-50"
                        title="Edit recruiter"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => setShowDeleteConfirm(recruiter.id)}
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 border-red-300 text-red-700 hover:bg-red-50"
                        title="Delete recruiter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleToggleVisibility(recruiter.id)}
                        variant="outline"
                        size="sm"
                        className={`h-9 px-3 ${
                          recruiter.hidden 
                            ? 'border-green-300 text-green-700 hover:bg-green-50' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        title={recruiter.hidden ? 'Show recruiter' : 'Hide recruiter'}
                      >
                        {recruiter.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Edit Modal */}
        <Dialog open={!!editingRecruiter} onOpenChange={() => handleCancelEdit()}>
          <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Edit {editingRecruiter?.name}
                  </DialogTitle>
                  <p className="text-gray-600 mt-1">Update recruiter profile and information</p>
                </div>
              </div>
            </DialogHeader>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
              {[
                { id: 'basic', label: 'Basic Info', icon: User },
                { id: 'metrics', label: 'Performance', icon: TrendingUp },
                { id: 'professional', label: 'Professional', icon: Briefcase },
                { id: 'testimonials', label: 'Testimonials', icon: Star },
                { id: 'availability', label: 'Availability', icon: Calendar }
              ].map(tab => (
                <button
                  key={tab.id}
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

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>
                    
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={editForm.jobTitle}
                        onChange={(e) => setEditForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                        placeholder="e.g., Senior Technical Recruiter"
                      />
                    </div>
                    
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={editForm.company}
                        onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Company name"
                      />
                    </div>
                    
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@company.com"
                      />
                    </div>
                    
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
                    
                    <div>
                      <Label>LinkedIn URL</Label>
                      <Input
                        value={editForm.linkedin}
                        onChange={(e) => setEditForm(prev => ({ ...prev, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    
                    <div>
                      <Label>Website (Optional)</Label>
                      <Input
                        value={editForm.website}
                        onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://website.com"
                      />
                    </div>
                    
                    <div>
                      <Label>Specialization</Label>
                      <Input
                        value={editForm.specialization}
                        onChange={(e) => setEditForm(prev => ({ ...prev, specialization: e.target.value }))}
                        placeholder="e.g., Software Engineering"
                      />
                    </div>
                    
                    <div>
                      <Label>Years of Experience</Label>
                      <Input
                        value={editForm.experience}
                        onChange={(e) => setEditForm(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="e.g., 8 years"
                      />
                    </div>
                    
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={editForm.location}
                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, State/Country"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remoteAvailable"
                        checked={editForm.remoteAvailable}
                        onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, remoteAvailable: !!checked }))}
                      />
                      <Label htmlFor="remoteAvailable">Remote work available</Label>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Professional bio and description..."
                      className="h-32"
                    />
                  </div>
                  
                  <div className="lg:col-span-2">
                    <HeadshotManager
                      currentAvatar={editForm.avatar}
                      recruiterName={editForm.name}
                      onAvatarChange={(newAvatarUrl) => setEditForm(prev => ({ ...prev, avatar: newAvatarUrl }))}
                    />
                  </div>
                  
                  <div className="lg:col-span-2 flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={editForm.featured}
                        onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, featured: !!checked }))}
                      />
                      <Label htmlFor="featured">Featured recruiter</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hidden"
                        checked={editForm.hidden}
                        onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, hidden: !!checked }))}
                      />
                      <Label htmlFor="hidden">Hide from directory</Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Metrics Tab */}
              {activeTab === 'metrics' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    
                    <div>
                      <Label>Rating (0-5)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={editForm.rating}
                        onChange={(e) => setEditForm(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Review Count</Label>
                      <Input
                        type="number"
                        min="0"
                        value={editForm.reviewCount}
                        onChange={(e) => setEditForm(prev => ({ ...prev, reviewCount: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Total Placements</Label>
                      <Input
                        type="number"
                        min="0"
                        value={editForm.placements}
                        onChange={(e) => setEditForm(prev => ({ ...prev, placements: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Average Time to Hire (days)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={editForm.avgTimeToHire}
                        onChange={(e) => setEditForm(prev => ({ ...prev, avgTimeToHire: parseInt(e.target.value) || 30 }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Satisfaction Metrics</h3>
                    
                    <div>
                      <Label>Candidate Satisfaction (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={editForm.candidateSatisfaction}
                        onChange={(e) => setEditForm(prev => ({ ...prev, candidateSatisfaction: parseInt(e.target.value) || 90 }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Client Retention (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={editForm.clientRetention}
                        onChange={(e) => setEditForm(prev => ({ ...prev, clientRetention: parseInt(e.target.value) || 85 }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Badge</Label>
                      <Select value={editForm.badge || 'none'} onValueChange={(value) => setEditForm(prev => ({ ...prev, badge: value === 'none' ? undefined : value as 'verified' | 'top-rated' | 'rising-star' }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select badge" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No badge</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="top-rated">Top Rated</SelectItem>
                          <SelectItem value="rising-star">Rising Star</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Details Tab */}
              {activeTab === 'professional' && (
                <div className="space-y-8">
                  {/* Achievements */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                    <div className="space-y-2">
                      {editForm.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [...editForm.achievements]
                              newAchievements[index] = e.target.value
                              setEditForm(prev => ({ ...prev, achievements: newAchievements }))
                            }}
                            placeholder="Achievement description"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem('achievements', index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addArrayItem('achievements', 'New achievement')}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Achievement
                      </Button>
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
                    <div className="space-y-4">
                      {editForm.workExperience.map((exp, index) => (
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
                                <Label>Job Title</Label>
                                <Input
                                  value={exp.jobTitle}
                                  onChange={(e) => updateWorkExperience(index, 'jobTitle', e.target.value)}
                                  placeholder="Job title"
                                />
                              </div>
                              <div>
                                <Label>Company</Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                                  placeholder="Company name"
                                />
                              </div>
                              <div>
                                <Label>Duration</Label>
                                <Input
                                  value={exp.duration}
                                  onChange={(e) => updateWorkExperience(index, 'duration', e.target.value)}
                                  placeholder="e.g., 2020-2023"
                                />
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addWorkExperience}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Work Experience
                      </Button>
                    </div>
                  </div>

                  {/* Skills and Specializations */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Roles Placed */}
                    <div>
                      <Label>Roles Placed</Label>
                      <div className="space-y-2">
                        {editForm.rolesPlaced.map((role, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={role}
                              onChange={(e) => {
                                const newRoles = [...editForm.rolesPlaced]
                                newRoles[index] = e.target.value
                                setEditForm(prev => ({ ...prev, rolesPlaced: newRoles }))
                              }}
                              placeholder="Role title"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayItem('rolesPlaced', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addArrayItem('rolesPlaced', 'New role')}
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Role
                        </Button>
                      </div>
                    </div>

                    {/* Industries */}
                    <div>
                      <Label>Industries</Label>
                      <div className="space-y-2">
                        {editForm.industries.map((industry, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={industry}
                              onChange={(e) => {
                                const newIndustries = [...editForm.industries]
                                newIndustries[index] = e.target.value
                                setEditForm(prev => ({ ...prev, industries: newIndustries }))
                              }}
                              placeholder="Industry name"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayItem('industries', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addArrayItem('industries', 'New industry')}
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Industry
                        </Button>
                      </div>
                    </div>

                    {/* Keywords */}
                    <div>
                      <Label>Keywords & Skills</Label>
                      <div className="space-y-2">
                        {editForm.keywords.map((keyword, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={keyword}
                              onChange={(e) => {
                                const newKeywords = [...editForm.keywords]
                                newKeywords[index] = e.target.value
                                setEditForm(prev => ({ ...prev, keywords: newKeywords }))
                              }}
                              placeholder="Keyword or skill"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayItem('keywords', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addArrayItem('keywords', 'New keyword')}
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Keyword
                        </Button>
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <Label>Languages</Label>
                      <div className="space-y-2">
                        {editForm.languages.map((language, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={language}
                              onChange={(e) => {
                                const newLanguages = [...editForm.languages]
                                newLanguages[index] = e.target.value
                                setEditForm(prev => ({ ...prev, languages: newLanguages }))
                              }}
                              placeholder="Language"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayItem('languages', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addArrayItem('languages', 'New language')}
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Language
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Testimonials Tab */}
              {activeTab === 'testimonials' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Testimonials</h3>
                  <div className="space-y-4">
                    {editForm.testimonials.map((testimonial, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">Testimonial #{index + 1}</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTestimonial(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label>Quote</Label>
                              <Textarea
                                value={testimonial.quote}
                                onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                                placeholder="Testimonial quote..."
                                className="h-24"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Reviewer Name</Label>
                                <Input
                                  value={testimonial.reviewer}
                                  onChange={(e) => updateTestimonial(index, 'reviewer', e.target.value)}
                                  placeholder="Reviewer name"
                                />
                              </div>
                              <div>
                                <Label>Rating (1-5)</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  max="5"
                                  value={testimonial.rating || 5}
                                  onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value) || 5)}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTestimonial}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Testimonial
                    </Button>
                  </div>
                </div>
              )}

              {/* Availability & Social Proof Tab */}
              {activeTab === 'availability' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="accepting"
                        checked={editForm.availability.accepting}
                        onCheckedChange={(checked) => setEditForm(prev => ({ 
                          ...prev, 
                          availability: { ...prev.availability, accepting: !!checked }
                        }))}
                      />
                      <Label htmlFor="accepting">Currently accepting new clients</Label>
                    </div>
                    
                    <div>
                      <Label>Next Available Date (Optional)</Label>
                      <Input
                        value={editForm.availability.nextAvailable}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          availability: { ...prev.availability, nextAvailable: e.target.value }
                        }))}
                        placeholder="e.g., January 2024"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Proof</h3>
                    
                    <div>
                      <Label>LinkedIn Followers</Label>
                      <Input
                        type="number"
                        min="0"
                        value={editForm.socialProof.linkedinFollowers}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          socialProof: { ...prev.socialProof, linkedinFollowers: parseInt(e.target.value) || 0 }
                        }))}
                        placeholder="Number of LinkedIn followers"
                      />
                    </div>
                    
                    <div>
                      <Label>Featured In</Label>
                      <div className="space-y-2">
                        {editForm.socialProof.featuredIn.map((publication, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={publication}
                              onChange={(e) => {
                                const newFeaturedIn = [...editForm.socialProof.featuredIn]
                                newFeaturedIn[index] = e.target.value
                                setEditForm(prev => ({ 
                                  ...prev, 
                                  socialProof: { ...prev.socialProof, featuredIn: newFeaturedIn }
                                }))
                              }}
                              placeholder="Publication name"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newFeaturedIn = editForm.socialProof.featuredIn.filter((_, i) => i !== index)
                                setEditForm(prev => ({ 
                                  ...prev, 
                                  socialProof: { ...prev.socialProof, featuredIn: newFeaturedIn }
                                }))
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditForm(prev => ({ 
                              ...prev, 
                              socialProof: { 
                                ...prev.socialProof, 
                                featuredIn: [...prev.socialProof.featuredIn, 'New publication']
                              }
                            }))
                          }}
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Publication
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                className="px-6 py-2.5"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
          <DialogContent className="w-full max-w-md">
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Delete Recruiter
              </DialogTitle>
            </DialogHeader>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action cannot be undone. The recruiter profile will be permanently removed.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(null)}
                variant="outline"
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                onClick={() => showDeleteConfirm && handleDeleteRecruiter(showDeleteConfirm)}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  )
}