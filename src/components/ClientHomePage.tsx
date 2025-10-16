'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, Search, Filter } from 'lucide-react'
import MultiStepSubmissionForm from './MultiStepSubmissionForm'
import HorizontalFilter from './HorizontalFilter'


interface ClientHomePageProps {
  initialRecruiters: any[]
}

export default function ClientHomePage({ initialRecruiters }: ClientHomePageProps) {
  const [recruiters, setRecruiters] = useState(initialRecruiters)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All'])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [additionalFilters, setAdditionalFilters] = useState<{
    locations: string[]
    experienceLevels: string[]
    ratings: string[]
    remoteAvailable: boolean | null
    badges: string[]
    companies: string[]
  }>({
    locations: [],
    experienceLevels: [],
    ratings: [],
    remoteAvailable: null,
    badges: [],
    companies: []
  })
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const router = useRouter()

  // Extract categories from initial data
  useEffect(() => {
    const categorySet = new Set<string>()
    initialRecruiters.forEach((recruiter: any) => {
      if (recruiter.specialization) {
        categorySet.add(recruiter.specialization)
      }
    })
    setCategories(['All', ...Array.from(categorySet).sort()])
  }, [initialRecruiters])

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/recruiters')
      if (response.ok) {
        const freshData = await response.json()
        setRecruiters(freshData)
        
        // Update categories
        const categorySet = new Set<string>()
        freshData.forEach((recruiter: any) => {
          if (recruiter.specialization) {
            categorySet.add(recruiter.specialization)
          }
        })
        setCategories(['All', ...Array.from(categorySet).sort()])
      }
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Load fresh data from API and set up real-time updates
  useEffect(() => {
    const loadFreshData = async () => {
      try {
        const response = await fetch('/api/recruiters')
        if (response.ok) {
          const freshData = await response.json()
          setRecruiters(freshData)
          
          // Update categories
          const categorySet = new Set<string>()
          freshData.forEach((recruiter: any) => {
            if (recruiter.specialization) {
              categorySet.add(recruiter.specialization)
            }
          })
          setCategories(['All', ...Array.from(categorySet).sort()])
        }
      } catch (error) {
        console.error('Error loading fresh data:', error)
      }
    }

    // Load fresh data after initial render
    setTimeout(loadFreshData, 100)

    // Set up periodic refresh to catch newly approved recruiters
    const refreshInterval = setInterval(loadFreshData, 30000) // Refresh every 30 seconds

    // Listen for updates from admin panel
    const handleRecruitersUpdated = (event: CustomEvent) => {
      console.log('Recruiters updated event received')
      setRecruiters(event.detail.recruiters)
      
      // Update categories
      const categorySet = new Set<string>()
      event.detail.recruiters.forEach((recruiter: any) => {
        if (recruiter.specialization) {
          categorySet.add(recruiter.specialization)
        }
      })
      setCategories(['All', ...Array.from(categorySet).sort()])
    }
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'recruiters_data' && event.newValue) {
        console.log('Storage change detected')
        try {
          const updatedRecruiters = JSON.parse(event.newValue)
          setRecruiters(updatedRecruiters)
          
          // Update categories
          const categorySet = new Set<string>()
          updatedRecruiters.forEach((recruiter: any) => {
            if (recruiter.specialization) {
              categorySet.add(recruiter.specialization)
            }
          })
          setCategories(['All', ...Array.from(categorySet).sort()])
        } catch (error) {
          console.error('Error parsing storage data:', error)
        }
      }
    }
    
    window.addEventListener('recruitersUpdated', handleRecruitersUpdated as EventListener)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('recruitersUpdated', handleRecruitersUpdated as EventListener)
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(refreshInterval)
    }
  }, [])

  // Generate search suggestions
  const generateSuggestions = (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const searchQuery = query.toLowerCase()
    const suggestionSet = new Set<string>()
    
    // Add matching recruiter names
    recruiters.forEach(recruiter => {
      if (!recruiter.hidden) {
        if (recruiter.name.toLowerCase().includes(searchQuery)) {
          suggestionSet.add(recruiter.name)
        }
        if (recruiter.company.toLowerCase().includes(searchQuery)) {
          suggestionSet.add(recruiter.company)
        }
        if (recruiter.specialization.toLowerCase().includes(searchQuery)) {
          suggestionSet.add(recruiter.specialization)
        }
        if (recruiter.location.toLowerCase().includes(searchQuery)) {
          suggestionSet.add(recruiter.location)
        }
      }
    })

    const suggestionsList = Array.from(suggestionSet).slice(0, 5) // Limit to 5 suggestions
    setSuggestions(suggestionsList)
    setShowSuggestions(suggestionsList.length > 0)
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    generateSuggestions(value)
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
  }

  // Filter recruiters
  const filteredRecruiters = recruiters.filter(recruiter => {
    if (recruiter.hidden) return false
    
    const matchesSearch = !searchTerm || 
      recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Category/Specialization filter
    const matchesCategory = selectedCategories.includes('All') || 
      selectedCategories.some(cat => recruiter.specialization === cat)
    
    // Location filter
    const matchesLocation = additionalFilters.locations.length === 0 ||
      additionalFilters.locations.some(loc => {
        const recruiterLocation = recruiter.location.split(',').pop()?.trim() || recruiter.location
        const normalizedLocation = recruiterLocation === 'CA' || recruiterLocation === 'NY' || recruiterLocation === 'TX' || recruiterLocation === 'IL' || recruiterLocation === 'MA' || recruiterLocation === 'WA' || recruiterLocation === 'GA' || recruiterLocation === 'FL' || recruiterLocation === 'MI' || recruiterLocation === 'MN' || recruiterLocation === 'AZ' || recruiterLocation === 'OR' || recruiterLocation === 'CO' || recruiterLocation === 'VA' || recruiterLocation === 'PA' || recruiterLocation === 'DC' ? 'United States' : recruiterLocation
        return normalizedLocation === loc
      })
    
    // Experience filter
    const matchesExperience = additionalFilters.experienceLevels.length === 0 ||
      additionalFilters.experienceLevels.some(exp => {
        const recruiterExp = recruiter.experience?.toLowerCase() || ''
        if (exp === '1-3 years') return recruiterExp.includes('1') || recruiterExp.includes('2') || recruiterExp.includes('3')
        if (exp === '4-6 years') return recruiterExp.includes('4') || recruiterExp.includes('5') || recruiterExp.includes('6')
        if (exp === '7-9 years') return recruiterExp.includes('7') || recruiterExp.includes('8') || recruiterExp.includes('9')
        if (exp === '10+ years') return recruiterExp.includes('10') || recruiterExp.includes('15')
        return false
      })
    
    // Rating filter
    const matchesRating = additionalFilters.ratings.length === 0 ||
      additionalFilters.ratings.some(rating => {
        const recruiterRating = recruiter.rating || 0
        if (rating === '4.5+ Stars') return recruiterRating >= 4.5
        if (rating === '4.0+ Stars') return recruiterRating >= 4.0
        if (rating === '3.5+ Stars') return recruiterRating >= 3.5
        return true
      })
    
    // Badge filter
    const matchesBadge = additionalFilters.badges.length === 0 ||
      additionalFilters.badges.some(badge => {
        const badgeMap: { [key: string]: string } = {
          'Top Rated': 'top-rated',
          'Verified': 'verified',
          'Rising Star': 'rising-star'
        }
        return recruiter.badge === badgeMap[badge]
      })
    
    // Company filter
    const matchesCompany = additionalFilters.companies.length === 0 ||
      additionalFilters.companies.includes(recruiter.company)
    
    // Remote filter
    const matchesRemote = additionalFilters.remoteAvailable === null ||
      recruiter.remoteAvailable === additionalFilters.remoteAvailable
    
    return matchesSearch && matchesCategory && matchesLocation && matchesExperience && matchesRating && matchesBadge && matchesCompany && matchesRemote
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Logo Design - Dark square with orange dot */}
                <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center relative">
                    <div className="w-2 h-2 bg-orange-500 rounded-full absolute bottom-1 right-1"></div>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">Recruiters Directory</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 font-medium disabled:opacity-50"
                title="Refresh directory"
              >
                {isRefreshing ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  '↻'
                )}
              </button>
              <button 
                onClick={() => setShowSubmissionForm(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
              >
                Submit Profile
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="bg-white pt-12 pb-4 shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Connect with Top Recruiters and Talent Acquisition Professionals
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed mb-1.5">
              Find specialized recruiters across industries to help you land your dream job or build your perfect team
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-16 z-40 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, company, specialization, or location..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => generateSuggestions(searchTerm)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              
              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Horizontal Filter Component */}
          <HorizontalFilter
            categories={categories.filter(cat => cat !== 'All')}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            tools={recruiters}
            additionalFilters={additionalFilters}
            onAdditionalFiltersChange={setAdditionalFilters}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 shadow-inner">
        <div className="container mx-auto px-4 max-w-7xl bg-white shadow-sm rounded-t-xl">
          <div className="pt-6">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 font-medium">
                Showing {filteredRecruiters.length} recruiters
              </p>
            </div>
          
            {/* Recruiters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredRecruiters.map((recruiter) => (
                <div 
                  key={recruiter.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group h-full flex flex-col shadow-sm cursor-pointer"
                  onClick={() => router.push(`/tool/${recruiter.slug}`)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 flex-shrink-0">
                      <img 
                        src={recruiter.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recruiter.name)}&background=3B82F6&color=fff&size=48`}
                        alt={`${recruiter.name} avatar`}
                        className="w-full h-full rounded-full shadow-sm object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-1 leading-tight">
                        {recruiter.name}
                      </h3>
                      <p className="text-sm text-orange-600 font-medium mb-2">
                        {recruiter.company}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {recruiter.bio}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{recruiter.location}</span>
                      <span>{recruiter.experience} experience</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 shadow-sm">
                        {recruiter.specialization}
                      </span>
                      <div className="flex items-center gap-2">
                        {recruiter.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm font-medium text-gray-700">{recruiter.rating}</span>
                          </div>
                        )}
                        <div className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1">
                          View Profile
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRecruiters.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-lg text-gray-500 mb-2">No recruiters found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Multi-step submission form modal */}
      {showSubmissionForm && (
        <MultiStepSubmissionForm 
          isOpen={showSubmissionForm}
          onClose={() => setShowSubmissionForm(false)}
        />
      )}


    </div>
  )
}