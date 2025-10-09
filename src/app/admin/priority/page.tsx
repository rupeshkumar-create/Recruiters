'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, ArrowDown, X, Save, RefreshCw } from 'lucide-react'

interface Tool {
  id: string
  name: string
  tagline: string
  logo: string
  categories: string
  priority_order: number | null
  created_at: string
}

export default function PriorityManagementPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [priorityTools, setPriorityTools] = useState<Tool[]>([])
  const [availableTools, setAvailableTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadTools()
  }, [])

  const loadTools = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tools/priority')
      if (response.ok) {
        const data = await response.json()
        setTools(data)
        
        // Separate priority tools (1-15) from available tools
        const priority = data.filter((tool: Tool) => tool.priority_order !== null).slice(0, 15)
        const available = data.filter((tool: Tool) => tool.priority_order === null)
        
        setPriorityTools(priority)
        setAvailableTools(available)
      } else {
        showMessage('error', 'Failed to load tools')
      }
    } catch (error) {
      console.error('Error loading tools:', error)
      showMessage('error', 'Error loading tools')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const addToPriority = (tool: Tool) => {
    if (priorityTools.length >= 15) {
      showMessage('error', 'Maximum 15 tools can be in priority list')
      return
    }

    const newPriorityTool = { ...tool, priority_order: priorityTools.length + 1 }
    setPriorityTools([...priorityTools, newPriorityTool])
    setAvailableTools(availableTools.filter(t => t.id !== tool.id))
  }

  const removeFromPriority = (toolId: string) => {
    const tool = priorityTools.find(t => t.id === toolId)
    if (!tool) return

    const updatedPriorityTools = priorityTools
      .filter(t => t.id !== toolId)
      .map((t, index) => ({ ...t, priority_order: index + 1 }))

    setPriorityTools(updatedPriorityTools)
    setAvailableTools([...availableTools, { ...tool, priority_order: null }].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ))
  }

  const movePriority = (toolId: string, direction: 'up' | 'down') => {
    const currentIndex = priorityTools.findIndex(t => t.id === toolId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= priorityTools.length) return

    const newPriorityTools = [...priorityTools]
    const [movedTool] = newPriorityTools.splice(currentIndex, 1)
    newPriorityTools.splice(newIndex, 0, movedTool)

    // Update priority_order for all tools
    const updatedTools = newPriorityTools.map((tool, index) => ({
      ...tool,
      priority_order: index + 1
    }))

    setPriorityTools(updatedTools)
  }

  const savePriorities = async () => {
    try {
      setSaving(true)
      
      // Prepare the data for API
      const toolPriorities = [
        ...priorityTools.map(tool => ({ id: tool.id, priority_order: tool.priority_order })),
        ...availableTools.map(tool => ({ id: tool.id, priority_order: null }))
      ]

      const response = await fetch('/api/tools/priority', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolPriorities })
      })

      if (response.ok) {
        showMessage('success', 'Priority order saved successfully!')
        // Trigger refresh on main page
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('refreshTools'))
        }
      } else {
        const error = await response.json()
        showMessage('error', error.message || 'Failed to save priorities')
      }
    } catch (error) {
      console.error('Error saving priorities:', error)
      showMessage('error', 'Error saving priorities')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading tools...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Top 15 Tools Priority</h1>
          <p className="text-gray-600">
            Drag and arrange the top 15 tools that will appear first on the homepage. 
            All other tools will appear after these in chronological order.
          </p>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Priority Tools (Top 15) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Top 15 Priority Tools ({priorityTools.length}/15)
              </h2>
              <button
                onClick={savePriorities}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Priority Order'}
              </button>
            </div>

            <div className="space-y-3">
              {priorityTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  layout
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => movePriority(tool.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => movePriority(tool.id, 'down')}
                        disabled={index === priorityTools.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="w-10 h-10 flex-shrink-0">
                    <img 
                      src={tool.logo} 
                      alt={tool.name}
                      className="w-full h-full rounded-lg object-contain"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=F26B21&color=fff&size=40`;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{tool.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{tool.tagline}</p>
                    <p className="text-xs text-gray-500">{tool.categories}</p>
                  </div>

                  <button
                    onClick={() => removeFromPriority(tool.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}

              {priorityTools.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No priority tools selected</p>
                  <p className="text-sm">Add tools from the available list</p>
                </div>
              )}
            </div>
          </div>

          {/* Available Tools */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Available Tools ({availableTools.length})
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  layout
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 flex-shrink-0">
                    <img 
                      src={tool.logo} 
                      alt={tool.name}
                      className="w-full h-full rounded-lg object-contain"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=F26B21&color=fff&size=40`;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{tool.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{tool.tagline}</p>
                    <p className="text-xs text-gray-500">{tool.categories}</p>
                  </div>

                  <button
                    onClick={() => addToPriority(tool)}
                    disabled={priorityTools.length >= 15}
                    className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add to Top 15
                  </button>
                </motion.div>
              ))}

              {availableTools.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>All tools are in priority list</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}