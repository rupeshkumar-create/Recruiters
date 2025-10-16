import { csvRecruiters } from '../../lib/data'

export default function ServerPage() {
  const recruiters = csvRecruiters.slice(0, 6) // Show first 6 recruiters

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0',
        marginBottom: '32px'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#111827',
            margin: 0
          }}>
            Recruiters Directory (Server-Side)
          </h1>
          <a 
            href="/admin"
            style={{
              padding: '8px 16px',
              backgroundColor: '#f97316',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500'
            }}
          >
            Admin Panel
          </a>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '16px'
          }}>
            Connect with Top Recruiters
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Find specialized recruiters across industries to help you land your dream job or build your perfect team
          </p>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginBottom: '32px',
          color: '#6b7280'
        }}>
          Showing {recruiters.length} recruiters (server-side rendered)
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '24px' 
        }}>
          {recruiters.map((recruiter) => (
            <div 
              key={recruiter.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '16px' }}>
                <img
                  src={recruiter.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recruiter.name)}&background=3B82F6&color=fff&size=64`}
                  alt={recruiter.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: '#111827',
                    margin: '0 0 4px 0'
                  }}>
                    {recruiter.name}
                  </h3>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#f97316',
                    fontWeight: '600',
                    margin: '0 0 8px 0'
                  }}>
                    {recruiter.company}
                  </p>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {recruiter.specialization}
                  </div>
                </div>
              </div>
              
              <p style={{ 
                color: '#6b7280', 
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                {recruiter.bio?.substring(0, 150)}...
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                color: '#9ca3af'
              }}>
                <span>{recruiter.location}</span>
                <span>{recruiter.experience} experience</span>
              </div>
              
              {recruiter.rating && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  marginTop: '12px'
                }}>
                  <span style={{ color: '#fbbf24' }}>★</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {recruiter.rating}
                  </span>
                  {recruiter.reviewCount && (
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                      ({recruiter.reviewCount} reviews)
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            This is a server-side rendered version that works without client-side JavaScript.
          </p>
          <a 
            href="/"
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500'
            }}
          >
            Try Client-Side Version
          </a>
        </div>
      </main>
    </div>
  )
}