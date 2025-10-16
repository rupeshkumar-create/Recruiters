'use client'

import { useState } from 'react'

export default function ImmediatePage() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '20px' }}>
      <h1>Immediate Test Page</h1>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#f97316', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Click me ({count})
      </button>
      <p>If this button works, React hydration is working.</p>
    </div>
  )
}