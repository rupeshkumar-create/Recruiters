'use client'

import { useState, useEffect } from 'react'
import { UserData } from '../components/UserAuthForm'

interface UserSession {
  userData: UserData | null
  isAuthenticated: boolean
  setUserData: (userData: UserData) => void
  clearSession: () => void
}

const USER_SESSION_KEY = 'userSession'

export function useUserSession(): UserSession {
  const [userData, setUserDataState] = useState<UserData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // For testing: Always clear session to show forms
  useEffect(() => {
    // Clear session to force form to show for testing
    localStorage.removeItem(USER_SESSION_KEY)
    setUserDataState(null)
    setIsAuthenticated(false)
  }, [])

  const setUserData = (newUserData: UserData) => {
    setUserDataState(newUserData)
    setIsAuthenticated(true)
    // Store with timestamp for future session management
    const sessionData = {
      ...newUserData,
      timestamp: Date.now()
    }
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionData))
  }

  const clearSession = () => {
    setUserDataState(null)
    setIsAuthenticated(false)
    localStorage.removeItem(USER_SESSION_KEY)
  }

  return {
    userData,
    isAuthenticated,
    setUserData,
    clearSession
  }
}
