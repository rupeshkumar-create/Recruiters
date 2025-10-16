#!/usr/bin/env node

// Script to fix duplicate slug declarations in submissions route
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/api/submissions/route.ts');

console.log('🔍 Checking for duplicate slug declarations...');

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let slugDeclarations = [];
  
  lines.forEach((line, index) => {
    if (line.includes('const slug =') || line.includes('let slug =') || line.includes('var slug =')) {
      slugDeclarations.push({
        line: index + 1,
        content: line.trim()
      });
    }
  });
  
  console.log(`Found ${slugDeclarations.length} slug declarations:`);
  slugDeclarations.forEach(decl => {
    console.log(`  Line ${decl.line}: ${decl.content}`);
  });
  
  if (slugDeclarations.length > 1) {
    console.log('\n❌ Multiple slug declarations found!');
    console.log('This will cause build errors in Vercel.');
    console.log('\n🔧 To fix this:');
    console.log('1. Keep only one slug declaration per function scope');
    console.log('2. Rename duplicate declarations (e.g., approvedSlug)');
    console.log('3. Update all references to use the correct variable name');
  } else {
    console.log('\n✅ No duplicate slug declarations found!');
  }
  
} catch (error) {
  console.error('❌ Error reading file:', error.message);
}