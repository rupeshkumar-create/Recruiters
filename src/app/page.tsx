'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { useRouter } from 'next/navigation'
import Navigation from '../components/Navigation'
import HorizontalFilter from '../components/HorizontalFilter'
import SearchBar from '../components/SearchBar'
import MultiStepSubmissionForm from '../components/MultiStepSubmissionForm'
import EmailSubscription from '../components/EmailSubscription'

import { RecruiterStorage } from '../lib/recruiterStorage'
import { trackToolClick } from '../lib/analytics'


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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}





function ScrollAnimatedCard({ children, index }: { children: React.ReactNode, index: number }) {
  return (
    <div>
      {children}
    </div>
  )
}

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All'])
  const [searchTerm, setSearchTerm] = useState('')
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [tools, setTools] = useState<any[]>([]) // Initialize empty, will load from storage
  const [initialToolsLoaded, setInitialToolsLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Additional filter states
  const [additionalFilters, setAdditionalFilters] = useState({
    locations: [] as string[],
    experienceLevels: [] as string[],
    ratings: [] as string[],
    badges: [] as string[],
    companies: [] as string[],
    remoteAvailable: null as boolean | null
  })

  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Ensure page starts at top on load
  useEffect(() => {
    // Force scroll to top once on initial load
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  // Load tools from storage and listen for updates
  useEffect(() => {
    // Load initial data from storage
    const loadRecruiters = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Always start with sync data for immediate display
        const syncRecruiters = RecruiterStorage.getAllSync()
        
        if (syncRecruiters && syncRecruiters.length > 0) {
          setTools(syncRecruiters)
          setInitialToolsLoaded(true)
          setLoading(false)
        }
        
        // Try to load fresh data from Supabase (if available)
        try {
          const freshRecruiters = await RecruiterStorage.getAll()
          
          if (freshRecruiters && freshRecruiters.length > 0) {
            setTools(freshRecruiters)
            setInitialToolsLoaded(true)
            setLoading(false)
          } else if (syncRecruiters.length === 0) {
            // If no sync data and no fresh data, load default
            const { csvRecruiters } = await import('../lib/data')
            setTools(csvRecruiters)
            setInitialToolsLoaded(true)
            setLoading(false)
          }
        } catch (supabaseError) {
          console.log('Supabase not available, using localStorage data')
          
          // If we don't have sync data either, load default
          if (syncRecruiters.length === 0) {
            const { csvRecruiters } = await import('../lib/data')
            setTools(csvRecruiters)
            setInitialToolsLoaded(true)
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('Error loading recruiters:', error)
        setError('Failed to load recruiters')
        
        // Final fallback to default data
        try {
          const { csvRecruiters } = await import('../lib/data')
          setTools(csvRecruiters)
          setInitialToolsLoaded(true)
        } catch (importError) {
          console.error('Failed to load default data:', importError)
          setError('Failed to load recruiter data')
        }
      } finally {
        setLoading(false)
      }
    }

    loadRecruiters()
    
    // Listen for updates from admin panel
    const handleRecruitersUpdated = (event: CustomEvent) => {
      console.log('Recruiters updated, refreshing homepage...')
      setTools(event.detail.recruiters)
      // Force re-render of all tool images
      setInitialToolsLoaded(false)
      setTimeout(() => setInitialToolsLoaded(true), 100)
    }
    
    // Listen for both custom events and refresh events
    window.addEventListener('recruitersUpdated', handleRecruitersUpdated as EventListener)
    window.addEventListener('refreshTools', loadRecruiters)
    
    // Cleanup
    return () => {
      window.removeEventListener('recruitersUpdated', handleRecruitersUpdated as EventListener)
      window.removeEventListener('refreshTools', loadRecruiters)
    }
  }, [])



  const getSearchScore = useCallback((tool: any, searchTerm: string): number => {
    if (!searchTerm) return 0;
    const term = searchTerm.toLowerCase();
    
    // Prioritize matches in name, tagline, content, and categories
    let score = 0;
    
    // Name match (highest priority)
    if (tool.name && tool.name.toLowerCase().includes(term)) {
      score += 100;
    }
    
    // Tagline match (high priority)
    if (tool.tagline && tool.tagline.toLowerCase().includes(term)) {
      score += 50;
    }
    
    // Bio match (medium priority)
    if (tool.bio && tool.bio.toLowerCase().includes(term)) {
      score += 25;
    }
    
    // Company match (medium priority)
    if (tool.company && tool.company.toLowerCase().includes(term)) {
      score += 20;
    }
    
    // Specialization match (lower priority)
    if (tool.specialization && tool.specialization.toLowerCase().includes(term)) {
      score += 15;
    }
    
    // Location match (lower priority)
    if (tool.location && tool.location.toLowerCase().includes(term)) {
      score += 10;
    }
    
    return score;
  }, []);

  // Helper function to format category names with proper case
  const formatCategoryName = (category: string): string => {
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Load categories from API
  const [categories, setCategories] = useState<string[]>(['All'])
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)
  
  // Helper function to get specializations that have recruiters
  const getCategoriesWithTools = (toolsList: any[]) => {
    const categorySet = new Set<string>()
    toolsList.filter(tool => !tool.hidden).forEach(tool => {
      if (tool.specialization) {
        const trimmed = tool.specialization.trim()
        if (trimmed) {
          const formatted = formatCategoryName(trimmed)
          categorySet.add(formatted)
        }
      }
    })
    return Array.from(categorySet).sort()
  }
  
  useEffect(() => {
    // Load categories from local tools data
    if (categoriesLoaded || tools.length === 0) return
    
    const categoriesWithTools = getCategoriesWithTools(tools)
    setCategories(['All', ...categoriesWithTools])
    setCategoriesLoaded(true)
  }, [categoriesLoaded, tools])

  // Update categories when tools change to filter out empty categories
  useEffect(() => {
    if (categoriesLoaded && tools.length > 0) {
      const categoriesWithTools = getCategoriesWithTools(tools)
      setCategories(['All', ...categoriesWithTools])
    }
  }, [tools, categoriesLoaded])

  // Fallback: Extract categories from tools if API failed and we have tools
  useEffect(() => {
    if (!categoriesLoaded && tools.length > 0) {
      const categoriesWithTools = getCategoriesWithTools(tools)
      setCategories(['All', ...categoriesWithTools])
      setCategoriesLoaded(true)
    }
  }, [tools, categoriesLoaded])

  const filteredTools = useMemo(() => {
    // First filter out hidden tools
    let filtered = tools.filter(tool => !tool.hidden)
    
    // Filter by specializations (support multiple selection)
    if (!selectedCategories.includes('All')) {
      filtered = filtered.filter(tool => 
        tool.specialization && selectedCategories.some(category =>
          tool.specialization.toLowerCase().includes(category.toLowerCase())
        )
      )
    }
    
    // Filter by locations
    if (additionalFilters.locations.length > 0) {
      filtered = filtered.filter(tool => 
        tool.location && additionalFilters.locations.some(location =>
          tool.location.split(',')[0].trim() === location
        )
      )
    }
    
    // Filter by experience levels
    if (additionalFilters.experienceLevels.length > 0) {
      filtered = filtered.filter(tool => {
        if (!tool.experience) return false
        const exp = tool.experience.toLowerCase()
        return additionalFilters.experienceLevels.some(level => {
          if (level === '1-3 years') return exp.includes('1') || exp.includes('2') || exp.includes('3')
          if (level === '4-6 years') return exp.includes('4') || exp.includes('5') || exp.includes('6')
          if (level === '7-9 years') return exp.includes('7') || exp.includes('8') || exp.includes('9')
          if (level === '10+ years') return exp.includes('10') || exp.includes('15')
          return false
        })
      })
    }
    
    // Filter by ratings
    if (additionalFilters.ratings.length > 0) {
      filtered = filtered.filter(tool => {
        const rating = tool.rating || 0
        return additionalFilters.ratings.some(ratingFilter => {
          if (ratingFilter === '4.5+ Stars') return rating >= 4.5
          if (ratingFilter === '4.0+ Stars') return rating >= 4.0
          if (ratingFilter === '3.5+ Stars') return rating >= 3.5
          if (ratingFilter === 'Any Rating') return true
          return false
        })
      })
    }
    
    // Filter by badges
    if (additionalFilters.badges.length > 0) {
      filtered = filtered.filter(tool => {
        if (!tool.badge) return false
        const badgeMap: { [key: string]: string } = {
          'Top Rated': 'top-rated',
          'Verified': 'verified',
          'Rising Star': 'rising-star'
        }
        return additionalFilters.badges.some(badge => tool.badge === badgeMap[badge])
      })
    }
    
    // Filter by companies
    if (additionalFilters.companies.length > 0) {
      filtered = filtered.filter(tool => 
        tool.company && additionalFilters.companies.includes(tool.company)
      )
    }
    
    // Filter by remote availability
    if (additionalFilters.remoteAvailable !== null) {
      filtered = filtered.filter(tool => tool.remoteAvailable === additionalFilters.remoteAvailable)
    }
    
    // Finally apply search if needed
    if (searchTerm && searchTerm.length > 1) {
      const scoredTools = filtered
        .map(tool => ({
          ...tool,
          searchScore: getSearchScore(tool, searchTerm)
        }))
        .filter(tool => tool.searchScore > 0)
        .sort((a, b) => b.searchScore - a.searchScore)
      
      return scoredTools
    }
    
    return filtered
  }, [selectedCategories, searchTerm, tools, getSearchScore, additionalFilters])

  // Split tools for eager loading - first 6 tools (2 rows) load immediately
  const eagerTools = useMemo(() => filteredTools.slice(0, 6), [filteredTools])
  const lazyTools = useMemo(() => filteredTools.slice(6), [filteredTools])



  const suggestions = useMemo(() => {
    if (searchTerm.length < 2) return []
    
    // Score and sort suggestions using the same prioritized algorithm
    const scoredSuggestions = tools
      .filter(tool => !tool.hidden)
      .map(tool => ({
        ...tool,
        searchScore: getSearchScore(tool, searchTerm)
      }))
      .filter(tool => tool.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 8)
    
    return scoredSuggestions
  }, [searchTerm, tools, getSearchScore])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedSuggestionIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedSuggestionIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (selectedSuggestionIndex >= 0) {
            const selectedTool = suggestions[selectedSuggestionIndex]
            router.push(`/tool/${selectedTool.slug}`)
          }
          break
        case 'Escape':
          setShowSuggestions(false)
          setSelectedSuggestionIndex(-1)
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSuggestions, suggestions, selectedSuggestionIndex, router])

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])



  // Track if this is the initial load and previous categories for comparison
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const previousCategoriesRef = useRef<string[]>(['All'])
  
  useEffect(() => {
    // Mark initial load as complete immediately
    setIsInitialLoad(false)
  }, [])
  
  // Track category changes without auto-scrolling
  useEffect(() => {
    // Update previous categories reference
    previousCategoriesRef.current = selectedCategories
  }, [selectedCategories])











  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setShowSuggestions(term.length >= 2)
    setSelectedSuggestionIndex(-1)
  }

  const handleSuggestionClick = (tool: any): void => {
    router.push(`/tool/${tool.slug}`)
  }

  // Show loading state
  if (loading && tools.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recruiters...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && tools.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation onSubmitToolClick={() => setShowSubmissionForm(true)} />
      
      <motion.div 
        className="flex-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <div className="bg-white pt-12 pb-4 shadow-sm border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div className="text-center" variants={itemVariants}>
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                Connect with Top Recruiters and Talent Acquisition Professionals
              </motion.h1>
              <motion.p 
                className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed mb-1.5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Find specialized recruiters across industries to help you land your dream job or build your perfect team
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Sticky Search Bar - Always visible */}
        <div className="sticky top-16 z-50 bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-3">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                suggestions={suggestions}
                showSuggestions={showSuggestions}
                onShowSuggestions={setShowSuggestions}
                selectedSuggestionIndex={selectedSuggestionIndex}
                onSuggestionSelect={handleSuggestionClick}
                className=""
              />
            </div>
            
            {/* Horizontal Filters */}
            <HorizontalFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              tools={tools}
              className=""
              additionalFilters={additionalFilters}
              onAdditionalFiltersChange={setAdditionalFilters}
            />
          </div>
        </div>

        {/* Main Content - Full Width Layout */}
        <div className="bg-gray-50 shadow-inner">
          <div className="container mx-auto px-4 max-w-7xl bg-white shadow-sm rounded-t-xl">
            {/* Add some top padding to create gap from search bar */}
            <div className="pt-6">
              {/* Recruiters Count Header */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 font-medium">
                  Showing {filteredTools.length} recruiters
                </p>
              </div>
            
              {/* Tools Grid Container */}
              <div id="tools-section" className="mb-16">
                {/* Tools Grid - Clean Layout */}
                <AnimatePresence mode="wait">
                  {filteredTools.length > 0 ? (
                    <div key={selectedCategories.join(',') + searchTerm}>
                      {/* Eager Loading - First 2 rows (6 tools) */}
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {eagerTools.map((tool, index) => (
                          <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                          >
                            <div 
                              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group h-full flex flex-col shadow-sm cursor-pointer"
                              onClick={() => router.push(`/tool/${tool.slug}`)}
                            >
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 flex-shrink-0">
                                    <img 
                                      src={tool.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=3B82F6&color=fff&size=48`}
                                      alt={`${tool.name} avatar`}
                                      className="w-full h-full rounded-full shadow-sm object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">
                                      {tool.name}
                                    </h3>
                                    <p className="text-sm text-orange-600 font-medium mb-2">
                                      {tool.company}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                      {tool.bio}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="mt-auto pt-4 space-y-3">
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{tool.location}</span>
                                    <span>{tool.experience} experience</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 shadow-sm">
                                      {tool.specialization}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {tool.rating && (
                                        <div className="flex items-center gap-1">
                                          <span className="text-yellow-400">★</span>
                                          <span className="text-sm font-medium text-gray-700">{tool.rating}</span>
                                        </div>
                                      )}
                                      <motion.div 
                                        className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                                        whileHover={{ x: 2 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        View Profile
                                        <ExternalLink className="w-3 h-3" />
                                      </motion.div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Lazy Loading - Remaining tools */}
                      {lazyTools.length > 0 && (
                        <motion.div 
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          {lazyTools.map((tool, index) => (
                            <ScrollAnimatedCard key={`${tool.id}-${tool.logo}-${initialToolsLoaded}`} index={index}>
                              <div 
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group h-full flex flex-col shadow-sm cursor-pointer"
                                onClick={() => {
                                  trackToolClick(tool.id, tool.name)
                                  router.push(`/tool/${tool.slug}`)
                                }}
                              >
                                  <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 flex-shrink-0">
                                      <img 
                                        src={tool.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=3B82F6&color=fff&size=48`}
                                        alt={`${tool.name} avatar`}
                                        className="w-full h-full rounded-full shadow-sm object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-1 leading-tight">
                                        {tool.name}
                                      </h3>
                                      <p className="text-sm text-orange-600 font-medium mb-2">
                                        {tool.company}
                                      </p>
                                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                        {tool.bio}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-auto pt-4 space-y-3">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                      <span>{tool.location}</span>
                                      <span>{tool.experience} experience</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 shadow-sm">
                                        {tool.specialization}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {tool.rating && (
                                          <div className="flex items-center gap-1">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-sm font-medium text-gray-700">{tool.rating}</span>
                                          </div>
                                        )}
                                        <motion.div 
                                          className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                                          whileHover={{ x: 2 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          View Profile
                                          <ExternalLink className="w-3 h-3" />
                                        </motion.div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            </ScrollAnimatedCard>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-lg text-gray-500 mb-2">No recruiters found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Email Subscription Section - Footer */}
        <div className="bg-gray-50 border-t border-gray-200 shadow-inner">
          <EmailSubscription className="shadow-sm" />
        </div>

        {/* Submission Form Modal */}
        <MultiStepSubmissionForm 
          isOpen={showSubmissionForm} 
          onClose={() => setShowSubmissionForm(false)} 
        />
      </motion.div>
    </div>
  )
}