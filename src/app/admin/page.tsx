'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  FileText, 
  Star, 
  TrendingUp, 
  MessageSquare, 
  Award,
  Calendar,
  ArrowUpRight,
  Lock
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import AdminLayout from '../../components/AdminLayout'

const ADMIN_PASSWORD = 'admin123' // In production, this would be properly secured

interface DashboardStats {
  totalRecruiters: number
  pendingSubmissions: number
  totalTestimonials: number
  avgRating: number
  monthlyGrowth: number
  activeRecruiters: number
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [stats, setStats] = useState<DashboardStats>({
    totalRecruiters: 0,
    pendingSubmissions: 0,
    totalTestimonials: 0,
    avgRating: 0,
    monthlyGrowth: 0,
    activeRecruiters: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const savedAuth = localStorage.getItem('admin_authenticated')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData()
    }
  }, [isAuthenticated])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load submissions for pending count
      const submissionsResponse = await fetch('/api/submissions')
      let pendingCount = 0
      if (submissionsResponse.ok) {
        const submissions = await submissionsResponse.json()
        pendingCount = submissions.filter((s: any) => s.status === 'pending').length
      }

      // Load testimonials
      const testimonialsResponse = await fetch('/api/testimonials')
      let testimonialCount = 0
      let avgRating = 0
      if (testimonialsResponse.ok) {
        const testimonials = await testimonialsResponse.json()
        testimonialCount = testimonials.length
        if (testimonials.length > 0) {
          const totalRating = testimonials.reduce((sum: number, t: any) => sum + (t.rating || 0), 0)
          avgRating = totalRating / testimonials.length
        }
      }

      // Mock data for other stats (in production, these would come from real APIs)
      setStats({
        totalRecruiters: 20, // From csvRecruiters length
        pendingSubmissions: pendingCount,
        totalTestimonials: testimonialCount,
        avgRating: avgRating,
        monthlyGrowth: 12.5,
        activeRecruiters: 18
      })

      // Load recent activity from submissions
      const recentSubmissions = submissionsResponse.ok ? await submissionsResponse.json() : []
      const recentActivity = recentSubmissions
        .slice(0, 5) // Get last 5 submissions
        .map((submission: any, index: number) => ({
          id: submission.id || index,
          type: 'submission',
          message: `New recruiter profile submitted`,
          user: submission.name || 'Unknown',
          time: submission.created_at ? new Date(submission.created_at).toLocaleDateString() : 'Recently',
          status: submission.status || 'pending'
        }))

      // Add some mock testimonial activity if we have space
      if (recentActivity.length < 3) {
        recentActivity.push({
          id: 'testimonial-1',
          type: 'testimonial',
          message: 'New testimonial received',
          user: 'Client Review',
          time: 'Yesterday',
          status: 'approved'
        })
      }

      setRecentActivity(recentActivity)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
      setLoginError('')
    } else {
      setLoginError('Invalid password')
    }
  }



  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center pb-8">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Admin Access</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Enter password to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="h-12 px-4 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
                
                {loginError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    {loginError}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Sign In
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  Demo password: <span className="font-mono font-medium">admin123</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back! Here's what's happening with your recruiter directory.">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Recruiters</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalRecruiters}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">+{stats.monthlyGrowth}%</span>
                        <span className="text-sm text-gray-500 ml-1">this month</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Submissions</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.pendingSubmissions}</p>
                      <div className="flex items-center mt-2">
                        {stats.pendingSubmissions > 0 ? (
                          <>
                            <span className="text-sm text-orange-600 font-medium">Needs review</span>
                          </>
                        ) : (
                          <span className="text-sm text-green-600 font-medium">All caught up!</span>
                        )}
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Rating</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(stats.avgRating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">({stats.totalTestimonials} reviews)</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Star className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Recruiters</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.activeRecruiters}</p>
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-sm text-gray-500">Currently accepting clients</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/admin/submissions">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors text-lg">
                        Review Submissions
                      </h3>
                      <p className="text-sm text-gray-600">Approve new profiles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/edit">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-gradient-to-br from-white to-green-50 hover:from-green-50 hover:to-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors text-lg">
                        Manage Recruiters
                      </h3>
                      <p className="text-sm text-gray-600">Edit profiles & settings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/testimonials">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-gradient-to-br from-white to-yellow-50 hover:from-yellow-50 hover:to-yellow-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                      <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-yellow-700 transition-colors text-lg">
                        Testimonials
                      </h3>
                      <p className="text-sm text-gray-600">Manage reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/analytics">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-gradient-to-br from-white to-purple-50 hover:from-purple-50 hover:to-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors text-lg">
                        Analytics
                      </h3>
                      <p className="text-sm text-gray-600">View performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates and actions in your admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'pending' ? 'bg-yellow-500' :
                      activity.status === 'approved' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-600">by {activity.user} • {activity.time}</p>
                    </div>
                    <Badge variant={
                      activity.status === 'pending' ? 'secondary' :
                      activity.status === 'approved' ? 'default' : 'outline'
                    }>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  )
}