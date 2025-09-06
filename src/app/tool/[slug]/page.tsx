'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Tag, Star, TrendingUp, Clock, Target, Users, Calendar, MapPin, ChevronUp, MessageCircle, Share2, Copy, Heart, ThumbsUp, Linkedin, X } from 'lucide-react'
import { getToolBySlug, getFeaturedTools, getSimilarTools } from '../../../lib/data'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import VotingSection from '../../../components/VotingSection'
import CommentSection from '../../../components/CommentSection'
import FeaturedTag from '../../../components/FeaturedTag'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface ToolPageProps {
  params: {
    slug: string
  }
}

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
    transition: { duration: 0.5 }
  }
}

const cardHoverVariants = {
  hover: {
    scale: 1.01,
    transition: { duration: 0.2 }
  }
}

const buttonHoverVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98
  }
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(String(params.slug))
  const [votes, setVotes] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shares, setShares] = useState(0)
  const [votingCounts, setVotingCounts] = useState({ upvotes: 0, downvotes: 0 })
  const [commentCount, setCommentCount] = useState(0)

  useEffect(() => {
    if (!tool?.id) return
    
    // Load from globalVotes system to sync with VotingSection
    const globalVotes = JSON.parse(localStorage.getItem('globalVotes') || '{}')
    const toolVotes = globalVotes[tool.id] || { upvotes: 0, downvotes: 0 }
    const userVoted = localStorage.getItem(`user-voted-${tool.id}`)
    const savedShares = localStorage.getItem(`tool-shares-${tool.id}`)
    
    // Load CommentSection data
    const commentData = JSON.parse(localStorage.getItem(`comments_${tool.id}`) || '[]')
    
    // Set total votes as sum of upvotes and downvotes
    setVotes(toolVotes.upvotes + toolVotes.downvotes)
    if (userVoted) setHasVoted(true)
    if (savedShares) setShares(parseInt(savedShares))
    
    setVotingCounts(toolVotes)
    setCommentCount(commentData.length)
    
    // Set up polling to check for updates
    const interval = setInterval(() => {
      const updatedGlobalVotes = JSON.parse(localStorage.getItem('globalVotes') || '{}')
      const updatedToolVotes = updatedGlobalVotes[tool.id] || { upvotes: 0, downvotes: 0 }
      const updatedComments = JSON.parse(localStorage.getItem(`comments_${tool.id}`) || '[]')
      
      // Update hero section votes from globalVotes
      setVotes(updatedToolVotes.upvotes + updatedToolVotes.downvotes)
      setVotingCounts(updatedToolVotes)
      setCommentCount(updatedComments.length)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [tool?.id])

  const handleVote = () => {
    if (!tool?.id) return
    
    if (!hasVoted) {
      // Add upvote to globalVotes system
      const globalVotes = JSON.parse(localStorage.getItem('globalVotes') || '{}')
      if (!globalVotes[tool.id]) {
        globalVotes[tool.id] = { upvotes: 0, downvotes: 0 }
      }
      globalVotes[tool.id].upvotes += 1
      localStorage.setItem('globalVotes', JSON.stringify(globalVotes))
      
      const newVotes = votes + 1
      setVotes(newVotes)
      setHasVoted(true)
      localStorage.setItem(`user-voted-${tool.id}`, 'true')
    } else {
      // Remove upvote from globalVotes system
      const globalVotes = JSON.parse(localStorage.getItem('globalVotes') || '{}')
      if (globalVotes[tool.id] && globalVotes[tool.id].upvotes > 0) {
        globalVotes[tool.id].upvotes -= 1
        localStorage.setItem('globalVotes', JSON.stringify(globalVotes))
      }
      
      const newVotes = Math.max(0, votes - 1)
      setVotes(newVotes)
      setHasVoted(false)
      localStorage.removeItem(`user-voted-${tool.id}`)
    }
  }



  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    // Increment share count
    const newShares = shares + 1
    setShares(newShares)
    localStorage.setItem(`tool-shares-${tool?.id}`, newShares.toString())
  }

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out ${tool?.name}: ${tool?.tagline}`)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${text}`, '_blank')
    // Increment share count
    const newShares = shares + 1
    setShares(newShares)
    localStorage.setItem(`tool-shares-${tool?.id}`, newShares.toString())
  }

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out ${tool?.name}: ${tool?.tagline}`)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
    // Increment share count
    const newShares = shares + 1
    setShares(newShares)
    localStorage.setItem(`tool-shares-${tool?.id}`, newShares.toString())
  }

  if (!tool) {
    notFound()
  }

  const featuredTools = getFeaturedTools().filter(t => t.id !== tool!.id).slice(0, 5)
  const similarTools = getSimilarTools(tool!.id, tool!.categories).slice(0, 3)

  return (
    <motion.div
      className="min-h-screen muted-gradient"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <Link href="/">
            <motion.div
              className="inline-flex items-center gap-2 muted-text-light hover:orange-accent transition-colors mb-6"
              whileHover={{ x: -5 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Directory
            </motion.div>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* Logo Column */}
            <motion.div
              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 relative flex-shrink-0 mx-auto lg:mx-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {tool.featured && <FeaturedTag className="top-1 right-1" />}
              <Image
                src={tool.logo}
                alt={`${tool.name} logo`}
                fill
                className="object-contain rounded-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&size=200&background=0D8ABC&color=fff&format=png`;
                }}
              />
            </motion.div>
            
            {/* Content Column */}
            <div className="flex-1 min-w-0">
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold muted-text text-center lg:text-left break-words hyphens-auto leading-tight mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {tool.name}
              </motion.h1>
              
              <motion.p
                className="text-lg sm:text-xl muted-text-light mb-1.5 leading-relaxed text-center lg:text-left max-w-4xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {tool.tagline}
              </motion.p>
              
              <motion.div
                className="flex flex-wrap gap-3 mb-3 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {tool.categories.split(',').map((category, index) => (
                  <motion.span
                    key={category.trim()}
                    className="px-3 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Tag className="w-3 h-3" />
                    {category.trim()}
                  </motion.span>
                ))}
              </motion.div>
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-center lg:items-start lg:justify-start mt-4">
                <motion.div
                  variants={buttonHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    asChild
                    className="orange-bg hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ExternalLink className="w-5 h-5 ml-2" />
                    </a>
                  </Button>
                </motion.div>
                
                {/* Social Sharing */}
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnLinkedIn}
                    className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 p-2.5"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnTwitter}
                    className="hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 transition-all duration-200 p-2.5"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-all duration-200 p-2.5"
                  >
                    <Copy className="w-4 h-4" />
                    {copied && <span className="ml-1 text-xs font-medium">Copied!</span>}
                  </Button>
                </motion.div>
              </div>
            </div>
            
            {/* Voting Section Column */}
            <motion.div
              className="flex flex-col items-center muted-card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-3 min-w-[80px] flex-shrink-0 mx-auto lg:mx-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.button
                onClick={handleVote}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  hasVoted 
                    ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                    : 'bg-neutral-50 muted-text-light hover:bg-neutral-100 hover:text-neutral-700 border border-neutral-200 hover:border-neutral-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronUp className="w-5 h-5" />
              </motion.button>
              <span className="text-lg font-bold muted-text mt-0.5">{votes}</span>
              <span className="text-xs muted-text-light font-medium">votes</span>
            </motion.div>
          </div>
        </motion.div>



        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <motion.div variants={itemVariants}>
              <Card className="muted-card border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl muted-text">About {tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="muted-text-light leading-relaxed text-lg break-words overflow-wrap-anywhere">
                      {tool.content}
                    </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Voting Section */}
            <motion.div variants={itemVariants}>
              <VotingSection 
                toolId={tool.id} 
                toolName={tool.name}
                initialUpvotes={0}
                initialDownvotes={0}
              />
            </motion.div>

            {/* Comments Section */}
            <motion.div variants={itemVariants}>
              <CommentSection 
                toolId={tool.id} 
                toolName={tool.name}
              />
            </motion.div>

            {/* Similar Tools */}
            {similarTools.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="muted-card border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl muted-text">Similar Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {similarTools.map((similarTool) => (
                        <Link key={similarTool.id} href={`/tool/${similarTool.slug}`}>
                          <motion.div
                            className="p-4 border border-neutral-200 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer muted-card hover:bg-gradient-to-br hover:from-orange-50/20 hover:to-neutral-50/40 group"
                            whileHover={{ scale: 1.01, y: -2 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 relative bg-gray-50 rounded-lg p-1.5 flex-shrink-0">
                                <Image
                                  src={similarTool.logo}
                                  alt={similarTool.name}
                                  fill
                                  className="object-contain rounded"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(similarTool.name)}&size=36&background=0D8ABC&color=fff&format=png`;
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold muted-text text-sm group-hover:orange-accent transition-colors truncate">{similarTool.name}</h4>
                                <p className="muted-text-light text-xs line-clamp-1 mt-0.5">{similarTool.tagline}</p>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </div>

          {/* Right Column */}
          <div className="space-y-6">


            {/* Featured Tools Slider */}
            {featuredTools.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="muted-card border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg muted-text flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Featured Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {featuredTools.map((featuredTool, index) => (
                        <Link key={featuredTool.id} href={`/tool/${featuredTool.slug}`}>
                          <motion.div
                            className="p-4 mb-4 border border-neutral-100 rounded-lg hover:border-neutral-200 hover:shadow-sm transition-all duration-200 cursor-pointer group muted-card"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            whileHover={{ scale: 1.005, y: -1 }}
                            style={{ marginBottom: '24px' }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 relative flex-shrink-0 bg-gray-50 rounded-lg p-1.5">
                                <Image
                                  src={featuredTool.logo}
                                  alt={featuredTool.name}
                                  fill
                                  className="object-contain rounded"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(featuredTool.name)}&size=40&background=0D8ABC&color=fff&format=png`;
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium muted-text text-sm group-hover:orange-accent transition-colors">
                                  {featuredTool.name}
                                </h4>
                                <p className="muted-text-light text-xs mt-0.5 line-clamp-1">
                                  {featuredTool.tagline}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Engagement Stats */}
            <motion.div variants={itemVariants}>
              <Card className="muted-card border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl muted-text">Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 orange-accent" />
                        <span className="muted-text-light">Votes</span>
                      </div>
                      <span className="font-bold muted-text">{votingCounts.upvotes + votingCounts.downvotes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-neutral-500" />
                        <span className="muted-text-light">Comments</span>
                      </div>
                      <span className="font-bold muted-text">{commentCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-neutral-500" />
                        <span className="muted-text-light">Share</span>
                      </div>
                      <span className="font-bold muted-text">{shares}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}