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

  // Load user session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(USER_SESSION_KEY)
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession)
        setUserDataState(parsedSession)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user session:', error)
        localStorage.removeItem(USER_SESSION_KEY)
      }
    }
  }, [])

  const setUserData = (newUserData: UserData) => {
    setUserDataState(newUserData)
    setIsAuthenticated(true)
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newUserData))
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
