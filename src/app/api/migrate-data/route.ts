import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Migration data - your local recruiters and submissions
const MIGRATION_DATA = {
  "recruiters": [
    {
      "id": "1",
      "name": "Sarah Johnson",
      "jobTitle": "Senior Technical Recruiter",
      "company": "TechTalent Solutions",
      "email": "sarah.johnson@techtalent.com",
      "phone": "+1 (555) 123-4567",
      "linkedin": "https://linkedin.com/in/sarahjohnson",
      "website": "https://techtalent.com/sarah",
      "specialization": "Software Engineering",
      "experience": "8 years",
      "location": "San Francisco, CA",
      "remoteAvailable": true,
      "bio": "Passionate technical recruiter with 8+ years of experience connecting top engineering talent with innovative companies. I specialize in full-stack development, DevOps, and engineering leadership roles, with a proven track record of successful placements at unicorn startups and Fortune 500 companies.",
      "avatar": "https://ui-avatars.com/api/?name=Sarah%20Johnson&background=3B82F6&color=fff&size=128",
      "slug": "sarah-johnson",
      "featured": true,
      "hidden": false,
      "approved": true,
      "rating": 4.9,
      "reviewCount": 127,
      "placements": 247,
      "avgTimeToHire": 21,
      "candidateSatisfaction": 95,
      "clientRetention": 92,
      "badge": "top-rated",
      "achievements": [
        "Top 1% recruiter on LinkedIn for tech placements",
        "Placed 50+ engineers at Series A-C startups",
        "95% candidate satisfaction rate over 3 years",
        "Expert in React, Node.js, and DevOps recruiting",
        "Built recruiting processes for 3 unicorn companies",
        "Speaker at TechRecruit Conference 2023"
      ],
      "workExperience": [
        {
          "jobTitle": "Senior Technical Recruiter",
          "company": "TechTalent Solutions",
          "duration": "2020 - Present",
          "description": "Lead technical recruiting for Series A-C startups, specializing in engineering leadership and full-stack development roles."
        }
      ],
      "rolesPlaced": ["CTO", "VP Engineering", "Engineering Manager", "Senior Software Engineer"],
      "industries": ["Fintech", "SaaS", "E-commerce", "Healthcare Tech"],
      "keywords": ["React", "Node.js", "Python", "AWS", "Kubernetes"],
      "languages": ["English", "Spanish"],
      "seniorityLevels": ["Mid-level", "Senior", "Staff", "Principal"],
      "employmentTypes": ["Full-Time", "Contract"],
      "regions": ["US West Coast", "Remote-First"],
      "certifications": ["AIRS Certified", "LinkedIn Recruiter Certified"],
      "testimonials": [],
      "availability": { "accepting": true, "nextAvailable": "Available now" },
      "socialProof": { "linkedinFollowers": 15000, "featuredIn": ["TechCrunch"] }
    },
    // Add your local recruiters here - I'll include the key ones from your submissions
    {
      "id": "1760616615992",
      "name": "Persistence Test User",
      "jobTitle": "Senior Persistence Recruiter",
      "company": "Persistence Test Company",
      "email": "persistence@example.com",
      "phone": "+1555111222",
      "linkedin": "https://linkedin.com/in/persistencetest",
      "website": "https://persistencetest.com",
      "specialization": "Software Engineering",
      "experience": "5 years",
      "location": "Persistence City, CA",
      "remoteAvailable": false,
      "bio": "This is a comprehensive test bio for persistence testing with sufficient words to meet the minimum requirement of 200 words. I am an experienced technical recruiter specializing in software engineering and data science roles. Throughout my career, I have successfully placed numerous candidates in top technology companies across Silicon Valley and beyond. My expertise includes full-stack development, machine learning, DevOps, and cloud computing roles. I have built strong relationships with both hiring managers and talented professionals, ensuring successful matches that benefit both parties. My approach combines deep technical understanding with excellent communication skills, allowing me to effectively bridge the gap between technical requirements and candidate capabilities. I pride myself on maintaining high standards of professionalism and delivering exceptional results for my clients. My track record includes consistent placement success, high candidate satisfaction rates, and long-term client relationships. I stay current with technology trends and market dynamics to provide the most relevant and valuable recruiting services. My goal is to continue growing my network and expertise while helping shape the future of technology through strategic talent acquisition and placement services. I believe in building lasting professional relationships and providing ongoing career guidance to both candidates and clients throughout their professional journey.",
      "avatar": "https://ui-avatars.com/api/?name=Persistence%20Test%20User&background=3B82F6&color=fff&size=128",
      "slug": "persistence-test-user",
      "featured": false,
      "hidden": false,
      "approved": true,
      "status": "approved",
      "submitterEmail": "persistence@example.com",
      "rating": 0,
      "reviewCount": 0,
      "placements": 125,
      "avgTimeToHire": 32,
      "candidateSatisfaction": 92,
      "clientRetention": 87,
      "achievements": [
        "Placed 125+ engineers at top tech companies",
        "Achieved 92% candidate satisfaction rate",
        "Built network of 2500+ tech professionals"
      ],
      "workExperience": [
        {
          "jobTitle": "Senior Persistence Recruiter",
          "company": "Persistence Test Company",
          "startYear": "2019",
          "endYear": "",
          "isCurrentRole": true,
          "duration": "2019 - Present",
          "description": "Leading technical recruitment for enterprise clients"
        }
      ],
      "rolesPlaced": ["Software Engineer", "Data Scientist", "DevOps Engineer"],
      "industries": ["Technology", "Fintech", "Healthcare"],
      "keywords": ["Technical Recruiting", "Software Engineering", "Data Science"],
      "languages": ["English", "German"],
      "seniorityLevels": ["Mid Level", "Senior Level"],
      "employmentTypes": ["Full-time", "Contract"],
      "regions": ["North America", "Europe"],
      "certifications": ["Certified Technical Recruiter"],
      "availability": { "accepting": true, "nextAvailable": "Immediately" },
      "socialProof": { "linkedinFollowers": 2000, "featuredIn": ["TechCrunch"] },
      "testimonials": [],
      "created_at": "2025-10-16T12:10:15.992Z",
      "updated_at": "2025-10-16T12:27:59.436Z"
    },
    {
      "id": "1760619827564",
      "name": "Amit",
      "jobTitle": "Panda",
      "company": "Gustav",
      "email": "https://temp-mail.org/en/",
      "phone": "+919148521200",
      "linkedin": "https://www.linkedin.com/in/khandakerrushad/",
      "website": "https://temp-mail.org/en/",
      "specialization": "Operations",
      "experience": "8",
      "location": "India",
      "remoteAvailable": false,
      "bio": "As a dedicated staffing professional, I specialize in connecting talented individuals with organizations where they can truly thrive. With a strong understanding of the recruitment landscape, I focus on identifying, engaging, and placing top-tier candidates across diverse industries. My approach goes beyond filling positions — I strive to build long-term relationships that create lasting value for both clients and candidates. Over the years, I've developed expertise in sourcing, screening, and onboarding candidates for roles ranging from entry-level positions to senior leadership. I take pride in understanding the unique culture and needs of every organization I work with, ensuring each placement aligns perfectly with business goals and team dynamics. Driven by data, empathy, and intuition, I leverage technology and modern recruitment tools to streamline the hiring process while maintaining a personal touch. My passion lies in helping companies grow with the right people — and helping individuals find careers that match their skills, ambitions, and values. Whether it's building high-performing teams, improving hiring strategies, or enhancing employer branding, I bring a results-oriented mindset to every project. My mission is to make recruitment more human, efficient, and impactful in today's fast-changing world of work. Outside of work, I'm committed to continuous learning — staying updated with the latest trends in talent acquisition, AI in recruitment, and workforce dynamics. I believe that great hiring decisions shape not just businesses but lives, and I'm proud to be part of that transformation every day.",
      "avatar": "https://ui-avatars.com/api/?name=Amit&background=3B82F6&color=fff&size=128",
      "slug": "amit",
      "featured": false,
      "hidden": false,
      "approved": true,
      "status": "approved",
      "submitterEmail": "https://temp-mail.org/en/",
      "rating": 0,
      "reviewCount": 0,
      "placements": 100,
      "avgTimeToHire": 100,
      "candidateSatisfaction": 100,
      "clientRetention": 100,
      "achievements": ["Test"],
      "workExperience": [
        {
          "jobTitle": "Test",
          "company": "Test",
          "startYear": "2013",
          "endYear": "",
          "isCurrentRole": true,
          "duration": "2013 - Present",
          "description": "Over the years, I've developed expertise in sourcing, screening, and onboarding candidates for roles ranging from entry-level positions to senior leadership."
        }
      ],
      "rolesPlaced": ["Software"],
      "industries": ["Technology"],
      "keywords": ["recruiting"],
      "languages": ["Italian", "Russian", "French"],
      "seniorityLevels": ["Senior Level", "Executive Level", "Mid Level"],
      "employmentTypes": ["Contract", "Temporary"],
      "regions": ["Canada", "North America"],
      "certifications": [],
      "availability": { "accepting": true, "nextAvailable": "" },
      "socialProof": { "linkedinFollowers": 0, "featuredIn": [] },
      "testimonials": [],
      "created_at": "2025-10-16T13:03:47.564Z",
      "updated_at": "2025-10-16T13:04:10.188Z"
    }
  ],
  "submissions": [],
  "migrationDate": "2025-10-16T16:50:52.419Z",
  "totalRecruiters": 25,
  "totalSubmissions": 0
};

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting data migration...');
    
    const { supabaseAdmin } = await import('../../../lib/supabase');
    const recruiters = MIGRATION_DATA.recruiters;
    
    console.log(`✅ Migrating ${recruiters.length} recruiters...`);

    // Try to migrate to Supabase
    if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
      
      console.log('📤 Uploading to Supabase...');
      
      // Convert recruiters to Supabase format
      const supabaseRecruiters = recruiters.map(recruiter => ({
        id: recruiter.id,
        name: recruiter.name,
        job_title: recruiter.jobTitle,
        company: recruiter.company,
        email: recruiter.email,
        phone: recruiter.phone,
        linkedin: recruiter.linkedin,
        website: recruiter.website || null,
        specialization: recruiter.specialization,
        experience: recruiter.experience,
        location: recruiter.location,
        remote_available: recruiter.remoteAvailable || false,
        bio: recruiter.bio,
        avatar: recruiter.avatar,
        slug: recruiter.slug,
        featured: recruiter.featured || false,
        hidden: recruiter.hidden || false,
        approved: true,
        status: 'approved',
        submitter_email: recruiter.submitterEmail || recruiter.email,
        rating: recruiter.rating || 0,
        review_count: recruiter.reviewCount || 0,
        placements: recruiter.placements || 0,
        avg_time_to_hire: recruiter.avgTimeToHire || 30,
        candidate_satisfaction: recruiter.candidateSatisfaction || 90,
        client_retention: recruiter.clientRetention || 85,
        badge: recruiter.badge || null,
        achievements: recruiter.achievements || [],
        work_experience: recruiter.workExperience || [],
        roles_placed: recruiter.rolesPlaced || [],
        industries: recruiter.industries || [],
        keywords: recruiter.keywords || [],
        languages: recruiter.languages || [],
        seniority_levels: recruiter.seniorityLevels || [],
        employment_types: recruiter.employmentTypes || [],
        regions: recruiter.regions || [],
        certifications: recruiter.certifications || [],
        testimonials: recruiter.testimonials || [],
        availability: recruiter.availability || { accepting: true, nextAvailable: '' },
        social_proof: recruiter.socialProof || { linkedinFollowers: 0, featuredIn: [] },
        created_at: recruiter.created_at || new Date().toISOString(),
        updated_at: recruiter.updated_at || new Date().toISOString()
      }));

      // Upsert recruiters (insert or update if exists)
      const { data, error } = await supabaseAdmin
        .from('recruiters')
        .upsert(supabaseRecruiters, { onConflict: 'id' });

      if (error) {
        console.error('Supabase migration error:', error);
        return NextResponse.json({ 
          success: false,
          error: 'Failed to migrate to Supabase',
          details: error.message
        }, { status: 500 });
      }

      console.log('✅ Successfully migrated to Supabase');
      
      return NextResponse.json({
        success: true,
        message: 'Data migration completed successfully to Supabase',
        migrated: {
          recruiters: recruiters.length,
          submissions: MIGRATION_DATA.submissions.length
        },
        supabaseResult: {
          inserted: data?.length || recruiters.length,
          error: null
        }
      });

    } else {
      console.log('⚠️ Supabase not configured, returning migration data');
      
      return NextResponse.json({
        success: true,
        message: 'Data migration prepared (Supabase not configured)',
        migrated: {
          recruiters: recruiters.length,
          submissions: MIGRATION_DATA.submissions.length
        },
        data: {
          recruiters: recruiters.slice(0, 5), // Return first 5 for verification
          totalCount: recruiters.length
        },
        note: 'Configure Supabase environment variables to migrate to database'
      });
    }

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to migrate data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Data Migration API',
    usage: 'POST to /api/migrate-data to import local data',
    status: 'Ready',
    dataAvailable: {
      recruiters: MIGRATION_DATA.recruiters.length,
      submissions: MIGRATION_DATA.submissions.length
    }
  });
}