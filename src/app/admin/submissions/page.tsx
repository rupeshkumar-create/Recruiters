'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, X, Eye, Trash2, Clock, User, Building, Mail, Phone, MapPin, Calendar, Award, Briefcase, Globe, Users } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import AdminLayout from '../../../components/AdminLayout'

interface Submission {
  id: string
  name: string
  job_title?: string
  jobTitle?: string
  company: string
  email: string
  phone: string
  linkedin: string
  website?: string
  location: string
  experience: string
  bio: string
  avatar: string
  slug?: string
  specialization?: string
  specializations?: string[] | string
  placements?: number
  avg_time_to_hire?: number
  avgTimeToHire?: number
  candidate_satisfaction?: number
  candidateSatisfaction?: number
  client_retention?: number
  clientRetention?: number
  achievements?: string[] | string
  work_experience?: Array<{
    jobTitle: string
    company: string
    duration: string
    description?: string
  }> | string
  workExperience?: Array<{
    jobTitle: string
    company: string
    duration: string
    description?: string
  }>
  roles_placed?: string[] | string
  rolesPlaced?: string[]
  industries?: string[] | string
  keywords?: string[] | string
  languages?: string[] | string
  seniority_levels?: string[] | string
  seniorityLevels?: string[]
  employment_types?: string[] | string
  employmentTypes?: string[]
  regions?: string[] | string
  certifications?: string[] | string
  availability?: {
    accepting: boolean
    nextAvailable: string
  } | string
  social_proof?: {
    linkedinFollowers: number
    featuredIn: string[]
  } | string
  socialProof?: {
    linkedinFollowers: number
    featuredIn: string[]
  }
  status: 'pending' | 'approved' | 'rejected'
  approved?: boolean
  hidden?: boolean
  submitter_email?: string
  submitterEmail?: string
  created_at: string
  updated_at: string
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      } else {
        console.error('Failed to load submissions')
        // Set empty array as fallback
        setSubmissions([])
      }
    } catch (error) {
      console.error('Error loading submissions:', error)
      // Set empty array as fallback to prevent crashes
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id)
      const response = await fetch(`/api/submissions?id=${id}&action=approve`, {
        method: 'PUT'
      })
      
      if (response.ok) {
        await loadSubmissions()
        setSelectedSubmission(null)
        alert('Submission approved successfully!')
      } else {
        alert('Failed to approve submission')
      }
    } catch (error) {
      console.error('Error approving submission:', error)
      alert('Error approving submission')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    try {
      setActionLoading(id)
      const response = await fetch(`/api/submissions?id=${id}&action=reject`, {
        method: 'PUT'
      })
      
      if (response.ok) {
        await loadSubmissions()
        setSelectedSubmission(null)
        alert('Submission rejected successfully!')
      } else {
        alert('Failed to reject submission')
      }
    } catch (error) {
      console.error('Error rejecting submission:', error)
      alert('Error rejecting submission')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return
    
    try {
      setActionLoading(id)
      const response = await fetch(`/api/submissions?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await loadSubmissions()
        setSelectedSubmission(null)
        alert('Submission deleted successfully!')
      } else {
        alert('Failed to delete submission')
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
      alert('Error deleting submission')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><X className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  return (
    <AdminLayout 
      title="Recruiter Submissions" 
      subtitle="Review and approve new recruiter profile submissions"
    >
      <div className="mb-6">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-xl font-medium inline-block">
          Total Submissions: {submissions.length}
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-3 text-gray-600">Loading submissions...</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No submissions yet</h3>
              <p className="text-gray-600">New recruiter profile submissions will appear here</p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {submissions.map((submission) => (
                <motion.div 
                  key={submission.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-150"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex gap-6">
                    {/* Submission Information */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img 
                            src={submission.avatar}
                            alt={submission.name}
                            className="w-full h-full object-cover rounded-full bg-gray-50"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{submission.name}</h3>
                            {getStatusBadge(submission.status)}
                          </div>
                          <p className="text-orange-600 font-medium">{submission.jobTitle || submission.job_title}</p>
                          <p className="text-gray-600">{submission.company}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {submission.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {submission.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(submission.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(() => {
                              try {
                                const specs = typeof submission.specializations === 'string' 
                                  ? JSON.parse(submission.specializations)
                                  : submission.specializations || [submission.specialization];
                                return specs.slice(0, 3).map((spec: string, index: number) => (
                                  <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                                    {spec}
                                  </span>
                                ));
                              } catch (error) {
                                return submission.specialization ? (
                                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                                    {submission.specialization}
                                  </span>
                                ) : null;
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setSelectedSubmission(submission)}
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 border-blue-300 text-blue-700 hover:bg-blue-50"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {submission.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleApprove(submission.id)}
                            disabled={actionLoading === submission.id}
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 border-green-300 text-green-700 hover:bg-green-50"
                            title="Approve submission"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleReject(submission.id)}
                            disabled={actionLoading === submission.id}
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 border-red-300 text-red-700 hover:bg-red-50"
                            title="Reject submission"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      <Button
                        onClick={() => handleDelete(submission.id)}
                        disabled={actionLoading === submission.id}
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                        title="Delete submission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
      </div>

      {/* Submission Details Modal */}
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {selectedSubmission?.name}
                  </DialogTitle>
                  <p className="text-gray-600 mt-1">Recruiter Profile Submission</p>
                </div>
              </div>
            </DialogHeader>

            {selectedSubmission && (
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900">{selectedSubmission.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Job Title</label>
                      <p className="text-gray-900">{selectedSubmission.jobTitle || selectedSubmission.job_title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company</label>
                      <p className="text-gray-900">{selectedSubmission.company}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedSubmission.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedSubmission.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-gray-900">{selectedSubmission.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Experience</label>
                      <p className="text-gray-900">{selectedSubmission.experience}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">LinkedIn</label>
                      <a href={selectedSubmission.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Profile
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Bio */}
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Bio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{selectedSubmission.bio}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Word count: {selectedSubmission.bio.trim().split(/\s+/).length} words
                    </p>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{selectedSubmission.placements || 0}+</div>
                      <div className="text-sm text-gray-600">Placements</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedSubmission.avg_time_to_hire || selectedSubmission.avgTimeToHire || 30}</div>
                      <div className="text-sm text-gray-600">Avg. Days to Hire</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedSubmission.candidate_satisfaction || selectedSubmission.candidateSatisfaction || 90}%</div>
                      <div className="text-sm text-gray-600">Candidate Satisfaction</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedSubmission.client_retention || selectedSubmission.clientRetention || 85}%</div>
                      <div className="text-sm text-gray-600">Client Retention</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Specializations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          try {
                            const specs = typeof selectedSubmission.specializations === 'string' 
                              ? JSON.parse(selectedSubmission.specializations)
                              : selectedSubmission.specializations || [selectedSubmission.specialization];
                            return specs.map((spec: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                {spec}
                              </span>
                            ));
                          } catch (error) {
                            return selectedSubmission.specialization ? (
                              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                {selectedSubmission.specialization}
                              </span>
                            ) : null;
                          }
                        })()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Languages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          try {
                            const langs = typeof selectedSubmission.languages === 'string' 
                              ? JSON.parse(selectedSubmission.languages)
                              : selectedSubmission.languages || [];
                            return langs.map((lang: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {lang}
                              </span>
                            ));
                          } catch (error) {
                            return <span className="text-gray-500 text-sm">No languages specified</span>;
                          }
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Actions */}
                {selectedSubmission.status === 'pending' && (
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <Button
                      onClick={() => handleReject(selectedSubmission.id)}
                      disabled={actionLoading === selectedSubmission.id}
                      variant="outline"
                      className="px-6 py-2.5 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedSubmission.id)}
                      disabled={actionLoading === selectedSubmission.id}
                      className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Profile
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
    </AdminLayout>
  )
}