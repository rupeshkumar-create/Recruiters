'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, StarOff, Settings, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { mockTools, toggleFeaturedStatus } from '../../../lib/data'
import type { Tool } from '../../../lib/data'

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

export default function FeaturedAdminPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [changes, setChanges] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setTools([...mockTools])
  }, [])

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleFeatured = (toolId: string) => {
    setTools(prevTools => 
      prevTools.map(tool => 
        tool.id === toolId 
          ? { ...tool, featured: !tool.featured }
          : tool
      )
    )
    setChanges(prev => new Set([...prev, toolId]))
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Apply changes to the actual data
    changes.forEach(toolId => {
      const tool = tools.find(t => t.id === toolId)
      if (tool) {
        toggleFeaturedStatus(toolId)
      }
    })
    
    setChanges(new Set())
    setIsSaving(false)
    
    // Refresh the page data
    window.location.reload()
  }

  const featuredCount = tools.filter(tool => tool.featured).length

  return (
    <motion.div 
      className="min-h-screen bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div 
          className="mb-12"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/admin"
              className="p-2 rounded-lg muted-card border border-neutral-200 hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-orange-500" />
              <h1 className="text-4xl font-bold muted-text">Featured Tools Management</h1>
            </div>
          </div>
          <p className="text-xl muted-text-light mb-6">
            Manage which tools appear in the featured section
          </p>
          <div className="flex items-center gap-6 text-sm muted-text-light">
            <span>Total Tools: {tools.length}</span>
            <span>Featured: {featuredCount}</span>
            <span>Changes: {changes.size}</span>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex flex-col md:flex-row gap-4 mb-8"
          variants={itemVariants}
        >
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent muted-card"
            />
          </div>
          {changes.size > 0 && (
            <motion.button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="orange-bg text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : `Save Changes (${changes.size})`}
            </motion.button>
          )}
        </motion.div>

        {/* Tools Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              variants={itemVariants}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-300 ${
                tool.featured 
                  ? 'border-[#F26B21] bg-gradient-to-br from-orange-50 to-white' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${
                changes.has(tool.id) ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 flex-shrink-0">
                  <img 
                    src={tool.logo.includes('linkedin.com') ? `https://images.weserv.nl/?url=${encodeURIComponent(tool.logo)}&w=48&h=48&fit=contain&bg=white` : tool.logo}
                    alt={`${tool.name} logo`}
                    className="w-full h-full object-contain rounded-lg bg-gray-50"
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
                  <div className="w-full h-full bg-[#F26B21] rounded-lg items-center justify-center text-white font-bold text-sm hidden">
                    {tool.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {tool.name}
                  </h3>
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {tool.categories.split(',')[0].trim()}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {tool.tagline}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tool.featured && (
                    <span className="bg-[#F26B21] text-white text-xs px-2 py-1 rounded-full font-medium">
                      Featured
                    </span>
                  )}
                  {changes.has(tool.id) && (
                    <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                      Modified
                    </span>
                  )}
                </div>
                <motion.button
                  onClick={() => handleToggleFeatured(tool.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    tool.featured 
                      ? 'bg-[#F26B21] text-white hover:bg-[#F26B21]/90' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {tool.featured ? (
                    <Star className="w-4 h-4 fill-current" />
                  ) : (
                    <StarOff className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredTools.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600">Try adjusting your search term</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}