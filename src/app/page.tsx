'use client'

import { useState, useMemo, useRef } from 'react'
import { Search, ExternalLink, Plus, Sparkles, Zap } from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import SubmissionForm from '../components/SubmissionForm'
import EmailSubscription from '../components/EmailSubscription'
import FeaturedTag from '../components/FeaturedTag'
import { mockTools, categories, getToolsByCategory, getFeaturedTools } from '../lib/data'
import SupabaseTest from '../components/SupabaseTest'

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: {
    y: -4,
    scale: 1.01,
    transition: { duration: 0.2, ease: "easeOut" }
  }
}

const logoVariants = {
  hover: {
    rotate: [0, -15, 15, 0],
    scale: 1.2,
    transition: { duration: 0.6, ease: "easeInOut" }
  }
}

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 25px rgba(242, 107, 33, 0.3)",
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.95
  }
}

const scrollCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.95 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: "easeOut",
      type: "spring",
      stiffness: 100
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

// Scroll Animation Component
function ScrollAnimatedCard({ children, index }: { children: React.ReactNode, index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px 0px -100px 0px" 
  })

  return (
    <motion.div
      ref={ref}
      variants={scrollCardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover="hover"
      transition={{ delay: index * 0.1 }}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)

  const featuredTools = useMemo(() => getFeaturedTools(), [])

  const filteredTools = useMemo(() => {
    let tools = selectedCategory === 'All' ? mockTools : getToolsByCategory(selectedCategory)
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.tagline.toLowerCase().includes(searchLower) ||
        tool.content.toLowerCase().includes(searchLower) ||
        tool.categories.toLowerCase().includes(searchLower)
      )
    }
    
    return tools
  }, [selectedCategory, searchTerm])

  return (
    <div className="min-h-screen muted-gradient flex flex-col">
      <motion.div 
        className="flex-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold muted-text">
              AI Staffing Tools
              <motion.span 
                className="orange-accent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {" "}Directory
              </motion.span>
            </h1>
          </motion.div>
          <motion.p 
            className="text-xl md:text-2xl muted-text-light max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Discover the best AI-powered tools for modern recruitment and staffing. 
            From resume screening to candidate sourcing, find the perfect solution for your hiring needs.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            className="mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 muted-text-light w-5 h-5" />
              <input
                type="text"
                placeholder="Search by tool name, use case, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent muted-card text-lg shadow-sm hover:shadow-md transition-all duration-300 muted-text"
              />
            </motion.div>
          </motion.div>

          {/* Submit Tool Button */}
          <motion.div 
            className="mb-12 text-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => setShowSubmissionForm(true)}
              className="orange-bg text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 mx-auto text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-500"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Plus className="w-6 h-6" />
              Submit Your Tool
            </motion.button>
          </motion.div>
        </motion.div>
        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          variants={itemVariants}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                selectedCategory === category
                  ? 'orange-bg text-white scale-105'
                  : 'muted-card muted-text-light hover:bg-neutral-50 border border-neutral-300 hover:border-orange-400'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Featured Tools Section */}
        {featuredTools.length > 0 && (
          <motion.div 
            className="mb-20"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold muted-text mb-8 text-center">Featured Tools</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredTools.slice(0, 4).map((tool, index) => (
                <ScrollAnimatedCard key={tool.id} index={index}>
                  <Link href={`/tool/${tool.id}`}>
                    <div className="muted-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group card-hover">
                      {tool.featured && <FeaturedTag size="sm" />}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-neutral-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-xl p-2">
                            <img 
                              src={tool.logo.includes('linkedin.com') ? `https://images.weserv.nl/?url=${encodeURIComponent(tool.logo)}&w=40&h=40&fit=contain&bg=white` : tool.logo}
                              alt={`${tool.name} logo`}
                              className="w-full h-full object-contain rounded-lg"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src.includes('weserv.nl')) {
                                  target.src = tool.logo;
                                  return;
                                }
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg items-center justify-center text-white font-bold text-sm hidden">
                              {tool.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <h3 className="font-bold text-lg muted-text group-hover:orange-accent transition-colors">{tool.name}</h3>
                        </div>
                        <p className="muted-text-light text-sm line-clamp-2 leading-relaxed">{tool.tagline}</p>
                      </div>
                    </div>
                  </Link>
                </ScrollAnimatedCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tools Grid */}
        <h2 className="text-3xl font-bold muted-text mb-8 text-center">{selectedCategory} Tools</h2>
        <AnimatePresence mode="wait">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            key={selectedCategory + searchTerm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredTools.map((tool, index) => (
              <ScrollAnimatedCard key={tool.id} index={index}>
                <Link href={`/tool/${tool.id}`}>
                  <div className="muted-card rounded-2xl shadow-sm p-8 hover:shadow-md transition-all duration-300 group h-full flex flex-col relative overflow-hidden card-hover">
                    {tool.featured && <FeaturedTag size="sm" />}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 to-neutral-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-start gap-5 mb-6">
                        <div className="w-14 h-14 flex-shrink-0 bg-gray-50 rounded-2xl p-3">
                          <img 
                            src={tool.logo.includes('linkedin.com') ? `https://images.weserv.nl/?url=${encodeURIComponent(tool.logo)}&w=48&h=48&fit=contain&bg=white` : tool.logo}
                            alt={`${tool.name} logo`}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              const target = e.currentTarget;
                              // Try original URL if proxy fails
                              if (target.src.includes('weserv.nl')) {
                                target.src = tool.logo;
                                return;
                              }
                              // Show fallback if original also fails
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg items-center justify-center text-white font-bold text-sm hidden">
                            {tool.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold muted-text mb-2 group-hover:orange-accent transition-colors">
                            {tool.name}
                          </h3>
                          <span className="inline-block bg-neutral-100 muted-text-light text-xs px-3 py-1 rounded-full font-medium">
                            {tool.categories.split(',')[0].trim()}
                          </span>
                        </div>
                      </div>
                      
                      <p className="muted-text-light text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">
                        {tool.tagline}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                         <button
                           onClick={(e) => {
                             e.preventDefault()
                             e.stopPropagation()
                             window.open(tool.url, '_blank')
                           }}
                           className="inline-flex items-center gap-2 orange-bg text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all duration-200 hover:scale-105 shadow-sm"
                         >
                           <ExternalLink className="w-4 h-4" />
                           Visit
                         </button>
                         <div className="muted-text-light group-hover:orange-accent transition-colors text-lg">
                           →
                         </div>
                       </div>
                     </div>
                   </div>
                 </Link>
              </ScrollAnimatedCard>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredTools.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-gray-400 text-8xl mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🔍
            </motion.div>
            <h3 className="text-2xl font-bold muted-text mb-3">No tools found</h3>
            <p className="text-lg muted-text-light">Try adjusting your search or category filter</p>
          </motion.div>
        )}
        </div>
      </motion.div>

      {/* Supabase Connection Test */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Supabase Connection Test</h2>
          <SupabaseTest />
        </div>
      </div>

      {/* Email Subscription Section - Footer */}
      <EmailSubscription className="" />

      {/* Submission Form Modal */}
      <SubmissionForm 
        isOpen={showSubmissionForm} 
        onClose={() => setShowSubmissionForm(false)} 
      />
    </div>
  )
}