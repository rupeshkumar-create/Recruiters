'use client'

import { useState, useEffect } from 'react'

const staticRecruiters = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechTalent Solutions',
    specialization: 'Software Engineering',
    location: 'San Francisco, CA',
    bio: 'Passionate technical recruiter with 8+ years of experience connecting top engineering talent with innovative companies.',
    avatar: '',
    slug: 'sarah-johnson',
    rating: 4.9,
    reviewCount: 127
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'Executive Search Partners',
    specialization: 'Executive Leadership',
    location: 'New York, NY',
    bio: 'Elite executive search consultant with 12+ years of experience placing C-suite leaders.',
    avatar: '',
    slug: 'michael-chen',
    rating: 4.8,
    reviewCount: 89
  }
]

export default function StaticPage() {
  const [recruiters, setRecruiters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Setting static data...')
    setTimeout(() => {
      setRecruiters(staticRecruiters)
      setLoading(false)
      console.log('Static data set')
    }, 1000)
  }, [])

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading static recruiters...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Static Recruiters Test</h1>
      <p>Found {recruiters.length} recruiters</p>
      
      {recruiters.map((recruiter) => (
        <div key={recruiter.id} style={{ 
          border: '1px solid #ddd', 
          padding: '16px', 
          margin: '16px 0',
          borderRadius: '8px'
        }}>
          <h3>{recruiter.name}</h3>
          <p><strong>{recruiter.company}</strong></p>
          <p>{recruiter.specialization} • {recruiter.location}</p>
          <p>{recruiter.bio}</p>
          {recruiter.rating && <p>Rating: {recruiter.rating} ({recruiter.reviewCount} reviews)</p>}
        </div>
      ))}
    </div>
  )
}