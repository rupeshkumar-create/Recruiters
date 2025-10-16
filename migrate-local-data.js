#!/usr/bin/env node

/**
 * Data Migration Script for Vercel Deployment
 * This script helps migrate local data to production environment
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Starting data migration...');

// Read local data files
const dataDir = path.join(__dirname, 'data');
const recruitersFile = path.join(dataDir, 'recruiters.json');
const submissionsFile = path.join(dataDir, 'submissions.json');

let recruiters = [];
let submissions = [];

// Load local recruiters data
if (fs.existsSync(recruitersFile)) {
  try {
    const recruitersData = fs.readFileSync(recruitersFile, 'utf8');
    recruiters = JSON.parse(recruitersData);
    console.log(`✅ Found ${recruiters.length} recruiters in local data`);
  } catch (error) {
    console.error('❌ Error reading recruiters.json:', error.message);
  }
} else {
  console.log('⚠️  No recruiters.json found');
}

// Load local submissions data
if (fs.existsSync(submissionsFile)) {
  try {
    const submissionsData = fs.readFileSync(submissionsFile, 'utf8');
    submissions = JSON.parse(submissionsData);
    console.log(`✅ Found ${submissions.length} submissions in local data`);
  } catch (error) {
    console.error('❌ Error reading submissions.json:', error.message);
  }
} else {
  console.log('⚠️  No submissions.json found');
}

// Filter approved recruiters from submissions
const approvedFromSubmissions = submissions
  .filter(sub => sub.status === 'approved')
  .map(sub => {
    // Convert submission format to recruiter format
    return {
      id: sub.id,
      name: sub.name,
      jobTitle: sub.job_title,
      company: sub.company,
      email: sub.email,
      phone: sub.phone,
      linkedin: sub.linkedin,
      website: sub.website || '',
      specialization: sub.specialization,
      experience: sub.experience,
      location: sub.location,
      remoteAvailable: sub.remote_available || false,
      bio: sub.bio,
      avatar: sub.avatar,
      slug: sub.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      featured: false,
      hidden: false,
      approved: true,
      status: 'approved',
      submitterEmail: sub.submitter_email,
      rating: 0,
      reviewCount: 0,
      placements: sub.placements || 0,
      avgTimeToHire: sub.avg_time_to_hire || 30,
      candidateSatisfaction: sub.candidate_satisfaction || 90,
      clientRetention: sub.client_retention || 85,
      achievements: typeof sub.achievements === 'string' ? JSON.parse(sub.achievements) : sub.achievements || [],
      workExperience: typeof sub.work_experience === 'string' ? JSON.parse(sub.work_experience) : sub.work_experience || [],
      rolesPlaced: typeof sub.roles_placed === 'string' ? JSON.parse(sub.roles_placed) : sub.roles_placed || [],
      industries: typeof sub.industries === 'string' ? JSON.parse(sub.industries) : sub.industries || [],
      keywords: typeof sub.keywords === 'string' ? JSON.parse(sub.keywords) : sub.keywords || [],
      languages: typeof sub.languages === 'string' ? JSON.parse(sub.languages) : sub.languages || [],
      seniorityLevels: typeof sub.seniority_levels === 'string' ? JSON.parse(sub.seniority_levels) : sub.seniority_levels || [],
      employmentTypes: typeof sub.employment_types === 'string' ? JSON.parse(sub.employment_types) : sub.employment_types || [],
      regions: typeof sub.regions === 'string' ? JSON.parse(sub.regions) : sub.regions || [],
      certifications: typeof sub.certifications === 'string' ? JSON.parse(sub.certifications) : sub.certifications || [],
      availability: typeof sub.availability === 'string' ? JSON.parse(sub.availability) : sub.availability || { accepting: true, nextAvailable: '' },
      socialProof: typeof sub.social_proof === 'string' ? JSON.parse(sub.social_proof) : sub.social_proof || { linkedinFollowers: 0, featuredIn: [] },
      testimonials: [],
      created_at: sub.created_at || new Date().toISOString(),
      updated_at: sub.updated_at || new Date().toISOString()
    };
  });

console.log(`✅ Found ${approvedFromSubmissions.length} approved recruiters from submissions`);

// Combine all recruiters (avoid duplicates)
const existingIds = new Set(recruiters.map(r => r.id));
const newRecruiters = approvedFromSubmissions.filter(r => !existingIds.has(r.id));
const allRecruiters = [...recruiters, ...newRecruiters];

console.log(`✅ Total recruiters to migrate: ${allRecruiters.length}`);

// Create migration data file
const migrationData = {
  recruiters: allRecruiters,
  submissions: submissions.filter(sub => sub.status !== 'approved'), // Only pending/rejected submissions
  migrationDate: new Date().toISOString(),
  totalRecruiters: allRecruiters.length,
  totalSubmissions: submissions.filter(sub => sub.status !== 'approved').length
};

// Write migration file
const migrationFile = path.join(__dirname, 'migration-data.json');
fs.writeFileSync(migrationFile, JSON.stringify(migrationData, null, 2));

console.log('✅ Migration data created successfully!');
console.log(`📁 File: ${migrationFile}`);
console.log(`📊 Recruiters: ${migrationData.totalRecruiters}`);
console.log(`📊 Pending Submissions: ${migrationData.totalSubmissions}`);

// Create environment variables for Vercel
console.log('\n🔧 Environment Variables for Vercel:');
console.log('Add these to your Vercel dashboard:');
console.log('');
console.log('MIGRATION_DATA=' + JSON.stringify(migrationData));
console.log('');
console.log('Or use the migration API endpoint after deployment.');

console.log('\n🚀 Next Steps:');
console.log('1. Deploy to Vercel with current environment variables');
console.log('2. Use the migration API to import this data');
console.log('3. Test the application with migrated data');

console.log('\n✅ Migration preparation complete!');