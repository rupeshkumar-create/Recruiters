'use client'

import { useState, useEffect } from 'react'

export default function SimplePage() {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('Component mounted')
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Test Page</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <p>If you can see this and the button works, React is working fine.</p>
    </div>
  )
}