'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save, ArrowLeft, Search, Image, FileText, Trash2, X, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import type { Tool } from '../../../lib/data'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Checkbox } from '../../../components/ui/checkbox'
import { Badge } from '../../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'

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
      }
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

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
        // Trigger refresh on main page
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
        // Trigger refresh on main page
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
          // Trigger refresh on main page
          window.dispatchEvent(new CustomEvent('refreshTools'))
        } else {
          console.error('Failed to update tool visibility')
        }
      }
    } catch (error) {
      console.error('Error toggling tool visibility:', error)
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
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3"
            />
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading tools...</h3>
              <p className="text-gray-500">Please wait while we fetch the tools data.</p>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No tools match your search criteria.' : 'No tools available to edit.'}
              </p>
            </div>
          ) : (
            filteredTools.map((tool) => (
            <motion.div key={tool.id} variants={itemVariants}>
              <Card className={`transition-all duration-300 ${
                tool.hidden 
                  ? 'border-gray-300 bg-gray-50 opacity-75' 
                  : 'hover:shadow-md'
              }`}>
                <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 flex-shrink-0 relative">
                  <img 
                    src={tool.logo.includes('linkedin.com') ? `https://images.weserv.nl/?url=${encodeURIComponent(tool.logo)}&w=48&h=48&fit=contain&bg=white` : tool.logo}
                    alt={`${tool.name} logo`}
                    className={`w-full h-full object-contain rounded-lg bg-gray-50 ${
                      tool.hidden ? 'grayscale opacity-60' : ''
                    }`}
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
                  {tool.hidden && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                      <EyeOff className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-lg font-semibold truncate ${
                      tool.hidden ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                      {tool.name}
                    </h3>
                    {tool.hidden && (
                      <Badge variant="secondary" className="text-xs">
                        Hidden
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {tool.categories.split(',')[0].trim()}
                  </Badge>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {tool.tagline}
              </p>
              
              <div className="flex gap-2">
                 <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                   <Button
                     onClick={() => handleEditTool(tool)}
                     className="w-full bg-[#F26B21] text-white hover:bg-[#F26B21]/90"
                   >
                     <Edit3 className="w-4 h-4 mr-2" />
                     Edit
                   </Button>
                 </motion.div>
                 <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                   <Button
                     onClick={() => handleToggleVisibility(tool.id)}
                     variant={tool.hidden ? "secondary" : "default"}
                     className={tool.hidden ? "bg-gray-600 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700"}
                     title={tool.hidden ? 'Show Tool' : 'Hide Tool'}
                   >
                     {tool.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </Button>
                 </motion.div>
                 <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                   <Button
                     onClick={() => setShowDeleteConfirm(tool.id)}
                     variant="destructive"
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                 </motion.div>
               </div>
                </CardContent>
              </Card>
            </motion.div>
           ))
           )}
         </motion.div>

        {/* Delete Confirmation Modal */}
        <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
          <DialogContent className="w-full max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-gray-900">Delete Tool</DialogTitle>
                  <DialogDescription className="text-gray-600">This action cannot be undone</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{tools.find(t => t.id === showDeleteConfirm)?.name}</strong>? This will permanently remove the tool from the directory.
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteTool(showDeleteConfirm!)}
                variant="destructive"
                className="flex-1"
              >
                Delete Tool
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={!!editingTool} onOpenChange={() => handleCancelEdit()}>
          <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-[#F26B21]" />
                Edit {editingTool?.name}
              </DialogTitle>
            </DialogHeader>
              
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
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Logo URL
                  </Label>
                  <Input
                    type="url"
                    value={editForm.logo}
                    onChange={(e) => setEditForm(prev => ({ ...prev, logo: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description/Tagline
                  </Label>
                  <Textarea
                    value={editForm.tagline}
                    onChange={(e) => setEditForm(prev => ({ ...prev, tagline: e.target.value }))}
                    className="h-24 resize-none"
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
                    className="h-32 resize-none"
                    placeholder="Detailed description of the tool..."
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
                    placeholder="Enter categories (comma separated)"
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </Label>
                  <Input
                    type="url"
                    value={editForm.url}
                    onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={editForm.featured}
                      onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, featured: !!checked }))}
                    />
                    <Label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Featured Tool
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hidden"
                      checked={editForm.hidden}
                      onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, hidden: !!checked }))}
                    />
                    <Label htmlFor="hidden" className="text-sm font-medium text-gray-700">
                      Hide Tool
                    </Label>
                  </div>
                </div>
                
                {/* Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 flex-shrink-0">
                      <img 
                        src={editForm.logo || (editingTool?.logo || '')}
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
                        {editingTool?.name?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{editingTool?.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{editForm.tagline || editingTool?.tagline}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 bg-[#F26B21] text-white hover:bg-[#F26B21]/90 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
           </DialogContent>
         </Dialog>
      </div>
    </motion.div>
  )
}