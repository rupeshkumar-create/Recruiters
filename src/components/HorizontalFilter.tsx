'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface HorizontalFilterProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  tools?: any[]
  className?: string
}

export default function HorizontalFilter({ 
  categories, 
  selectedCategories, 
  onCategoryChange,
  tools = [],
  className = '' 
}: HorizontalFilterProps) {
  
  // Prevent scroll restoration on category changes
  useEffect(() => {
    if (window.history && window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual'
    }
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

    if (category === 'All Tools') {
      onCategoryChange(['All'])
      // Don't restore scroll position - let the main page handle scrolling
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
    // Don't restore scroll position - let the main page handle scrolling
  }

  const clearFilters = (event?: React.MouseEvent) => {
    // Store current scroll position
    const currentScrollY = window.scrollY
    
    if (event) {
      event.preventDefault()
      event.stopPropagation()
      const target = event.currentTarget as HTMLElement
      target.blur()
    }
    onCategoryChange(['All'])
    // Don't restore scroll position - let the main page handle scrolling
  }

  // Helper function to get tool count for a category
  const getCategoryCount = (category: string): number => {
    if (category === 'All' || category === 'All Tools') {
      return tools.filter(tool => !tool.hidden).length
    }
    return tools.filter(tool => 
      !tool.hidden && 
      tool.categories && 
      tool.categories.toLowerCase().includes(category.toLowerCase())
    ).length
  }

  // Check if this is the hero version (transparent background)
  const isHeroVersion = className.includes('bg-transparent')
  
  // Create display categories with "All Tools" as first item
  const displayCategories = ['All Tools', ...categories.filter(cat => cat !== 'All')]
  
  // Check if we should show the separate clear filter option (2 or more categories selected, excluding "All")
  const shouldShowClearOption = (() => {
    // If "All" is selected, don't show clear option
    if (selectedCategories.includes('All')) {
      return false
    }
    // Show clear option if 2 or more specific categories are selected
    return selectedCategories.length >= 2
  })()
  
  return (
    <div className={`${isHeroVersion ? '' : 'bg-white border-b border-gray-200 sticky top-16 z-40'} ${className}`}>
      <div className={`${isHeroVersion ? 'px-4' : 'container mx-auto px-4 py-3 max-w-7xl'}`}>
        {/* Filter Container with Clear Option */}
        <div className="flex items-center gap-8">
          {/* Horizontal Scrollable Filter Container - Dynamic width based on clear option visibility */}
          <motion.div 
            className="relative overflow-hidden"
            animate={{ 
              width: shouldShowClearOption ? 'calc(100% - 152px)' : '100%' 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div 
              className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth pr-12" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayCategories.map((category) => {
                const isSelected = category === 'All Tools' 
                  ? selectedCategories.includes('All')
                  : selectedCategories.includes(category)
                const count = getCategoryCount(category)
                
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      isSelected
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </motion.button>
                )
              })}
            </div>
            
            {/* Gradient fade and scroll indicator on right edge */}
            <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-end pr-2">
              <div className="bg-orange-100 rounded-full p-1 animate-pulse">
                <ChevronRight className="w-3 h-3 text-orange-500" />
              </div>
            </div>
          </motion.div>
          
          {/* Separate Clear Filter Option - Only shows when 2+ categories selected */}
          <AnimatePresence>
            {shouldShowClearOption && (
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '120px' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
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
                  className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0 px-2 py-1 rounded hover:bg-red-50"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Hide scrollbar with CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}