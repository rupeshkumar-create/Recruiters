'use client'

import { useState, useEffect } from 'react'

export default function MinimalPage() {
  const [data, setData] = useState<string>('Initial')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log('useEffect running')
    setMounted(true)
    setData('Updated by useEffect')
  }, [])

  console.log('Component rendering, mounted:', mounted, 'data:', data)

  return (
    <div style={{ padding: '20px' }}>
      <h1>Minimal Test</h1>
      <p>Mounted: {mounted ? 'Yes' : 'No'}</p>
      <p>Data: {data}</p>
      <p>If you see "Updated by useEffect", React is working.</p>
    </div>
  )
}