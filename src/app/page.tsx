'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { ExternalLink } from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navigation from '../components/Navigation'
import HorizontalFilter from '../components/HorizontalFilter'
import SearchBar from '../components/SearchBar'
import SubmissionForm from '../components/SubmissionForm'
import EmailSubscription from '../components/EmailSubscription'
import ToolImage from '../components/ToolImage'
import { csvTools } from '../lib/data'


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



const scrollCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.95 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: "easeOut",
      type: "spring",
      stiffness: 100
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

function ScrollAnimatedCard({ children, index }: { children: React.ReactNode, index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px 0px",
    amount: 0.3
  })

  return (
    <motion.div
      ref={ref}
      variants={scrollCardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover="hover"
      transition={{ delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All'])
  const [searchTerm, setSearchTerm] = useState('')
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [tools, setTools] = useState<any[]>(csvTools) // Initialize with csvTools to prevent hydration mismatch
  const [initialToolsLoaded, setInitialToolsLoaded] = useState(false)

  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Ensure page starts at top on load
  useEffect(() => {
    // Force scroll to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    
    // Also set it after a small delay to ensure it sticks
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Load approved tools from Supabase API on component mount
  useEffect(() => {
    
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools')
        if (response.ok) {
          const toolsData = await response.json()
          setTools(toolsData)
          setInitialToolsLoaded(true)
        } else {
          console.error('Failed to fetch tools from API, using CSV fallback')
          // Keep csvTools as fallback when API fails
          setTools(csvTools)
          setInitialToolsLoaded(true)
        }
      } catch (error) {
        console.error('Error fetching tools:', error, 'using CSV fallback')
        // Keep csvTools as fallback when API fails
        setTools(csvTools)
        setInitialToolsLoaded(true)
      }
    }
    
    fetchTools()
    
    // Set up polling to refresh data every 10 minutes (further reduced frequency)
    const interval = setInterval(fetchTools, 600000)
    
    // Track last focus time to prevent excessive refreshes
    let lastFocusRefresh = 0
    
    // Refresh data when window regains focus (user comes back from admin panel)
    const handleFocus = () => {
      const now = Date.now()
      // Only refresh if it's been more than 30 seconds since last focus refresh
      if (now - lastFocusRefresh > 30000) {
        lastFocusRefresh = now
        fetchTools()
      }
    }
    
    // Listen for custom refresh events from admin panel
    const handleRefreshTools = () => {
      fetchTools()
    }
    
    window.addEventListener('focus', handleFocus)
    window.addEventListener('refreshTools', handleRefreshTools)
    
    // Cleanup
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('refreshTools', handleRefreshTools)
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
    
    // Content match (medium priority)
    if (tool.content && tool.content.toLowerCase().includes(term)) {
      score += 25;
    }
    
    // Categories match (lower priority)
    if (tool.categories && tool.categories.toLowerCase().includes(term)) {
      score += 15;
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
  
  useEffect(() => {
    // Only load categories once, not dependent on tools
    if (categoriesLoaded) return
    
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories?active=true')
        if (response.ok) {
          const categoriesData = await response.json()
          const categoryNames = categoriesData.map((cat: any) => cat.name)
          setCategories(['All', ...categoryNames.sort()])
          setCategoriesLoaded(true)
        } else {
          console.error('Failed to load categories, will use fallback when tools load')
          // Don't set categoriesLoaded to true here, let it fallback later
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        // Don't set categoriesLoaded to true here, let it fallback later
      }
    }

    loadCategories()
  }, [categoriesLoaded])

  // Fallback: Extract categories from tools if API failed and we have tools
  useEffect(() => {
    if (!categoriesLoaded && tools.length > 0) {
      const categorySet = new Set<string>()
      tools.forEach(tool => {
        if (tool.categories) {
          tool.categories.split(',').forEach((cat: string) => {
            const trimmed = cat.trim()
            if (trimmed) {
              const formatted = formatCategoryName(trimmed)
              categorySet.add(formatted)
            }
          })
        }
      })
      setCategories(['All', ...Array.from(categorySet).sort()])
      setCategoriesLoaded(true)
    }
  }, [tools, categoriesLoaded])

  const filteredTools = useMemo(() => {
    // First filter out hidden tools
    const visibleTools = tools.filter(tool => !tool.hidden)
    
    // Then filter by categories (support multiple selection)
    let categoryFiltered = visibleTools
    if (!selectedCategories.includes('All')) {
      categoryFiltered = visibleTools.filter(tool => 
        tool.categories && selectedCategories.some(category =>
          tool.categories.toLowerCase().includes(category.toLowerCase())
        )
      )
    }
    
    // Finally apply search if needed
    if (searchTerm && searchTerm.length > 1) {
      const scoredTools = categoryFiltered
        .map(tool => ({
          ...tool,
          searchScore: getSearchScore(tool, searchTerm)
        }))
        .filter(tool => tool.searchScore > 0)
        .sort((a, b) => b.searchScore - a.searchScore)
      
      return scoredTools
    }
    
    return categoryFiltered
  }, [selectedCategories, searchTerm, tools, getSearchScore])

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
  }, [searchTerm, tools])

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
  }, [showSuggestions, suggestions, selectedSuggestionIndex])

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
    // Mark initial load as complete after a short delay
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 2000) // Increased delay to prevent premature scrolling
    
    return () => clearTimeout(timer)
  }, [])
  
  // Auto-scroll to tools section only when categories actually change (not on initial load)
  useEffect(() => {
    // Skip if it's initial load
    if (isInitialLoad) {
      previousCategoriesRef.current = selectedCategories
      return
    }
    
    // Skip if categories haven't actually changed
    if (JSON.stringify(selectedCategories) === JSON.stringify(previousCategoriesRef.current)) {
      return
    }
    
    // Only scroll when user actively changes categories and it's not the initial "All" selection
    if (selectedCategories.length > 0 && !selectedCategories.includes('All')) {
      const toolsSection = document.getElementById('tools-section')
      if (toolsSection) {
        const yOffset = -120 // Offset to account for sticky header
        const y = toolsSection.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
    
    previousCategoriesRef.current = selectedCategories
  }, [selectedCategories, isInitialLoad])









  const router = useRouter()

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setShowSuggestions(term.length >= 2)
    setSelectedSuggestionIndex(-1)
  }

  const handleSuggestionClick = (tool: any): void => {
    router.push(`/tool/${tool.slug}`)
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
                Discover the best AI-powered tools for modern recruitment and staffing
              </motion.h1>
              <motion.p 
                className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed mb-1.5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                From resume screening to candidate sourcing, find the perfect solution for your hiring needs
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
            />
          </div>
        </div>

        {/* Main Content - Full Width Layout */}
        <div className="bg-gray-50 shadow-inner">
          <div className="container mx-auto px-4 max-w-7xl bg-white shadow-sm rounded-t-xl">
            {/* Add some top padding to create gap from search bar */}
            <div className="pt-6">
              {/* Tools Count Header */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 font-medium">
                  Showing {filteredTools.length} tools
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
                            <Link href={`/tool/${tool.slug}`} className="block h-full">
                              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group h-full flex flex-col shadow-sm">
                                <div className="flex items-start gap-3 mb-4">
                                  <div className="w-10 h-10 flex-shrink-0">
                                    <ToolImage 
                                      src={tool.logo}
                                      alt={`${tool.name} logo`}
                                      name={tool.name}
                                      size="md"
                                      className="w-full h-full rounded-lg shadow-sm"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                                      {tool.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                      {tool.tagline}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="mt-auto pt-4 flex items-center justify-between">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 shadow-sm">
                                    {formatCategoryName(tool.categories.split(',')[0].trim())}
                                  </span>
                                  <motion.div 
                                    className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                                    whileHover={{ x: 2 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    Visit Website
                                    <ExternalLink className="w-3 h-3" />
                                  </motion.div>
                                </div>
                              </div>
                            </Link>
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
                            <ScrollAnimatedCard key={tool.id} index={index}>
                              <Link href={`/tool/${tool.slug}`} className="block h-full">
                                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group h-full flex flex-col shadow-sm">
                                  <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 flex-shrink-0">
                                      <ToolImage 
                                        src={tool.logo}
                                        alt={`${tool.name} logo`}
                                        name={tool.name}
                                        size="md"
                                        className="w-full h-full rounded-lg shadow-sm"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                                        {tool.name}
                                      </h3>
                                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                        {tool.tagline}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-auto pt-4 flex items-center justify-between">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 shadow-sm">
                                      {formatCategoryName(tool.categories.split(',')[0].trim())}
                                    </span>
                                    <motion.div 
                                      className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                                      whileHover={{ x: 2 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      Visit Website
                                      <ExternalLink className="w-3 h-3" />
                                    </motion.div>
                                  </div>
                                </div>
                              </Link>
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
                      <p className="text-lg text-gray-500 mb-2">No tools found</p>
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
        <SubmissionForm 
          isOpen={showSubmissionForm} 
          onClose={() => setShowSubmissionForm(false)} 
        />
      </motion.div>
    </div>
  )
}