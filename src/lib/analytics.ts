// Analytics tracking utility - Local storage version
export const trackEvent = async (toolId: string, eventType: string, metadata: any = {}) => {
  try {
    // Store analytics in local storage
    const analyticsKey = 'ai_staffing_analytics';
    const existingData = localStorage.getItem(analyticsKey);
    const analytics = existingData ? JSON.parse(existingData) : [];
    
    const newEvent = {
      id: Date.now().toString(),
      toolId,
      eventType,
      metadata,
      timestamp: new Date().toISOString()
    };
    
    analytics.push(newEvent);
    localStorage.setItem(analyticsKey, JSON.stringify(analytics));
    
    console.log('Analytics tracked:', newEvent);
  } catch (error) {
    // Silently fail - don't break the user experience
    console.error('Analytics tracking failed:', error);
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