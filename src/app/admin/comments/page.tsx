'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Check, X, Eye, Clock, RefreshCw, User, Calendar } from 'lucide-react'

interface Comment {
  id: number
  tool_id: string
  user_email: string
  user_name: string
  user_company: string | null
  user_title: string | null
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  approved_at: string | null
  approved_by: string | null
}

interface Tool {
  id: string
  name: string
  slug: string
}

export default function CommentsManagementPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadComments()
    loadTools()
  }, [filter])

  const loadComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?toolId=all&status=${filter}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      } else {
        showMessage('error', 'Failed to load comments')
      }
    } catch (error) {
      console.error('Error loading comments:', error)
      showMessage('error', 'Error loading comments')
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

  const handleApprove = async (commentId: number) => {
    try {
      setProcessing(commentId)
      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          status: 'approved',
          approvedBy: 'admin'
        })
      })

      if (response.ok) {
        setComments(comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, status: 'approved', approved_at: new Date().toISOString(), approved_by: 'admin' }
            : comment
        ))
        showMessage('success', 'Comment approved successfully!')
      } else {
        showMessage('error', 'Failed to approve comment')
      }
    } catch (error) {
      console.error('Error approving comment:', error)
      showMessage('error', 'Error approving comment')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (commentId: number) => {
    try {
      setProcessing(commentId)
      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          status: 'rejected',
          approvedBy: 'admin'
        })
      })

      if (response.ok) {
        setComments(comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, status: 'rejected', updated_at: new Date().toISOString() }
            : comment
        ))
        showMessage('success', 'Comment rejected successfully!')
      } else {
        showMessage('error', 'Failed to reject comment')
      }
    } catch (error) {
      console.error('Error rejecting comment:', error)
      showMessage('error', 'Error rejecting comment')
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return
    }

    try {
      setProcessing(commentId)
      const response = await fetch(`/api/comments?commentId=${commentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId))
        showMessage('success', 'Comment deleted successfully!')
      } else {
        showMessage('error', 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      showMessage('error', 'Error deleting comment')
    } finally {
      setProcessing(null)
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />
      case 'approved': return <Check className="w-3 h-3" />
      case 'rejected': return <X className="w-3 h-3" />
      default: return <Eye className="w-3 h-3" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading comments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Comments</h1>
          <p className="text-gray-600">
            Review and moderate user comments on tools.
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

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: 'pending', label: 'Pending', count: comments.filter(c => c.status === 'pending').length },
              { key: 'approved', label: 'Approved', count: comments.filter(c => c.status === 'approved').length },
              { key: 'rejected', label: 'Rejected', count: comments.filter(c => c.status === 'rejected').length },
              { key: 'all', label: 'All', count: comments.length }
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
        </div>

        {/* Comments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comments ({comments.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No {filter !== 'all' ? filter : ''} comments found</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Comment Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {comment.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{comment.user_name}</h4>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(comment.status)}`}>
                              {getStatusIcon(comment.status)}
                              <span className="ml-1">{comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {comment.user_title && comment.user_company && (
                              <span>{comment.user_title} at {comment.user_company}</span>
                            )}
                            <span>Tool: {getToolName(comment.tool_id)}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Comment Content */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <p className="text-gray-800 leading-relaxed">{comment.content}</p>
                      </div>
                      
                      {/* Approval Info */}
                      {comment.approved_at && (
                        <div className="text-xs text-gray-500">
                          Approved on {formatDate(comment.approved_at)} by {comment.approved_by}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {comment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(comment.id)}
                            disabled={processing === comment.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                          >
                            {processing === comment.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(comment.id)}
                            disabled={processing === comment.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                          >
                            <X className="w-3 h-3" />
                            Reject
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={processing === comment.id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        <X className="w-3 h-3" />
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