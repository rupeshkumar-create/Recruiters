'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Users, Target, Zap, Heart } from 'lucide-react'
import Navigation from '../../components/Navigation'

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

export default function AboutPage() {
  return (
    <div className="min-h-screen muted-gradient">
      <Navigation onSubmitToolClick={() => {}} />
      
      <motion.div
        className="container mx-auto px-4 py-12 max-w-4xl"
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
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold muted-text mb-6">
            About AI-Powered Staffing Tools
          </h1>
          <p className="text-xl muted-text-light max-w-3xl mx-auto leading-relaxed">
            Your comprehensive resource for discovering the best AI-powered tools 
            that are transforming the recruitment and staffing industry.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="muted-card rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 orange-accent" />
              <h2 className="text-2xl font-bold muted-text">Our Mission</h2>
            </div>
            <p className="muted-text-light text-lg leading-relaxed">
              We believe that the right technology can revolutionize how companies find, 
              evaluate, and hire talent. Our mission is to curate and showcase the most 
              innovative AI-powered staffing tools, making it easier for recruiters, 
              HR professionals, and staffing agencies to discover solutions that can 
              streamline their processes and improve their results.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="muted-card rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 orange-accent" />
              <h3 className="text-xl font-semibold muted-text">Community Driven</h3>
            </div>
            <p className="muted-text-light">
              Our directory is built by and for the staffing community. We welcome 
              submissions from tool creators and feedback from users to ensure we're 
              showcasing the most valuable solutions.
            </p>
          </div>

          <div className="muted-card rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 orange-accent" />
              <h3 className="text-xl font-semibold muted-text">Always Current</h3>
            </div>
            <p className="muted-text-light">
              The AI landscape moves fast, and so do we. Our directory is regularly 
              updated with new tools, features, and insights to keep you ahead of 
              the curve in recruitment technology.
            </p>
          </div>
        </motion.div>

        {/* What We Cover */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="muted-card rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold muted-text mb-6">What We Cover</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold muted-text mb-2">AI-Powered Solutions</h4>
                <ul className="muted-text-light space-y-1 text-sm">
                  <li>• Resume screening and parsing</li>
                  <li>• Candidate sourcing and matching</li>
                  <li>• Interview scheduling and automation</li>
                  <li>• Skills assessment and testing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold muted-text mb-2">Modern Platforms</h4>
                <ul className="muted-text-light space-y-1 text-sm">
                  <li>• Applicant tracking systems (ATS)</li>
                  <li>• Customer relationship management (CRM)</li>
                  <li>• Analytics and reporting tools</li>
                  <li>• Communication and collaboration</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Get Involved */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="muted-card rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-6 h-6 orange-accent" />
              <h2 className="text-2xl font-bold muted-text">Get Involved</h2>
            </div>
            <p className="muted-text-light text-lg mb-6 max-w-2xl mx-auto">
              Have a tool that's transforming your recruitment process? We'd love to 
              feature it in our directory. Help us build the most comprehensive resource 
              for AI staffing tools.
            </p>
            <Link href="/">
              <motion.button
                className="orange-bg text-white px-8 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:bg-orange-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit a Tool
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}