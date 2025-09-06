'use client'

import { useState, useEffect } from 'react'
import { Eye, Check, X, Lock, Star, Settings, Edit3, FolderPlus, Plus } from 'lucide-react'
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
      const response = await fetch(`/api/submissions`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                ← Back to Home
              </Link>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false)
                localStorage.removeItem('admin_authenticated')
              }}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Manage tool submissions and directory content</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-[#F26B21]" />
                <CardTitle className="text-lg">Submissions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Review and approve new tool submissions</CardDescription>
              <div className="text-2xl font-bold text-[#F26B21] mb-2">{submissions.filter(s => s.status === 'pending').length}</div>
              <Badge variant="secondary">Pending submissions</Badge>
            </CardContent>
          </Card>
          
          <Link href="/admin/featured">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-[#F26B21]" />
                  <CardTitle className="text-lg">Featured Tools</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">Manage which tools appear in the featured section</CardDescription>
                <div className="text-sm text-[#F26B21] font-medium">Manage Featured →</div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/directory">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FolderPlus className="w-6 h-6 text-[#F26B21]" />
                  <CardTitle className="text-lg">Directory</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">Add or remove tools from the main directory</CardDescription>
                <div className="text-sm text-[#F26B21] font-medium">Manage Directory →</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/edit">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Edit3 className="w-6 h-6 text-[#F26B21]" />
                  <CardTitle className="text-lg">Edit Tools</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">Edit tool logos and descriptions</CardDescription>
                <div className="text-sm text-[#F26B21] font-medium">Edit Tools →</div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/add">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Plus className="w-6 h-6 text-[#F26B21]" />
                  <CardTitle className="text-lg">Add Tool</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">Add new tools to the directory</CardDescription>
                <div className="text-sm text-[#F26B21] font-medium">Add Tool →</div>
              </CardContent>
            </Card>
          </Link>
          </div>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Pending Submissions</CardTitle>
                  <CardDescription className="mt-1 text-gray-600">Review and approve new tool submissions</CardDescription>
                </div>
                <Button onClick={loadSubmissions} variant="outline" size="sm" className="shrink-0 border-gray-200 hover:bg-gray-50">
                  Refresh Submissions
                </Button>
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
                
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shrink-0">
                            {submission.name ? submission.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {submission.name || 'Untitled Tool'}
                              </h3>
                              <Badge 
                                variant={submission.status === 'pending' ? 'secondary' : 'default'}
                                className={submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                              >
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {submission.description || 'No description provided'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                🌐 <span className="truncate max-w-[200px]">{submission.website}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                📁 {submission.category}
                              </span>
                              <span className="flex items-center gap-1">
                                📅 {formatDate(submission.submittedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
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
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(submission.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                title="Approve"
                                disabled={isLoading}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(submission.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Reject"
                                disabled={isLoading}
                              >
                                <X className="w-4 h-4" />
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