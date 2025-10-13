'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Tag, Star, TrendingUp, Clock, Target, Users, Calendar, MapPin, ChevronUp, MessageCircle, Share2, Copy, Heart, ThumbsUp, ThumbsDown, Linkedin, X } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import VotingSection from '../../../components/VotingSection'
import CommentSection from '../../../components/CommentSection'
import FeaturedTag from '../../../components/FeaturedTag'
import ToolImage from '../../../components/ToolImage'
import UserAuthForm, { UserData } from '../../../components/UserAuthForm'
import Navigation from '../../../components/Navigation'
import EmailSubscription from '../../../components/EmailSubscription'
import { useState, useEffect } from 'react'
import { trackToolVisit, trackToolClick, trackToolShare } from '../../../lib/analytics'

interface Tool {
  id: string;
  name: string;
  url: string;
  tagline: string;
  content: string;
  description?: string;
  categories: string;
  logo: string;
  slug: string;
  featured: boolean;
  hidden?: boolean;
  approved?: boolean;
}

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
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([])
  const [similarTools, setSimilarTools] = useState<Tool[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shares, setShares] = useState(0)
  const [votingCounts, setVotingCounts] = useState({ upvotes: 0, downvotes: 0 })
  const [commentCount, setCommentCount] = useState(0)
  const [showAuthForm, setShowAuthForm] = useState(false)

  // Helper function to format category names with proper case
  const formatCategoryName = (category: string): string => {
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Fetch tool data from API
  useEffect(() => {
    const fetchTool = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/tools/${params.slug}`)
        
        if (response.status === 404) {
          notFound()
          return
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error('API Error:', response.status, errorData)
          throw new Error(`API Error: ${response.status} - ${errorData.error || 'Failed to fetch tool'}`)
        }
        
        const toolData = await response.json()
        setTool(toolData)
        
        // Track tool visit
        trackToolVisit(toolData.id, toolData.name)
        
        // Fetch featured tools
        const featuredResponse = await fetch('/api/tools?featured=true')
        if (featuredResponse.ok) {
          const featured = await featuredResponse.json()
          setFeaturedTools(featured.filter((t: Tool) => t.id !== toolData.id).slice(0, 5))
        }
        
        // Fetch similar tools (same category, then all tools if not enough)
        let similarToolsFound: Tool[] = []
        
        if (toolData.categories) {
          // First try to get tools from the same category
          const firstCategory = toolData.categories.split(',')[0].trim()
          const similarResponse = await fetch(`/api/tools?category=${encodeURIComponent(firstCategory)}`)
          if (similarResponse.ok) {
            const similar = await similarResponse.json()
            similarToolsFound = similar.filter((t: Tool) => t.id !== toolData.id)
          }
        }
        
        // If we don't have enough similar tools, get more from all tools
        if (similarToolsFound.length < 3) {
          const allToolsResponse = await fetch('/api/tools')
          if (allToolsResponse.ok) {
            const allTools = await allToolsResponse.json()
            const remainingTools = allTools.filter((t: Tool) => 
              t.id !== toolData.id && 
              !similarToolsFound.some(existing => existing.id === t.id)
            )
            
            // Add random tools to fill up to 3
            const additionalNeeded = 3 - similarToolsFound.length
            const shuffled = remainingTools.sort(() => 0.5 - Math.random())
            similarToolsFound = [...similarToolsFound, ...shuffled.slice(0, additionalNeeded)]
          }
        }
        
        setSimilarTools(similarToolsFound.slice(0, 3))
        
      } catch (error) {
        console.error('Error fetching tool:', error)
        // Only call notFound() for actual 404s, not network errors
        if (error instanceof Error && error.message.includes('404')) {
          notFound()
        }
        // For other errors, just set loading to false and let the component handle it
      } finally {
        setLoading(false)
      }
    }
    
    fetchTool()
  }, [params.slug])

  useEffect(() => {
    if (!tool?.id) return
    
    const loadVotesAndComments = async () => {
      try {
        // Load votes from API
        const votesResponse = await fetch(`/api/votes?toolId=${tool.id}`)
        if (votesResponse.ok) {
          const votesData = await votesResponse.json()
          setVotingCounts({ upvotes: votesData.upvotes, downvotes: votesData.downvotes })
          
          // Check if current user has voted
          const userData = JSON.parse(localStorage.getItem('userSession') || 'null')
          if (userData?.email) {
            const userVote = votesData.votes.find((vote: any) => vote.user_email === userData.email)
            setHasVoted(!!userVote && userVote.vote_type === 'up')
          }
        }
        
        // Load approved comments from API
        const commentsResponse = await fetch(`/api/comments?toolId=${tool.id}&status=approved`)
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json()
          setCommentCount(commentsData.length)
        } else {
          // Fallback to localStorage for backward compatibility
          const commentData = JSON.parse(localStorage.getItem(`comments_${tool.id}`) || '[]')
          setCommentCount(commentData.length)
        }
        
        // Load shares from localStorage
        const savedShares = localStorage.getItem(`tool-shares-${tool.id}`)
        if (savedShares) setShares(parseInt(savedShares))
        
      } catch (error) {
        console.error('Error loading votes and comments:', error)
      }
    }
    
    loadVotesAndComments()
    
    // Set up polling to check for updates
    const interval = setInterval(loadVotesAndComments, 5000)
    
    return () => clearInterval(interval)
  }, [tool?.id])

  const handleVote = async () => {
    if (!tool?.id) return
    
    // Import user session hook functionality
    const userData = JSON.parse(localStorage.getItem('userSession') || 'null')
    
    if (!userData) {
      // Show auth form
      setShowAuthForm(true)
      return
    }
    
    if (!hasVoted) {
      try {
        const response = await fetch('/api/votes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            toolId: tool.id,
            userEmail: userData.email,
            userName: `${userData.firstName} ${userData.lastName}`,
            voteType: 'up',
            userData
          })
        })
        
        if (response.ok) {
          setHasVoted(true)
          setVotingCounts(prev => ({ ...prev, upvotes: prev.upvotes + 1 }))
          
          // Show thank you message
          alert('🎉 Thank you for your vote! Your feedback helps other users discover great tools.')
        }
      } catch (error) {
        console.error('Error submitting vote:', error)
      }
    } else {
      try {
        const response = await fetch(`/api/votes?toolId=${tool.id}&userEmail=${userData.email}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setHasVoted(false)
          setVotingCounts(prev => ({ ...prev, upvotes: Math.max(0, prev.upvotes - 1) }))
        }
      } catch (error) {
        console.error('Error removing vote:', error)
      }
    }
  }



  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    // Track share
    if (tool) {
      trackToolShare(tool.id, 'copy', tool.name)
    }
    // Increment share count
    const newShares = shares + 1
    setShares(newShares)
    localStorage.setItem(`tool-shares-${tool?.id}`, newShares.toString())
  }

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out ${tool?.name}: ${tool?.tagline}`)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${text}`, '_blank')
    // Track share
    if (tool) {
      trackToolShare(tool.id, 'linkedin', tool.name)
    }
    // Increment share count
    const newShares = shares + 1
    setShares(newShares)
    localStorage.setItem(`tool-shares-${tool?.id}`, newShares.toString())
  }

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out ${tool?.name}: ${tool?.tagline}`)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
    // Track share
    if (tool) {
      trackToolShare(tool.id, 'twitter', tool.name)
    }
    // Increment share count
    const newShares = shares + 1
    setShares(newShares)
    localStorage.setItem(`tool-shares-${tool?.id}`, newShares.toString())
  }

  const handleAuthSubmit = async (userData: UserData) => {
    // Store user data in session
    localStorage.setItem('userSession', JSON.stringify(userData))
    setShowAuthForm(false)
    
    // Submit the vote directly after authentication
    if (!tool?.id) return
    
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          toolId: tool.id,
          userEmail: userData.email,
          userName: `${userData.firstName} ${userData.lastName}`,
          voteType: 'up',
          userData
        })
      })
      
      if (response.ok) {
        setHasVoted(true)
        setVotingCounts(prev => ({ ...prev, upvotes: prev.upvotes + 1 }))
        
        // Show thank you message
        alert('🎉 Thank you for your vote! Your feedback helps other users discover great tools.')
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen muted-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="muted-text-light">Loading tool...</p>
        </div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen muted-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool Not Found</h1>
          <p className="text-gray-600 mb-6">The tool you're looking for doesn't exist or there was an error loading it.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen muted-gradient">
      <Navigation onSubmitToolClick={() => setShowAuthForm(true)} />
      
      <motion.div
        className="container mx-auto px-4 py-8 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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
              <ToolImage 
                src={tool.logo}
                alt={`${tool.name} logo`}
                name={tool.name}
                className="w-full h-full rounded-2xl"
                size="lg"
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
                    {formatCategoryName(category.trim())}
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
                    <a 
                      href={tool.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => trackToolClick(tool.id, tool.name)}
                    >
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
              <span className="text-lg font-bold muted-text mt-0.5">{votingCounts.upvotes}</span>
              <span className="text-xs muted-text-light font-medium">helpful</span>
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
                initialUpvotes={votingCounts.upvotes}
                initialDownvotes={votingCounts.downvotes}
onVoteChange={(upvotes, downvotes) => {
                  setVotingCounts({ upvotes, downvotes })
                }}
              />
            </motion.div>

            {/* Comments Section */}
            <motion.div variants={itemVariants}>
              <CommentSection 
                toolId={tool.id} 
                toolName={tool.name}
                onCommentCountChange={(count) => setCommentCount(count)}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {similarTools.map((similarTool) => (
                        <Link key={similarTool.id} href={`/tool/${similarTool.slug}`}>
                          <motion.div
                            className="p-4 border border-neutral-200 rounded-xl hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer bg-white hover:bg-gradient-to-br hover:from-orange-50/30 hover:to-neutral-50/20 group h-full"
                            whileHover={{ scale: 1.02, y: -3 }}
                          >
                            <div className="flex flex-col items-center text-center gap-3 h-full">
                              <ToolImage 
                                src={similarTool.logo}
                                alt={similarTool.name}
                                name={similarTool.name}
                                size="md"
                                className="bg-gray-50 rounded-lg p-2 shadow-sm"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold muted-text text-sm group-hover:orange-accent transition-colors line-clamp-2 leading-tight mb-1">{similarTool.name}</h4>
                                <p className="muted-text-light text-xs line-clamp-2 leading-relaxed">{similarTool.tagline}</p>
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
                              <ToolImage 
                                src={featuredTool.logo}
                                alt={featuredTool.name}
                                name={featuredTool.name}
                                size="md"
                                className="bg-gray-50 rounded-lg p-1.5"
                              />
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
                        <span className="muted-text-light">Helpful</span>
                      </div>
                      <span className="font-bold muted-text">{votingCounts.upvotes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="w-4 h-4 text-red-500" />
                        <span className="muted-text-light">Not Helpful</span>
                      </div>
                      <span className="font-bold muted-text">{votingCounts.downvotes}</span>
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
                        <span className="muted-text-light">Shares</span>
                      </div>
                      <span className="font-bold muted-text">{shares}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <UserAuthForm
          isOpen={showAuthForm}
          onClose={() => setShowAuthForm(false)}
          onSubmit={handleAuthSubmit}
          title="Vote for this tool"
          description={`Please provide your information to vote for ${tool?.name}. This helps us maintain quality and prevent spam.`}
        />
      </motion.div>

      {/* Email Subscription Section - Footer */}
      <div className="bg-gray-50 border-t border-gray-200 shadow-inner">
        <EmailSubscription className="shadow-sm" />
      </div>
    </div>
  )
}