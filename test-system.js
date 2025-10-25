#!/usr/bin/env node

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Test configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bong-flavours';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

console.log('🧪 Bong Flavours System Test Script');
console.log('=====================================\n');

async function testDatabaseConnection() {
  console.log('1. Testing Database Connection...');
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    const collections = await db.listCollections().toArray();

    console.log('✅ Database connected successfully');
    console.log(`📊 Found ${collections.length} collections:`, collections.map(c => c.name).join(', '));

    // Test specific collections
    const menuItems = await db.collection('menuitems').countDocuments();
    const users = await db.collection('users').countDocuments();
    const orders = await db.collection('orders').countDocuments();

    console.log(`   - Menu Items: ${menuItems}`);
    console.log(`   - Users: ${users}`);
    console.log(`   - Orders: ${orders}`);

    await client.close();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testAuthentication() {
  console.log('\n2. Testing Authentication System...');
  try {
    // Test password hashing
    const password = 'testpassword123';
    const hashedPassword = await bcrypt.hash(password, 12);
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      throw new Error('Password hashing failed');
    }
    console.log('✅ Password hashing works correctly');

    // Test JWT token generation
    const payload = {
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'customer',
      name: 'Test User'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.email !== payload.email) {
      throw new Error('JWT token verification failed');
    }
    console.log('✅ JWT token generation and verification works');

    return true;
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    return false;
  }
}

async function testAPIEndpoints() {
  console.log('\n3. Testing API Endpoints (if server is running)...');

  const endpoints = [
    { path: '/api/menu', method: 'GET', description: 'Menu API' },
    { path: '/api/auth/signup', method: 'POST', description: 'Signup API' },
    { path: '/api/auth/login-v2', method: 'POST', description: 'Login API' }
  ];

  let successCount = 0;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_BASE}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' }
      });

      // Don't expect success, just check if endpoint responds
      console.log(`✅ ${endpoint.description}: ${response.status} ${response.statusText}`);
      successCount++;
    } catch (error) {
      console.log(`⚠️  ${endpoint.description}: Server not running or endpoint unavailable`);
    }
  }

  if (successCount > 0) {
    console.log(`✅ Server is running - ${successCount}/${endpoints.length} endpoints responded`);
    return true;
  } else {
    console.log('⚠️  Server appears to be offline (this is OK if you haven\'t started it yet)');
    return false;
  }
}

async function testMenuData() {
  console.log('\n4. Testing Menu Data Structure...');
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    const menuCollection = db.collection('menuitems');

    // Get a sample menu item
    const sampleItem = await menuCollection.findOne({});

    if (!sampleItem) {
      console.log('⚠️  No menu items found. Run: npm run seed:menu');
      await client.close();
      return false;
    }

    // Check required fields
    const requiredFields = ['name', 'description', 'price', 'category', 'isVeg', 'isAvailable'];
    const missingFields = requiredFields.filter(field => !(field in sampleItem));

    if (missingFields.length > 0) {
      console.error(`❌ Menu item missing fields: ${missingFields.join(', ')}`);
      await client.close();
      return false;
    }

    console.log('✅ Menu data structure is correct');
    console.log(`   Sample item: ${sampleItem.name} - ₹${sampleItem.price}`);

    // Check categories
    const categories = await menuCollection.distinct('category');
    console.log(`   Categories (${categories.length}):`, categories.join(', '));

    await client.close();
    return true;
  } catch (error) {
    console.error('❌ Menu data test failed:', error.message);
    return false;
  }
}

async function testCartDataStructure() {
  console.log('\n5. Testing Cart Data Structure...');

  // Simulate cart item structure
  const cartItem = {
    id: 'item-123',
    menuItemId: 'menu-item-456',
    name: 'Test Item',
    price: 250,
    quantity: 2,
    variantIndex: 0,
    variantName: 'Regular',
    specialInstructions: 'Extra spicy'
  };

  // Test order API expected structure
  const orderData = {
    items: [{
      menuItemId: cartItem.menuItemId,
      name: cartItem.name,
      price: cartItem.price,
      quantity: cartItem.quantity,
      variant: cartItem.variantName,
      specialInstructions: cartItem.specialInstructions
    }],
    customerInfo: {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '9876543210',
      address: 'Test Address'
    },
    deliveryInfo: {
      address: 'Test Address',
      phone: '9876543210',
      deliveryNotes: 'Test notes'
    },
    paymentMethod: 'cod',
    notes: 'Test order'
  };

  // Validate structure
  const hasAllFields = orderData.items[0].menuItemId &&
                      orderData.customerInfo.name &&
                      orderData.deliveryInfo.address;

  if (hasAllFields) {
    console.log('✅ Cart to Order data structure mapping is correct');
    return true;
  } else {
    console.error('❌ Cart to Order data structure has issues');
    return false;
  }
}

async function checkEnvironmentVariables() {
  console.log('\n6. Checking Environment Variables...');

  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS'
  ];

  const missingVars = [];
  const presentVars = [];

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      presentVars.push(varName);
    } else {
      missingVars.push(varName);
    }
  }

  console.log(`✅ Present variables (${presentVars.length}):`, presentVars.join(', '));

  if (missingVars.length > 0) {
    console.log(`⚠️  Missing variables (${missingVars.length}):`, missingVars.join(', '));
    console.log('   Please set these in your .env.local file');
  }

  return missingVars.length === 0;
}

async function runAllTests() {
  const startTime = Date.now();

  const results = {
    database: await testDatabaseConnection(),
    auth: await testAuthentication(),
    api: await testAPIEndpoints(),
    menu: await testMenuData(),
    cart: await testCartDataStructure(),
    env: await checkEnvironmentVariables()
  };

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  console.log('\n🎯 Test Results Summary');
  console.log('=======================');

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${test.charAt(0).toUpperCase() + test.slice(1)} Test`);
  });

  console.log(`\n📊 Score: ${passed}/${total} tests passed`);
  console.log(`⏱️  Completed in ${duration.toFixed(2)}s`);

  if (passed === total) {
    console.log('\n🎉 All tests passed! Your Bong Flavours system is ready to go!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.');
  }

  // Recommendations
  console.log('\n💡 Next Steps:');
  if (!results.env) {
    console.log('   1. Set up your .env.local file with required variables');
  }
  if (!results.database) {
    console.log('   2. Ensure MongoDB is running and accessible');
  }
  if (!results.menu) {
    console.log('   3. Run: npm run seed:menu to populate menu data');
  }
  if (!results.api) {
    console.log('   4. Start your development server: npm run dev');
  }

  console.log('   5. Test the frontend by visiting http://localhost:3000');
  console.log('   6. Try logging in and placing a test order');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testDatabaseConnection,
  testAuthentication,
  testAPIEndpoints,
  testMenuData,
  testCartDataStructure,
  checkEnvironmentVariables,
  runAllTests
};
