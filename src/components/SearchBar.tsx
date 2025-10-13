'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ToolImage from './ToolImage'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  suggestions: any[]
  showSuggestions: boolean
  onShowSuggestions: (show: boolean) => void
  selectedSuggestionIndex: number
  onSuggestionSelect: (tool: any) => void
  className?: string
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  suggestions,
  showSuggestions,
  onShowSuggestions,
  selectedSuggestionIndex,
  onSuggestionSelect,
  className = ''
}: SearchBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        onShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onShowSuggestions])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onSearchChange(value)
    onShowSuggestions(value.length >= 2)
  }

  const handleSuggestionClick = (tool: any) => {
    router.push(`/tool/${tool.slug}`)
  }

  const clearSearch = () => {
    onSearchChange('')
    onShowSuggestions(false)
    searchInputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search size={20} />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search by tool name, use case, or category..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchTerm.length >= 2 && onShowSuggestions(true)}
          className="w-full pl-12 pr-12 py-4 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent muted-card text-lg shadow-sm hover:shadow-md transition-all duration-300 muted-text"
          autoComplete="off"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 muted-text-light hover:muted-text transition-colors rounded-full hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
      
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
                key={`${tool.id}-${tool.logo}`}
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
                <ToolImage
                  src={tool.logo}
                  alt={`${tool.name} logo`}
                  name={tool.name}
                  size="sm"
                  className="bg-gray-50 rounded-lg p-1"
                />
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
    </div>
  )
}