'use client'

import { useState, useEffect } from 'react'

export default function WorkingPage() {
  const [recruiters, setRecruiters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/recruiters')
        const data = await response.json()
        setRecruiters(data)
        setLoading(false)
      } catch (error) {
        console.error('Error:', error)
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Loading recruiters...</h1>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Recruiters Directory</h1>
      <p>Found {recruiters.length} recruiters</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {recruiters.slice(0, 6).map((recruiter) => (
          <div key={recruiter.id} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '16px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{recruiter.name}</h3>
            <p style={{ margin: '0 0 8px 0', color: '#666', fontWeight: 'bold' }}>{recruiter.company}</p>
            <p style={{ margin: '0 0 8px 0', color: '#888', fontSize: '14px' }}>{recruiter.specialization}</p>
            <p style={{ margin: '0 0 8px 0', color: '#888', fontSize: '14px' }}>{recruiter.location}</p>
            <p style={{ margin: '0', color: '#555', fontSize: '14px', lineHeight: '1.4' }}>
              {recruiter.bio?.substring(0, 150)}...
            </p>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <a href="/admin" style={{ 
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#f97316',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 'bold'
        }}>
          Admin Panel
        </a>
      </div>
    </div>
  )
}