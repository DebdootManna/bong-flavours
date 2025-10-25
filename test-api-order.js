require('dotenv').config({ path: '.env.local' });

async function testOrderAPI() {
  console.log('🧪 Testing Order API');
  console.log('==================================================');

  const orderData = {
    items: [
      {
        menuItemId: "item_25",
        name: "Fish Cutlet (1 pcs)",
        price: 110,
        quantity: 1
      },
      {
        menuItemId: "item_26",
        name: "Fish Kobiraji",
        price: 210,
        quantity: 1
      }
    ],
    customerInfo: {
      name: "API Test Customer",
      email: "apitest@example.com",
      phone: "7777777777",
      address: "API Test Address, Test City"
    },
    deliveryInfo: {
      address: "API Test Address, Test City",
      phone: "7777777777",
      deliveryNotes: "API test order"
    },
    paymentMethod: "cod",
    notes: "Test order via API"
  };

  try {
    console.log('📝 Making API request to create order...');
    console.log('🔗 URL: http://localhost:3000/api/orders');
    console.log('📦 Payload:', JSON.stringify(orderData, null, 2));

    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: In a real scenario, you'd need a valid JWT token
        // For testing, the API should handle missing auth gracefully
      },
      body: JSON.stringify(orderData)
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Order created successfully!');
      console.log('📄 Response:', JSON.stringify(result, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Order creation failed');
      console.log('📄 Error response:', errorText);

      try {
        const errorJson = JSON.parse(errorText);
        console.log('🔍 Parsed error:', JSON.stringify(errorJson, null, 2));
      } catch {
        console.log('🔍 Raw error text:', errorText);
      }
    }

  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.error('🔍 Full error:', error);
  }
}

// Alternative test with mock token
async function testOrderAPIWithMockAuth() {
  console.log('\n🔐 Testing Order API with Mock Auth');
  console.log('==================================================');

  // First, let's try to get a token or create a mock one
  const mockJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGZiYWM5MDc1Yjk4ZmI5ZGZlOWNmOTgiLCJlbWFpbCI6Im1hbm5hZGViZG9vdDAwN0BnbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.mock_signature';

  const orderData = {
    items: [
      {
        menuItemId: "item_25",
        name: "Fish Cutlet (1 pcs)",
        price: 110,
        quantity: 1
      }
    ],
    customerInfo: {
      name: "Auth Test Customer",
      email: "authtest@example.com",
      phone: "6666666666",
      address: "Auth Test Address, Test City"
    },
    deliveryInfo: {
      address: "Auth Test Address, Test City",
      phone: "6666666666",
      deliveryNotes: "Auth test order"
    },
    paymentMethod: "cod",
    notes: "Test order with auth"
  };

  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockJWT}`,
      },
      body: JSON.stringify(orderData)
    });

    console.log('📡 Response status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Authenticated order created successfully!');
      console.log('📄 Response:', JSON.stringify(result, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Authenticated order creation failed');
      console.log('📄 Error response:', errorText);
    }

  } catch (error) {
    console.error('❌ Auth test error:', error.message);
  }
}

// Test helper endpoints
async function testHelperEndpoints() {
  console.log('\n🔧 Testing Helper Endpoints');
  console.log('==================================================');

  const endpoints = [
    '/api/debug',
    '/api/test-auth',
    '/api/email-debug'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing ${endpoint}...`);
      const response = await fetch(`http://localhost:3000${endpoint}`);
      console.log(`📊 Status: ${response.status}`);

      if (response.ok) {
        const result = await response.text();
        console.log(`✅ ${endpoint} responded:`);
        console.log(result.substring(0, 200) + (result.length > 200 ? '...' : ''));
      } else {
        console.log(`❌ ${endpoint} failed with status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} error:`, error.message);
    }
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive API tests...\n');

  await testHelperEndpoints();
  await testOrderAPI();
  await testOrderAPIWithMockAuth();

  console.log('\n✅ All tests completed!');
}

runAllTests().catch(console.error);
