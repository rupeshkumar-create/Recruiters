'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FolderPlus, FolderMinus, Settings, Save, ArrowLeft, Search, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'
// Removed mock data imports - now using Supabase API
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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

export default function DirectoryManagementPage() {
  const [tools, setTools] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [changes, setChanges] = useState<Set<string>>(new Set())
  const [removedTools, setRemovedTools] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadTools()
  }, [])

  const loadTools = async () => {
    try {
      const response = await fetch('/api/tools')
      if (response.ok) {
        const data = await response.json()
        setTools(data)
      } else {
        console.error('Failed to load tools')
      }
    } catch (error) {
      console.error('Error loading tools:', error)
    }
  }

  const filteredTools = tools.filter(tool => 
    !removedTools.has(tool.id) &&
    (tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.tagline.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleRemoveTool = (toolId: string) => {
    setRemovedTools(prev => new Set(Array.from(prev).concat(toolId)))
    setChanges(prev => new Set(Array.from(prev).concat(toolId)))
  }

  const handleRestoreTool = async (toolId: string) => {
    try {
      const tool = tools.find(t => t.id === toolId);
      if (tool) {
        await fetch('/api/tools', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...tool,
            hidden: false
          }),
        });
        
        const newRemovedTools = new Set(Array.from(removedTools).filter(id => id !== toolId))
        setRemovedTools(newRemovedTools)
        setChanges(prev => new Set(Array.from(prev).concat(toolId)))
        
        // Reload tools data
        await loadTools()
        // Trigger refresh on main page
        window.dispatchEvent(new CustomEvent('refreshTools'))
      }
    } catch (error) {
      console.error('Error restoring tool:', error)
    }
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    
    try {
      // Remove tools from directory by setting them as hidden
      const removedToolsList = Array.from(removedTools);
      
      for (const toolId of removedToolsList) {
        const tool = tools.find(t => t.id === toolId);
        if (tool) {
          await fetch('/api/tools', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...tool,
              hidden: true
            }),
          });
        }
      }
      
      setChanges(new Set())
      setRemovedTools(new Set())
      
      // Reload tools data
      await loadTools()
      // Trigger refresh on main page
      window.dispatchEvent(new CustomEvent('refreshTools'))
    } catch (error) {
      console.error('Error saving changes:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const removedCount = removedTools.size

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
              <FolderPlus className="w-8 h-8 text-orange-500" />
              <h1 className="text-4xl font-bold muted-text">Directory Management</h1>
            </div>
          </div>
          <p className="text-xl muted-text-light mb-6">
            Add or remove tools from the main directory
          </p>
          <div className="flex items-center gap-6 text-sm muted-text-light">
            <Badge variant="secondary">Total Tools: {tools.length}</Badge>
            <Badge variant="destructive">Removed: {removedCount}</Badge>
            <Badge variant="outline">Changes: {changes.size}</Badge>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex flex-col md:flex-row gap-4 mb-8"
          variants={itemVariants}
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            onClick={handleSaveChanges}
            disabled={changes.size === 0 || isSaving}
            variant={changes.size > 0 && !isSaving ? "default" : "secondary"}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes ({changes.size})</span>
              </>
            )}
          </Button>
        </motion.div>

        {/* Tools List */}
        <motion.div variants={itemVariants}>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Tool</TableHead>
                  <TableHead className="w-24 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <motion.tr 
                      key={tool.id}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
                          <img 
                            src={tool.logo} 
                            alt={tool.name} 
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder.svg';
                            }}
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <h3 className="font-medium text-gray-900">{tool.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{tool.tagline}</p>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTool(tool.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Remove from directory"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No tools match your search' : 'No tools available'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </motion.div>

        {/* Removed Tools */}
        {removedTools.size > 0 && (
          <motion.div 
            className="mt-12"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold muted-text mb-4">Removed Tools</h2>
            <Card>
              <Table>
                <TableBody>
                  {tools
                    .filter(tool => removedTools.has(tool.id))
                    .map((tool) => (
                      <motion.tr 
                        key={tool.id}
                        className="bg-gray-50 hover:bg-gray-100 transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell>
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
                            <img 
                              src={tool.logo} 
                              alt={tool.name} 
                              className="w-10 h-10 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/placeholder.svg';
                              }}
                            />
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <h3 className="font-medium text-gray-900">{tool.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{tool.tagline}</p>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestoreTool(tool.id)}
                            className="text-green-500 hover:text-green-700 hover:bg-green-50"
                            title="Restore to directory"
                          >
                            <Plus className="w-5 h-5" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}