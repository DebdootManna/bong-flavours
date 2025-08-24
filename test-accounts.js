// Test script to verify demo user accounts
// Run this after starting the development server (npm run dev)

const testAccounts = [
  {
    name: 'Admin Account',
    email: 'admin@bongflavours.com',
    password: 'admin123',
    expectedRole: 'admin'
  },
  {
    name: 'Customer - Raj Kumar',
    email: 'raj.kumar@example.com',
    password: 'customer123',
    expectedRole: 'customer'
  },
  {
    name: 'Customer - Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'customer123',
    expectedRole: 'customer'
  }
];

async function testLogin(account) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: account.email,
        password: account.password
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ ${account.name} - Login successful`);
      console.log(`   Name: ${result.user.name}`);
      console.log(`   Email: ${result.user.email}`);
      console.log(`   Role: ${result.user.role}`);
      
      if (result.user.role === account.expectedRole) {
        console.log(`   ✅ Role matches expected: ${account.expectedRole}`);
      } else {
        console.log(`   ❌ Role mismatch! Expected: ${account.expectedRole}, Got: ${result.user.role}`);
      }
      
      return true;
    } else {
      console.log(`❌ ${account.name} - Login failed`);
      console.log(`   Error: ${result.message}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${account.name} - Connection error`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testAllAccounts() {
  console.log('🧪 Testing Demo User Accounts');
  console.log('='.repeat(40));
  console.log('Make sure your development server is running (npm run dev)\n');

  let successCount = 0;
  let totalCount = testAccounts.length;

  for (const account of testAccounts) {
    const success = await testLogin(account);
    if (success) successCount++;
    console.log(''); // Empty line for readability
  }

  console.log('📊 Test Results:');
  console.log('-'.repeat(20));
  console.log(`✅ Successful logins: ${successCount}/${totalCount}`);
  console.log(`❌ Failed logins: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log('🎉 All demo accounts are working correctly!');
    console.log('\n📋 Next Steps:');
    console.log('   • Use admin@bongflavours.com to access admin features');
    console.log('   • Use any customer account to test ordering and bookings');
    console.log('   • Try the complete order flow: login → order → payment → invoice');
  } else {
    console.log('⚠️  Some accounts failed. Check your server and database connection.');
  }
}

// Check if we're in Node.js environment
if (typeof window === 'undefined') {
  // Node.js environment - check for fetch polyfill
  if (typeof fetch === 'undefined') {
    console.log('❌ fetch is not available. Install node-fetch or use a browser to run this test.');
    console.log('   Or copy this code into your browser console with the dev server running.');
  } else {
    testAllAccounts();
  }
} else {
  // Browser environment
  testAllAccounts();
}

// Export for manual use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testAllAccounts, testLogin };
}
