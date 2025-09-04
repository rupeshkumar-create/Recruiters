'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save, ArrowLeft, Search, Image, FileText } from 'lucide-react'
import Link from 'next/link'
import { mockTools, updateTool } from '../../../lib/data'
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

export default function EditToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingTool, setEditingTool] = useState<Tool | null>(null)
  const [editForm, setEditForm] = useState({ logo: '', tagline: '' })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setTools([...mockTools])
  }, [])

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool)
    setEditForm({
      logo: tool.logo,
      tagline: tool.tagline
    })
  }

  const handleSaveEdit = async () => {
    if (!editingTool) return
    
    setIsSaving(true)
    try {
      const updatedTool = updateTool(editingTool.id, {
        logo: editForm.logo,
        tagline: editForm.tagline
      })
      
      if (updatedTool) {
        setTools(prevTools => 
          prevTools.map(tool => 
            tool.id === editingTool.id ? updatedTool : tool
          )
        )
      }
      
      setEditingTool(null)
      setEditForm({ logo: '', tagline: '' })
    } catch (error) {
      console.error('Error updating tool:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingTool(null)
    setEditForm({ logo: '', tagline: '' })
  }

  return (
    <motion.div 
      className="min-h-screen bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <div className="flex items-center justify-center mb-6">
            <Link 
              href="/admin" 
              className="absolute left-4 top-4 bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-4">
              <Edit3 className="w-8 h-8 text-[#F26B21]" />
              <h1 className="text-4xl font-bold muted-text">Edit Tools</h1>
            </div>
          </div>
          <p className="text-xl muted-text-light mb-6">
            Edit tool logos and descriptions
          </p>
          <div className="flex items-center justify-center gap-6 text-sm muted-text-light">
            <span>Total Tools: {tools.length}</span>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent muted-card"
            />
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {filteredTools.map((tool) => (
            <motion.div
              key={tool.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
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
              
              <motion.button
                onClick={() => handleEditTool(tool)}
                className="w-full bg-[#F26B21] text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#F26B21]/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit3 className="w-4 h-4" />
                Edit Tool
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Edit Modal */}
        {editingTool && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-[#F26B21]" />
                Edit {editingTool.name}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={editForm.logo}
                    onChange={(e) => setEditForm(prev => ({ ...prev, logo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B21] focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description/Tagline
                  </label>
                  <textarea
                    value={editForm.tagline}
                    onChange={(e) => setEditForm(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B21] focus:border-transparent h-24 resize-none"
                    placeholder="Brief description of the tool..."
                  />
                </div>
                
                {/* Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 flex-shrink-0">
                      <img 
                        src={editForm.logo || editingTool.logo}
                        alt="Preview"
                        className="w-full h-full object-contain rounded bg-white"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-[#F26B21] rounded items-center justify-center text-white font-bold text-xs hidden">
                        {editingTool.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{editingTool.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{editForm.tagline || editingTool.tagline}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 bg-[#F26B21] text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#F26B21]/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}