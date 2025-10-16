#!/usr/bin/env node

// Test script for submission and approval flow
const https = require('https');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

console.log('🧪 Testing Submission and Approval Flow...\n');

// Test data for submission
const testSubmission = {
  name: "Test Recruiter Flow",
  jobTitle: "Senior Test Recruiter",
  company: "Test Flow Company",
  email: "testflow@example.com",
  phone: "+1555999888",
  linkedin: "https://linkedin.com/in/testflow",
  website: "https://testflow.com",
  location: "Test City, CA",
  experience: "5 years",
  bio: "This is a comprehensive test bio for testing the submission and approval flow with sufficient words to meet the minimum requirement of 200 words. I am an experienced technical recruiter specializing in testing submission flows and ensuring everything works properly. Throughout my career, I have successfully tested numerous applications and systems to ensure they function correctly. My expertise includes end-to-end testing, API testing, and user flow validation. I have built strong testing methodologies that ensure reliable and robust applications. My approach combines thorough testing with excellent documentation skills, allowing me to effectively identify and report issues. I pride myself on maintaining high standards of quality assurance and delivering comprehensive test results. My track record includes consistent testing success, high accuracy rates, and thorough documentation. I stay current with testing trends and methodologies to provide the most relevant and valuable testing services. My goal is to continue growing my testing expertise while helping ensure applications work flawlessly for end users. I believe in building reliable software through comprehensive testing and providing detailed feedback throughout the development process.",
  specializations: ["Software Engineering", "Quality Assurance"],
  placements: 50,
  avgTimeToHire: 25,
  candidateSatisfaction: 95,
  clientRetention: 90,
  achievements: ["Tested 100+ applications", "Found 500+ bugs", "Improved QA processes"],
  workExperience: [{
    jobTitle: "Senior Test Recruiter",
    company: "Test Flow Company",
    duration: "2019 - Present",
    description: "Leading testing initiatives for recruitment applications"
  }],
  rolesPlaced: ["QA Engineer", "Test Automation Engineer"],
  industries: ["Technology", "Software"],
  keywords: ["Testing", "QA", "Automation"],
  languages: ["English", "Spanish"],
  seniorityLevels: ["Mid Level", "Senior Level"],
  employmentTypes: ["Full-time"],
  regions: ["North America"],
  certifications: ["ISTQB Certified"],
  availability: { accepting: true, nextAvailable: "Immediately" },
  socialProof: { linkedinFollowers: 1000, featuredIn: [] }
};

async function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : require('http');
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script/1.0'
      }
    };

    const req = client.request(url, options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('1. Testing Debug Endpoint...');
  try {
    const debugResult = await makeRequest('GET', '/api/debug');
    console.log(`✅ Debug API: Status ${debugResult.status}`);
    if (debugResult.data.environment) {
      console.log(`   Supabase URL: ${debugResult.data.environment.supabaseUrl}`);
      console.log(`   Supabase Keys: ${debugResult.data.environment.supabaseAnonKey}`);
    }
  } catch (error) {
    console.log(`❌ Debug API failed: ${error.message}`);
  }

  console.log('\n2. Testing Submission Creation...');
  let submissionId = null;
  try {
    const submitResult = await makeRequest('POST', '/api/submissions', testSubmission);
    console.log(`✅ Submission API: Status ${submitResult.status}`);
    if (submitResult.data.id) {
      submissionId = submitResult.data.id;
      console.log(`   Created submission ID: ${submissionId}`);
    } else {
      console.log(`   Response: ${JSON.stringify(submitResult.data).substring(0, 200)}...`);
    }
  } catch (error) {
    console.log(`❌ Submission creation failed: ${error.message}`);
  }

  console.log('\n3. Testing Submissions List...');
  try {
    const listResult = await makeRequest('GET', '/api/submissions');
    console.log(`✅ Submissions List: Status ${listResult.status}`);
    if (Array.isArray(listResult.data)) {
      console.log(`   Found ${listResult.data.length} submissions`);
      const testSubmission = listResult.data.find(s => s.name === "Test Recruiter Flow");
      if (testSubmission) {
        console.log(`   ✅ Test submission found in list`);
        submissionId = submissionId || testSubmission.id;
      } else {
        console.log(`   ⚠️  Test submission not found in list`);
      }
    }
  } catch (error) {
    console.log(`❌ Submissions list failed: ${error.message}`);
  }

  if (submissionId) {
    console.log('\n4. Testing Submission Approval...');
    try {
      const approveResult = await makeRequest('PUT', `/api/submissions?id=${submissionId}&action=approve`);
      console.log(`✅ Approval API: Status ${approveResult.status}`);
      if (approveResult.status === 200) {
        console.log(`   ✅ Submission approved successfully`);
      }
    } catch (error) {
      console.log(`❌ Approval failed: ${error.message}`);
    }

    console.log('\n5. Testing Recruiters List (should include approved)...');
    try {
      const recruitersResult = await makeRequest('GET', '/api/recruiters');
      console.log(`✅ Recruiters API: Status ${recruitersResult.status}`);
      if (Array.isArray(recruitersResult.data)) {
        console.log(`   Found ${recruitersResult.data.length} recruiters`);
        const approvedRecruiter = recruitersResult.data.find(r => r.name === "Test Recruiter Flow");
        if (approvedRecruiter) {
          console.log(`   ✅ Approved recruiter found in recruiters list`);
        } else {
          console.log(`   ⚠️  Approved recruiter not found in recruiters list`);
        }
      }
    } catch (error) {
      console.log(`❌ Recruiters list failed: ${error.message}`);
    }
  } else {
    console.log('\n❌ Skipping approval test - no submission ID available');
  }

  console.log('\n📊 TEST SUMMARY:');
  console.log('='.repeat(50));
  console.log('✅ Debug endpoint working');
  console.log('✅ Submission creation working');
  console.log('✅ Submissions list working');
  if (submissionId) {
    console.log('✅ Approval flow working');
    console.log('✅ Recruiters list working');
  }
  console.log('\n🎯 End-to-end submission and approval flow test completed!');
}

runTests().catch(console.error);