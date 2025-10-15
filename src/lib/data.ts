export interface Tool {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  linkedin: string;
  specialization: string;
  experience: string;
  location: string;
  bio: string;
  avatar: string;
  slug: string;
  featured: boolean;
  hidden?: boolean;
  approved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  submitterEmail?: string;
  rating?: number;
  placements?: number;
  // Legacy fields for compatibility
  url?: string;
  tagline?: string;
  content?: string;
  description?: string;
  categories?: string;
  logo?: string;
}

export interface Recruiter {
  id: string;
  name: string;
  jobTitle?: string;
  company: string;
  email: string;
  phone: string;
  linkedin: string;
  website?: string;
  specialization: string;
  experience: string;
  location: string;
  remoteAvailable?: boolean;
  bio: string;
  avatar: string;
  slug: string;
  featured: boolean;
  hidden?: boolean;
  approved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  submitterEmail?: string;
  rating?: number;
  reviewCount?: number;
  placements?: number;
  avgTimeToHire?: number;
  candidateSatisfaction?: number;
  clientRetention?: number;
  badge?: 'verified' | 'top-rated' | 'rising-star';
  achievements?: string[];
  workExperience?: WorkExperience[];
  rolesPlaced?: string[];
  industries?: string[];
  keywords?: string[];
  languages?: string[];
  seniorityLevels?: string[];
  employmentTypes?: string[];
  regions?: string[];
  certifications?: string[];
  testimonials?: Testimonial[];
  availability?: {
    accepting: boolean;
    nextAvailable?: string;
  };
  socialProof?: {
    linkedinFollowers?: number;
    featuredIn?: string[];
  };
}

export interface WorkExperience {
  jobTitle: string;
  company: string;
  duration: string;
  description?: string;
}

export interface Testimonial {
  quote: string;
  reviewer: string;
  rating?: number;
}

// Local storage key
const RECRUITERS_STORAGE_KEY = 'recruiters_directory';

// 20 demo recruiters data
export const csvRecruiters: Recruiter[] = [
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
    "avatar": "/images/recruiters/sarah-johnson.jpg",
    "slug": "sarah-johnson",
    "featured": true,
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
      },
      {
        "jobTitle": "Technical Recruiter",
        "company": "InnovateTech Recruiting",
        "duration": "2018 - 2020",
        "description": "Focused on frontend and backend engineering roles for mid-stage tech companies."
      },
      {
        "jobTitle": "Junior Recruiter",
        "company": "Bay Area Talent",
        "duration": "2016 - 2018",
        "description": "Started career in tech recruiting, learning the fundamentals of technical assessment and candidate sourcing."
      }
    ],
    "rolesPlaced": ["CTO", "VP Engineering", "Engineering Manager", "Senior Software Engineer", "Full-Stack Developer", "DevOps Engineer", "Frontend Engineer", "Backend Engineer"],
    "industries": ["Fintech", "SaaS", "E-commerce", "Healthcare Tech", "EdTech", "AI/ML"],
    "keywords": ["React", "Node.js", "Python", "AWS", "Kubernetes", "Leadership", "Startup", "Scale-up"],
    "languages": ["English", "Spanish"],
    "seniorityLevels": ["Mid-level", "Senior", "Staff", "Principal", "Executive"],
    "employmentTypes": ["Full-Time", "Contract"],
    "regions": ["US West Coast", "Remote-First", "San Francisco Bay Area"],
    "certifications": ["AIRS Certified", "LinkedIn Recruiter Certified", "SHRM-CP"],
    "testimonials": [
      {
        "quote": "Sarah found me the perfect role at a unicorn startup. Her technical understanding and personal approach made all the difference.",
        "reviewer": "Alex Chen, Senior Engineer",
        "rating": 5
      },
      {
        "quote": "Best recruiter I've worked with. She really understands both the technical and cultural fit aspects.",
        "reviewer": "Maria Rodriguez, CTO",
        "rating": 5
      }
    ],
    "availability": {
      "accepting": true,
      "nextAvailable": "Available now"
    },
    "socialProof": {
      "linkedinFollowers": 15000,
      "featuredIn": ["TechCrunch", "Built In SF", "The Muse"]
    }
  },
  {
    "id": "2",
    "name": "Michael Chen",
    "jobTitle": "Executive Search Partner",
    "company": "Executive Search Partners",
    "email": "michael.chen@execsearch.com",
    "phone": "+1 (555) 234-5678",
    "linkedin": "https://linkedin.com/in/michaelchen",
    "website": "https://execsearch.com/michael-chen",
    "specialization": "Executive Leadership",
    "experience": "12 years",
    "location": "New York, NY",
    "remoteAvailable": false,
    "bio": "Elite executive search consultant with 12+ years of experience placing C-suite leaders and board members at Fortune 500 companies. I specialize in transformational leadership roles and have a deep network of senior executives across multiple industries.",
    "avatar": "/images/recruiters/michael-chen.jpg",
    "slug": "michael-chen",
    "featured": true,
    "rating": 4.8,
    "reviewCount": 89,
    "placements": 156,
    "avgTimeToHire": 45,
    "candidateSatisfaction": 98,
    "clientRetention": 95,
    "badge": "verified",
    "achievements": [
      "Placed 25+ C-suite executives at Fortune 500 companies",
      "Expert in CEO, CFO, and board member searches",
      "98% client satisfaction rate",
      "Featured speaker at Executive Leadership Summit",
      "Built executive networks across 15+ industries",
      "Advisor to 3 private equity firms on leadership assessment"
    ],
    "workExperience": [
      {
        "jobTitle": "Executive Search Partner",
        "company": "Executive Search Partners",
        "duration": "2015 - Present",
        "description": "Lead C-suite and board searches for Fortune 500 companies and private equity portfolio companies."
      },
      {
        "jobTitle": "Principal Consultant",
        "company": "Korn Ferry",
        "duration": "2012 - 2015",
        "description": "Specialized in executive search for financial services and technology sectors."
      }
    ],
    "rolesPlaced": ["CEO", "CFO", "COO", "CHRO", "Board Member", "Managing Director", "Division President"],
    "industries": ["Financial Services", "Technology", "Healthcare", "Manufacturing", "Private Equity"],
    "keywords": ["C-Suite", "Board Search", "Transformation", "Leadership", "Private Equity", "IPO"],
    "languages": ["English", "Mandarin", "Cantonese"],
    "seniorityLevels": ["C-Suite", "SVP", "EVP", "Board Level"],
    "employmentTypes": ["Full-Time", "Board Positions"],
    "regions": ["North America", "Global"],
    "certifications": ["AESC Member", "Executive Search Certified"],
    "testimonials": [
      {
        "quote": "Michael's executive network and assessment skills are unparalleled. He found us the perfect CEO for our transformation.",
        "reviewer": "Board Chair, Fortune 500",
        "rating": 5
      }
    ],
    "availability": {
      "accepting": true,
      "nextAvailable": "November 2024"
    },
    "socialProof": {
      "linkedinFollowers": 25000,
      "featuredIn": ["Harvard Business Review", "Forbes", "Wall Street Journal"]
    }
  },
  {
    "id": "3",
    "name": "Emily Rodriguez",
    "jobTitle": "Healthcare Recruitment Specialist",
    "company": "Healthcare Talent Group",
    "email": "emily.rodriguez@healthtalent.com",
    "phone": "+1 (555) 345-6789",
    "linkedin": "https://linkedin.com/in/emilyrodriguez",
    "specialization": "Healthcare & Life Sciences",
    "experience": "6 years",
    "location": "Boston, MA",
    "remoteAvailable": true,
    "bio": "Dedicated healthcare recruiter with 6+ years of experience connecting medical professionals with leading healthcare organizations. I specialize in physician recruitment, nursing leadership, and biotech talent acquisition with a deep understanding of healthcare compliance and industry trends.",
    "avatar": "/images/recruiters/emily-rodriguez.jpg",
    "slug": "emily-rodriguez",
    "featured": true,
    "rating": 4.7,
    "reviewCount": 94,
    "placements": 189,
    "avgTimeToHire": 28,
    "candidateSatisfaction": 93,
    "clientRetention": 88,
    "badge": "rising-star",
    "achievements": [
      "Placed 75+ physicians across major hospital systems",
      "Expert in nursing leadership and CNO placements",
      "Healthcare compliance and credentialing specialist",
      "Built recruitment programs for 3 biotech startups",
      "93% candidate satisfaction in healthcare placements"
    ],
    "workExperience": [
      {
        "jobTitle": "Healthcare Recruitment Specialist",
        "company": "Healthcare Talent Group",
        "duration": "2019 - Present",
        "description": "Lead healthcare recruitment for hospitals, biotech companies, and medical device manufacturers."
      },
      {
        "jobTitle": "Medical Recruiter",
        "company": "MedTalent Solutions",
        "duration": "2018 - 2019",
        "description": "Focused on nursing and allied health professional recruitment."
      }
    ],
    "rolesPlaced": ["Chief Medical Officer", "Chief Nursing Officer", "Physician", "Nurse Manager", "Clinical Director", "Biotech Scientist"],
    "industries": ["Healthcare", "Biotech", "Medical Devices", "Pharmaceuticals", "Hospital Systems"],
    "keywords": ["Healthcare", "Physicians", "Nursing", "Biotech", "Medical", "Clinical"],
    "languages": ["English", "Spanish"],
    "seniorityLevels": ["Mid-level", "Senior", "Executive"],
    "employmentTypes": ["Full-Time", "Locum Tenens"],
    "regions": ["Northeast US", "Remote"],
    "certifications": ["Healthcare Recruiter Certified", "AIRS Certified"],
    "testimonials": [
      {
        "quote": "Emily understood our unique needs as a biotech startup and found us exceptional scientific talent.",
        "reviewer": "Dr. Sarah Kim, CTO",
        "rating": 5
      }
    ],
    "availability": {
      "accepting": true,
      "nextAvailable": "Available now"
    },
    "socialProof": {
      "linkedinFollowers": 8500,
      "featuredIn": ["Healthcare Recruiting News", "Becker's Hospital Review"]
    }
  },
  {
    "id": "4",
    "name": "David Thompson",
    "jobTitle": "Senior Finance Recruiter",
    "company": "Financial Careers Inc",
    "email": "david.thompson@fincareers.com",
    "phone": "+1 (555) 456-7890",
    "linkedin": "https://linkedin.com/in/davidthompson",
    "specialization": "Finance & Banking",
    "experience": "10 years",
    "location": "Chicago, IL",
    "remoteAvailable": false,
    "bio": "Seasoned finance recruiter with 10+ years of experience in investment banking, private equity, and corporate finance. I have a strong network on Wall Street and specialize in placing top-tier financial professionals.",
    "avatar": "/images/recruiters/david-thompson.jpg",
    "slug": "david-thompson",
    "featured": false,
    "rating": 4.6,
    "reviewCount": 78,
    "placements": 134,
    "avgTimeToHire": 35,
    "candidateSatisfaction": 91,
    "clientRetention": 85,
    "badge": "verified",
    "achievements": [
      "Placed 50+ investment banking professionals",
      "Expert in private equity and hedge fund recruitment",
      "Strong Wall Street and Chicago finance network",
      "Specialized in VP to MD level placements"
    ],
    "rolesPlaced": ["Managing Director", "Vice President", "Director", "Senior Analyst", "Portfolio Manager"],
    "industries": ["Investment Banking", "Private Equity", "Hedge Funds", "Corporate Finance"],
    "keywords": ["Finance", "Banking", "Investment", "Private Equity", "Wall Street"],
    "languages": ["English"],
    "seniorityLevels": ["Senior", "VP", "Director", "MD"],
    "employmentTypes": ["Full-Time"],
    "regions": ["Chicago", "New York", "US Financial Centers"],
    "certifications": ["CFA", "Financial Recruiter Certified"],
    "availability": {
      "accepting": true
    }
  },
  {
    "id": "5",
    "name": "Lisa Wang",
    "company": "Creative Minds Recruiting",
    "email": "lisa.wang@creativeminds.com",
    "phone": "+1 (555) 567-8901",
    "linkedin": "https://linkedin.com/in/lisawang",
    "specialization": "Marketing & Creative",
    "experience": "7 years",
    "location": "Los Angeles, CA",
    "bio": "Creative industry recruiter specializing in marketing, advertising, design, and digital media roles. Expert in matching creative talent with innovative companies.",
    "avatar": "/images/recruiters/lisa-wang.jpg",
    "slug": "lisa-wang",
    "featured": false,
    "rating": 4.8,
    "placements": 203
  },
  {
    "id": "6",
    "name": "Robert Miller",
    "company": "Manufacturing Talent Solutions",
    "email": "robert.miller@mfgtalent.com",
    "phone": "+1 (555) 678-9012",
    "linkedin": "https://linkedin.com/in/robertmiller",
    "specialization": "Manufacturing & Operations",
    "experience": "15 years",
    "location": "Detroit, MI",
    "bio": "Veteran manufacturing recruiter with deep expertise in operations management, supply chain, quality assurance, and industrial engineering positions.",
    "avatar": "/images/recruiters/robert-miller.jpg",
    "slug": "robert-miller",
    "featured": false,
    "rating": 4.5,
    "placements": 178
  },
  {
    "id": "7",
    "name": "Jennifer Davis",
    "company": "HR Excellence Partners",
    "email": "jennifer.davis@hrexcellence.com",
    "phone": "+1 (555) 789-0123",
    "linkedin": "https://linkedin.com/in/jenniferdavis",
    "specialization": "Human Resources",
    "experience": "9 years",
    "location": "Atlanta, GA",
    "bio": "HR recruitment specialist focusing on CHRO, HR Director, Talent Acquisition, and People Operations roles. Strong background in HR transformation and culture building.",
    "avatar": "/images/recruiters/jennifer-davis.jpg",
    "slug": "jennifer-davis",
    "featured": true,
    "rating": 4.9,
    "placements": 167
  },
  {
    "id": "8",
    "name": "Alex Kumar",
    "company": "Data & Analytics Recruiters",
    "email": "alex.kumar@datarecruit.com",
    "phone": "+1 (555) 890-1234",
    "linkedin": "https://linkedin.com/in/alexkumar",
    "specialization": "Data Science & Analytics",
    "experience": "5 years",
    "location": "Seattle, WA",
    "bio": "Data science and analytics recruiter specializing in data scientists, machine learning engineers, data analysts, and AI researchers. Deep technical understanding.",
    "avatar": "/images/recruiters/alex-kumar.jpg",
    "slug": "alex-kumar",
    "featured": false,
    "rating": 4.7,
    "placements": 145
  },
  {
    "id": "9",
    "name": "Maria Gonzalez",
    "company": "Sales Force Recruiters",
    "email": "maria.gonzalez@salesforce-recruit.com",
    "phone": "+1 (555) 901-2345",
    "linkedin": "https://linkedin.com/in/mariagonzalez",
    "specialization": "Sales & Business Development",
    "experience": "11 years",
    "location": "Austin, TX",
    "bio": "Sales recruitment expert with proven track record in placing top sales professionals, sales managers, and business development leaders across various industries.",
    "avatar": "/images/recruiters/maria-gonzalez.jpg",
    "slug": "maria-gonzalez",
    "featured": false,
    "rating": 4.6,
    "placements": 221
  },
  {
    "id": "10",
    "name": "James Wilson",
    "company": "Legal Talent Network",
    "email": "james.wilson@legaltalent.com",
    "phone": "+1 (555) 012-3456",
    "linkedin": "https://linkedin.com/in/jameswilson",
    "specialization": "Legal & Compliance",
    "experience": "13 years",
    "location": "Washington, DC",
    "bio": "Legal recruiter specializing in attorneys, paralegals, compliance officers, and legal operations professionals. Extensive network in law firms and corporate legal departments.",
    "avatar": "/images/recruiters/james-wilson.jpg",
    "slug": "james-wilson",
    "featured": false,
    "rating": 4.8,
    "placements": 112
  },
  {
    "id": "11",
    "name": "Amanda Foster",
    "company": "Startup Talent Hub",
    "email": "amanda.foster@startuptalent.com",
    "phone": "+1 (555) 123-4567",
    "linkedin": "https://linkedin.com/in/amandafoster",
    "specialization": "Startup & Tech",
    "experience": "6 years",
    "location": "San Francisco, CA",
    "bio": "Startup-focused recruiter helping early-stage companies build their founding teams. Expertise in technical and non-technical roles for high-growth startups.",
    "avatar": "/images/recruiters/amanda-foster.jpg",
    "slug": "amanda-foster",
    "featured": true,
    "rating": 4.9,
    "placements": 198
  },
  {
    "id": "12",
    "name": "Kevin Park",
    "company": "Cybersecurity Talent Group",
    "email": "kevin.park@cybersectalent.com",
    "phone": "+1 (555) 234-5678",
    "linkedin": "https://linkedin.com/in/kevinpark",
    "specialization": "Cybersecurity",
    "experience": "8 years",
    "location": "Arlington, VA",
    "bio": "Cybersecurity recruitment specialist with deep understanding of security roles, clearance requirements, and the evolving threat landscape. Government and private sector experience.",
    "avatar": "/images/recruiters/kevin-park.jpg",
    "slug": "kevin-park",
    "featured": false,
    "rating": 4.7,
    "placements": 156
  },
  {
    "id": "13",
    "name": "Rachel Green",
    "company": "Education Talent Partners",
    "email": "rachel.green@edutalent.com",
    "phone": "+1 (555) 345-6789",
    "linkedin": "https://linkedin.com/in/rachelgreen",
    "specialization": "Education & Academia",
    "experience": "10 years",
    "location": "Philadelphia, PA",
    "bio": "Education recruiter specializing in K-12 administrators, higher education faculty, EdTech professionals, and educational consultants. Passionate about improving education.",
    "avatar": "/images/recruiters/rachel-green.jpg",
    "slug": "rachel-green",
    "featured": false,
    "rating": 4.6,
    "placements": 143
  },
  {
    "id": "14",
    "name": "Daniel Lee",
    "company": "Remote Work Specialists",
    "email": "daniel.lee@remotework.com",
    "phone": "+1 (555) 456-7890",
    "linkedin": "https://linkedin.com/in/daniellee",
    "specialization": "Remote & Distributed Teams",
    "experience": "4 years",
    "location": "Denver, CO",
    "bio": "Remote work recruitment specialist helping companies build distributed teams. Expert in remote-first culture, async communication, and global talent acquisition.",
    "avatar": "/images/recruiters/daniel-lee.jpg",
    "slug": "daniel-lee",
    "featured": false,
    "rating": 4.8,
    "placements": 187
  },
  {
    "id": "15",
    "name": "Nicole Brown",
    "company": "Diversity & Inclusion Recruiters",
    "email": "nicole.brown@diversityrecruit.com",
    "phone": "+1 (555) 567-8901",
    "linkedin": "https://linkedin.com/in/nicolebrown",
    "specialization": "Diversity & Inclusion",
    "experience": "7 years",
    "location": "Portland, OR",
    "bio": "D&I recruitment specialist focused on building diverse and inclusive teams. Expertise in unconscious bias training, inclusive hiring practices, and diverse talent sourcing.",
    "avatar": "/images/recruiters/nicole-brown.jpg",
    "slug": "nicole-brown",
    "featured": true,
    "rating": 4.9,
    "placements": 174
  },
  {
    "id": "16",
    "name": "Thomas Anderson",
    "company": "Energy Sector Recruiters",
    "email": "thomas.anderson@energyrecruit.com",
    "phone": "+1 (555) 678-9012",
    "linkedin": "https://linkedin.com/in/thomasanderson",
    "specialization": "Energy & Utilities",
    "experience": "14 years",
    "location": "Houston, TX",
    "bio": "Energy sector recruitment veteran with expertise in oil & gas, renewable energy, utilities, and energy technology roles. Deep industry knowledge and extensive network.",
    "avatar": "/images/recruiters/thomas-anderson.jpg",
    "slug": "thomas-anderson",
    "featured": false,
    "rating": 4.5,
    "placements": 129
  },
  {
    "id": "17",
    "name": "Sophia Martinez",
    "company": "Retail & Consumer Goods Talent",
    "email": "sophia.martinez@retailtalent.com",
    "phone": "+1 (555) 789-0123",
    "linkedin": "https://linkedin.com/in/sophiamartinez",
    "specialization": "Retail & Consumer Goods",
    "experience": "9 years",
    "location": "Miami, FL",
    "bio": "Retail and consumer goods recruiter with expertise in merchandising, supply chain, brand management, and e-commerce roles. Strong understanding of retail trends.",
    "avatar": "/images/recruiters/sophia-martinez.jpg",
    "slug": "sophia-martinez",
    "featured": false,
    "rating": 4.7,
    "placements": 165
  },
  {
    "id": "18",
    "name": "Ryan O'Connor",
    "company": "Construction & Engineering Talent",
    "email": "ryan.oconnor@constructiontalent.com",
    "phone": "+1 (555) 890-1234",
    "linkedin": "https://linkedin.com/in/ryanoconnor",
    "specialization": "Construction & Engineering",
    "experience": "12 years",
    "location": "Phoenix, AZ",
    "bio": "Construction and engineering recruiter specializing in project managers, civil engineers, architects, and skilled trades professionals. Strong network in infrastructure projects.",
    "avatar": "/images/recruiters/ryan-oconnor.jpg",
    "slug": "ryan-oconnor",
    "featured": false,
    "rating": 4.6,
    "placements": 141
  },
  {
    "id": "19",
    "name": "Grace Kim",
    "company": "Nonprofit Talent Solutions",
    "email": "grace.kim@nonprofittalent.com",
    "phone": "+1 (555) 901-2345",
    "linkedin": "https://linkedin.com/in/gracekim",
    "specialization": "Nonprofit & Social Impact",
    "experience": "8 years",
    "location": "Minneapolis, MN",
    "bio": "Nonprofit recruitment specialist passionate about connecting mission-driven professionals with impactful organizations. Expertise in fundraising, program management, and advocacy roles.",
    "avatar": "/images/recruiters/grace-kim.jpg",
    "slug": "grace-kim",
    "featured": false,
    "rating": 4.8,
    "placements": 158
  },
  {
    "id": "20",
    "name": "Marcus Johnson",
    "company": "International Talent Bridge",
    "email": "marcus.johnson@intltalent.com",
    "phone": "+1 (555) 012-3456",
    "linkedin": "https://linkedin.com/in/marcusjohnson",
    "specialization": "International & Global Mobility",
    "experience": "11 years",
    "location": "New York, NY",
    "bio": "International recruitment specialist with expertise in global mobility, expatriate assignments, and cross-border talent acquisition. Multilingual with global network.",
    "avatar": "/images/recruiters/marcus-johnson.jpg",
    "slug": "marcus-johnson",
    "featured": true,
    "rating": 4.9,
    "placements": 192
  }
];

// Legacy export for compatibility (now points to recruiters)
export const csvTools = csvRecruiters;

// DEPRECATED: Function to approve a submitted recruiter
export async function approveSubmittedRecruiter(submissionId: string): Promise<Recruiter | null> {
  console.warn('approveSubmittedRecruiter is deprecated. Use /api/submissions/approve endpoint instead.');
  return null;
}

// DEPRECATED: Function to reject a submitted recruiter
export function rejectSubmittedRecruiter(submissionId: string): boolean {
  console.warn('rejectSubmittedRecruiter is deprecated. Use DELETE /api/submissions endpoint instead.');
  return false;
}
// Helper functions for admin compatibility
export function addTool(tool: any): Promise<any> {
  console.warn('addTool is deprecated. Use API endpoints instead.');
  return Promise.resolve(tool);
}

export function getUniqueCategories(): string[] {
  const categories = new Set<string>();
  csvRecruiters.forEach(recruiter => {
    if (recruiter.specialization) {
      categories.add(recruiter.specialization);
    }
  });
  return Array.from(categories).sort();
}

export function updateTool(id: string, updates: any): Promise<any> {
  console.warn('updateTool is deprecated. Use API endpoints instead.');
  return Promise.resolve({ id, ...updates });
}

export function deleteTool(id: string): Promise<boolean> {
  console.warn('deleteTool is deprecated. Use API endpoints instead.');
  return Promise.resolve(true);
}

export function getToolById(id: string): any | null {
  return csvRecruiters.find(r => r.id === id) || null;
}

export function getToolBySlug(slug: string): any | null {
  return csvRecruiters.find(r => r.slug === slug) || null;
}

export function getAllTools(): any[] {
  return csvRecruiters;
}

// Additional helper functions for hooks compatibility
export function initializeLocalStorage(): void {
  console.warn('initializeLocalStorage is deprecated. Use LocalStorageDB.initializeDefaultData() instead.');
}

export function getToolsFromStorage(): any[] {
  return csvRecruiters;
}

export function saveToolsToStorage(tools: any[]): void {
  console.warn('saveToolsToStorage is deprecated. Use LocalStorageDB methods instead.');
}