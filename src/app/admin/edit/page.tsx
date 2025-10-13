'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save, ArrowLeft, Search, Image, FileText, Trash2, X, Eye, EyeOff, Star, StarOff, ExternalLink, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Tool } from '../../../lib/data'
import ToolImage from '../../../components/ToolImage'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Checkbox } from '../../../components/ui/checkbox'
import { Badge } from '../../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import LogoUpload from '../../../components/LogoUpload'

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
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState({ 
    name: '', 
    logo: '', 
    tagline: '', 
    description: '', 
    categories: '', 
    url: '',
    featured: false,
    hidden: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    refreshTools()
    
    // Listen for refresh events
    const handleRefresh = () => {
      console.log('Refreshing edit tools...')
      refreshTools()
    }
    
    window.addEventListener('refreshTools', handleRefresh)
    
    return () => {
      window.removeEventListener('refreshTools', handleRefresh)
    }
  }, [])

  const refreshTools = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tools')
      if (response.ok) {
        const toolsData = await response.json()
        setTools(toolsData)
      } else {
        console.error('Failed to fetch tools from API')
        setTools(getSampleTools())
      }
    } catch (error) {
      console.error('Error fetching tools:', error)
      setTools(getSampleTools())
    } finally {
      setLoading(false)
    }
  }

  const getSampleTools = (): Tool[] => [
    {
      id: '1',
      name: 'ChatGPT',
      logo: 'https://cdn.openai.com/API/logo-openai.svg',
      tagline: 'AI-powered conversational assistant',
      description: 'Advanced AI chatbot for various tasks',
      content: 'ChatGPT is an advanced AI language model that can help with writing, coding, analysis, and creative tasks.',
      categories: 'AI, Productivity',
      url: 'https://chat.openai.com',
      slug: 'chatgpt',
      featured: true,
      hidden: false,
      approved: true
    }
  ]

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool)
    setEditForm({
      name: tool.name,
      logo: tool.logo,
      tagline: tool.tagline,
      description: tool.description || '',
      categories: tool.categories,
      url: tool.url,
      featured: tool.featured || false,
      hidden: tool.hidden || false
    })
  }

  const handleSaveEdit = async () => {
    if (!editingTool) return
    
    setIsSaving(true)
    try {
      const response = await fetch(`/api/tools/${editingTool.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          logo: editForm.logo,
          tagline: editForm.tagline,
          description: editForm.description,
          categories: editForm.categories,
          url: editForm.url,
          featured: editForm.featured,
          hidden: editForm.hidden
        }),
      })

      if (response.ok) {
        await refreshTools()
        setEditingTool(null)
        setEditForm({ 
         name: '', 
         logo: '', 
         tagline: '', 
         description: '', 
         categories: '', 
         url: '',
         featured: false,
         hidden: false
       })
        window.dispatchEvent(new CustomEvent('refreshTools'))
      } else {
        console.error('Failed to update tool')
      }
    } catch (error) {
      console.error('Error updating tool:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingTool(null)
    setEditForm({ 
      name: '', 
      logo: '', 
      tagline: '', 
      description: '', 
      categories: '', 
      url: '',
      featured: false,
      hidden: false
    })
  }

  const handleDeleteTool = async (toolId: string) => {
    try {
      const response = await fetch(`/api/tools/${toolId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await refreshTools()
        setShowDeleteConfirm(null)
        window.dispatchEvent(new CustomEvent('refreshTools'))
      } else {
        console.error('Failed to delete tool')
      }
    } catch (error) {
      console.error('Error deleting tool:', error)
    }
  }

  const handleToggleVisibility = async (toolId: string) => {
    try {
      const tool = tools.find(t => t.id === toolId)
      if (tool) {
        const response = await fetch(`/api/tools/${toolId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...tool, hidden: !tool.hidden }),
        })

        if (response.ok) {
          await refreshTools()
          window.dispatchEvent(new CustomEvent('refreshTools'))
        } else {
          console.error('Failed to update tool visibility')
        }
      }
    } catch (error) {
      console.error('Error toggling tool visibility:', error)
    }
  }

  const handleToggleFeatured = async (toolId: string) => {
    try {
      const tool = tools.find(t => t.id === toolId)
      if (tool) {
        const response = await fetch(`/api/tools/${toolId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...tool, featured: !tool.featured }),
        })

        if (response.ok) {
          await refreshTools()
          window.dispatchEvent(new CustomEvent('refreshTools'))
        } else {
          console.error('Failed to update tool featured status')
        }
      }
    } catch (error) {
      console.error('Error toggling tool featured status:', error)
    }
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
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-[#F26B21]">⚡</span>
                  Edit Tools
                </h1>
                <p className="text-gray-600 mt-2">Edit tool logos and descriptions</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#F26B21] to-[#FF8A4C] text-white px-4 py-2 rounded-xl font-medium">
              Total Tools: {tools.length}
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search tools by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-full border-gray-300 rounded-xl focus:border-[#F26B21] focus:ring-[#F26B21] text-base"
            />
          </div>
        </motion.div>

        {/* Tools Table */}
        <motion.div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden" variants={itemVariants}>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F26B21]"></div>
              <span className="ml-3 text-gray-600">Loading tools...</span>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTools.map((tool, index) => (
                <motion.div 
                  key={tool.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-150"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex gap-6">
                    {/* Tool Information Container - 60% */}
                    <div className="flex-1 w-3/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex-shrink-0">
                          <ToolImage 
                            src={tool.logo} 
                            alt={tool.name}
                            name={tool.name}
                            className="w-full h-full object-contain rounded-lg bg-gray-50"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{tool.name}</h3>
                            {tool.featured && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{tool.tagline}</p>
                          <a 
                            href={tool.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#F26B21] hover:text-[#E55A1A] font-medium"
                          >
                            Visit <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status and Actions Container - 40% */}
                    <div className="flex items-center justify-between w-2/5 pl-6 border-l border-gray-200">
                      <div className="text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          tool.hidden 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {tool.hidden ? '🚫 Hidden' : '✅ Active'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleToggleFeatured(tool.id)}
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                          title={tool.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          {tool.featured ? '⭐' : '☆'}
                        </Button>
                        <Button
                          onClick={() => handleEditTool(tool)}
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 border-blue-300 text-blue-700 hover:bg-blue-50"
                          title="Edit tool"
                        >
                          ✏️
                        </Button>
                        <Button
                          onClick={() => setShowDeleteConfirm(tool.id)}
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 border-red-300 text-red-700 hover:bg-red-50"
                          title="Delete tool"
                        >
                          🗑️
                        </Button>
                        <Button
                          onClick={() => handleToggleVisibility(tool.id)}
                          variant="outline"
                          size="sm"
                          className={`h-9 px-3 ${
                            tool.hidden 
                              ? 'border-green-300 text-green-700 hover:bg-green-50' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          title={tool.hidden ? 'Show tool' : 'Hide tool'}
                        >
                          {tool.hidden ? '👁️' : '🙈'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Edit Modal */}
        <Dialog open={!!editingTool} onOpenChange={() => handleCancelEdit()}>
          <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-[#F26B21] to-[#FF8A4C] p-3 rounded-xl">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Edit {editingTool?.name}
                  </DialogTitle>
                  <p className="text-gray-600 mt-1">Update tool information and settings</p>
                </div>
              </div>
            </DialogHeader>
              
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Tool Name
                      </Label>
                      <Input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter tool name"
                        className="border-gray-300 focus:border-[#F26B21] focus:ring-[#F26B21]"
                      />
                    </div>
                    
                    <LogoUpload
                      currentLogo={editForm.logo}
                      onLogoChange={async (logoUrl) => {
                        // Update form state
                        setEditForm(prev => ({ ...prev, logo: logoUrl }))
                        
                        // Auto-save the tool with new logo
                        if (editingTool) {
                          try {
                            const response = await fetch(`/api/tools/${editingTool.id}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                ...editForm,
                                logo: logoUrl
                              }),
                            })

                            if (response.ok) {
                              // Refresh tools data immediately
                              await refreshTools()
                              // Trigger global refresh event
                              window.dispatchEvent(new CustomEvent('refreshTools'))
                              console.log('Logo updated and saved successfully')
                            } else {
                              console.error('Failed to save logo update')
                            }
                          } catch (error) {
                            console.error('Error saving logo update:', error)
                          }
                        }
                      }}
                    />
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </Label>
                      <Input
                        type="url"
                        value={editForm.url}
                        onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com"
                        className="border-gray-300 focus:border-[#F26B21] focus:ring-[#F26B21]"
                      />
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Categories
                      </Label>
                      <Input
                        type="text"
                        value={editForm.categories}
                        onChange={(e) => setEditForm(prev => ({ ...prev, categories: e.target.value }))}
                        placeholder="AI, Productivity, Design (comma separated)"
                        className="border-gray-300 focus:border-[#F26B21] focus:ring-[#F26B21]"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Settings */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <div>
                          <Label htmlFor="featured" className="text-sm font-medium text-gray-900">
                            Featured Tool
                          </Label>
                          <p className="text-xs text-gray-500">Show in featured section</p>
                        </div>
                      </div>
                      <Checkbox
                        id="featured"
                        checked={editForm.featured}
                        onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, featured: !!checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <EyeOff className="w-5 h-5 text-gray-500" />
                        <div>
                          <Label htmlFor="hidden" className="text-sm font-medium text-gray-900">
                            Hide Tool
                          </Label>
                          <p className="text-xs text-gray-500">Hide from public directory</p>
                        </div>
                      </div>
                      <Checkbox
                        id="hidden"
                        checked={editForm.hidden}
                        onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, hidden: !!checked }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Descriptions & Preview */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Descriptions</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Tagline
                      </Label>
                      <Textarea
                        value={editForm.tagline}
                        onChange={(e) => setEditForm(prev => ({ ...prev, tagline: e.target.value }))}
                        className="h-20 resize-none border-gray-300 focus:border-[#F26B21] focus:ring-[#F26B21]"
                        placeholder="Brief description of the tool..."
                      />
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Description
                      </Label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="h-32 resize-none border-gray-300 focus:border-[#F26B21] focus:ring-[#F26B21]"
                        placeholder="Detailed description of the tool..."
                      />
                    </div>
                  </div>
                </div>
                
                {/* Preview Section */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      {editForm.logo && (
                        <img 
                          src={editForm.logo} 
                          alt={editForm.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-logo.png';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{editForm.name || 'Tool Name'}</h4>
                        <p className="text-sm text-gray-600 mt-1">{editForm.tagline || 'Tool tagline will appear here...'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {editForm.featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              ⭐ Featured
                            </span>
                          )}
                          {editForm.hidden && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              🚫 Hidden
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#F26B21] to-[#FF8A4C] hover:from-[#E55A1A] hover:to-[#F07A3B] text-white font-medium"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
          <DialogContent className="w-full max-w-md">
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Delete Tool
              </DialogTitle>
            </DialogHeader>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action cannot be undone. The tool will be permanently removed from the directory.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(null)}
                variant="outline"
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                onClick={() => showDeleteConfirm && handleDeleteTool(showDeleteConfirm)}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  )
}