'use client'

import { useState, useEffect } from 'react'
import { Eye, Check, X, Lock, Star, Settings, Edit3, FolderPlus } from 'lucide-react'
import Link from 'next/link'

// Mock pending submissions data
const mockSubmissions = [
  {
    id: 1,
    name: 'CandidateGPT',
    website: 'https://candidategpt.ai',
    description: 'AI-powered candidate evaluation and screening platform with natural language processing',
    category: 'Resume Screening',
    logo: '🧠',
    submittedAt: '2024-01-15T10:30:00Z',
    status: 'pending'
  },
  {
    id: 2,
    name: 'RecruiterBot',
    website: 'https://recruiterbot.com',
    description: 'Automated recruitment assistant that handles initial candidate outreach and scheduling',
    category: 'Candidate Sourcing',
    logo: '🤖',
    submittedAt: '2024-01-14T15:45:00Z',
    status: 'pending'
  },
  {
    id: 3,
    name: 'SkillSync',
    website: 'https://skillsync.io',
    description: 'Real-time skill matching and candidate ranking system for technical roles',
    category: 'Resume Screening',
    logo: '⚡',
    submittedAt: '2024-01-13T09:20:00Z',
    status: 'pending'
  }
]

const ADMIN_PASSWORD = 'admin123' // In production, this would be properly secured

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [submissions, setSubmissions] = useState(mockSubmissions)
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [loginError, setLoginError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('Invalid password')
    }
  }

  const handleApprove = (id: number) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'approved' } : sub
    ))
    setSelectedSubmission(null)
  }

  const handleReject = (id: number) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'rejected' } : sub
    ))
    setSelectedSubmission(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-[#F26B21] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600 mt-2">Enter password to access the admin dashboard</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F26B21] focus:border-transparent outline-none"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {loginError && (
              <div className="mb-4 text-red-600 text-sm">{loginError}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-[#F26B21] text-white py-2 rounded-lg hover:bg-[#F26B21]/90 transition-colors font-medium"
            >
              Login
            </button>
          </form>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            Demo password: admin123
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-[#F26B21]" />
              <h3 className="text-lg font-semibold text-gray-900">Submissions</h3>
            </div>
            <p className="text-gray-600 mb-4">Review and approve new tool submissions</p>
            <div className="text-2xl font-bold text-[#F26B21] mb-2">{submissions.filter(s => s.status === 'pending').length}</div>
            <div className="text-sm text-gray-500">Pending submissions</div>
          </div>
          
          <Link href="/admin/featured">
            <div className="muted-card rounded-xl shadow-sm border-neutral-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 orange-accent" />
                <h3 className="text-lg font-semibold muted-text">Featured Tools</h3>
              </div>
              <p className="muted-text-light mb-4">Manage which tools appear in the featured section</p>
              <div className="text-sm orange-accent font-medium">Manage Featured →</div>
            </div>
          </Link>

          <Link href="/admin/directory">
            <div className="muted-card rounded-xl shadow-sm border-neutral-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <FolderPlus className="w-6 h-6 orange-accent" />
                <h3 className="text-lg font-semibold muted-text">Directory</h3>
              </div>
              <p className="muted-text-light mb-4">Add or remove tools from the main directory</p>
              <div className="text-sm orange-accent font-medium">Manage Directory →</div>
            </div>
          </Link>
          
          <Link href="/admin/edit">
            <div className="muted-card rounded-xl shadow-sm border-neutral-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <Edit3 className="w-6 h-6 orange-accent" />
                <h3 className="text-lg font-semibold muted-text">Edit Tools</h3>
              </div>
              <p className="muted-text-light mb-4">Edit tool logos and descriptions</p>
              <div className="text-sm orange-accent font-medium">Edit Tools →</div>
            </div>
          </Link>
        </div>

        <div className="muted-card rounded-xl shadow-sm border-neutral-100">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-xl font-semibold muted-text">Pending Submissions</h2>
            <p className="muted-text-light mt-1">Review and approve new tool submissions</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tool
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{submission.logo}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                          <div className="text-sm text-gray-500">{submission.website}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {submission.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(submission.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="text-[#F26B21] hover:text-[#F26B21]/80 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {submission.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(submission.id)}
                              className="text-green-600 hover:text-green-800 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(submission.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Review Submission</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{selectedSubmission.logo}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedSubmission.name}</h3>
                    <a 
                      href={selectedSubmission.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#F26B21] hover:underline"
                    >
                      {selectedSubmission.website}
                    </a>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                    {selectedSubmission.category}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedSubmission.description}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                  <p className="text-gray-600">{formatDate(selectedSubmission.submittedAt)}</p>
                </div>
                
                {selectedSubmission.status === 'pending' && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleApprove(selectedSubmission.id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedSubmission.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}