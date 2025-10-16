// Recruiter data management with Supabase and localStorage fallback
import { csvRecruiters, type Recruiter } from './data'
import { supabase } from './supabase'

const STORAGE_KEY = 'recruiters_data'

export class RecruiterStorage {
  // Get all recruiters (from Supabase with localStorage fallback)
  static async getAll(): Promise<Recruiter[]> {
    // Check if Supabase is available
    const isSupabaseAvailable = supabase && typeof supabase.from === 'function'
    
    if (isSupabaseAvailable) {
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('recruiters')
          .select('*')
          .eq('status', 'approved')
          .eq('hidden', false)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          // Transform Supabase data to match our Recruiter interface
          const recruiters = data.map(this.transformFromSupabase)
          
          // Cache in localStorage for offline access
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recruiters))
          }
          
          return recruiters
        }
      } catch (error) {
        console.error('Error fetching from Supabase:', error)
      }
    }

    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed
          }
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }
    }

    // Final fallback to default data
    return csvRecruiters
  }

  // Synchronous version for immediate use (uses localStorage cache)
  static getAllSync(): Recruiter[] {
    if (typeof window === 'undefined') {
      return csvRecruiters
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }

    // Initialize localStorage with default data if empty
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(csvRecruiters))
      console.log('Initialized localStorage with default data:', csvRecruiters.length, 'recruiters')
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }

    return csvRecruiters
  }

  // Save all recruiters to Supabase and localStorage
  static async saveAll(recruiters: Recruiter[]): Promise<void> {
    // Check if Supabase is available
    const isSupabaseAvailable = supabase && typeof supabase.from === 'function'
    
    if (isSupabaseAvailable) {
      try {
        // Transform data for Supabase
        const supabaseData = recruiters.map(this.transformToSupabase)
        
        // Save to Supabase
        const { error } = await supabase
          .from('recruiters')
          .upsert(supabaseData, { onConflict: 'id' })

        if (error) {
          console.error('Error saving to Supabase:', error)
          throw error
        }
      } catch (error) {
        console.error('Supabase save failed, using localStorage fallback:', error)
      }
    }

    // Always save to localStorage as backup
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recruiters))
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('recruitersUpdated', { 
          detail: { recruiters } 
        }))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }
  }

  // Update a specific recruiter
  static async updateRecruiter(id: string, updates: Partial<Recruiter>): Promise<Recruiter | null> {
    console.log('RecruiterStorage.updateRecruiter called with:', { id, updates })
    
    // If name is being updated, also update the slug
    if (updates.name) {
      updates.slug = updates.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 50)
    }
    
    // Always update localStorage first to ensure immediate UI updates
    const recruiters = this.getAllSync()
    const index = recruiters.findIndex(r => r.id === id)
    
    if (index === -1) {
      console.error('Recruiter not found:', id)
      return null
    }

    const updatedRecruiter = { ...recruiters[index], ...updates }
    recruiters[index] = updatedRecruiter
    
    // Save to localStorage immediately
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recruiters))
      console.log('Updated localStorage with new data')
    }
    
    // Check if Supabase is available and try to update there too
    const isSupabaseAvailable = supabase && typeof supabase.from === 'function' && 
                                process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')
    
    if (isSupabaseAvailable) {
      try {
        console.log('Attempting Supabase update...')
        // Transform updates for Supabase
        const supabaseUpdates = this.transformToSupabase(updatedRecruiter)
        
        // Update in Supabase
        const { data, error } = await supabase
          .from('recruiters')
          .update(supabaseUpdates)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Error updating in Supabase:', error)
          // Don't throw error, continue with localStorage version
        } else if (data) {
          console.log('Successfully updated in Supabase')
          const supabaseRecruiter = this.transformFromSupabase(data)
          
          // Update localStorage with Supabase data
          recruiters[index] = supabaseRecruiter
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recruiters))
          }
        }
      } catch (error) {
        console.error('Supabase update failed, using localStorage version:', error)
      }
    } else {
      console.log('Supabase not available, using localStorage only')
    }
    
    // Dispatch update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('recruitersUpdated', { 
        detail: { recruiters } 
      }))
      console.log('Dispatched recruitersUpdated event')
    }
    
    return recruiters[index]
  }

  // Get a specific recruiter by ID
  static async getById(id: string): Promise<Recruiter | null> {
    const recruiters = await this.getAll()
    return recruiters.find(r => r.id === id) || null
  }

  // Get a specific recruiter by slug
  static async getBySlug(slug: string): Promise<Recruiter | null> {
    const recruiters = await this.getAll()
    return recruiters.find(r => r.slug === slug) || null
  }

  // Add a new recruiter to the storage
  static async addRecruiter(recruiter: Recruiter): Promise<void> {
    try {
      // Get current recruiters
      const currentRecruiters = await this.getAll()
      
      // Check if recruiter already exists
      const existingIndex = currentRecruiters.findIndex(r => r.id === recruiter.id)
      
      if (existingIndex >= 0) {
        // Update existing recruiter
        currentRecruiters[existingIndex] = recruiter
      } else {
        // Add new recruiter
        currentRecruiters.push(recruiter)
      }
      
      // Save updated list
      await this.saveAll(currentRecruiters)
      
      // Trigger homepage refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('recruitersUpdated', {
          detail: { recruiters: currentRecruiters }
        }))
      }
    } catch (error) {
      console.error('Error adding recruiter:', error)
      throw error
    }
  }

  // Reset to default data
  static reset(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(STORAGE_KEY)
    this.saveAll(csvRecruiters)
  }

  // Initialize with default data if empty
  static async initialize(): Promise<void> {
    try {
      // Always ensure localStorage has data
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(csvRecruiters))
        }
      }
      
      const current = await this.getAll()
      if (current.length === 0) {
        await this.saveAll(csvRecruiters)
      }
    } catch (error) {
      console.error('Error initializing RecruiterStorage:', error)
      // Ensure localStorage fallback
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(csvRecruiters))
        } catch (storageError) {
          console.error('Failed to initialize localStorage:', storageError)
        }
      }
    }
  }

  // Transform Supabase data to Recruiter interface
  static transformFromSupabase(data: any): Recruiter {
    return {
      id: data.id,
      name: data.name,
      jobTitle: data.job_title,
      company: data.company,
      email: data.email,
      phone: data.phone,
      linkedin: data.linkedin,
      website: data.website,
      specialization: data.specialization,
      experience: data.experience,
      location: data.location,
      remoteAvailable: data.remote_available,
      bio: data.bio,
      avatar: data.avatar,
      slug: data.slug,
      featured: data.featured,
      hidden: data.hidden,
      approved: data.approved,
      status: data.status,
      submitterEmail: data.submitter_email,
      rating: data.rating,
      reviewCount: data.review_count,
      placements: data.placements,
      avgTimeToHire: data.avg_time_to_hire,
      candidateSatisfaction: data.candidate_satisfaction,
      clientRetention: data.client_retention,
      badge: data.badge,
      achievements: data.achievements,
      workExperience: data.work_experience,
      rolesPlaced: data.roles_placed,
      industries: data.industries,
      keywords: data.keywords,
      languages: data.languages,
      seniorityLevels: data.seniority_levels,
      employmentTypes: data.employment_types,
      regions: data.regions,
      certifications: data.certifications,
      testimonials: data.testimonials,
      availability: data.availability,
      socialProof: data.social_proof
    }
  }

  // Transform Recruiter interface to Supabase format
  static transformToSupabase(recruiter: Recruiter): any {
    return {
      id: recruiter.id,
      name: recruiter.name,
      job_title: recruiter.jobTitle,
      company: recruiter.company,
      email: recruiter.email,
      phone: recruiter.phone,
      linkedin: recruiter.linkedin,
      website: recruiter.website,
      specialization: recruiter.specialization,
      experience: recruiter.experience,
      location: recruiter.location,
      remote_available: recruiter.remoteAvailable,
      bio: recruiter.bio,
      avatar: recruiter.avatar,
      slug: recruiter.slug,
      featured: recruiter.featured,
      hidden: recruiter.hidden,
      approved: recruiter.approved,
      status: recruiter.status,
      submitter_email: recruiter.submitterEmail,
      rating: recruiter.rating,
      review_count: recruiter.reviewCount,
      placements: recruiter.placements,
      avg_time_to_hire: recruiter.avgTimeToHire,
      candidate_satisfaction: recruiter.candidateSatisfaction,
      client_retention: recruiter.clientRetention,
      badge: recruiter.badge,
      achievements: recruiter.achievements,
      work_experience: recruiter.workExperience,
      roles_placed: recruiter.rolesPlaced,
      industries: recruiter.industries,
      keywords: recruiter.keywords,
      languages: recruiter.languages,
      seniority_levels: recruiter.seniorityLevels,
      employment_types: recruiter.employmentTypes,
      regions: recruiter.regions,
      certifications: recruiter.certifications,
      testimonials: recruiter.testimonials,
      availability: recruiter.availability,
      social_proof: recruiter.socialProof
    }
  }
}

// Initialize on module load (client-side only)
if (typeof window !== 'undefined') {
  // Use setTimeout to avoid blocking the main thread
  setTimeout(() => {
    RecruiterStorage.initialize().catch(error => {
      console.error('Failed to initialize RecruiterStorage:', error)
    })
  }, 0)
}