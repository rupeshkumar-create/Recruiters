'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Globe, MapPin, Calendar, TrendingUp, Award, CheckCircle, Star, Clock, Share2, Linkedin, MessageSquare, Users } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import Navigation from '../../../components/Navigation'
import TestimonialForm from '../../../components/TestimonialForm'
import { useState, useEffect } from 'react'
import { Recruiter } from '../../../lib/data'
import { RecruiterStorage } from '../../../lib/recruiterStorage'

interface RecruiterPageProps {
  params: {
    slug: string
  }
}

export default function RecruiterProfile({ params }: RecruiterPageProps) {
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const [shareMessage, setShareMessage] = useState('')
  const [similarRecruiters, setSimilarRecruiters] = useState<Recruiter[]>([])

  const loadRecruiterData = async () => {
    try {
      setLoading(true)
      console.log('Looking for recruiter with slug:', params.slug)
      
      // Get all recruiters from storage
      const allRecruiters = await RecruiterStorage.getAll()
      console.log('Available recruiters:', allRecruiters.length)
      
      // Find recruiter by slug
      const foundRecruiter = allRecruiters.find(r => r.slug === params.slug)
      console.log('Found recruiter:', foundRecruiter)
      
      if (foundRecruiter) {
        setRecruiter(foundRecruiter)
        
        // Find similar recruiters (same specialization, excluding current)
        const similar = allRecruiters
          .filter(r => 
            r.id !== foundRecruiter.id && 
            r.specialization === foundRecruiter.specialization &&
            !r.hidden &&
            r.status === 'approved'
          )
          .slice(0, 5)
        
        // If not enough similar, add random ones
        if (similar.length < 5) {
          const additional = allRecruiters
            .filter(r => 
              r.id !== foundRecruiter.id && 
              !r.hidden &&
              r.status === 'approved' &&
              !similar.find(s => s.id === r.id)
            )
            .slice(0, 5 - similar.length)
          similar.push(...additional)
        }
        
        setSimilarRecruiters(similar)
      }
    } catch (error) {
      console.error('Error loading recruiter data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecruiterData()
    
    // Listen for recruiter updates from admin panel
    const handleRecruitersUpdated = () => {
      console.log('Recruiters updated, refreshing profile page...')
      loadRecruiterData()
    }
    
    // Listen for storage updates
    const handleStorageUpdate = () => {
      loadRecruiterData()
    }
    
    window.addEventListener('recruitersUpdated', handleRecruitersUpdated)
    window.addEventListener('storage', handleStorageUpdate)
    window.addEventListener('refreshTools', handleRecruitersUpdated)
    
    return () => {
      window.removeEventListener('recruitersUpdated', handleRecruitersUpdated)
      window.removeEventListener('storage', handleStorageUpdate)
      window.removeEventListener('refreshTools', handleRecruitersUpdated)
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-6"></div>
          <p className="text-gray-600">Loading recruiter profile...</p>
        </div>
      </div>
    )
  }

  if (!recruiter) {
    notFound()
  }

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200'
      case 'top-rated': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'rising-star': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'verified': return <CheckCircle className="w-3 h-3" />
      case 'top-rated': return <Star className="w-3 h-3" />
      case 'rising-star': return <TrendingUp className="w-3 h-3" />
      default: return null
    }
  }

  const handleContactClick = (type: string) => {
    if (typeof window === 'undefined') return
    
    switch (type) {
      case 'email':
        window.location.href = `mailto:${recruiter.email}`
        break
      case 'linkedin':
        window.open(recruiter.linkedin, '_blank')
        break
      case 'phone':
        window.location.href = `tel:${recruiter.phone}`
        break
      case 'website':
        if (recruiter.website) {
          window.open(recruiter.website, '_blank')
        }
        break
      case 'share':
        handleShare()
        break
    }
  }

  const handleShare = async () => {
    if (typeof window === 'undefined') return
    
    const shareData = {
      title: `${recruiter?.name} - ${recruiter?.jobTitle}`,
      text: `Check out ${recruiter?.name}, a ${recruiter?.specialization} recruiter at ${recruiter?.company}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Error sharing:', error)
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    if (typeof window === 'undefined' || !navigator.clipboard) return
    
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareMessage('Profile link copied to clipboard!')
      setTimeout(() => setShareMessage(''), 3000)
    }).catch(() => {
      setShareMessage('Unable to copy link')
      setTimeout(() => setShareMessage(''), 3000)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navigation onSubmitToolClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Animated Back Button */}
        <div className="mb-8 transform transition-all duration-300 hover:translate-x-1">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-all duration-200 group">
            <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:bg-orange-50">
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" />
            </div>
            <span className="font-medium">Back to Directory</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Simple Hero Section */}
            <Card className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img 
                    src={recruiter.avatar}
                    alt={recruiter.name}
                    className="w-32 h-32 rounded-full object-cover shadow-lg"
                  />
                </div>
                
                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start gap-3 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{recruiter.name}</h1>
                    {recruiter.badge && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getBadgeColor(recruiter.badge)}`}>
                        {getBadgeIcon(recruiter.badge)}
                        {recruiter.badge.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    )}
                  </div>
                  
                  {recruiter.jobTitle && (
                    <p className="text-xl text-orange-600 font-semibold mb-2">{recruiter.jobTitle}</p>
                  )}
                  <p className="text-lg text-gray-700 mb-4">{recruiter.company}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {recruiter.location}
                    </div>
                    {recruiter.remoteAvailable && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        Remote Available
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {recruiter.experience} experience
                    </div>
                  </div>

                  {/* Contact Buttons - Icons Only */}
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 p-2"
                      onClick={() => handleContactClick('email')}
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="p-2"
                      onClick={() => handleContactClick('linkedin')}
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="p-2"
                      onClick={() => handleContactClick('phone')}
                      title="Call"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    {recruiter.website && (
                      <Button 
                        size="sm"
                        variant="outline"
                        className="p-2"
                        onClick={() => handleContactClick('website')}
                        title="Website"
                      >
                        <Globe className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      size="sm"
                      variant="outline"
                      className="p-2"
                      onClick={() => handleContactClick('share')}
                      title="Share Profile"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Share Message */}
                  {shareMessage && (
                    <div className="mt-2 text-sm text-green-600 font-medium">
                      {shareMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Rating Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(recruiter.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{recruiter.rating}</span>
                  <span className="text-gray-600">({recruiter.reviewCount || 0} reviews)</span>
                </div>
              </div>
            </Card>       
     {/* Enhanced About Section */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                <div className="bg-white rounded-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed text-lg">{recruiter.bio}</p>
                  </CardContent>
                </div>
              </div>
            </Card>

            {/* Enhanced Key Stats */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                <div className="bg-white rounded-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                      Key Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { value: `${recruiter.placements || 0}+`, label: 'Placements Made', color: 'from-orange-500 to-red-500', bg: 'from-orange-50 to-red-50' },
                        { value: `${recruiter.avgTimeToHire || 30} days`, label: 'Avg. Time-to-Hire', color: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50' },
                        { value: `${recruiter.candidateSatisfaction || 90}%`, label: 'Candidate Satisfaction', color: 'from-purple-500 to-violet-500', bg: 'from-purple-50 to-violet-50' },
                        { value: `${recruiter.clientRetention || 85}%`, label: 'Clients Retained', color: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50' }
                      ].map((stat, index) => (
                        <div key={index} className={`relative p-4 rounded-xl bg-gradient-to-br ${stat.bg} transform hover:scale-105 transition-all duration-300 group cursor-pointer`}>
                          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                          <div className="relative text-center">
                            <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                              {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>

            {/* Compact Achievements */}
            {recruiter.achievements && recruiter.achievements.length > 0 && (
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                  <div className="bg-white rounded-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {recruiter.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg transform hover:scale-[1.01] transition-all duration-200 group">
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-700 text-sm leading-snug">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            )}

            {/* Enhanced Work Experience */}
            {recruiter.workExperience && recruiter.workExperience.length > 0 && (
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                  <div className="bg-white rounded-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                        Work Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {recruiter.workExperience.map((exp, index) => (
                          <div key={index} className="relative pl-8 pb-6 last:pb-0">
                            <div className="absolute left-0 top-2 w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg"></div>
                            {index < recruiter.workExperience!.length - 1 && (
                              <div className="absolute left-2 top-6 w-0.5 h-full bg-gradient-to-b from-orange-200 to-red-200"></div>
                            )}
                            <div className="bg-gradient-to-r from-gray-50 to-orange-50/30 p-4 rounded-xl transform hover:scale-[1.02] transition-all duration-200">
                              <h4 className="font-semibold text-gray-900 text-lg">{exp.jobTitle}</h4>
                              <p className="text-orange-600 font-medium">{exp.company}</p>
                              <p className="text-sm text-gray-600 mb-2">{exp.duration}</p>
                              {exp.description && (
                                <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            )}     
       {/* Enhanced Roles Placed */}
            {recruiter.rolesPlaced && recruiter.rolesPlaced.length > 0 && (
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                  <div className="bg-white rounded-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                        Roles Placed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {recruiter.rolesPlaced.map((role, index) => (
                          <span 
                            key={index} 
                            className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full text-sm font-medium transform hover:scale-105 transition-all duration-200 cursor-pointer hover:shadow-md"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            )}

            {/* Enhanced Industries */}
            {recruiter.industries && recruiter.industries.length > 0 && (
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                  <div className="bg-white rounded-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                        Industries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {recruiter.industries.map((industry, index) => (
                          <span 
                            key={index} 
                            className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full text-sm font-medium transform hover:scale-105 transition-all duration-200 cursor-pointer hover:shadow-md"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            )}

            {/* Single Enhanced Testimonials Section */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                <div className="bg-white rounded-xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                        Client Testimonials
                      </CardTitle>
                      <Button
                        onClick={() => setShowTestimonialForm(true)}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                        size="sm"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Write a Review
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {recruiter.testimonials && recruiter.testimonials.length > 0 ? (
                      <div className="space-y-6">
                        {recruiter.testimonials.map((testimonial, index) => (
                          <div key={index} className="relative p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-l-4 border-orange-400 transform hover:scale-[1.02] transition-all duration-200">
                            <div className="absolute top-4 right-4 text-orange-200 text-6xl font-serif">"</div>
                            <blockquote className="text-gray-700 italic text-lg leading-relaxed mb-4 relative z-10">
                              {testimonial.quote}
                            </blockquote>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-semibold">
                                {testimonial.reviewer.charAt(0)}
                              </div>
                              <div>
                                <cite className="text-sm font-semibold text-gray-900 not-italic">
                                  {testimonial.reviewer}
                                </cite>
                                {testimonial.rating && (
                                  <div className="flex items-center mt-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="w-10 h-10 text-orange-500" />
                        </div>
                        <p className="text-gray-600 mb-2 text-lg">No testimonials yet</p>
                        <p className="text-sm text-gray-500">Be the first to share your experience working with {recruiter.name}</p>
                      </div>
                    )}
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>  
        {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Specialization */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
              <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                <div className="bg-white rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Specialization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-block px-4 py-3 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-xl font-medium text-center w-full transform group-hover:scale-105 transition-transform duration-200">
                      {recruiter.specialization}
                    </span>
                  </CardContent>
                </div>
              </div>
            </Card>

            {/* Keywords */}
            {recruiter.keywords && recruiter.keywords.length > 0 && (
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                  <div className="bg-white rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Keywords & Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {recruiter.keywords.map((keyword, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transform hover:scale-105 transition-all duration-200 cursor-pointer"
                          >
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            )}

            {/* Languages */}
            {recruiter.languages && recruiter.languages.length > 0 && (
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                  <div className="bg-white rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Languages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {recruiter.languages.map((language, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-medium transform hover:scale-105 transition-all duration-200 cursor-pointer"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            )}

            {/* Recruiting Focus - Only show if any focus data exists */}
            {(recruiter.seniorityLevels && recruiter.seniorityLevels.length > 0) || 
             (recruiter.employmentTypes && recruiter.employmentTypes.length > 0) || 
             (recruiter.regions && recruiter.regions.length > 0) ? (
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                  <div className="bg-white rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Recruiting Focus</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recruiter.seniorityLevels && recruiter.seniorityLevels.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">Seniority Levels</h4>
                          <div className="flex flex-wrap gap-1">
                            {recruiter.seniorityLevels.map((level, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium transform hover:scale-105 transition-all duration-200 cursor-pointer"
                              >
                                {level}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {recruiter.employmentTypes && recruiter.employmentTypes.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">Employment Types</h4>
                          <div className="flex flex-wrap gap-1">
                            {recruiter.employmentTypes.map((type, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium transform hover:scale-105 transition-all duration-200 cursor-pointer"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {recruiter.regions && recruiter.regions.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">Regions</h4>
                          <div className="flex flex-wrap gap-1">
                            {recruiter.regions.map((region, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs font-medium transform hover:scale-105 transition-all duration-200 cursor-pointer"
                              >
                                {region}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            ) : null}    
        {/* Certifications */}
            {recruiter.certifications && recruiter.certifications.length > 0 && (
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                  <div className="bg-white rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recruiter.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg transform hover:scale-105 transition-all duration-200 cursor-pointer">
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                              <Award className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            )}

            {/* Availability */}
            {recruiter.availability && (
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                  <div className="bg-white rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Availability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                          {recruiter.availability.accepting ? (
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                              <Clock className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-medium text-gray-900 block">
                              {recruiter.availability.accepting ? 'Accepting new clients' : 'Not accepting new clients'}
                            </span>
                            {recruiter.availability.nextAvailable && (
                              <span className="text-xs text-gray-600">
                                Next available: {recruiter.availability.nextAvailable}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            )}

            {/* Social Proof - Only show if any social proof data exists */}
            {recruiter.socialProof && 
             ((recruiter.socialProof.linkedinFollowers && recruiter.socialProof.linkedinFollowers > 0) || 
              (recruiter.socialProof.featuredIn && recruiter.socialProof.featuredIn.length > 0)) && (
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                  <div className="bg-white rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Social Proof</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recruiter.socialProof.linkedinFollowers && recruiter.socialProof.linkedinFollowers > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <Linkedin className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {recruiter.socialProof.linkedinFollowers.toLocaleString()} LinkedIn followers
                          </span>
                        </div>
                      )}
                      {recruiter.socialProof.featuredIn && recruiter.socialProof.featuredIn.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 text-sm">Featured In</h4>
                          <div className="space-y-2">
                            {recruiter.socialProof.featuredIn.map((publication, index) => (
                              <div key={index} className="p-2 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg text-sm text-gray-700 font-medium">
                                {publication}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            )}       
     {/* Similar Profiles Section */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500/5 to-red-500/5 p-1">
                <div className="bg-white rounded-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="w-5 h-5 text-orange-600" />
                      Similar Profiles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {similarRecruiters.map((similar, index) => (
                        <Link key={similar.id} href={`/tool/${similar.slug}`}>
                          <div className="group p-4 bg-gradient-to-r from-gray-50 to-orange-50/30 rounded-xl border border-gray-100 hover:border-orange-200 transform hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img 
                                  src={similar.avatar}
                                  alt={similar.name}
                                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md group-hover:ring-orange-200 transition-all duration-200"
                                />
                                {similar.badge && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                                    {getBadgeIcon(similar.badge) && (
                                      <div className="text-white text-xs">
                                        {getBadgeIcon(similar.badge)}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 truncate">
                                  {similar.name}
                                </h4>
                                <p className="text-sm text-gray-600 truncate">{similar.company}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                    {similar.specialization}
                                  </span>
                                  {similar.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                      <span className="text-xs text-gray-600">{similar.rating}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                      
                      {similarRecruiters.length === 0 && (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 text-sm">No similar profiles found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonial Form Modal */}
      <TestimonialForm
        isOpen={showTestimonialForm}
        onClose={() => setShowTestimonialForm(false)}
        recruiterId={recruiter.id}
        recruiterName={recruiter.name}
      />
    </div>
  )
}