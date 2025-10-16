import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Force migration data - the 3 recruiters that should be in production
const FORCE_MIGRATION_DATA = [
  {
    "id": "1",
    "name": "Sarah Johnson",
    "job_title": "Senior Technical Recruiter",
    "company": "TechTalent Solutions",
    "email": "sarah.johnson@techtalent.com",
    "phone": "+1 (555) 123-4567",
    "linkedin": "https://linkedin.com/in/sarahjohnson",
    "website": "https://techtalent.com/sarah",
    "specialization": "Software Engineering",
    "experience": "8 years",
    "location": "San Francisco, CA",
    "remote_available": true,
    "bio": "Passionate technical recruiter with 8+ years of experience connecting top engineering talent with innovative companies. I specialize in full-stack development, DevOps, and engineering leadership roles, with a proven track record of successful placements at unicorn startups and Fortune 500 companies.",
    "avatar": "https://ui-avatars.com/api/?name=Sarah%20Johnson&background=3B82F6&color=fff&size=128",
    "slug": "sarah-johnson",
    "featured": true,
    "hidden": false,
    "approved": true,
    "status": "approved",
    "rating": 4.9,
    "review_count": 127,
    "placements": 247,
    "avg_time_to_hire": 21,
    "candidate_satisfaction": 95,
    "client_retention": 92,
    "badge": "top-rated",
    "achievements": [
      "Top 1% recruiter on LinkedIn for tech placements",
      "Placed 50+ engineers at Series A-C startups",
      "95% candidate satisfaction rate over 3 years",
      "Expert in React, Node.js, and DevOps recruiting",
      "Built recruiting processes for 3 unicorn companies",
      "Speaker at TechRecruit Conference 2023"
    ],
    "work_experience": [
      {
        "jobTitle": "Senior Technical Recruiter",
        "company": "TechTalent Solutions",
        "duration": "2020 - Present",
        "description": "Lead technical recruiting for Series A-C startups, specializing in engineering leadership and full-stack development roles."
      }
    ],
    "roles_placed": ["CTO", "VP Engineering", "Engineering Manager", "Senior Software Engineer"],
    "industries": ["Fintech", "SaaS", "E-commerce", "Healthcare Tech"],
    "keywords": ["React", "Node.js", "Python", "AWS", "Kubernetes"],
    "languages": ["English", "Spanish"],
    "seniority_levels": ["Mid-level", "Senior", "Staff", "Principal"],
    "employment_types": ["Full-Time", "Contract"],
    "regions": ["US West Coast", "Remote-First"],
    "certifications": ["AIRS Certified", "LinkedIn Recruiter Certified"],
    "testimonials": [],
    "availability": { "accepting": true, "nextAvailable": "Available now" },
    "social_proof": { "linkedinFollowers": 15000, "featuredIn": ["TechCrunch"] },
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": new Date().toISOString()
  },
  {
    "id": "1760616615992",
    "name": "Persistence Test User",
    "job_title": "Senior Persistence Recruiter",
    "company": "Persistence Test Company",
    "email": "persistence@example.com",
    "phone": "+1555111222",
    "linkedin": "https://linkedin.com/in/persistencetest",
    "website": "https://persistencetest.com",
    "specialization": "Software Engineering",
    "experience": "5 years",
    "location": "Persistence City, CA",
    "remote_available": false,
    "bio": "This is a comprehensive test bio for persistence testing with sufficient words to meet the minimum requirement of 200 words. I am an experienced technical recruiter specializing in software engineering and data science roles. Throughout my career, I have successfully placed numerous candidates in top technology companies across Silicon Valley and beyond. My expertise includes full-stack development, machine learning, DevOps, and cloud computing roles. I have built strong relationships with both hiring managers and talented professionals, ensuring successful matches that benefit both parties. My approach combines deep technical understanding with excellent communication skills, allowing me to effectively bridge the gap between technical requirements and candidate capabilities. I pride myself on maintaining high standards of professionalism and delivering exceptional results for my clients. My track record includes consistent placement success, high candidate satisfaction rates, and long-term client relationships. I stay current with technology trends and market dynamics to provide the most relevant and valuable recruiting services. My goal is to continue growing my network and expertise while helping shape the future of technology through strategic talent acquisition and placement services. I believe in building lasting professional relationships and providing ongoing career guidance to both candidates and clients throughout their professional journey.",
    "avatar": "https://ui-avatars.com/api/?name=Persistence%20Test%20User&background=3B82F6&color=fff&size=128",
    "slug": "persistence-test-user",
    "featured": false,
    "hidden": false,
    "approved": true,
    "status": "approved",
    "submitter_email": "persistence@example.com",
    "rating": 0,
    "review_count": 0,
    "placements": 125,
    "avg_time_to_hire": 32,
    "candidate_satisfaction": 92,
    "client_retention": 87,
    "achievements": [
      "Placed 125+ engineers at top tech companies",
      "Achieved 92% candidate satisfaction rate",
      "Built network of 2500+ tech professionals"
    ],
    "work_experience": [
      {
        "jobTitle": "Senior Persistence Recruiter",
        "company": "Persistence Test Company",
        "duration": "2019 - Present",
        "description": "Leading technical recruitment for enterprise clients"
      }
    ],
    "roles_placed": ["Software Engineer", "Data Scientist", "DevOps Engineer"],
    "industries": ["Technology", "Fintech", "Healthcare"],
    "keywords": ["Technical Recruiting", "Software Engineering", "Data Science"],
    "languages": ["English", "German"],
    "seniority_levels": ["Mid Level", "Senior Level"],
    "employment_types": ["Full-time", "Contract"],
    "regions": ["North America", "Europe"],
    "certifications": ["Certified Technical Recruiter"],
    "availability": { "accepting": true, "nextAvailable": "Immediately" },
    "social_proof": { "linkedinFollowers": 2000, "featuredIn": ["TechCrunch"] },
    "testimonials": [],
    "created_at": "2025-10-16T12:10:15.992Z",
    "updated_at": new Date().toISOString()
  },
  {
    "id": "1760619827564",
    "name": "Amit",
    "job_title": "Panda",
    "company": "Gustav",
    "email": "https://temp-mail.org/en/",
    "phone": "+919148521200",
    "linkedin": "https://www.linkedin.com/in/khandakerrushad/",
    "website": "https://temp-mail.org/en/",
    "specialization": "Operations",
    "experience": "8",
    "location": "India",
    "remote_available": false,
    "bio": "As a dedicated staffing professional, I specialize in connecting talented individuals with organizations where they can truly thrive. With a strong understanding of the recruitment landscape, I focus on identifying, engaging, and placing top-tier candidates across diverse industries. My approach goes beyond filling positions — I strive to build long-term relationships that create lasting value for both clients and candidates. Over the years, I've developed expertise in sourcing, screening, and onboarding candidates for roles ranging from entry-level positions to senior leadership. I take pride in understanding the unique culture and needs of every organization I work with, ensuring each placement aligns perfectly with business goals and team dynamics. Driven by data, empathy, and intuition, I leverage technology and modern recruitment tools to streamline the hiring process while maintaining a personal touch. My passion lies in helping companies grow with the right people — and helping individuals find careers that match their skills, ambitions, and values. Whether it's building high-performing teams, improving hiring strategies, or enhancing employer branding, I bring a results-oriented mindset to every project. My mission is to make recruitment more human, efficient, and impactful in today's fast-changing world of work. Outside of work, I'm committed to continuous learning — staying updated with the latest trends in talent acquisition, AI in recruitment, and workforce dynamics. I believe that great hiring decisions shape not just businesses but lives, and I'm proud to be part of that transformation every day.",
    "avatar": "https://ui-avatars.com/api/?name=Amit&background=3B82F6&color=fff&size=128",
    "slug": "amit",
    "featured": false,
    "hidden": false,
    "approved": true,
    "status": "approved",
    "submitter_email": "https://temp-mail.org/en/",
    "rating": 0,
    "review_count": 0,
    "placements": 100,
    "avg_time_to_hire": 100,
    "candidate_satisfaction": 100,
    "client_retention": 100,
    "achievements": ["Test"],
    "work_experience": [
      {
        "jobTitle": "Test",
        "company": "Test",
        "duration": "2013 - Present",
        "description": "Over the years, I've developed expertise in sourcing, screening, and onboarding candidates for roles ranging from entry-level positions to senior leadership."
      }
    ],
    "roles_placed": ["Software"],
    "industries": ["Technology"],
    "keywords": ["recruiting"],
    "languages": ["Italian", "Russian", "French"],
    "seniority_levels": ["Senior Level", "Executive Level", "Mid Level"],
    "employment_types": ["Contract", "Temporary"],
    "regions": ["Canada", "North America"],
    "certifications": [],
    "availability": { "accepting": true, "nextAvailable": "" },
    "social_proof": { "linkedinFollowers": 0, "featuredIn": [] },
    "testimonials": [],
    "created_at": "2025-10-16T13:03:47.564Z",
    "updated_at": new Date().toISOString()
  }
];

export async function POST() {
  try {
    console.log('🚀 Force migrating recruiters to Supabase...');
    
    if (!supabaseAdmin || !process.env.SUPABASE_SERVICE_ROLE_KEY || 
        !process.env.NEXT_PUBLIC_SUPABASE_URL || 
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured properly',
        message: 'Please set up Supabase environment variables'
      }, { status: 400 });
    }

    // Upsert all recruiters
    const { data, error } = await supabaseAdmin
      .from('recruiters')
      .upsert(FORCE_MIGRATION_DATA, { onConflict: 'id' });

    if (error) {
      console.error('❌ Force migration error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to migrate recruiters',
        details: error.message
      }, { status: 500 });
    }

    console.log('✅ Force migration completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Recruiters force migrated successfully',
      migrated: FORCE_MIGRATION_DATA.length,
      recruiters: FORCE_MIGRATION_DATA.map(r => ({ id: r.id, name: r.name }))
    });

  } catch (error) {
    console.error('❌ Force migration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to force migrate recruiters',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Force Migration API',
    usage: 'POST to /api/force-migrate to force populate Supabase with recruiter data',
    status: 'Ready',
    recruitersToMigrate: FORCE_MIGRATION_DATA.length
  });
}