'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, ExternalLink, Plus, Sparkles, Zap, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SubmissionForm from '../components/SubmissionForm'
import EmailSubscription from '../components/EmailSubscription'
import FeaturedTag from '../components/FeaturedTag'
import TypingIcon from '../components/TypingIcon'
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

const cardVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: {
    y: -4,
    scale: 1.01,
    transition: { duration: 0.2, ease: "easeOut" }
  }
}

const logoVariants = {
  hover: {
    rotate: [0, -15, 15, 0],
    scale: 1.2,
    transition: { duration: 0.6, ease: "easeInOut" }
  }
}

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 25px rgba(242, 107, 33, 0.3)",
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.95
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
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [tools, setTools] = useState<any[]>(csvTools) // Initialize with csvTools to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false)
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Load approved tools from Supabase API on component mount
  useEffect(() => {
    setIsClient(true)
    
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools')
        if (response.ok) {
          const toolsData = await response.json()
          setTools(toolsData)
        } else {
          console.error('Failed to fetch tools from API, using CSV fallback')
          // Keep csvTools as fallback when API fails
          setTools(csvTools)
        }
      } catch (error) {
        console.error('Error fetching tools:', error, 'using CSV fallback')
        // Keep csvTools as fallback when API fails
        setTools(csvTools)
      }
    }
    
    fetchTools()
  }, [])

  const getSearchScore = (tool: any, searchTerm: string): number => {
    const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0)
    let score = 0
    
    searchWords.forEach(word => {
      const toolName = tool.name.toLowerCase()
      const toolTagline = tool.tagline.toLowerCase()
      const toolContent = tool.content.toLowerCase()
      const toolCategories = tool.categories.toLowerCase()
      
      // Exact title match gets highest priority (score: 1000)
      if (toolName === word || toolName.includes(word)) {
        score += toolName === word ? 1000 : 500
      }
      // Description/tagline match gets medium priority (score: 100)
      else if (toolTagline.includes(word) || toolContent.includes(word)) {
        score += 100
      }
      // Category/tag match gets lowest priority (score: 10)
      else if (toolCategories.includes(word)) {
        score += 10
      }
    })
    
    return score
  }

  // Generate categories from current tools to prevent hydration mismatch
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(tools.map(tool => tool.categories).filter(Boolean))
    ).sort()
    return ['All', ...uniqueCategories]
  }, [tools])

  // Helper function to get tools by category
  const getToolsByCategory = (category: string) => {
    if (category === 'All') {
      return tools
    }
    return tools.filter(tool => 
      tool.categories.toLowerCase().includes(category.toLowerCase())
    )
  }

  const filteredTools = useMemo(() => {
    let filteredTools = selectedCategory === 'All' ? tools : getToolsByCategory(selectedCategory)
    
    // Filter out hidden tools from public view
    filteredTools = filteredTools.filter(tool => !tool.hidden)
    
    if (searchTerm) {
      const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0)
      
      // Filter and score tools
      const scoredTools = filteredTools
        .map(tool => ({
          ...tool,
          searchScore: getSearchScore(tool, searchTerm)
        }))
        .filter(tool => tool.searchScore > 0)
        .sort((a, b) => b.searchScore - a.searchScore)
      
      return scoredTools
    }
    
    return filteredTools
  }, [selectedCategory, searchTerm, tools])

  const featuredTools = tools.filter(tool => tool.featured && !tool.hidden)

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
            router.push(`/tool/${selectedTool.id}`)
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowSuggestions(value.length >= 2)
    setSelectedSuggestionIndex(-1)
  }

  const router = useRouter()

  const handleSuggestionClick = (tool: any): void => {
    router.push(`/tool/${tool.id}`)
  }

  return (
    <div className="min-h-screen muted-gradient flex flex-col">
      <motion.div 
        className="flex-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold muted-text">
              AI Staffing Tools
              <motion.span 
                className="orange-accent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {" "}Directory
              </motion.span>
            </h1>
          </motion.div>
          <motion.p 
            className="text-xl md:text-2xl muted-text-light max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Discover the best AI-powered tools for modern recruitment and staffing. 
            From resume screening to candidate sourcing, find the perfect solution for your hiring needs.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            className="mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 muted-text-light">
                <TypingIcon size={20} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by tool name, use case, or category..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                className="w-full pl-12 pr-6 py-4 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent muted-card text-lg shadow-sm hover:shadow-md transition-all duration-300 muted-text"
                autoComplete="off"
              />
              
              {/* Dropdown Suggestions */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    ref={suggestionsRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-lg z-50 max-h-80 overflow-y-auto"
                  >
                    {suggestions.map((tool, index) => (
                      <motion.div
                        key={tool.id}
                        className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                          index === selectedSuggestionIndex
                            ? 'bg-orange-50 border-l-4 border-orange-500'
                            : 'hover:bg-neutral-50'
                        } ${
                          index === 0 ? 'rounded-t-2xl' : ''
                        } ${
                          index === suggestions.length - 1 ? 'rounded-b-2xl' : 'border-b border-neutral-100'
                        }`}
                        onClick={() => handleSuggestionClick(tool)}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.1 }}
                      >
                        <div className="w-8 h-8 flex-shrink-0 bg-gray-50 rounded-lg p-1.5">
                          <img 
                            src={tool.logo.includes('linkedin.com') ? `https://images.weserv.nl/?url=${encodeURIComponent(tool.logo)}&w=32&h=32&fit=contain&bg=white` : tool.logo}
                            alt={`${tool.name} logo`}
                            className="w-full h-full object-contain rounded"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src.includes('weserv.nl')) {
                                target.src = tool.logo;
                                return;
                              }
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs hidden">
                            {tool.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm muted-text truncate text-left">{tool.name}</div>
                          <div className="text-xs muted-text-light truncate text-left">{tool.tagline}</div>
                        </div>
                        {index === selectedSuggestionIndex && (
                          <div className="text-orange-500 text-xs font-medium">Enter</div>
                        )}
                      </motion.div>
                    ))}
                    
                    {/* Footer hint */}
                    <div className="px-4 py-2 text-xs muted-text-light text-center border-t border-neutral-100 bg-neutral-50 rounded-b-2xl">
                      Use ↑↓ to navigate, Enter to select, Esc to close
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Submit Tool Button */}
          <motion.div 
            className="mb-12 text-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => setShowSubmissionForm(true)}
              className="orange-bg text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 mx-auto text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-500"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Plus className="w-6 h-6" />
              Submit Your Tool
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          variants={itemVariants}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                selectedCategory === category
                  ? 'orange-bg text-white scale-105'
                  : 'muted-card muted-text-light hover:bg-neutral-50 border border-neutral-300 hover:border-orange-400'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

      {/* Featured Tools Section */}
      {featuredTools.length > 0 && (
        <motion.div 
          className="mb-20 container mx-auto px-4 max-w-7xl"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold muted-text mb-8 text-center">Featured Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.slice(0, 4).map((tool, index) => (
              <ScrollAnimatedCard key={tool.id} index={index}>
                <Link href={`/tool/${tool.slug}`}>
                  <div className="muted-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group card-hover h-64 flex flex-col">
                    {tool.featured && <FeaturedTag className="z-20" />}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-neutral-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-center mb-4 mt-2">
                        <motion.div 
                          className="w-16 h-16 bg-gray-50 rounded-xl p-3 flex-shrink-0"
                          variants={logoVariants}
                          whileHover="hover"
                        >
                          <img 
                            src={tool.logo.includes('linkedin.com') ? `https://images.weserv.nl/?url=${encodeURIComponent(tool.logo)}&w=64&h=64&fit=contain&bg=white` : tool.logo}
                            alt={`${tool.name} logo`}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src.includes('weserv.nl')) {
                                target.src = tool.logo;
                                return;
                              }
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl hidden">
                            {tool.name.charAt(0).toUpperCase()}
                          </div>
                        </motion.div>
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <h3 className="font-bold text-lg muted-text mb-2 text-center group-hover:orange-accent transition-colors line-clamp-2">{tool.name}</h3>
                        <p className="muted-text-light text-sm text-center line-clamp-3 leading-relaxed">{tool.tagline}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollAnimatedCard>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tools Grid */}
      <div className="container mx-auto px-4 max-w-7xl mb-20">
        <h2 className="text-3xl font-bold muted-text mb-8 text-center">{selectedCategory} Tools</h2>
        <AnimatePresence mode="wait">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            key={selectedCategory + searchTerm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredTools.map((tool, index) => (
              <ScrollAnimatedCard key={tool.id} index={index}>
                <Link href={`/tool/${tool.slug}`}>
                  <div className="muted-card rounded-2xl shadow-sm p-8 hover:shadow-md transition-all duration-300 group h-full flex flex-col relative overflow-hidden card-hover">
                    {tool.featured && <FeaturedTag size="sm" className="z-20" />}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 to-neutral-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-start gap-5 mb-6 mt-2">
                        <div className="w-14 h-14 flex-shrink-0 bg-gray-50 rounded-2xl p-3">
                          <img 
                            src={tool.logo.includes('linkedin.com') ? `https://images.weserv.nl/?url=${encodeURIComponent(tool.logo)}&w=48&h=48&fit=contain&bg=white` : tool.logo}
                            alt={`${tool.name} logo`}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src.includes('weserv.nl')) {
                                target.src = tool.logo;
                                return;
                              }
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg items-center justify-center text-white font-bold text-sm hidden">
                            {tool.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold muted-text mb-2 group-hover:orange-accent transition-colors">
                            {tool.name}
                          </h3>
                          <span className="inline-block bg-neutral-100 muted-text-light text-xs px-3 py-1 rounded-full font-medium">
                            {tool.categories.split(',')[0].trim()}
                          </span>
                        </div>
                      </div>
                      <p className="muted-text-light text-sm leading-relaxed mb-4 flex-grow">
                        {tool.tagline}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-md transition-colors">
                          <ExternalLink className="w-3 h-3" />
                          <span>Visit Website</span>
                        </button>
                        <div className="flex items-center text-orange-500 group-hover:text-orange-600 transition-colors">
                          <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollAnimatedCard>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>



      {/* Email Subscription Section - Footer */}
      <EmailSubscription className="" />

      {/* Submission Form Modal */}
      <SubmissionForm 
        isOpen={showSubmissionForm} 
        onClose={() => setShowSubmissionForm(false)} 
      />
        </div>
      </motion.div>
    </div>
  )
}