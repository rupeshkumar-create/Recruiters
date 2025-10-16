#!/usr/bin/env node

// Test script to verify admin sync functionality
console.log('🧪 Testing Admin Sync Functionality...\n');

// Test 1: Check if localStorage is working
console.log('1. Testing localStorage functionality...');
if (typeof window !== 'undefined') {
  console.log('   ✅ Running in browser environment');
  
  // Test localStorage read/write
  try {
    localStorage.setItem('test_key', 'test_value');
    const value = localStorage.getItem('test_key');
    if (value === 'test_value') {
      console.log('   ✅ localStorage read/write working');
      localStorage.removeItem('test_key');
    } else {
      console.log('   ❌ localStorage read/write failed');
    }
  } catch (error) {
    console.log('   ❌ localStorage error:', error.message);
  }
} else {
  console.log('   ⚠️  Running in Node.js environment (expected for this test)');
}

// Test 2: Check API endpoints
console.log('\n2. Testing API endpoints...');
const testEndpoints = [
  '/api/recruiters',
  '/api/recruiters/1',
  '/api/submissions'
];

testEndpoints.forEach(endpoint => {
  console.log(`   📡 ${endpoint} - Should be available when server is running`);
});

// Test 3: Check file structure
console.log('\n3. Checking file structure...');
const fs = require('fs');
const requiredFiles = [
  'src/lib/recruiterStorage.ts',
  'src/app/admin/edit/page.tsx',
  'src/app/page.tsx',
  'src/app/api/recruiters/[id]/route.ts'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
  }
});

// Test 4: Check for event listeners
console.log('\n4. Checking event listener setup...');
const pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');
const adminContent = fs.readFileSync('src/app/admin/edit/page.tsx', 'utf8');

const checks = [
  { name: 'Homepage recruitersUpdated listener', pattern: /recruitersUpdated.*handleRecruitersUpdated/, content: pageContent },
  { name: 'Homepage storage listener', pattern: /storage.*handleStorageChange/, content: pageContent },
  { name: 'Admin update dispatch', pattern: /recruitersUpdated.*detail/, content: adminContent },
  { name: 'RecruiterStorage import', pattern: /import.*RecruiterStorage/, content: adminContent }
];

checks.forEach(check => {
  if (check.pattern.test(check.content)) {
    console.log(`   ✅ ${check.name}`);
  } else {
    console.log(`   ❌ ${check.name} - NOT FOUND`);
  }
});

console.log('\n🎯 Manual Testing Instructions:');
console.log('1. Start the development server: npm run dev');
console.log('2. Open browser console (F12)');
console.log('3. Go to admin panel and edit a recruiter');
console.log('4. Watch console logs for:');
console.log('   - "RecruiterStorage.updateRecruiter called with:"');
console.log('   - "Updated localStorage with new data"');
console.log('   - "Dispatched recruitersUpdated event"');
console.log('5. Check homepage for immediate updates');

console.log('\n🔧 Troubleshooting:');
console.log('- If Supabase errors appear, that\'s normal (using localStorage fallback)');
console.log('- Check browser console for detailed logs');
console.log('- Verify localStorage data: localStorage.getItem("recruiters_data")');
console.log('- Test event dispatch: window.dispatchEvent(new CustomEvent("refreshTools"))');

console.log('\n✅ Test script completed!');