'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { ChevronRight, MapPin, Star, Calendar, Briefcase, Globe, Award, Building, ChevronDown, Filter } from 'lucide-react'

interface HorizontalFilterProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  tools?: any[]
  className?: string
  additionalFilters?: FilterState
  onAdditionalFiltersChange?: (filters: FilterState) => void
}

interface FilterState {
  locations: string[]
  experienceLevels: string[]
  ratings: string[]
  remoteAvailable: boolean | null
  badges: string[]
  companies: string[]
}

export default function HorizontalFilter({ 
  categories, 
  selectedCategories, 
  onCategoryChange,
  tools = [],
  className = '',
  additionalFilters,
  onAdditionalFiltersChange
}: HorizontalFilterProps) {
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [activeFilterType, setActiveFilterType] = useState<string>('specializations')
  const [showAllFiltersDropdown, setShowAllFiltersDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const filters = additionalFilters || {
    locations: [],
    experienceLevels: [],
    ratings: [],
    remoteAvailable: null,
    badges: [],
    companies: []
  }

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])



  // Extract unique values from tools for filter options
  const getUniqueLocations = () => {
    // Always use data-based locations during SSR to ensure consistency
    const locations = tools
      .filter(tool => !tool.hidden && tool.location)
      .map(tool => {
        const location = tool.location.split(',').pop()?.trim() || tool.location
        // Convert state abbreviations to countries
        if (location === 'CA' || location === 'NY' || location === 'TX' || location === 'IL' || location === 'MA' || location === 'WA' || location === 'GA' || location === 'FL' || location === 'MI' || location === 'MN' || location === 'AZ' || location === 'OR' || location === 'CO' || location === 'VA' || location === 'PA' || location === 'DC') {
          return 'United States'
        }
        return location
      })
    const dataBasedLocations = Array.from(new Set(locations)).sort()
    
    // Only use admin-managed options on client-side after hydration
    if (isClient) {
      const savedOptions = localStorage.getItem('admin_filter_options')
      if (savedOptions) {
        try {
          const options = JSON.parse(savedOptions)
          const adminLocations = options
            .filter((o: any) => o.type === 'location' && o.visible)
            .sort((a: any, b: any) => a.order - b.order)
            .map((o: any) => o.name)
          if (adminLocations.length > 0) {
            return adminLocations
          }
        } catch (error) {
          console.error('Error parsing admin filter options:', error)
        }
      }
    }
    
    return dataBasedLocations
  }

  const getUniqueExperienceLevels = () => {
    const experiences = tools
      .filter(tool => !tool.hidden && tool.experience)
      .map(tool => {
        const exp = tool.experience.toLowerCase()
        if (exp.includes('1') || exp.includes('2') || exp.includes('3')) return '1-3 years'
        if (exp.includes('4') || exp.includes('5') || exp.includes('6')) return '4-6 years'
        if (exp.includes('7') || exp.includes('8') || exp.includes('9')) return '7-9 years'
        if (exp.includes('10') || exp.includes('15')) return '10+ years'
        return 'Other'
      })
    return Array.from(new Set(experiences)).sort()
  }

  const getRatingRanges = () => {
    return ['4.5+ Stars', '4.0+ Stars', '3.5+ Stars', 'Any Rating']
  }

  const getUniqueBadges = () => {
    // Always use data-based badges during SSR to ensure consistency
    const badges = tools
      .filter(tool => !tool.hidden && tool.badge)
      .map(tool => {
        const badge = tool.badge
        switch (badge) {
          case 'top-rated': return 'Top Rated'
          case 'verified': return 'Verified'
          case 'rising-star': return 'Rising Star'
          default: return badge
        }
      })
    const dataBasedBadges = Array.from(new Set(badges)).sort()
    
    // Only use admin-managed options on client-side after hydration
    if (isClient) {
      const savedOptions = localStorage.getItem('admin_filter_options')
      if (savedOptions) {
        try {
          const options = JSON.parse(savedOptions)
          const adminBadges = options
            .filter((o: any) => o.type === 'badge' && o.visible)
            .sort((a: any, b: any) => a.order - b.order)
            .map((o: any) => o.name)
          if (adminBadges.length > 0) {
            return adminBadges
          }
        } catch (error) {
          console.error('Error parsing admin filter options:', error)
        }
      }
    }
    
    return dataBasedBadges
  }

  const getUniqueCompanies = () => {
    const companies = tools
      .filter(tool => !tool.hidden && tool.company)
      .map(tool => tool.company)
    return Array.from(new Set(companies)).sort().slice(0, 10) // Limit to top 10 companies
  }

  const getUniqueSpecializations = () => {
    // Always use data-based specializations during SSR to ensure consistency
    const specializations = tools
      .filter(tool => !tool.hidden && tool.specialization)
      .map(tool => tool.specialization)
    const dataBasedSpecializations = Array.from(new Set(specializations)).sort()
    
    // Only use admin-managed options on client-side after hydration
    if (isClient) {
      const savedOptions = localStorage.getItem('admin_filter_options')
      if (savedOptions) {
        try {
          const options = JSON.parse(savedOptions)
          const adminSpecializations = options
            .filter((o: any) => o.type === 'specialization' && o.visible)
            .sort((a: any, b: any) => a.order - b.order)
            .map((o: any) => o.name)
          if (adminSpecializations.length > 0) {
            return adminSpecializations
          }
        } catch (error) {
          console.error('Error parsing admin filter options:', error)
        }
      }
    }
    
    return dataBasedSpecializations
  }

  // Prevent scroll restoration on category changes
  useEffect(() => {
    if (window.history && window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Listen for filter options updates
  useEffect(() => {
    const handleFilterOptionsUpdate = () => {
      // Force re-render by updating component
      setShowAdvancedFilters(prev => !prev)
      setTimeout(() => setShowAdvancedFilters(prev => !prev), 0)
    }
    
    if (isClient) {
      window.addEventListener('filterOptionsUpdated', handleFilterOptionsUpdate)
      return () => window.removeEventListener('filterOptionsUpdated', handleFilterOptionsUpdate)
    }
  }, [isClient])

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      // Check if click is on the backdrop or outside the dropdown
      if (showAllFiltersDropdown) {
        const dropdownContainer = target.closest('[data-dropdown-container]')
        const isBackdrop = target.classList.contains('backdrop-blur-sm')
        
        if (!dropdownContainer || isBackdrop) {
          setShowAllFiltersDropdown(false)
        }
      }
    }
    
    if (showAllFiltersDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      // Also handle escape key
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setShowAllFiltersDropdown(false)
        }
      }
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [showAllFiltersDropdown])

  const handleFilterTypeChange = (filterType: string) => {
    setActiveFilterType(filterType)
  }

  // Get filter options based on active filter type
  const getFilterOptions = () => {
    switch (activeFilterType) {
      case 'specializations':
        return getUniqueSpecializations()
      case 'locations':
        return getUniqueLocations()
      case 'experience':
        return getUniqueExperienceLevels()
      case 'ratings':
        return getRatingRanges()
      case 'badges':
        return getUniqueBadges()
      case 'companies':
        return getUniqueCompanies()
      case 'remote':
        return ['Remote Available', 'On-site Only']
      default:
        return []
    }
  }

  const getFilterIcon = (filterType: string) => {
    switch (filterType) {
      case 'specializations': return <Briefcase className="w-4 h-4" />
      case 'locations': return <MapPin className="w-4 h-4" />
      case 'experience': return <Calendar className="w-4 h-4" />
      case 'ratings': return <Star className="w-4 h-4" />
      case 'badges': return <Award className="w-4 h-4" />
      case 'companies': return <Building className="w-4 h-4" />
      case 'remote': return <Globe className="w-4 h-4" />
      default: return <Filter className="w-4 h-4" />
    }
  }

  const isFilterActive = (filterType: string, value: string) => {
    switch (filterType) {
      case 'specializations':
        return selectedCategories.includes(value) && !selectedCategories.includes('All')
      case 'locations':
        return filters.locations.includes(value)
      case 'experience':
        return filters.experienceLevels.includes(value)
      case 'ratings':
        return filters.ratings.includes(value)
      case 'badges':
        return filters.badges.includes(value)
      case 'companies':
        return filters.companies.includes(value)
      case 'remote':
        if (value === 'Remote Available') return filters.remoteAvailable === true
        if (value === 'On-site Only') return filters.remoteAvailable === false
        return false
      default:
        return false
    }
  }

  const handleFilterOptionClick = (filterType: string, value: string) => {
    if (filterType === 'specializations') {
      handleCategoryToggle(value)
    } else if (filterType === 'remote') {
      const remoteValue = value === 'Remote Available' ? true : false
      handleAdvancedFilterChange('remoteAvailable', remoteValue)
    } else if (filterType === 'experience') {
      handleAdvancedFilterChange('experienceLevels', value)
    } else {
      handleAdvancedFilterChange(filterType as keyof FilterState, value)
    }
  }

  const getFilterCount = (filterType: string, option: string): number => {
    if (filterType === 'specializations') {
      return getCategoryCount(option)
    }
    
    return tools.filter(tool => {
      if (tool.hidden) return false
      switch (filterType) {
        case 'locations':
          const location = tool.location.split(',').pop()?.trim() || tool.location
          const normalizedLocation = location === 'CA' || location === 'NY' || location === 'TX' || location === 'IL' || location === 'MA' || location === 'WA' || location === 'GA' || location === 'FL' || location === 'MI' || location === 'MN' || location === 'AZ' || location === 'OR' || location === 'CO' || location === 'VA' || location === 'PA' || location === 'DC' ? 'United States' : location
          return normalizedLocation === option
        case 'experience':
          const exp = tool.experience?.toLowerCase() || ''
          if (option === '1-3 years') return exp.includes('1') || exp.includes('2') || exp.includes('3')
          if (option === '4-6 years') return exp.includes('4') || exp.includes('5') || exp.includes('6')
          if (option === '7-9 years') return exp.includes('7') || exp.includes('8') || exp.includes('9')
          if (option === '10+ years') return exp.includes('10') || exp.includes('15')
          return false
        case 'ratings':
          const rating = tool.rating || 0
          if (option === '4.5+ Stars') return rating >= 4.5
          if (option === '4.0+ Stars') return rating >= 4.0
          if (option === '3.5+ Stars') return rating >= 3.5
          return true
        case 'badges':
          const badgeMap: { [key: string]: string } = {
            'Top Rated': 'top-rated',
            'Verified': 'verified',
            'Rising Star': 'rising-star'
          }
          return tool.badge === badgeMap[option]
        case 'companies':
          return tool.company === option
        case 'remote':
          if (option === 'Remote Available') return tool.remoteAvailable === true
          if (option === 'On-site Only') return tool.remoteAvailable === false
          return false
        default:
          return false
      }
    }).length
  }

  const handleCategoryToggle = (category: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
      const target = event.currentTarget as HTMLElement
      target.blur()
    }

    if (category === 'All Tools') {
      onCategoryChange(['All'])
      return
    }

    let newSelected = [...selectedCategories]
    
    // Remove 'All' if it's selected and we're selecting a specific category
    if (newSelected.includes('All')) {
      newSelected = newSelected.filter(c => c !== 'All')
    }

    // Toggle the category
    if (newSelected.includes(category)) {
      newSelected = newSelected.filter(c => c !== category)
      // If no categories are selected, default to 'All'
      if (newSelected.length === 0) {
        newSelected = ['All']
      }
    } else {
      // Add the category (allow multiple selections)
      newSelected.push(category)
    }

    onCategoryChange(newSelected)
  }

  const handleAdvancedFilterChange = (filterType: keyof FilterState, value: string | boolean) => {
    if (!onAdditionalFiltersChange) return
    
    const newFilters = { ...filters }
    
    if (filterType === 'remoteAvailable') {
      newFilters.remoteAvailable = value as boolean
    } else {
      const currentArray = newFilters[filterType] as string[]
      if (currentArray.includes(value as string)) {
        newFilters[filterType] = currentArray.filter(item => item !== value) as any
      } else {
        newFilters[filterType] = [...currentArray, value as string] as any
      }
    }
    
    onAdditionalFiltersChange(newFilters)
  }



  const clearAllFilters = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    onCategoryChange(['All'])
    if (onAdditionalFiltersChange) {
      onAdditionalFiltersChange({
        locations: [],
        experienceLevels: [],
        ratings: [],
        remoteAvailable: null,
        badges: [],
        companies: []
      })
    }
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (!selectedCategories.includes('All')) count += selectedCategories.length
    count += filters.locations.length
    count += filters.experienceLevels.length
    count += filters.ratings.length
    count += filters.badges.length
    count += filters.companies.length
    if (filters.remoteAvailable !== null) count += 1
    return count
  }

  // Helper function to get tool count for a category
  const getCategoryCount = (category: string): number => {
    if (category === 'All' || category === 'All Tools') {
      return tools.filter(tool => !tool.hidden).length
    }
    return tools.filter(tool => 
      !tool.hidden && 
      tool.specialization && 
      tool.specialization.toLowerCase().includes(category.toLowerCase())
    ).length
  }

  // Check if this is the hero version (transparent background)
  const isHeroVersion = className.includes('bg-transparent')
  
  // Create display categories with "All Tools" as first item, filtering out categories with 0 tools
  const displayCategories = ['All Tools', ...categories.filter(cat => {
    if (cat === 'All') return false
    return getCategoryCount(cat) > 0
  })]
  
  // Check if we should show the separate clear filter option (2 or more filters selected total)
  const shouldShowClearOption = (() => {
    let totalFilters = 0
    
    // Count category filters (excluding "All")
    if (!selectedCategories.includes('All')) {
      totalFilters += selectedCategories.length
    }
    
    // Count additional filters
    totalFilters += filters.locations.length
    totalFilters += filters.experienceLevels.length
    totalFilters += filters.ratings.length
    totalFilters += filters.badges.length
    totalFilters += filters.companies.length
    if (filters.remoteAvailable !== null) totalFilters += 1
    
    // Show clear option if 2 or more filters are selected
    return totalFilters >= 2
  })()
  


  return (
    <div className={`${isHeroVersion ? '' : 'bg-white border-b border-gray-200 sticky top-16 z-30'} ${className}`}>
      <div className={`${isHeroVersion ? 'px-4' : 'container mx-auto px-4 py-3 max-w-7xl'}`}>
        {/* Main Filter Container */}
        <div className="flex items-center gap-8">
          {/* Horizontal Scrollable Filter Container */}
          <motion.div 
            className="relative"
            animate={{ 
              width: shouldShowClearOption ? 'calc(100% - 152px)' : '100%' 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: 'visible' }}
          >
            <div 
              className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth pr-12" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'visible' }}
            >
              {/* All Filters Dropdown Button */}
              <div className="relative" data-dropdown-container>
                <motion.button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('All Filters clicked, current state:', showAllFiltersDropdown)
                    
                    if (!showAllFiltersDropdown && buttonRef.current) {
                      const rect = buttonRef.current.getBoundingClientRect()
                      setDropdownPosition({
                        top: rect.bottom + 8,
                        left: rect.left
                      })
                    }
                    
                    setShowAllFiltersDropdown(!showAllFiltersDropdown)
                  }}
                  ref={buttonRef}
                  tabIndex={0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    showAllFiltersDropdown
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Filter className="w-4 h-4" />
                  <span>All Filters</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAllFiltersDropdown ? 'rotate-180' : ''}`} />
                </motion.button>
              </div>

              {/* All Recruiters Button - Always visible */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleCategoryToggle('All Tools', e)
                }}
                onFocus={(e) => {
                  e.preventDefault()
                  e.currentTarget.blur()
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  const scrollY = window.scrollY
                  setTimeout(() => {
                    window.scrollTo(0, scrollY)
                  }, 0)
                }}
                tabIndex={-1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  selectedCategories.includes('All')
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>All Recruiters</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategories.includes('All')
                    ? 'bg-white/20 text-white' 
                    : 'bg-white text-gray-600'
                }`}>
                  {tools.filter(tool => !tool.hidden).length}
                </span>
              </motion.button>

              {/* Dynamic Filter Options Based on Active Type */}
              {getFilterOptions().map((option: string) => {
                const isSelected = isFilterActive(activeFilterType, option)
                const count = getFilterCount(activeFilterType, option)
                
                return (
                  <motion.button
                    key={`${activeFilterType}-${option}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleFilterOptionClick(activeFilterType, option)
                    }}
                    onFocus={(e) => {
                      e.preventDefault()
                      e.currentTarget.blur()
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
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
                    {getFilterIcon(activeFilterType)}
                    <span>{option}</span>
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
          
          {/* Separate Clear Filter Option - Only shows when 2+ filters are active */}
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
                  onClick={(e) => clearAllFilters(e)}
                  onFocus={(e) => {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
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
                  Clear Options
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

      {/* Portal-based Dropdown with Backdrop */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {showAllFiltersDropdown && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                style={{ zIndex: 9998 }}
                onClick={() => setShowAllFiltersDropdown(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ 
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className="fixed w-64 bg-white rounded-lg shadow-2xl border border-gray-200"
                style={{
                  zIndex: 9999,
                  top: dropdownPosition.top,
                  left: dropdownPosition.left
                }}
                data-dropdown-container
              >
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Filter Options</h3>
                  <div className="space-y-2">
                    {[
                      { key: 'specializations', label: 'Specialization', icon: <Briefcase className="w-4 h-4" /> },
                      { key: 'locations', label: 'Location', icon: <MapPin className="w-4 h-4" /> },
                      { key: 'experience', label: 'Experience', icon: <Calendar className="w-4 h-4" /> },
                      { key: 'ratings', label: 'Rating', icon: <Star className="w-4 h-4" /> },
                      { key: 'badges', label: 'Badge', icon: <Award className="w-4 h-4" /> },
                      { key: 'companies', label: 'Company', icon: <Building className="w-4 h-4" /> },
                      { key: 'remote', label: 'Work Type', icon: <Globe className="w-4 h-4" /> }
                    ].map((filterType) => (
                      <motion.button
                        key={filterType.key}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Filter type clicked:', filterType.key)
                          handleFilterTypeChange(filterType.key)
                          setShowAllFiltersDropdown(false)
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                          activeFilterType === filterType.key
                            ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                        }`}
                        whileHover={{ x: 2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {filterType.icon}
                        <span>{filterType.label}</span>
                        {activeFilterType === filterType.key && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-2 h-2 bg-orange-500 rounded-full"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}