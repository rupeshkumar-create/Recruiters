'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, ThumbsDown, RefreshCw, User, Calendar, ExternalLink } from 'lucide-react'

interface Vote {
  id: string
  tool_id: string
  user_email: string
  user_name: string
  user_company: string | null
  user_title: string | null
  vote_type: 'up' | 'down'
  created_at: string
  updated_at: string
  user_data: any
}

interface Tool {
  id: string
  name: string
  slug: string
}

export default function VotesManagementPage() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'up' | 'down'>('all')
  const [selectedTool, setSelectedTool] = useState<string>('all')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadVotes()
    loadTools()
  }, [filter, selectedTool])

  const loadVotes = async () => {
    try {
      setLoading(true)
      let url = '/api/votes?admin=true'
      
      if (selectedTool !== 'all') {
        url += `&toolId=${selectedTool}`
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        let filteredVotes = data.votes || []
        
        if (filter !== 'all') {
          filteredVotes = filteredVotes.filter((vote: Vote) => vote.vote_type === filter)
        }
        
        setVotes(filteredVotes)
      } else {
        showMessage('error', 'Failed to load votes')
      }
    } catch (error) {
      console.error('Error loading votes:', error)
      showMessage('error', 'Error loading votes')
    } finally {
      setLoading(false)
    }
  }

  const loadTools = async () => {
    try {
      const response = await fetch('/api/tools')
      if (response.ok) {
        const data = await response.json()
        setTools(data)
      }
    } catch (error) {
      console.error('Error loading tools:', error)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const getToolName = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId)
    return tool ? tool.name : `Tool ${toolId}`
  }

  const getToolSlug = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId)
    return tool ? tool.slug : toolId
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getVoteIcon = (voteType: string) => {
    return voteType === 'up' ? (
      <ThumbsUp className="w-4 h-4 text-green-600" />
    ) : (
      <ThumbsDown className="w-4 h-4 text-red-600" />
    )
  }

  const getVoteColor = (voteType: string) => {
    return voteType === 'up' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200'
  }

  const deleteVote = async (voteId: string) => {
    if (!confirm('Are you sure you want to delete this vote?')) {
      return
    }

    try {
      const response = await fetch(`/api/votes?voteId=${voteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setVotes(votes.filter(vote => vote.id !== voteId))
        showMessage('success', 'Vote deleted successfully!')
      } else {
        showMessage('error', 'Failed to delete vote')
      }
    } catch (error) {
      console.error('Error deleting vote:', error)
      showMessage('error', 'Error deleting vote')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading votes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Votes</h1>
          <p className="text-gray-600">
            View and manage user votes on tools.
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

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Vote Type Filter */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'All Votes', count: votes.length },
              { key: 'up', label: 'Upvotes', count: votes.filter(v => v.vote_type === 'up').length },
              { key: 'down', label: 'Downvotes', count: votes.filter(v => v.vote_type === 'down').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Tool Filter */}
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Tools</option>
            {tools.map((tool) => (
              <option key={tool.id} value={tool.id}>
                {tool.name}
              </option>
            ))}
          </select>
        </div>

        {/* Votes List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <ThumbsUp className="w-5 h-5" />
              Votes ({votes.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {votes.length === 0 ? (
              <div className="text-center py-12">
                <ThumbsUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No votes found</p>
              </div>
            ) : (
              votes.map((vote) => (
                <div key={vote.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Vote Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {vote.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{vote.user_name}</h4>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getVoteColor(vote.vote_type)}`}>
                              {getVoteIcon(vote.vote_type)}
                              <span className="ml-1">{vote.vote_type === 'up' ? 'Upvote' : 'Downvote'}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {vote.user_title && vote.user_company && (
                              <span>{vote.user_title} at {vote.user_company}</span>
                            )}
                            <span className="flex items-center gap-1">
                              Tool: 
                              <a 
                                href={`/tool/${getToolSlug(vote.tool_id)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                              >
                                {getToolName(vote.tool_id)}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(vote.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* User Details */}
                      <div className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="ml-2 text-gray-600">{vote.user_email}</span>
                          </div>
                          {vote.user_company && (
                            <div>
                              <span className="font-medium text-gray-700">Company:</span>
                              <span className="ml-2 text-gray-600">{vote.user_company}</span>
                            </div>
                          )}
                          {vote.user_title && (
                            <div>
                              <span className="font-medium text-gray-700">Title:</span>
                              <span className="ml-2 text-gray-600">{vote.user_title}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => deleteVote(vote.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}