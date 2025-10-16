// Debug script to test RecruiterStorage
const { RecruiterStorage } = require('./src/lib/recruiterStorage.ts');
const { csvRecruiters } = require('./src/lib/data.ts');

console.log('Testing RecruiterStorage...');
console.log('csvRecruiters length:', csvRecruiters?.length || 'undefined');

// Test localStorage simulation
global.window = {
  localStorage: {
    data: {},
    getItem(key) {
      return this.data[key] || null;
    },
    setItem(key, value) {
      this.data[key] = value;
    },
    removeItem(key) {
      delete this.data[key];
    }
  },
  dispatchEvent() {}
};

// Test sync method
try {
  const syncData = RecruiterStorage.getAllSync();
  console.log('getAllSync result:', syncData?.length || 'undefined');
} catch (error) {
  console.error('getAllSync error:', error.message);
}