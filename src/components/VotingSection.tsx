'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import UserAuthForm, { UserData } from './UserAuthForm'
import { useUserSession } from '../hooks/useUserSession'

interface VotingSectionProps {
  toolId: string
  toolName: string
  initialUpvotes?: number
  initialDownvotes?: number
}

interface Vote {
  type: 'up' | 'down'
  userData: UserData
  timestamp: number
}

export default function VotingSection({ 
  toolId, 
  toolName, 
  initialUpvotes = 0, 
  initialDownvotes = 0 
}: VotingSectionProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [pendingVoteType, setPendingVoteType] = useState<'up' | 'down' | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const { userData, isAuthenticated, setUserData } = useUserSession()

  useEffect(() => {
    loadVotes()
  }, [toolId, userData])

  const loadVotes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/votes?toolId=${toolId}`)
      if (response.ok) {
        const data = await response.json()
        setUpvotes(data.upvotes)
        setDownvotes(data.downvotes)
        
        // Check if current user has voted
        if (userData?.email) {
          const userExistingVote = data.votes.find((vote: any) => 
            vote.user_email === userData.email
          )
          if (userExistingVote) {
            setUserVote(userExistingVote.vote_type)
          }
        }
      }
    } catch (error) {
      console.error('Error loading votes:', error)
    } finally {
      setLoading(false)
    }
  }



  const handleVoteClick = (voteType: 'up' | 'down') => {
    // If user already voted for the same type, undo the vote
    if (userVote === voteType) {
      handleUndoVote()
      return
    }
    
    // If user voted for different type, change the vote
    if (userVote && userVote !== voteType) {
      handleChangeVote(voteType)
      return
    }
    
    // If user hasn't voted yet
    if (!isAuthenticated || !userData) {
      // Show auth form
      setPendingVoteType(voteType)
      setShowAuthForm(true)
    } else {
      // User is already authenticated, submit vote directly
      handleDirectVote(voteType)
    }
  }
  
  const handleUndoVote = async () => {
    if (!userVote || !userData?.email) return
    
    try {
      const response = await fetch(`/api/votes?toolId=${toolId}&userEmail=${userData.email}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Update local state
        if (userVote === 'up') {
          setUpvotes(prev => Math.max(0, prev - 1))
        } else {
          setDownvotes(prev => Math.max(0, prev - 1))
        }
        setUserVote(null)
      }
    } catch (error) {
      console.error('Error removing vote:', error)
    }
  }
  
  const handleChangeVote = async (newVoteType: 'up' | 'down') => {
    if (!userVote || !userData?.email) return
    
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           toolId,
           userEmail: userData.email,
           userName: `${userData.firstName} ${userData.lastName}`,
           voteType: newVoteType,
           userData
         })
      })
      
      if (response.ok) {
        // Update local state
        if (userVote === 'up' && newVoteType === 'down') {
          setUpvotes(prev => Math.max(0, prev - 1))
          setDownvotes(prev => prev + 1)
        } else if (userVote === 'down' && newVoteType === 'up') {
          setDownvotes(prev => Math.max(0, prev - 1))
          setUpvotes(prev => prev + 1)
        }
        setUserVote(newVoteType)
      }
    } catch (error) {
      console.error('Error changing vote:', error)
    }
  }

  const handleDirectVote = async (voteType: 'up' | 'down') => {
    if (!userData) return

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           toolId,
           userEmail: userData.email,
           userName: `${userData.firstName} ${userData.lastName}`,
           voteType,
           userData
         })
      })
      
      if (response.ok) {
        // Update local state
        if (voteType === 'up') {
          setUpvotes(prev => prev + 1)
        } else {
          setDownvotes(prev => prev + 1)
        }
        setUserVote(voteType)
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
    }
    
    setPendingVoteType(null)
  }

  const handleVoteSubmit = async (userData: UserData) => {
    if (!pendingVoteType) return

    // Store user data in global session
    setUserData(userData)
    setShowAuthForm(false)
    
    // Submit vote directly after authentication
    handleDirectVote(pendingVoteType)
  }

  const handleCloseAuthForm = () => {
    setShowAuthForm(false)
    setPendingVoteType(null)
  }

  return (
    <>
      <div className="muted-card rounded-xl p-6 shadow-sm border border-neutral-100">
        <h3 className="text-lg font-semibold muted-text mb-4">Rate this tool</h3>
        
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => handleVoteClick('up')}

            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              userVote === 'up'
                ? 'bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-200'
                : userVote === 'down'
                ? 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                : 'bg-neutral-50 muted-text-light hover:bg-green-50 hover:text-green-600 border border-neutral-200 hover:border-green-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{upvotes}</span>
            <span className="text-sm">Helpful</span>
          </motion.button>
          
          <motion.button
            onClick={() => handleVoteClick('down')}

            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              userVote === 'down'
                ? 'bg-red-100 text-red-700 border-2 border-red-200 hover:bg-red-200'
                : userVote === 'up'
                ? 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                : 'bg-neutral-50 muted-text-light hover:bg-red-50 hover:text-red-600 border border-neutral-200 hover:border-red-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{downvotes}</span>
            <span className="text-sm">Not helpful</span>
          </motion.button>
        </div>
        
        {userVote && (
          <div className="mt-3">
            <p className="text-sm muted-text-light">
              Thank you for your feedback! You rated this tool as {userVote === 'up' ? 'helpful' : 'not helpful'}.
            </p>
            <button
              onClick={() => handleUndoVote()}
              className="text-xs text-neutral-500 hover:text-neutral-700 underline mt-1 transition-colors"
            >
              Remove my vote
            </button>
          </div>
        )}
      </div>

      <UserAuthForm
        isOpen={showAuthForm}
        onClose={handleCloseAuthForm}
        onSubmit={handleVoteSubmit}
        title="Vote for this tool"
        description={`Please provide your information to ${pendingVoteType === 'up' ? 'upvote' : 'downvote'} ${toolName}. This helps us maintain quality and prevent spam.`}
      />


    </>
  )
}