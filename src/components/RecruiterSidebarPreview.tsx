'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, MapPin, Briefcase, Star, Calendar, TrendingUp, CheckCircle, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface RecruiterSidebarPreviewProps {
  recruiter: any | null
  isOpen: boolean
  onClose: () => void
}

export default function RecruiterSidebarPreview({ recruiter, isOpen, onClose }: RecruiterSidebarPreviewProps) {
  const router = useRouter()

  if (!recruiter) return null

  const handleViewFullProfile = () => {
    router.push(`/tool/${recruiter.slug}`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] md:w-[450px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Quick Preview</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4">
                  <img
                    src={recruiter.avatar}
                    alt={recruiter.name}
                    className="w-full h-full rounded-full object-cover border-4 border-gray-100"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{recruiter.name}</h2>
                <p className="text-orange-600 font-medium mb-2">{recruiter.jobTitle}</p>
                <p className="text-gray-600">{recruiter.company}</p>
                
                {/* Badges */}
                <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                  {recruiter.featured && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      ⭐ Featured
                    </Badge>
                  )}
                  {recruiter.badge && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {recruiter.badge === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {recruiter.badge === 'top-rated' && <Star className="w-3 h-3 mr-1" />}
                      {recruiter.badge === 'rising-star' && <TrendingUp className="w-3 h-3 mr-1" />}
                      {recruiter.badge.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              {recruiter.rating && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-2xl font-bold text-gray-900">{recruiter.rating}</span>
                      <span className="text-gray-600">/ 5.0</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{recruiter.reviewCount || 0} reviews</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Information */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900 font-medium">{recruiter.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Specialization</p>
                    <p className="text-gray-900 font-medium">{recruiter.specialization}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-gray-900 font-medium">{recruiter.experience}</p>
                  </div>
                </div>

                {recruiter.placements && (
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Total Placements</p>
                      <p className="text-gray-900 font-medium">{recruiter.placements}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio Preview */}
              {recruiter.bio && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600 text-sm line-clamp-4">
                    {recruiter.bio}
                  </p>
                </div>
              )}

              {/* Performance Metrics */}
              {(recruiter.candidateSatisfaction || recruiter.clientRetention) && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Performance</h4>
                  {recruiter.candidateSatisfaction && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Candidate Satisfaction</span>
                      <span className="text-sm font-semibold text-gray-900">{recruiter.candidateSatisfaction}%</span>
                    </div>
                  )}
                  {recruiter.clientRetention && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Client Retention</span>
                      <span className="text-sm font-semibold text-gray-900">{recruiter.clientRetention}%</span>
                    </div>
                  )}
                  {recruiter.avgTimeToHire && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg. Time to Hire</span>
                      <span className="text-sm font-semibold text-gray-900">{recruiter.avgTimeToHire} days</span>
                    </div>
                  )}
                </div>
              )}

              {/* Remote Available */}
              {recruiter.remoteAvailable && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span>Remote work available</span>
                </div>
              )}
            </div>

            {/* Footer - View Full Profile Button */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <Button
                onClick={handleViewFullProfile}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg"
              >
                View Full Profile
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}