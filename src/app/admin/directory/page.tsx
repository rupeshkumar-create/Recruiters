'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FolderPlus, FolderMinus, Settings, Save, ArrowLeft, Search, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'
import { mockTools, removeToolFromDirectory, addToolToDirectory } from '../../../lib/data'
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

export default function DirectoryManagementPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [changes, setChanges] = useState<Set<string>>(new Set())
  const [removedTools, setRemovedTools] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setTools([...mockTools])
  }, [])

  const filteredTools = tools.filter(tool => 
    !removedTools.has(tool.id) &&
    (tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.tagline.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleRemoveTool = (toolId: string) => {
    setRemovedTools(prev => new Set([...prev, toolId]))
    setChanges(prev => new Set([...prev, toolId]))
  }

  const handleRestoreTool = (toolId: string) => {
    const newRemovedTools = new Set(removedTools)
    newRemovedTools.delete(toolId)
    setRemovedTools(newRemovedTools)
    setChanges(prev => new Set([...prev, toolId]))
    
    // In a real implementation, this would be handled in handleSaveChanges
    // For now, we'll just update the UI state
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Apply changes to the actual data
    const removedToolsList = Array.from(removedTools);
    const originalTools = [...tools];
    
    // Remove tools from directory
    removedToolsList.forEach(toolId => {
      const tool = originalTools.find(t => t.id === toolId);
      if (tool) {
        removeToolFromDirectory(toolId);
      }
    });
    
    setChanges(new Set())
    setIsSaving(false)
    
    // Refresh the page data
    window.location.reload()
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
            <span>Total Tools: {tools.length}</span>
            <span>Removed: {removedCount}</span>
            <span>Changes: {changes.size}</span>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex flex-col md:flex-row gap-4 mb-8"
          variants={itemVariants}
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          
          <button
            onClick={handleSaveChanges}
            disabled={changes.size === 0 || isSaving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${changes.size > 0 && !isSaving ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
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
          </button>
        </motion.div>

        {/* Tools List */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 bg-gray-50 border-b border-gray-100 font-medium text-gray-600">
              <div className="w-12"></div>
              <div>Tool</div>
              <div className="w-24 text-center">Actions</div>
            </div>
            
            {filteredTools.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredTools.map((tool) => (
                  <motion.div 
                    key={tool.id}
                    className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
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
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{tool.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{tool.tagline}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemoveTool(tool.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove from directory"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No tools match your search' : 'No tools available'}
              </div>
            )}
          </div>
        </motion.div>

        {/* Removed Tools */}
        {removedTools.size > 0 && (
          <motion.div 
            className="mt-12"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold muted-text mb-4">Removed Tools</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {tools
                  .filter(tool => removedTools.has(tool.id))
                  .map((tool) => (
                    <motion.div 
                      key={tool.id}
                      className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
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
                      
                      <div>
                        <h3 className="font-medium text-gray-900">{tool.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{tool.tagline}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRestoreTool(tool.id)}
                          className="p-2 rounded-lg text-green-500 hover:bg-green-50 transition-colors"
                          title="Restore to directory"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}