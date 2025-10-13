'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'

interface VerticalFilterSidebarProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  tools?: any[]
  className?: string
}

export default function VerticalFilterSidebar({ 
  categories, 
  selectedCategories, 
  onCategoryChange,
  tools = [],
  className = '' 
}: VerticalFilterSidebarProps) {
  
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
      const target = event.currentTarget as HTMLElement
      target.blur()
    }
    onCategoryChange(['All'])
    // Restore scroll position after state change
    setTimeout(() => window.scrollTo(0, currentScrollY), 0)
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

  // Create display categories with "All Tools" as first item, filtering out categories with 0 tools
  const displayCategories = ['All Tools', ...categories.filter(cat => {
    if (cat === 'All') return false
    return getCategoryCount(cat) > 0
  })]
  
  // Check if there are active filters (not just "All")
  const hasActiveFilters = selectedCategories.length > 0 && !selectedCategories.includes('All')

  return (
    <div className={`bg-white border-r border-gray-200 ${className}`}>
      <div className="sticky top-[144px] p-6 bg-white z-30">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Filter by Category</h3>
          <p className="text-sm text-gray-600">Find the perfect AI tool for your needs</p>
        </div>

        {/* Filter Categories */}
        <div className="space-y-3 mb-6">
          {displayCategories.map((category) => {
            const isSelected = category === 'All Tools' 
              ? selectedCategories.includes('All')
              : selectedCategories.includes(category)
            const isAllTools = category === 'All Tools'
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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? isAllTools
                      ? 'bg-gray-900 text-white'
                      : 'bg-orange-500 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  {isAllTools && <Filter className="w-4 h-4" />}
                  <span>{category}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
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

        {/* Clear Filters Button */}
        {hasActiveFilters && (
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <X className="w-4 h-4" />
            <span>Clear All Filters</span>
          </motion.button>
        )}

        {/* Filter Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {hasActiveFilters 
              ? `${selectedCategories.length} filter${selectedCategories.length > 1 ? 's' : ''} applied`
              : 'No filters applied'
            }
          </p>
        </div>
      </div>
    </div>
  )
}