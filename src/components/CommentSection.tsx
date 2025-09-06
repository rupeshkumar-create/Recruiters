'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, User, Calendar } from 'lucide-react'
import UserAuthForm, { UserData } from './UserAuthForm'
import { useUserSession } from '../hooks/useUserSession'

interface Comment {
  id: string
  content: string
  userData: UserData
  timestamp: number
}

interface CommentSectionProps {
  toolId: string
  toolName: string
}

export default function CommentSection({ toolId, toolName }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [pendingComment, setPendingComment] = useState('')

  const { userData, isAuthenticated, setUserData } = useUserSession()

  // Load comments from localStorage on component mount
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${toolId}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }
  }, [toolId])



  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      alert('Please enter a comment before submitting.')
      return
    }

    if (isAuthenticated && userData) {
      // User is already authenticated, submit comment directly
      handleDirectCommentSubmit(newComment)
    } else {
      // Show auth form
      setPendingComment(newComment)
      setShowAuthForm(true)
    }
  }

  const handleDirectCommentSubmit = (commentText: string) => {
    if (!userData || !commentText.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: commentText,
      userData,
      timestamp: Date.now()
    }

    const updatedComments = [comment, ...comments]
    setComments(updatedComments)
    
    // Save to localStorage
    localStorage.setItem(`comments_${toolId}`, JSON.stringify(updatedComments))
    
    // Reset form
    setNewComment('')
  }

  const handleAuthSubmit = async (userData: UserData) => {
    if (!pendingComment.trim()) return

    // Store user data in global session
    setUserData(userData)

    const comment: Comment = {
      id: Date.now().toString(),
      content: pendingComment,
      userData,
      timestamp: Date.now()
    }

    const updatedComments = [comment, ...comments]
    setComments(updatedComments)
    
    // Save to localStorage
    localStorage.setItem(`comments_${toolId}`, JSON.stringify(updatedComments))
    
    // Reset form and close auth form
    setNewComment('')
    setPendingComment('')
    setShowAuthForm(false)
  }

  const handleCloseAuthForm = () => {
    setShowAuthForm(false)
    setPendingComment('')
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-5 h-5 text-[#F26B21]" />
          <h3 className="text-lg font-semibold text-gray-900">
            Comments ({comments.length})
          </h3>
        </div>

        {/* Comment Input */}
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`Share your thoughts about ${toolName}...`}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26B21] focus:border-transparent resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <motion.button
              onClick={handleCommentSubmit}
              disabled={!newComment.trim()}
              className="flex items-center gap-2 bg-[#F26B21] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#F26B21]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-4 h-4" />
              Post Comment
            </motion.button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          <AnimatePresence>
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="muted-card rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 orange-bg rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {getInitials(comment.userData.firstName, comment.userData.lastName)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium muted-text">
                          {comment.userData.firstName} {comment.userData.lastName}
                        </h4>
                        <span className="text-sm muted-text-light">
                          {comment.userData.title} at {comment.userData.company}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        <span className="text-xs muted-text-light">
                          {formatDate(comment.timestamp)}
                        </span>
                      </div>
                      
                      <p className="muted-text-light leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <UserAuthForm
        isOpen={showAuthForm}
        onClose={handleCloseAuthForm}
        onSubmit={handleAuthSubmit}
        title="Post a comment"
        description={`Please provide your information to post a comment about ${toolName}. This helps us maintain a professional community.`}
      />


    </>
  )
}