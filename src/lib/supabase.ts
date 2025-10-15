// Supabase client - will be enabled after package installation
let supabase: any = null
let supabaseAdmin: any = null

// Check if Supabase is available
try {
  const { createClient } = require('@supabase/supabase-js')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Server-side client with service role key
  supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
} catch (error) {
  console.log('Supabase client not available - using localStorage fallback')
  
  // Mock Supabase client for fallback
  const mockClient = {
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          eq: () => ({ 
            order: () => ({ 
              order: () => Promise.resolve({ data: null, error: new Error('Supabase not installed') })
            })
          })
        })
      }),
      upsert: () => Promise.resolve({ error: new Error('Supabase not installed') }),
      update: () => ({ 
        eq: () => ({ 
          select: () => ({ 
            single: () => Promise.resolve({ data: null, error: new Error('Supabase not installed') })
          })
        })
      })
    })
  }
  
  supabase = mockClient
  supabaseAdmin = mockClient
}

export { supabase, supabaseAdmin }

// Database types
export interface Database {
  public: {
    Tables: {
      recruiters: {
        Row: {
          id: string
          name: string
          job_title: string | null
          company: string
          email: string
          phone: string
          linkedin: string
          website: string | null
          specialization: string
          experience: string
          location: string
          remote_available: boolean
          bio: string
          avatar: string
          slug: string
          featured: boolean
          hidden: boolean
          approved: boolean
          status: 'pending' | 'approved' | 'rejected'
          submitter_email: string | null
          rating: number | null
          review_count: number | null
          placements: number | null
          avg_time_to_hire: number | null
          candidate_satisfaction: number | null
          client_retention: number | null
          badge: 'verified' | 'top-rated' | 'rising-star' | null
          achievements: string[] | null
          work_experience: any[] | null
          roles_placed: string[] | null
          industries: string[] | null
          keywords: string[] | null
          languages: string[] | null
          seniority_levels: string[] | null
          employment_types: string[] | null
          regions: string[] | null
          certifications: string[] | null
          testimonials: any[] | null
          availability: any | null
          social_proof: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          job_title?: string | null
          company: string
          email: string
          phone: string
          linkedin: string
          website?: string | null
          specialization: string
          experience: string
          location: string
          remote_available?: boolean
          bio: string
          avatar: string
          slug: string
          featured?: boolean
          hidden?: boolean
          approved?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          submitter_email?: string | null
          rating?: number | null
          review_count?: number | null
          placements?: number | null
          avg_time_to_hire?: number | null
          candidate_satisfaction?: number | null
          client_retention?: number | null
          badge?: 'verified' | 'top-rated' | 'rising-star' | null
          achievements?: string[] | null
          work_experience?: any[] | null
          roles_placed?: string[] | null
          industries?: string[] | null
          keywords?: string[] | null
          languages?: string[] | null
          seniority_levels?: string[] | null
          employment_types?: string[] | null
          regions?: string[] | null
          certifications?: string[] | null
          testimonials?: any[] | null
          availability?: any | null
          social_proof?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          job_title?: string | null
          company?: string
          email?: string
          phone?: string
          linkedin?: string
          website?: string | null
          specialization?: string
          experience?: string
          location?: string
          remote_available?: boolean
          bio?: string
          avatar?: string
          slug?: string
          featured?: boolean
          hidden?: boolean
          approved?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          submitter_email?: string | null
          rating?: number | null
          review_count?: number | null
          placements?: number | null
          avg_time_to_hire?: number | null
          candidate_satisfaction?: number | null
          client_retention?: number | null
          badge?: 'verified' | 'top-rated' | 'rising-star' | null
          achievements?: string[] | null
          work_experience?: any[] | null
          roles_placed?: string[] | null
          industries?: string[] | null
          keywords?: string[] | null
          languages?: string[] | null
          seniority_levels?: string[] | null
          employment_types?: string[] | null
          regions?: string[] | null
          certifications?: string[] | null
          testimonials?: any[] | null
          availability?: any | null
          social_proof?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          recruiter_id: string
          first_name: string
          last_name: string
          title: string
          company: string
          email: string
          rating: number
          testimonial: string
          status: 'pending' | 'approved' | 'rejected'
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          first_name: string
          last_name: string
          title: string
          company: string
          email: string
          rating: number
          testimonial: string
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          first_name?: string
          last_name?: string
          title?: string
          company?: string
          email?: string
          rating?: number
          testimonial?: string
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          name: string
          job_title: string | null
          company: string
          email: string
          phone: string
          linkedin: string
          website: string | null
          specialization: string
          experience: string
          location: string
          remote_available: boolean
          bio: string
          avatar: string | null
          submitter_email: string
          status: 'pending' | 'approved' | 'rejected'
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          job_title?: string | null
          company: string
          email: string
          phone: string
          linkedin: string
          website?: string | null
          specialization: string
          experience: string
          location: string
          remote_available?: boolean
          bio: string
          avatar?: string | null
          submitter_email: string
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          job_title?: string | null
          company?: string
          email?: string
          phone?: string
          linkedin?: string
          website?: string | null
          specialization?: string
          experience?: string
          location?: string
          remote_available?: boolean
          bio?: string
          avatar?: string | null
          submitter_email?: string
          status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}