'use client'

import { useState, useEffect } from 'react'
import { Eye, Check, X, Lock, Star, Settings, Edit3, FolderPlus, Plus, MessageCircle, ThumbsUp, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'

// Mock pending submissions data
// Mock submissions removed - now showing only real user submissions

const ADMIN_PASSWORD = 'admin123' // In production, this would be properly secured

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [submissions, setSubmissions] = useState<any[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const savedAuth = localStorage.getItem('admin_authenticated')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions()
    }
  }, [isAuthenticated])

  const loadSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions')
      if (response.ok) {
        const data = await response.json()
        const formattedSubmissions = data.map((submission: any) => ({
          id: submission.id,
          name: submission.name,
          website: submission.url,
          description: submission.description,
          category: submission.categories?.join(', ') || 'Uncategorized',
          logo: submission.logo,
          submittedAt: submission.created_at,
          status: submission.status || 'pending',
          submitterEmail: submission.submitter_email
        }))
        setSubmissions(formattedSubmissions)
      }
    } catch (error) {
      console.error('Error loading submissions:', error)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
      setLoginError('')
      loadSubmissions()
    } else {
      setLoginError('Invalid password')
    }
  }

  const handleApprove = async (id: string) => {
    if (isLoading) return
    setIsLoading(true)
    
    try {
      console.log('Approving submission:', id)
      const response = await fetch('/api/submissions/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId: id }),
      })
      
      if (!response.ok) {
          const errorData = await response.json();
          console.error('Approval failed:', errorData);
          
          // Handle specific error types
          if (errorData.details === 'duplicate_slug') {
            alert(`Cannot approve: ${errorData.error}\n\nThis submission conflicts with an existing tool. You may need to reject this submission or contact the submitter to choose a different name.`);
          } else {
            alert(`Failed to approve submission: ${errorData.error || 'Unknown error'}`);
          }
          return;
        }
      
      const responseText = await response.text()
      console.log('Approval response:', response.status, responseText)
      
      // Update local state to reflect the approval
      setSubmissions(prev => prev.map(sub => 
        sub.id === id ? { ...sub, status: 'approved' } : sub
      ))
      // Refresh submissions to get updated data
      setTimeout(() => loadSubmissions(), 500)
      alert('Tool approved successfully!')
    } catch (error) {
      console.error('Error approving tool:', error)
      alert('Error approving tool. Check console for details.')
    } finally {
      setIsLoading(false)
    }
    setSelectedSubmission(null)
  }

  const handleReject = async (id: string) => {
    if (isLoading) return
    setIsLoading(true)
    
    try {
      console.log('Rejecting submission:', id)
      const response = await fetch(`/api/submissions?id=${id}`, {
        method: 'DELETE'
      })
      
      const responseText = await response.text()
      console.log('Rejection response:', response.status, responseText)
      
      if (response.ok) {
        // Remove the submission from local state
        setSubmissions(prev => prev.filter(sub => sub.id !== id))
        alert('Submission rejected successfully!')
      } else {
        console.error('Failed to reject submission:', responseText)
        alert('Failed to reject submission. Check console for details.')
      }
    } catch (error) {
      console.error('Error rejecting submission:', error)
      alert('Error rejecting submission. Check console for details.')
    } finally {
      setIsLoading(false)
    }
    setSelectedSubmission(null)
  }

  const refreshSubmissions = () => {
    loadSubmissions()
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
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 text-[#F26B21] mx-auto mb-4" />
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>Enter password to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              
              {loginError && (
                <div className="text-red-600 text-sm">{loginError}</div>
              )}
              
              <Button type="submit" className="w-full bg-[#F26B21] hover:bg-[#F26B21]/90">
                Login
              </Button>
            </form>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              Demo password: admin123
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">Admin Dashboard</h1>
              <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 text-slate-700 hover:text-slate-800 rounded-xl font-medium transition-all duration-300 border border-slate-200/50 hover:border-slate-300/50 shadow-sm hover:shadow-md">
                ← Back to Home
              </Link>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false)
                localStorage.removeItem('admin_authenticated')
              }}
              className="px-5 py-2.5 text-slate-600 hover:text-slate-800 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 rounded-xl transition-all duration-300 border border-red-200/50 hover:border-red-300/50 font-medium shadow-sm hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent mb-4">Welcome to Admin Dashboard</h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">Manage tool submissions, directory content, and featured tools with ease</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200/50">
                <div className="text-sm text-slate-500 font-medium">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="h-48 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white via-orange-50/30 to-orange-100/20 hover:from-orange-50/50 hover:to-orange-100/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-sm">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-800">Submissions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="mb-4 text-sm text-slate-600">Review and approve new tool submissions</CardDescription>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">{submissions.filter(s => s.status === 'pending').length}</div>
              <Badge variant="secondary" className="bg-orange-100/80 text-orange-800 border-orange-300/50 font-medium">Pending submissions</Badge>
            </CardContent>
          </Card>
          
          <Link href="/admin/edit">
            <Card className="h-48 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white via-green-50/30 to-emerald-100/20 hover:from-green-50/50 hover:to-emerald-100/30 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-sm group-hover:from-green-600 group-hover:to-emerald-600 transition-all">
                    <Edit3 className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Edit Tools</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col justify-between h-full">
                <CardDescription className="mb-4 text-sm text-slate-600">Edit, feature, and manage all tools with advanced options</CardDescription>
                <div className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold group-hover:from-green-700 group-hover:to-emerald-700 transition-all">Manage Tools →</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/add">
            <Card className="h-48 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white via-purple-50/30 to-violet-100/20 hover:from-purple-50/50 hover:to-violet-100/30 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl shadow-sm group-hover:from-purple-600 group-hover:to-violet-600 transition-all">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Add Tool</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col justify-between h-full">
                <CardDescription className="mb-4 text-sm text-slate-600">Add new tools to the directory</CardDescription>
                <div className="text-sm bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent font-bold group-hover:from-purple-700 group-hover:to-violet-700 transition-all">Add Tool →</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/priority">
            <Card className="h-48 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white via-blue-50/30 to-cyan-100/20 hover:from-blue-50/50 hover:to-cyan-100/30 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-sm group-hover:from-blue-600 group-hover:to-cyan-600 transition-all">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Top 15 Priority</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col justify-between h-full">
                <CardDescription className="mb-4 text-sm text-slate-600">Manage the top 15 tools that appear first on homepage</CardDescription>
                <div className="text-sm bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold group-hover:from-blue-700 group-hover:to-cyan-700 transition-all">Manage Priority →</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/categories">
            <Card className="h-48 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white via-indigo-50/30 to-purple-100/20 hover:from-indigo-50/50 hover:to-purple-100/30 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-sm group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Categories</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col justify-between h-full">
                <CardDescription className="mb-4 text-sm text-slate-600">Manage categories for tools and submission forms</CardDescription>
                <div className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold group-hover:from-indigo-700 group-hover:to-purple-700 transition-all">Manage Categories →</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/comments">
            <Card className="h-48 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white via-teal-50/30 to-emerald-100/20 hover:from-teal-50/50 hover:to-emerald-100/30 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl shadow-sm group-hover:from-teal-600 group-hover:to-emerald-600 transition-all">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Comments</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col justify-between h-full">
                <CardDescription className="mb-4 text-sm text-slate-600">Review and approve user comments on tools</CardDescription>
                <div className="text-sm bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent font-bold group-hover:from-teal-700 group-hover:to-emerald-700 transition-all">Manage Comments →</div>
              </CardContent>
            </Card>
          </Link>
          </div>

          {/* Second row of navigation cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Link href="/admin/votes">
            <Card className="h-48 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white via-pink-50/30 to-rose-100/20 hover:from-pink-50/50 hover:to-rose-100/30 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-sm group-hover:from-pink-600 group-hover:to-rose-600 transition-all">
                    <ThumbsUp className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Votes</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col justify-between h-full">
                <CardDescription className="mb-4 text-sm text-slate-600">View and manage user votes on tools</CardDescription>
                <div className="text-sm bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent font-bold group-hover:from-pink-700 group-hover:to-rose-700 transition-all">Manage Votes →</div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="h-48 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white via-cyan-50/30 to-blue-100/20 hover:from-cyan-50/50 hover:to-blue-100/30 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-sm group-hover:from-cyan-600 group-hover:to-blue-600 transition-all">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Analytics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col justify-between h-full">
                <CardDescription className="mb-4 text-sm text-slate-600">View tool performance, clicks, shares, and user engagement</CardDescription>
                <div className="text-sm bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-bold group-hover:from-cyan-700 group-hover:to-blue-700 transition-all">View Analytics →</div>
              </CardContent>
            </Card>
          </Link>
          </div>

          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-6 bg-gradient-to-r from-slate-50/80 via-blue-50/50 to-indigo-50/30 border-b border-slate-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">Pending Submissions</CardTitle>
                  <CardDescription className="mt-2 text-slate-600">Review and approve new tool submissions</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={loadSubmissions} variant="outline" size="sm" className="shrink-0 border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-xl font-medium transition-all duration-200">
                    Refresh Submissions
                  </Button>
                  <Button 
                    onClick={() => window.dispatchEvent(new CustomEvent('refreshTools'))} 
                    variant="outline" 
                    size="sm" 
                    className="shrink-0 border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-xl font-medium transition-all duration-200"
                  >
                    Refresh All Data
                  </Button>
                </div>
              </div>
            </CardHeader>
          <CardContent className="pt-0">
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderPlus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending submissions</h3>
                <p className="text-gray-500">New tool submissions will appear here for review.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-muted-foreground">
                    {submissions.length} pending submission{submissions.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="space-y-6">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:border-gray-200">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm">
                            {submission.name ? submission.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900 truncate">
                                {submission.name || 'Untitled Tool'}
                              </h3>
                              <Badge 
                                variant={submission.status === 'pending' ? 'secondary' : 'default'}
                                className={submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                              >
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {submission.description || 'No description provided'}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                🌐 <span className="truncate max-w-[200px] font-medium">{submission.website}</span>
                              </span>
                              <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                📁 <span className="font-medium">{submission.category}</span>
                              </span>
                              <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                📅 <span className="font-medium">{formatDate(submission.submittedAt)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-gray-600 hover:text-gray-700"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {submission.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(submission.id)}
                                className="text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400 transition-all duration-200 rounded-xl px-4 py-2 font-medium"
                                title="Approve"
                                disabled={isLoading}
                              >
                                ✓ Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(submission.id)}
                                className="text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200 rounded-xl px-4 py-2 font-medium"
                                title="Reject"
                                disabled={isLoading}
                              >
                                ✗ Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
          </Card>
        </div>
      </main>

      {/* Submission Detail Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>Review the details of this tool submission</DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  {selectedSubmission.logo}
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold mb-2">{selectedSubmission.name}</h4>
                  <a 
                    href={selectedSubmission.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#F26B21] hover:underline"
                  >
                    {selectedSubmission.website}
                  </a>
                  <div className="mt-2">
                    <Badge variant="secondary">{selectedSubmission.category}</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold mb-2">Description</h5>
                <p className="text-muted-foreground leading-relaxed">{selectedSubmission.description}</p>
              </div>
              
              <div>
                <h5 className="font-semibold mb-2">Submission Details</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Submitted:</span>
                    <div className="font-medium">{formatDate(selectedSubmission.submittedAt)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="mt-1">
                      <Badge 
                        variant={selectedSubmission.status === 'pending' ? 'default' : 
                                selectedSubmission.status === 'approved' ? 'default' : 'destructive'}
                        className={selectedSubmission.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                                  selectedSubmission.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                      >
                        {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedSubmission.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleApprove(selectedSubmission.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Approve Submission'}
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedSubmission.id)}
                    variant="destructive"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Reject Submission'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}