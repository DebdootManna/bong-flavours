// Test script for Bong Flavours Database System
// This script tests all the implemented MongoDB functionality

const API_BASE = 'http://localhost:3000/api';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@bongflavours.com',
  phone: '9876543210',
  password: 'testpassword123'
};

const testOrder = {
  items: [
    {
      menuItemId: '6750a6b8b85f123456789001',
      name: 'Kosha Mangsho',
      price: 350,
      quantity: 2,
      specialInstructions: 'Medium spicy'
    },
    {
      menuItemId: '6750a6b8b85f123456789002', 
      name: 'Steamed Rice',
      price: 80,
      quantity: 2
    }
  ],
  customerInfo: {
    name: 'Test Customer',
    email: 'customer@test.com',
    phone: '9876543210',
    address: '123 Test Street, Kolkata'
  },
  deliveryInfo: {
    address: '123 Test Street, Kolkata',
    phone: '9876543210',
    deliveryNotes: 'Please call on arrival'
  },
  paymentMethod: 'cod',
  notes: 'Test order for database verification'
};

const testBooking = {
  name: 'Test Booker',
  email: 'booker@test.com',
  phone: '9876543210',
  date: '2025-01-15',
  time: '19:30',
  numPersons: 4,
  notes: 'Window seat preferred'
};

let authToken = null;
let testOrderId = null;
let testBookingId = null;

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null, useAuth = false) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (useAuth && authToken) {
    options.headers['Cookie'] = `auth-token=${authToken}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();
    
    return {
      status: response.status,
      data: result,
      success: response.ok
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: error.message },
      success: false
    };
  }
}

// Test functions
async function testUserRegistration() {
  console.log('🧪 Testing User Registration...');
  
  const result = await apiRequest('/auth/signup', 'POST', testUser);
  
  if (result.success) {
    console.log('✅ User registration successful');
    console.log(`   User ID: ${result.data.user?.id}`);
    
    // Extract auth token from response headers (in real implementation)
    // For now, we'll use the login endpoint
    return true;
  } else {
    console.log('❌ User registration failed:', result.data.message);
    return false;
  }
}

async function testUserLogin() {
  console.log('🧪 Testing User Login...');
  
  const loginData = {
    email: testUser.email,
    password: testUser.password
  };
  
  const result = await apiRequest('/auth/login', 'POST', loginData);
  
  if (result.success) {
    console.log('✅ User login successful');
    console.log(`   User: ${result.data.user?.name}`);
    console.log(`   Role: ${result.data.user?.role}`);
    
    // In a real test, we'd extract the cookie
    // For now, we'll simulate having the token
    authToken = 'simulated-jwt-token';
    return true;
  } else {
    console.log('❌ User login failed:', result.data.message);
    return false;
  }
}

async function testMenuAPI() {
  console.log('🧪 Testing Menu API...');
  
  const result = await apiRequest('/menu');
  
  if (result.success && result.data.length > 0) {
    console.log('✅ Menu API working');
    console.log(`   Found ${result.data.length} menu items`);
    console.log(`   First item: ${result.data[0]?.name}`);
    return true;
  } else {
    console.log('❌ Menu API failed:', result.data.message);
    return false;
  }
}

async function testOrderCreation() {
  console.log('🧪 Testing Order Creation...');
  
  const result = await apiRequest('/orders', 'POST', testOrder, true);
  
  if (result.success) {
    console.log('✅ Order creation successful');
    console.log(`   Order Number: ${result.data.order?.orderNumber}`);
    console.log(`   Total: ₹${result.data.order?.total}`);
    testOrderId = result.data.order?._id;
    return true;
  } else {
    console.log('❌ Order creation failed:', result.data.message);
    return false;
  }
}

async function testOrderRetrieval() {
  console.log('🧪 Testing Order Retrieval...');
  
  const result = await apiRequest('/orders', 'GET', null, true);
  
  if (result.success) {
    console.log('✅ Order retrieval successful');
    console.log(`   Found ${result.data.orders?.length || 0} orders`);
    if (result.data.pagination) {
      console.log(`   Pagination: ${result.data.pagination.current}/${result.data.pagination.pages}`);
    }
    return true;
  } else {
    console.log('❌ Order retrieval failed:', result.data.message);
    return false;
  }
}

async function testBookingCreation() {
  console.log('🧪 Testing Booking Creation...');
  
  const result = await apiRequest('/bookings', 'POST', testBooking);
  
  if (result.success) {
    console.log('✅ Booking creation successful');
    console.log(`   Booking for: ${result.data.booking?.name}`);
    console.log(`   Date/Time: ${result.data.booking?.date} ${result.data.booking?.time}`);
    console.log(`   Persons: ${result.data.booking?.numPersons}`);
    testBookingId = result.data.booking?._id;
    return true;
  } else {
    console.log('❌ Booking creation failed:', result.data.message);
    return false;
  }
}

async function testBookingRetrieval() {
  console.log('🧪 Testing Booking Retrieval...');
  
  const result = await apiRequest('/bookings', 'GET', null, true);
  
  if (result.success) {
    console.log('✅ Booking retrieval successful');
    console.log(`   Found ${result.data.bookings?.length || 0} bookings`);
    return true;
  } else {
    console.log('❌ Booking retrieval failed:', result.data.message);
    return false;
  }
}

async function testPaymentProcessing() {
  console.log('🧪 Testing Payment Processing...');
  
  if (!testOrderId) {
    console.log('❌ No test order ID available');
    return false;
  }
  
  const paymentData = {
    orderId: testOrderId,
    paymentMethod: 'cod',
    paymentStatus: 'paid'
  };
  
  const result = await apiRequest('/payments/confirm', 'POST', paymentData, true);
  
  if (result.success) {
    console.log('✅ Payment processing successful');
    console.log(`   Order Status: ${result.data.order?.status}`);
    console.log(`   Payment Status: ${result.data.order?.paymentStatus}`);
    return true;
  } else {
    console.log('❌ Payment processing failed:', result.data.message);
    return false;
  }
}

async function testInvoiceGeneration() {
  console.log('🧪 Testing Invoice Generation...');
  
  if (!testOrderId) {
    console.log('❌ No test order ID available');
    return false;
  }
  
  const result = await apiRequest(`/invoices/${testOrderId}`, 'GET', null, true);
  
  if (result.status === 200) {
    console.log('✅ Invoice generation successful');
    return true;
  } else {
    console.log('❌ Invoice generation failed:', result.data.message);
    return false;
  }
}

// Main test runner
async function runDatabaseTests() {
  console.log('🚀 Starting Bong Flavours Database System Tests\n');
  
  const tests = [
    { name: 'Menu API', fn: testMenuAPI },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Order Creation', fn: testOrderCreation },
    { name: 'Order Retrieval', fn: testOrderRetrieval },
    { name: 'Booking Creation', fn: testBookingCreation },
    { name: 'Booking Retrieval', fn: testBookingRetrieval },
    { name: 'Payment Processing', fn: testPaymentProcessing },
    { name: 'Invoice Generation', fn: testInvoiceGeneration }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} threw an error:`, error.message);
      failed++;
    }
    console.log(''); // Empty line for readability
  }
  
  console.log('📊 Test Results Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('🎉 All database tests passed! The system is ready for production.');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runDatabaseTests };
} else {
  // Run tests immediately if in browser
  runDatabaseTests();
}
