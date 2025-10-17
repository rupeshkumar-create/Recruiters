import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'

// Migration data from local development - Extended for better testing
// Use global to persist changes across requests in development
declare global {
  var recruitersData: any[] | undefined;
}

export const INITIAL_MIGRATION_RECRUITERS = [
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
    "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&h=128&fit=crop&crop=face",
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
    "badge": "top-rated"
  },
  {
    "id": "2",
    "name": "Michael Chen",
    "jobTitle": "Data Science Recruiter",
    "company": "AI Talent Hub",
    "email": "michael.chen@aitalenthub.com",
    "phone": "+1 (555) 234-5678",
    "linkedin": "https://linkedin.com/in/michaelchen",
    "website": "https://aitalenthub.com/michael",
    "specialization": "Data Science",
    "experience": "6 years",
    "location": "New York, NY",
    "remoteAvailable": true,
    "bio": "Specialized data science recruiter with deep expertise in machine learning, AI, and analytics roles. I've successfully placed data scientists, ML engineers, and AI researchers at leading tech companies and innovative startups. My background in computer science helps me understand technical requirements and match candidates with the right opportunities. I focus on building long-term relationships with both clients and candidates to ensure successful placements that drive business growth and career advancement.",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
    "slug": "michael-chen",
    "featured": true,
    "hidden": false,
    "approved": true,
    "rating": 4.7,
    "reviewCount": 89,
    "placements": 156,
    "avgTimeToHire": 28,
    "candidateSatisfaction": 92,
    "clientRetention": 88,
    "badge": "verified"
  },
  {
    "id": "3",
    "name": "Emily Rodriguez",
    "jobTitle": "DevOps & Cloud Recruiter",
    "company": "CloudScale Recruiting",
    "email": "emily.rodriguez@cloudscale.com",
    "phone": "+1 (555) 345-6789",
    "linkedin": "https://linkedin.com/in/emilyrodriguez",
    "website": "https://cloudscale.com/emily",
    "specialization": "DevOps",
    "experience": "7 years",
    "location": "Austin, TX",
    "remoteAvailable": true,
    "bio": "DevOps and cloud infrastructure recruiting specialist with extensive experience placing Site Reliability Engineers, DevOps Engineers, and Cloud Architects. I understand the evolving landscape of cloud technologies and help companies build robust engineering teams. My expertise spans AWS, Azure, GCP, Kubernetes, and modern DevOps practices. I pride myself on understanding both the technical and cultural fit required for successful DevOps transformations.",
    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face",
    "slug": "emily-rodriguez",
    "featured": false,
    "hidden": false,
    "approved": true,
    "rating": 4.8,
    "reviewCount": 112,
    "placements": 203,
    "avgTimeToHire": 25,
    "candidateSatisfaction": 94,
    "clientRetention": 90,
    "badge": "top-rated"
  },
  {
    "id": "4",
    "name": "David Kim",
    "jobTitle": "Frontend Specialist Recruiter",
    "company": "UI/UX Talent Co",
    "email": "david.kim@uuxtalent.com",
    "phone": "+1 (555) 456-7890",
    "linkedin": "https://linkedin.com/in/davidkim",
    "website": "https://uuxtalent.com/david",
    "specialization": "Frontend Development",
    "experience": "5 years",
    "location": "Seattle, WA",
    "remoteAvailable": false,
    "bio": "Frontend development recruiter specializing in React, Vue, Angular, and modern JavaScript frameworks. I work closely with design teams and frontend engineers to understand the perfect blend of technical skills and design sensibility required for exceptional user experiences. My network includes senior frontend developers, UI/UX engineers, and full-stack developers with strong frontend expertise. I focus on companies building consumer-facing products and developer tools.",
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face",
    "slug": "david-kim",
    "featured": false,
    "hidden": false,
    "approved": true,
    "rating": 4.6,
    "reviewCount": 76,
    "placements": 134,
    "avgTimeToHire": 30,
    "candidateSatisfaction": 89,
    "clientRetention": 85,
    "badge": "verified"
  },
  {
    "id": "5",
    "name": "Jessica Thompson",
    "jobTitle": "Backend & Infrastructure Recruiter",
    "company": "Scale Systems Recruiting",
    "email": "jessica.thompson@scalesystems.com",
    "phone": "+1 (555) 567-8901",
    "linkedin": "https://linkedin.com/in/jessicathompson",
    "website": "https://scalesystems.com/jessica",
    "specialization": "Backend Development",
    "experience": "9 years",
    "location": "Denver, CO",
    "remoteAvailable": true,
    "bio": "Backend and distributed systems recruiter with deep expertise in scalable architecture, microservices, and high-performance computing. I specialize in placing senior backend engineers, system architects, and platform engineers at companies dealing with massive scale challenges. My technical background helps me evaluate candidates' experience with databases, message queues, caching systems, and distributed computing frameworks. I focus on matching engineers with companies where they can solve interesting technical challenges.",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&crop=face",
    "slug": "jessica-thompson",
    "featured": true,
    "hidden": false,
    "approved": true,
    "rating": 4.9,
    "reviewCount": 145,
    "placements": 278,
    "avgTimeToHire": 22,
    "candidateSatisfaction": 96,
    "clientRetention": 93,
    "badge": "top-rated"
  },
  {
    "id": "6",
    "name": "Alex Martinez",
    "jobTitle": "Mobile Development Recruiter",
    "company": "Mobile First Talent",
    "email": "alex.martinez@mobilefirst.com",
    "phone": "+1 (555) 678-9012",
    "linkedin": "https://linkedin.com/in/alexmartinez",
    "website": "https://mobilefirst.com/alex",
    "specialization": "Mobile Development",
    "experience": "4 years",
    "location": "Los Angeles, CA",
    "remoteAvailable": true,
    "bio": "Mobile development recruiter specializing in iOS, Android, and cross-platform development. I work with companies building mobile-first products and help them find talented iOS developers, Android engineers, React Native specialists, and Flutter developers. My understanding of mobile development lifecycle, app store optimization, and mobile UX principles helps me identify candidates who can deliver exceptional mobile experiences. I focus on both consumer apps and enterprise mobile solutions.",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=face",
    "slug": "alex-martinez",
    "featured": false,
    "hidden": false,
    "approved": true,
    "rating": 4.5,
    "reviewCount": 63,
    "placements": 98,
    "avgTimeToHire": 35,
    "candidateSatisfaction": 87,
    "clientRetention": 82,
    "badge": "rising-star"
  },
  {
    "id": "7",
    "name": "Rachel Green",
    "jobTitle": "Security & Compliance Recruiter",
    "company": "SecureTech Recruiting",
    "email": "rachel.green@securetech.com",
    "phone": "+1 (555) 789-0123",
    "linkedin": "https://linkedin.com/in/rachelgreen",
    "website": "https://securetech.com/rachel",
    "specialization": "Cybersecurity",
    "experience": "6 years",
    "location": "Washington, DC",
    "remoteAvailable": false,
    "bio": "Cybersecurity and compliance recruiter with expertise in information security, penetration testing, and regulatory compliance roles. I specialize in placing security engineers, compliance officers, security architects, and incident response specialists. My deep understanding of security frameworks, compliance requirements, and threat landscape helps me match candidates with organizations that need to strengthen their security posture. I work with both government contractors and private sector companies.",
    "avatar": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=128&h=128&fit=crop&crop=face",
    "slug": "rachel-green",
    "featured": false,
    "hidden": false,
    "approved": true,
    "rating": 4.7,
    "reviewCount": 91,
    "placements": 167,
    "avgTimeToHire": 40,
    "candidateSatisfaction": 91,
    "clientRetention": 87,
    "badge": "verified"
  },
  {
    "id": "8",
    "name": "James Wilson",
    "jobTitle": "Product & Growth Recruiter",
    "company": "Growth Talent Partners",
    "email": "james.wilson@growthtalent.com",
    "phone": "+1 (555) 890-1234",
    "linkedin": "https://linkedin.com/in/jameswilson",
    "website": "https://growthtalent.com/james",
    "specialization": "Product Management",
    "experience": "7 years",
    "location": "Boston, MA",
    "remoteAvailable": true,
    "bio": "Product management and growth recruiter focused on placing product managers, growth engineers, and data-driven product leaders. I understand the intersection of technology, business strategy, and user experience that makes great product teams. My expertise spans B2B and B2C products, from early-stage startups to established tech companies. I help companies find product leaders who can drive user acquisition, retention, and revenue growth through data-driven product decisions.",
    "avatar": "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=128&h=128&fit=crop&crop=face",
    "slug": "james-wilson",
    "featured": true,
    "hidden": false,
    "approved": true,
    "rating": 4.8,
    "reviewCount": 108,
    "placements": 189,
    "avgTimeToHire": 32,
    "candidateSatisfaction": 93,
    "clientRetention": 89,
    "badge": "top-rated"
  },
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
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop&crop=face",
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
    "clientRetention": 87
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
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop&crop=face",
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
    "clientRetention": 100
  }
];

// GET /api/recruiters - Get all recruiters
export async function GET() {
  try {
    // Always try Supabase first in production
    if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase') &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      
      console.log('📡 Loading recruiters from Supabase...');
      const { data, error } = await supabaseAdmin
        .from('recruiters')
        .select('*')
        .eq('approved', true)
        .eq('hidden', false)
        .order('created_at', { ascending: false });

      if (!error && data) {
        console.log(`✅ Loaded ${data.length} recruiters from Supabase`);
        
        // If no data in Supabase, auto-populate it
        if (data.length === 0) {
          console.log('📥 No data in Supabase, auto-populating...');
          try {
            const populateResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/populate-supabase`, {
              method: 'POST'
            });
            
            if (populateResponse.ok) {
              console.log('✅ Auto-populated Supabase, refetching data...');
              const { data: newData, error: newError } = await supabaseAdmin
                .from('recruiters')
                .select('*')
                .eq('approved', true)
                .eq('hidden', false)
                .order('created_at', { ascending: false });
              
              if (!newError && newData) {
                console.log(`✅ Loaded ${newData.length} recruiters after auto-population`);
                return NextResponse.json(newData);
              }
            }
          } catch (populateError) {
            console.error('❌ Auto-populate failed:', populateError);
          }
        } else {
          return NextResponse.json(data);
        }
      } else {
        console.error('❌ Supabase error:', error);
        
        // In production, if Supabase fails, return empty array rather than fallback
        if (process.env.NODE_ENV === 'production') {
          console.log('🚨 Production mode: returning empty array due to Supabase error');
          return NextResponse.json([]);
        }
      }
    } else {
      console.log('⚠️ Supabase not configured properly');
      
      // In production, if Supabase not configured, return error
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({
          error: 'Database not configured',
          message: 'Supabase configuration required for production'
        }, { status: 500 });
      }
    }

    // Fallback to migration data only if Supabase is not configured
    // Initialize global data if not exists
    if (!global.recruitersData) {
      global.recruitersData = [...INITIAL_MIGRATION_RECRUITERS];
    }
    
    console.log(`📁 Using migration data fallback: ${global.recruitersData.length} recruiters`);
    return NextResponse.json(global.recruitersData);
  } catch (error) {
    console.error('❌ Error fetching recruiters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recruiters' },
      { status: 500 }
    )
  }
}

// PUT /api/recruiters - Update all recruiters (for in-memory updates)
export async function PUT(request: NextRequest) {
  try {
    const recruiters = await request.json()
    
    if (!Array.isArray(recruiters)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    // Try Supabase first - only if properly configured
    if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase') &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      
      console.log('📡 Updating all recruiters in Supabase...');
      
      // Convert all recruiters to Supabase format and upsert
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
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabaseAdmin
        .from('recruiters')
        .upsert(supabaseRecruiters, { onConflict: 'id' });

      if (!error) {
        console.log('✅ All recruiters updated in Supabase');
        return NextResponse.json({ success: true, message: 'Recruiters updated in Supabase' });
      } else {
        console.error('❌ Supabase bulk update error:', error);
      }
    }

    // Fallback: Update in-memory migration data
    console.log('📝 Updating in-memory migration data...');
    global.recruitersData = [...recruiters]; // Update global data
    console.log(`✅ Updated ${global.recruitersData.length} recruiters in memory`);

    return NextResponse.json({ 
      success: true, 
      message: 'Recruiters updated in memory',
      count: global.recruitersData.length 
    });
  } catch (error) {
    console.error('❌ Error updating recruiters:', error)
    return NextResponse.json(
      { error: 'Failed to update recruiters' },
      { status: 500 }
    )
  }
}

// Export function to get current recruiters data
export function getCurrentRecruitersData() {
  if (!global.recruitersData) {
    global.recruitersData = [...INITIAL_MIGRATION_RECRUITERS];
  }
  return global.recruitersData;
}