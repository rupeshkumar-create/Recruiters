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
  onCommentCountChange?: (count: number) => void
}

export default function CommentSection({ toolId, toolName, onCommentCountChange }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [pendingComment, setPendingComment] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)
  const [loading, setLoading] = useState(true)

  const { userData, isAuthenticated, setUserData, clearSession } = useUserSession()

  // Load comments from API on component mount
  useEffect(() => {
    loadComments()
  }, [toolId])

  const loadComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?toolId=${toolId}&status=approved`)
      if (response.ok) {
        const commentsData = await response.json()
        setComments(commentsData)
        
        // Notify parent component of comment count change
        if (onCommentCountChange) {
          onCommentCountChange(commentsData.length)
        }
      } else {
        console.error('Failed to load comments')
        // Fallback to localStorage for backward compatibility
        const savedComments = localStorage.getItem(`comments_${toolId}`)
        if (savedComments) {
          const parsedComments = JSON.parse(savedComments)
          setComments(parsedComments)
          if (onCommentCountChange) {
            onCommentCountChange(parsedComments.length)
          }
        }
      }
    } catch (error) {
      console.error('Error loading comments:', error)
      // Fallback to localStorage
      const savedComments = localStorage.getItem(`comments_${toolId}`)
      if (savedComments) {
        const parsedComments = JSON.parse(savedComments)
        setComments(parsedComments)
        if (onCommentCountChange) {
          onCommentCountChange(parsedComments.length)
        }
      }
    } finally {
      setLoading(false)
    }
  }



  const handleCommentSubmit = () => {
    console.log('Comment submit clicked:', { newComment: newComment.trim(), isAuthenticated, userData })
    
    if (!newComment.trim()) {
      alert('Please enter a comment before submitting.')
      return
    }

    if (isAuthenticated && userData) {
      // User is already authenticated, submit comment directly
      console.log('User is authenticated, submitting directly')
      handleDirectCommentSubmit(newComment)
    } else {
      // Show auth form
      console.log('User not authenticated, showing auth form')
      setPendingComment(newComment)
      setShowAuthForm(true)
    }
  }

  const handleDirectCommentSubmit = async (commentText: string) => {
    if (!userData || !commentText.trim()) {
      console.log('Missing userData or commentText:', { userData, commentText })
      return
    }

    console.log('Submitting comment:', {
      toolId,
      userEmail: userData.email,
      userName: `${userData.firstName} ${userData.lastName}`,
      userCompany: userData.company || '',
      userTitle: userData.title || '',
      content: commentText
    })

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolId,
          userEmail: userData.email,
          userName: `${userData.firstName} ${userData.lastName}`,
          userCompany: userData.company || '',
          userTitle: userData.title || '',
          content: commentText
        })
      })

      console.log('Comment submission response:', response.status)
      const responseData = await response.json()
      console.log('Comment submission response data:', responseData)

      if (response.ok) {
        // Show thank you message
        console.log('Setting showThankYou to true')
        setShowThankYou(true)
        
        // Reset form
        setNewComment('')
        
        // Show success message for longer duration
        setTimeout(() => {
          console.log('Hiding thank you message after 8 seconds')
          setShowThankYou(false)
        }, 8000)
        
        // Don't add to local comments since it needs approval
        console.log('Comment submitted successfully, showing thank you message')
        return
      } else {
        console.error('Failed to submit comment:', responseData)
        alert('Failed to submit comment. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Error submitting comment. Please try again.')
    }
  }

  const handleAuthSubmit = async (userData: UserData) => {
    console.log('Auth form submitted:', { userData, pendingComment })
    
    if (!pendingComment.trim()) {
      console.log('No pending comment, returning')
      return
    }

    const commentToSubmit = pendingComment

    // Store user data in global session
    setUserData(userData)
    console.log('User data stored, submitting comment')

    // Close auth form and show success message immediately
    setShowAuthForm(false)
    setPendingComment('')
    
    // Show success message instantly
    setShowThankYou(true)
    console.log('Showing success message immediately')
    
    // Reset form
    setNewComment('')
    
    // Hide success message after 6 seconds
    setTimeout(() => {
      console.log('Hiding thank you message after 6 seconds')
      setShowThankYou(false)
    }, 6000)

    // Submit comment to API in background
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolId,
          userEmail: userData.email,
          userName: `${userData.firstName} ${userData.lastName}`,
          userCompany: userData.company || '',
          userTitle: userData.title || '',
          content: commentToSubmit
        })
      })

      console.log('Comment submission response:', response.status)
      const responseData = await response.json()
      console.log('Comment submission response data:', responseData)

      if (response.ok) {
        console.log('Comment submitted successfully to API')
        
        // Clear user session so they need to fill form again next time
        setTimeout(() => {
          clearSession()
          console.log('User session cleared for next interaction')
        }, 1000)
        
      } else {
        console.error('Failed to submit comment after auth:', responseData)
        // Don't show error to user since success message is already shown
        // Just log the error for debugging
      }
    } catch (error) {
      console.error('Error submitting comment after auth:', error)
      alert('Error submitting comment. Please try again.')
    }
    console.log('Auth form closed')
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
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F26B21] mx-auto mb-3"></div>
              <p>Loading comments...</p>
            </div>
          ) : (
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
                        {comment.user_name ? getInitials(comment.user_name.split(' ')[0] || '', comment.user_name.split(' ')[1] || '') : 
                         comment.userData ? getInitials(comment.userData.firstName, comment.userData.lastName) : '?'}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium muted-text">
                            {comment.user_name || `${comment.userData?.firstName} ${comment.userData?.lastName}`}
                          </h4>
                          {((comment.user_title || comment.userData?.title) && (comment.user_company || comment.userData?.company)) && (
                            <span className="text-sm muted-text-light">
                              {comment.user_title || comment.userData?.title} at {comment.user_company || comment.userData?.company}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          <span className="text-xs muted-text-light">
                            {comment.created_at ? formatDate(new Date(comment.created_at).getTime()) : formatDate(comment.timestamp)}
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
          )}
        </div>
      </div>

      <UserAuthForm
        isOpen={showAuthForm}
        onClose={handleCloseAuthForm}
        onSubmit={handleAuthSubmit}
        title="Post a comment"
        description={`Please provide your information to post a comment about ${toolName}. This helps us maintain a professional community.`}
      />

      {/* Success Overlay */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Thank You!
              </h3>
              <p className="text-gray-600 mb-6">
                Your comment has been submitted for review and will appear once approved by our team.
              </p>
              <button
                onClick={() => setShowThankYou(false)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}