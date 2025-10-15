'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Eye, Share2, MousePointer, Search, ExternalLink, Calendar, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface AnalyticsData {
  tool_id: string
  event_type: string
  count: number
  latest: string
}

interface Tool {
  id: string
  name: string
  slug: string
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [selectedTool, setSelectedTool] = useState('all')

  useEffect(() => {
    loadAnalytics()
    loadTools()
  }, [selectedPeriod, selectedTool])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?period=${selectedPeriod}&toolId=${selectedTool}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.summary || [])
      } else {
        console.error('Failed to load analytics')
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
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

  const getToolName = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId)
    return tool ? tool.name : `Tool ${toolId}`
  }

  const getToolSlug = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId)
    return tool ? tool.slug : toolId
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'click': return <MousePointer className="w-4 h-4" />
      case 'visit': return <Eye className="w-4 h-4" />
      case 'share': 
      case 'linkedin_share':
      case 'twitter_share':
      case 'copy_link': return <Share2 className="w-4 h-4" />
      case 'search': return <Search className="w-4 h-4" />
      default: return <BarChart3 className="w-4 h-4" />
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'click': return 'text-orange-600 bg-orange-100'
      case 'visit': return 'text-green-600 bg-green-100'
      case 'share': 
      case 'linkedin_share':
      case 'twitter_share':
      case 'copy_link': return 'text-purple-600 bg-purple-100'
      case 'search': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatEventType = (eventType: string) => {
    switch (eventType) {
      case 'linkedin_share': return 'LinkedIn Share'
      case 'twitter_share': return 'Twitter Share'
      case 'copy_link': return 'Copy Link'
      default: return eventType.charAt(0).toUpperCase() + eventType.slice(1)
    }
  }

  // Group analytics by tool
  const toolAnalytics = analytics.reduce((acc: any, item) => {
    if (!acc[item.tool_id]) {
      acc[item.tool_id] = {
        tool_id: item.tool_id,
        events: {},
        total: 0
      }
    }
    acc[item.tool_id].events[item.event_type] = item.count
    acc[item.tool_id].total += item.count
    return acc
  }, {})

  const sortedTools = Object.values(toolAnalytics).sort((a: any, b: any) => b.total - a.total)

  // Calculate totals
  const totalEvents = analytics.reduce((sum, item) => sum + item.count, 0)
  const totalClicks = analytics.filter(item => item.event_type === 'click').reduce((sum, item) => sum + item.count, 0)
  const totalVisits = analytics.filter(item => item.event_type === 'visit').reduce((sum, item) => sum + item.count, 0)
  const totalShares = analytics.filter(item => ['share', 'linkedin_share', 'twitter_share', 'copy_link'].includes(item.event_type)).reduce((sum, item) => sum + item.count, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Track tool performance and user engagement</p>
            </div>
            <Link href="/admin" className="text-orange-600 hover:text-orange-700 font-medium">
              ← Back to Admin
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>

          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Tools</option>
            {tools.map((tool) => (
              <option key={tool.id} value={tool.id}>
                {tool.name}
              </option>
            ))}
          </select>

          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{totalEvents.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Visits</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisits.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MousePointer className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Share2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Shares</p>
                <p className="text-2xl font-bold text-gray-900">{totalShares.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Analytics Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tool Performance</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Searches</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTools.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No analytics data found for the selected period
                    </td>
                  </tr>
                ) : (
                  sortedTools.map((toolData: any) => (
                    <tr key={toolData.tool_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {getToolName(toolData.tool_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {toolData.events.visit || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {toolData.events.click || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(toolData.events.share || 0) + (toolData.events.linkedin_share || 0) + (toolData.events.twitter_share || 0) + (toolData.events.copy_link || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {toolData.events.search || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {toolData.total}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/tool/${getToolSlug(toolData.tool_id)}`}
                          target="_blank"
                          className="text-orange-600 hover:text-orange-900 flex items-center gap-1"
                        >
                          View Tool
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}