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
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [pendingVoteType, setPendingVoteType] = useState<'up' | 'down' | null>(null)
  const { userData, isAuthenticated, setUserData } = useUserSession()

  // Check if user has already voted for this tool and set initial vote state
  useEffect(() => {
    const votes = JSON.parse(localStorage.getItem(`votes_${toolId}`) || '[]')
    if (votes.length > 0) {
      setUserVote(votes[0].type)
    }
    
    // Load initial vote counts from global storage
    const globalVotes = JSON.parse(localStorage.getItem('globalVotes') || '{}')
    const toolVotes = globalVotes[toolId]
    if (toolVotes) {
      setUpvotes(toolVotes.upvotes || 0)
      setDownvotes(toolVotes.downvotes || 0)
    }
  }, [toolId])

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
    if (isAuthenticated && userData) {
      // User is already authenticated, vote directly
      handleDirectVote(voteType)
    } else {
      // Show auth form
      setPendingVoteType(voteType)
      setShowAuthForm(true)
    }
  }
  
  const handleUndoVote = () => {
    if (!userVote) return
    
    // Remove vote from localStorage
    localStorage.removeItem(`votes_${toolId}`)
    
    // Update vote counts
    if (userVote === 'up') {
      setUpvotes(prev => Math.max(0, prev - 1))
    } else {
      setDownvotes(prev => Math.max(0, prev - 1))
    }
    
    // Update global vote counts
    const globalVotes = JSON.parse(localStorage.getItem('globalVotes') || '{}')
    if (globalVotes[toolId]) {
      if (userVote === 'up') {
        globalVotes[toolId].upvotes = Math.max(0, globalVotes[toolId].upvotes - 1)
      } else {
        globalVotes[toolId].downvotes = Math.max(0, globalVotes[toolId].downvotes - 1)
      }
      localStorage.setItem('globalVotes', JSON.stringify(globalVotes))
    }
    
    setUserVote(null)
  }
  
  const handleChangeVote = (newVoteType: 'up' | 'down') => {
    if (!userVote) return
    
    // Update vote counts (remove old vote, add new vote)
    if (userVote === 'up' && newVoteType === 'down') {
      setUpvotes(prev => Math.max(0, prev - 1))
      setDownvotes(prev => prev + 1)
    } else if (userVote === 'down' && newVoteType === 'up') {
      setDownvotes(prev => Math.max(0, prev - 1))
      setUpvotes(prev => prev + 1)
    }
    
    // Update localStorage with new vote
    const vote: Vote = {
      type: newVoteType,
      userData: JSON.parse(localStorage.getItem(`votes_${toolId}`) || '[]')[0]?.userData || {},
      timestamp: Date.now()
    }
    localStorage.setItem(`votes_${toolId}`, JSON.stringify([vote]))
    
    // Update global vote counts
    const globalVotes = JSON.parse(localStorage.getItem('globalVotes') || '{}')
    if (!globalVotes[toolId]) {
      globalVotes[toolId] = { upvotes: 0, downvotes: 0 }
    }
    
    if (userVote === 'up' && newVoteType === 'down') {
      globalVotes[toolId].upvotes = Math.max(0, globalVotes[toolId].upvotes - 1)
      globalVotes[toolId].downvotes = globalVotes[toolId].downvotes + 1
    } else if (userVote === 'down' && newVoteType === 'up') {
      globalVotes[toolId].downvotes = Math.max(0, globalVotes[toolId].downvotes - 1)
      globalVotes[toolId].upvotes = globalVotes[toolId].upvotes + 1
    }
    
    localStorage.setItem('globalVotes', JSON.stringify(globalVotes))
    setUserVote(newVoteType)
  }

  const handleDirectVote = (voteType: 'up' | 'down') => {
    if (!userData) return

    const vote: Vote = {
      type: voteType,
      userData,
      timestamp: Date.now()
    }

    // Store vote in localStorage
    const existingVotes = JSON.parse(localStorage.getItem(`votes_${toolId}`) || '[]')
    existingVotes.push(vote)
    localStorage.setItem(`votes_${toolId}`, JSON.stringify(existingVotes))

    // Update vote counts
    if (voteType === 'up') {
      setUpvotes(prev => prev + 1)
    } else {
      setDownvotes(prev => prev + 1)
    }

    setUserVote(voteType)
    
    // Store global vote counts
    const globalVotes = JSON.parse(localStorage.getItem('globalVotes') || '{}')
    globalVotes[toolId] = {
      upvotes: voteType === 'up' ? upvotes + 1 : upvotes,
      downvotes: voteType === 'down' ? downvotes + 1 : downvotes
    }
    localStorage.setItem('globalVotes', JSON.stringify(globalVotes))
  }

  const handleVoteSubmit = async (userData: UserData) => {
    if (!pendingVoteType) return

    // Store user data in global session
    setUserData(userData)

    const vote: Vote = {
      type: pendingVoteType,
      userData,
      timestamp: Date.now()
    }

    // Store vote in localStorage (in a real app, this would be sent to a server)
    const existingVotes = JSON.parse(localStorage.getItem(`votes_${toolId}`) || '[]')
    existingVotes.push(vote)
    localStorage.setItem(`votes_${toolId}`, JSON.stringify(existingVotes))

    // Update vote counts
    if (pendingVoteType === 'up') {
      setUpvotes(prev => prev + 1)
    } else {
      setDownvotes(prev => prev + 1)
    }

    setUserVote(pendingVoteType)
    setPendingVoteType(null)
    setShowAuthForm(false)
    
    // Store global vote counts
    const globalVotes = JSON.parse(localStorage.getItem('globalVotes') || '{}')
    globalVotes[toolId] = {
      upvotes: pendingVoteType === 'up' ? upvotes + 1 : upvotes,
      downvotes: pendingVoteType === 'down' ? downvotes + 1 : downvotes
    }
    localStorage.setItem('globalVotes', JSON.stringify(globalVotes))
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