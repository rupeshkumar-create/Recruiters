// Analytics tracking utility
export const trackEvent = async (toolId: string, eventType: string, metadata: any = {}) => {
  try {
    // Only track in production or when explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ENABLE_ANALYTICS) {
      console.log('Analytics tracking (dev):', { toolId, eventType, metadata })
      return
    }

    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toolId,
        eventType,
        metadata
      })
    })
  } catch (error) {
    // Silently fail - don't break the user experience
    console.error('Analytics tracking failed:', error)
  }
}

// Specific tracking functions
export const trackToolClick = (toolId: string, toolName: string) => {
  trackEvent(toolId, 'click', { toolName })
}

export const trackToolVisit = (toolId: string, toolName: string) => {
  trackEvent(toolId, 'visit', { toolName })
}

export const trackToolShare = (toolId: string, shareType: 'linkedin' | 'twitter' | 'copy', toolName: string) => {
  const eventType = shareType === 'copy' ? 'copy_link' : `${shareType}_share`
  trackEvent(toolId, eventType, { toolName, shareType })
}

export const trackToolSearch = (toolId: string, searchTerm: string, toolName: string) => {
  trackEvent(toolId, 'search', { toolName, searchTerm })
}