'use client'

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data...')
        const response = await fetch('/api/recruiters')
        const recruiters = await response.json()
        console.log('Data loaded:', recruiters.length)
        setData(recruiters)
        setLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Test Page</h1>
      <p>Found {data.length} recruiters</p>
      {data.slice(0, 3).map(recruiter => (
        <div key={recruiter.id}>
          <h3>{recruiter.name}</h3>
          <p>{recruiter.company}</p>
        </div>
      ))}
    </div>
  )
}