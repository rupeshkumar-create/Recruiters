'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'

interface FilterSidebarProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  className?: string
}

export default function FilterSidebar({ 
  categories, 
  selectedCategories, 
  onCategoryChange, 
  className = '' 
}: FilterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Prevent scroll restoration on category changes
  useEffect(() => {
    if (window.history && window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCategoryToggle = (category: string, event?: React.MouseEvent) => {
    // Store current scroll position
    const currentScrollY = window.scrollY
    
    // Prevent any default browser behavior that might cause scrolling
    if (event) {
      event.preventDefault()
      event.stopPropagation()
      // Prevent focus from causing scroll
      const target = event.currentTarget as HTMLElement
      target.blur()
    }

    if (category === 'All') {
      onCategoryChange(['All'])
      // Restore scroll position after state change
      setTimeout(() => window.scrollTo(0, currentScrollY), 0)
      return
    }

    let newSelected = [...selectedCategories]
    
    // Remove 'All' if it's selected and we're selecting a specific category
    if (newSelected.includes('All')) {
      newSelected = newSelected.filter(c => c !== 'All')
    }

    if (newSelected.includes(category)) {
      newSelected = newSelected.filter(c => c !== category)
      // If no categories selected, default to 'All'
      if (newSelected.length === 0) {
        newSelected = ['All']
      }
    } else {
      newSelected.push(category)
    }

    onCategoryChange(newSelected)
    // Restore scroll position after state change
    setTimeout(() => window.scrollTo(0, currentScrollY), 0)
  }

  const clearFilters = (event?: React.MouseEvent) => {
    // Store current scroll position
    const currentScrollY = window.scrollY
    
    if (event) {
      event.preventDefault()
      event.stopPropagation()
      ;(event.currentTarget as HTMLElement).blur()
    }
    onCategoryChange(['All'])
    // Restore scroll position after state change
    setTimeout(() => window.scrollTo(0, currentScrollY), 0)
  }

  const activeFiltersCount = selectedCategories.filter(c => c !== 'All').length

  if (isMobile) {
    return (
      <div className={`bg-white border-b border-gray-200 sticky top-48 z-20 ${className}`}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Filter by Category</h3>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-gray-500 hover:text-gray-800 transition-colors"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {categories.map((category) => {
                    const isSelected = selectedCategories.includes(category)
                    
                    return (
                      <motion.button
                        key={category}
                        onClick={(e) => handleCategoryToggle(category, e)}
                        onFocus={(e) => {
                          e.preventDefault()
                          e.currentTarget.blur()
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          // Prevent any scroll behavior
                          const scrollY = window.scrollY
                          setTimeout(() => {
                            window.scrollTo(0, scrollY)
                          }, 0)
                        }}
                        tabIndex={-1}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {category}
                      </motion.button>
                    )
                  })}
                </div>
                
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className="bg-white">
        {/* Fixed Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
        </div>

        {/* Scrollable Categories Container */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="space-y-2 pr-2">
            {categories.map((category, index) => {
              const isSelected = selectedCategories.includes(category)
              
              return (
                <motion.button
                  key={category}
                  onClick={(e) => handleCategoryToggle(category, e)}
                  onFocus={(e) => {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    // Prevent any scroll behavior
                    const scrollY = window.scrollY
                    setTimeout(() => {
                      window.scrollTo(0, scrollY)
                    }, 0)
                  }}
                  tabIndex={-1}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {category}
                </motion.button>
              )
            })}
          </div>
        </div>
        
        {/* Fixed Clear Filters Footer */}
        {activeFiltersCount > 0 && (
          <motion.div className="mt-4 pt-4 border-t border-gray-200">
            <motion.button
              onClick={(e) => clearFilters(e)}
              onFocus={(e) => {
                e.preventDefault()
                e.currentTarget.blur()
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                // Prevent any scroll behavior
                const scrollY = window.scrollY
                setTimeout(() => {
                  window.scrollTo(0, scrollY)
                }, 0)
              }}
              tabIndex={-1}
              className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear all filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}