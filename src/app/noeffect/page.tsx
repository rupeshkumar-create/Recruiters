'use client'

import { useState } from 'react'

export default function NoEffectPage() {
  const [message, setMessage] = useState('Initial message')

  return (
    <div style={{ padding: '20px' }}>
      <h1>No Effect Test Page</h1>
      <p>{message}</p>
      <button 
        onClick={() => setMessage('Button clicked!')}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#f97316', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px' 
        }}
      >
        Click me
      </button>
      <p>This page has no useEffect, just useState and onClick.</p>
    </div>
  )
}