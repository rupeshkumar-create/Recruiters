'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  MessageSquare,
  BarChart3,
  Bell
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  {
    name: 'Submissions',
    href: '/admin/submissions',
    icon: FileText,
    description: 'Review new profiles',
    badge: 'pending'
  },
  {
    name: 'Recruiters',
    href: '/admin/edit',
    icon: Users,
    description: 'Manage profiles'
  },
  {
    name: 'Testimonials',
    href: '/admin/testimonials',
    icon: MessageSquare,
    description: 'Reviews & ratings'
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Performance metrics'
  },
  {
    name: 'Filters',
    href: '/admin/filters',
    icon: Settings,
    description: 'Manage filter options'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System configuration'
  }
]

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    // Load pending submissions count
    const loadPendingCount = async () => {
      try {
        const response = await fetch('/api/submissions')
        if (response.ok) {
          const data = await response.json()
          const pending = data.filter((item: any) => item.status === 'pending').length
          setPendingCount(pending)
        }
      } catch (error) {
        console.warn('Could not load pending count, using fallback:', error)
        // Set a fallback count for demo purposes
        setPendingCount(2)
      }
    }
    
    loadPendingCount()
    
    // Listen for updates from other admin pages
    const handleRecruitersUpdate = () => {
      loadPendingCount()
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('recruitersUpdated', handleRecruitersUpdate)
      return () => window.removeEventListener('recruitersUpdated', handleRecruitersUpdate)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
                <div className="text-xs text-gray-500 font-medium">Recruiter Directory</div>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 shadow-sm border border-orange-100'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive 
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-600'
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.name}</span>
                      {item.badge === 'pending' && pendingCount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 shadow-sm">
                          {pendingCount}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">System Administrator</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-gray-700 hover:text-red-700 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-100 bg-white/95 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              {title && (
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                ← Back to Site
              </Link>
              <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center shadow-sm">
                    {pendingCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 min-h-screen">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}