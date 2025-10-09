const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testCommentAPI() {
  try {
    console.log('Testing comment API...');
    
    // Test POST to comments API
    const testComment = {
      toolId: '123e4567-e89b-12d3-a456-426614174000', // dummy tool ID
      userEmail: 'test@example.com',
      userName: 'Test User',
      userCompany: 'Test Company',
      userTitle: 'Test Title',
      content: 'This is a test comment'
    };
    
    const response = await fetch('http://localhost:3004/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testComment)
    });
    
    console.log('Response status:', response.status);
    const responseData = await response.json();
    console.log('Response data:', responseData);
    
    if (response.ok) {
      console.log('Comment submitted successfully!');
      
      // Test GET to retrieve comments
      console.log('Testing comment retrieval...');
      const getResponse = await fetch(`http://localhost:3004/api/comments?toolId=${testComment.toolId}&status=pending`);
      const comments = await getResponse.json();
      console.log('Retrieved comments:', comments);
      
      // Clean up - delete the test comment
      if (responseData.id) {
        const deleteResponse = await fetch(`http://localhost:3004/api/comments?commentId=${responseData.id}`, {
          method: 'DELETE'
        });
        console.log('Cleanup response:', deleteResponse.status);
      }
    } else {
      console.error('Comment submission failed:', responseData);
    }
    
  } catch (error) {
    console.error('Error testing comment API:', error);
  }
}

testCommentAPI();