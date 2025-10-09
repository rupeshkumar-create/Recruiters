'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Menu, X } from 'lucide-react'

interface NavigationProps {
  onSubmitToolClick: () => void
}

export default function Navigation({ onSubmitToolClick }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {/* Logo Design - Dark square with orange dot */}
              <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center relative">
                  <div className="w-2 h-2 bg-orange-500 rounded-full absolute bottom-1 right-1"></div>
                </div>
              </div>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                AI-Powered Staffing Tools
              </h1>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                AI Staffing Tools
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/about" 
              className="muted-text-light hover:muted-text transition-colors font-medium"
            >
              About
            </Link>
            <motion.button
              onClick={onSubmitToolClick}
              className="orange-bg text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-orange-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              Submit Tool
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <motion.button
              onClick={onSubmitToolClick}
              className="orange-bg text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 text-sm shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-3.5 h-3.5" />
              Submit
            </motion.button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 muted-text-light hover:muted-text transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-neutral-200 py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-4">
              <Link 
                href="/about" 
                className="muted-text-light hover:muted-text transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}