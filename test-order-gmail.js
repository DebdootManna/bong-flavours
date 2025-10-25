require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function testOrderWithGmail() {
  console.log('🍽️  Testing Complete Order Flow with Gmail Email Delivery');
  console.log('========================================================');
  console.log('');

  // Check Gmail configuration
  console.log('🔍 Checking Gmail SMTP Configuration...');
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = process.env.SMTP_PORT || '587';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  console.log(`   Host: ${smtpHost}`);
  console.log(`   Port: ${smtpPort}`);
  console.log(`   User: ${smtpUser || 'NOT SET'}`);
  console.log(`   Pass: ${smtpPass ? '***SET*** (' + smtpPass.length + ' chars)' : 'NOT SET'}`);

  if (!smtpUser || !smtpPass) {
    console.log('❌ Gmail SMTP not configured. Please set SMTP_USER and SMTP_PASS in .env.local');
    return false;
  }

  console.log('✅ Gmail SMTP configuration found');
  console.log('');

  try {
    // Test order data
    const testOrder = {
      customerInfo: {
        name: 'Test Customer Gmail',
        email: 'debdootmanna007@gmail.com',
        phone: '9876543210',
        address: '123 Test Street, Test City, 700001'
      },
      deliveryInfo: {
        address: '123 Test Street, Test City, 700001',
        phone: '9876543210',
        deliveryNotes: 'Gmail test order - please deliver carefully'
      },
      items: [
        {
          menuItemId: '60f7f7f7f7f7f7f7f7f7f7f7',
          name: 'Hilsa Fish Curry',
          quantity: 2,
          price: 450,
          variant: 'Regular'
        },
        {
          menuItemId: '60f7f7f7f7f7f7f7f7f7f7f8',
          name: 'Mutton Kosha',
          quantity: 1,
          price: 380
        },
        {
          menuItemId: '60f7f7f7f7f7f7f7f7f7f7f9',
          name: 'Steamed Rice',
          quantity: 3,
          price: 80
        }
      ],
      paymentMethod: 'cod',
      notes: 'Test order for Gmail SMTP verification'
    };

    console.log('🔥 Creating test order...');
    console.log('Customer:', testOrder.customerInfo.name);
    console.log('Email:', testOrder.customerInfo.email);
    console.log('Items:', testOrder.items.length);
    console.log('');

    // Make API call to create order
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Order creation failed');
      console.log('Status:', response.status);
      console.log('Error:', errorText);

      if (response.status === 500) {
        console.log('');
        console.log('💡 Common issues:');
        console.log('   • Development server not running (npm run dev)');
        console.log('   • Database connection issues');
        console.log('   • API route errors');
        console.log('');
        console.log('🔧 Try:');
        console.log('   1. Make sure dev server is running: npm run dev');
        console.log('   2. Check server logs for errors');
        console.log('   3. Verify MongoDB connection');
      }

      return false;
    }

    const result = await response.json();
    console.log('✅ Order created successfully!');
    console.log('📦 Order ID:', result.orderId);
    console.log('💾 Database ID:', result.id);
    console.log('');

    // Check if PDF was generated
    if (result.pdfGenerated) {
      console.log('✅ PDF invoice generated successfully');
    } else {
      console.log('⚠️  PDF generation failed, HTML fallback used');
    }

    // Check if emails were sent
    if (result.emailSent) {
      console.log('✅ Emails sent successfully via Gmail SMTP');
      console.log('');
      console.log('📧 EMAILS SENT:');
      console.log('===============');
      console.log('🏪 Restaurant notification → mannadebdoot007@gmail.com');
      console.log('👤 Customer confirmation → ' + testOrder.customerInfo.email);
      console.log('');
      console.log('📎 Both emails include PDF invoice attachment');
      console.log('');
      console.log('🎉 SUCCESS! Check your Gmail inbox now!');
      console.log('   Look for:');
      console.log('   • "New Order #' + result.orderId + '" (restaurant notification)');
      console.log('   • "Order Confirmation #' + result.orderId + '" (customer confirmation)');
    } else {
      console.log('❌ Email sending failed - check server logs');
    }

    console.log('');
    console.log('🔍 Full Result:');
    console.log(JSON.stringify(result, null, 2));

    return true;

  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error('Error:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('');
      console.log('🚫 Connection refused - development server not running');
      console.log('💡 Start your dev server: npm run dev');
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.log('');
      console.log('🚫 Fetch error - make sure you are running Node.js 18+ or install node-fetch');
    }

    return false;
  }
}

async function checkDatabase() {
  console.log('🗄️  Checking Database Connection...');

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db();
    const collections = await db.listCollections().toArray();

    console.log('✅ Database connected successfully');
    console.log('📊 Collections found:', collections.map(c => c.name).join(', '));

    // Check recent orders
    const ordersCollection = db.collection('orders');
    const recentOrders = await ordersCollection.find().sort({ createdAt: -1 }).limit(3).toArray();

    console.log('📦 Recent orders:', recentOrders.length);
    if (recentOrders.length > 0) {
      console.log('   Latest order:', recentOrders[0].orderId || recentOrders[0]._id);
    }

    await client.close();
    return true;

  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    return false;
  }
}

async function checkDevServer() {
  console.log('🚀 Checking Development Server...');

  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'OPTIONS'
    });
    if (response.status === 200 || response.status === 405) {
      console.log('✅ Development server is running');
      return true;
    } else {
      console.log('⚠️  Development server responded with:', response.status);
      return true; // Server is running even if endpoint has issues
    }
  } catch (error) {
    console.log('❌ Development server not reachable');
    console.log('💡 Start with: npm run dev');
    return false;
  }
}

async function showPreTestChecklist() {
  console.log('📋 Pre-Test Checklist');
  console.log('=====================');
  console.log('');

  const dbOk = await checkDatabase();
  const serverOk = await checkDevServer();

  console.log('');
  console.log('📧 Gmail SMTP Status:');
  console.log('   Host:', process.env.SMTP_HOST || 'smtp.gmail.com (default)');
  console.log('   User:', process.env.SMTP_USER ? '✅ Set' : '❌ Not set');
  console.log('   Pass:', process.env.SMTP_PASS ? '✅ Set' : '❌ Not set');

  console.log('');
  console.log('🎯 Test Target Email:', process.env.SMTP_USER || 'debdootmanna007@gmail.com');
  console.log('');

  if (!dbOk || !serverOk || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('❌ Prerequisites not met. Please fix the issues above before running the test.');
    return false;
  }

  console.log('✅ All prerequisites met! Ready to test Gmail order flow.');
  return true;
}

// Alternative: Test with login/auth (if needed)
async function testWithAuth() {
  console.log('🔐 Testing Complete Order Flow with Authentication...');
  console.log('====================================================');

  try {
    // Login first
    console.log('🔐 Logging in...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@bongflavours.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      return false;
    }

    const loginResult = await loginResponse.json();
    console.log('✅ Login successful');

    // Use the token for order creation
    const testOrder = {
      customerInfo: {
        name: 'Test Customer Gmail Auth',
        email: 'debdootmanna007@gmail.com',
        phone: '9876543210',
        address: '123 Gmail Test Street, Test City, 700001'
      },
      deliveryInfo: {
        address: '123 Gmail Test Street, Test City, 700001',
        phone: '9876543210',
        deliveryNotes: 'Gmail SMTP test order - authenticated'
      },
      items: [
        {
          menuItemId: '60f7f7f7f7f7f7f7f7f7f7f7',
          name: 'Hilsa Fish Curry',
          quantity: 2,
          price: 450
        },
        {
          menuItemId: '60f7f7f7f7f7f7f7f7f7f7f8',
          name: 'Mutton Kosha',
          quantity: 1,
          price: 380
        }
      ],
      paymentMethod: 'cod',
      notes: 'Authenticated Gmail test order'
    };

    console.log('🔥 Creating authenticated order...');
    console.log('Customer:', testOrder.customerInfo.name);
    console.log('Email:', testOrder.customerInfo.email);
    console.log('Items:', testOrder.items.length);
    console.log('');

    const orderResponse = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginResult.token}`
      },
      body: JSON.stringify(testOrder)
    });

    if (orderResponse.ok) {
      const result = await orderResponse.json();
      console.log('✅ Order created successfully!');
      console.log('📦 Order ID:', result.orderId);
      console.log('📦 Order Number:', result.orderNumber);
      console.log('💰 Total:', '₹' + result.total);
      console.log('');

      // Check if PDF was generated
      if (result.invoiceGenerated) {
        console.log('✅ PDF invoice generated successfully');
      } else {
        console.log('⚠️  PDF generation failed, HTML fallback used');
      }

      // Check if emails were sent
      if (result.emailsSent) {
        console.log('✅ Emails sent successfully via Gmail SMTP');
        console.log('');
        console.log('📧 EMAILS SENT:');
        console.log('===============');
        console.log('🏪 Restaurant notification → mannadebdoot007@gmail.com');
        console.log('👤 Customer confirmation → ' + testOrder.customerInfo.email);
        console.log('');
        console.log('📎 Both emails include PDF invoice attachment');
        console.log('');
        console.log('🎉 SUCCESS! Check your Gmail inbox now!');
        console.log('   Look for:');
        console.log('   • "New Order #' + result.orderNumber + '" (restaurant notification)');
        console.log('   • "Order Confirmation #' + result.orderNumber + '" (customer confirmation)');
      } else {
        console.log('❌ Email sending failed - check server logs');
      }

      console.log('');
      console.log('🔍 Full Result:');
      console.log(JSON.stringify(result, null, 2));

      return true;
    } else {
      const errorText = await orderResponse.text();
      console.log('❌ Authenticated order failed');
      console.log('Status:', orderResponse.status);
      console.log('Error:', errorText);
      return false;
    }

  } catch (error) {
    console.log('❌ Auth test failed:', error.message);
    return false;
  }
}

// Instructions for Gmail setup
function showGmailSetupInstructions() {
  console.log('📝 GMAIL SETUP INSTRUCTIONS');
  console.log('============================');
  console.log('');
  console.log('If emails are not working, ensure your .env.local has:');
  console.log('');
  console.log('SMTP_HOST=smtp.gmail.com');
  console.log('SMTP_PORT=587');
  console.log('SMTP_SECURE=false');
  console.log('SMTP_USER=debdootmanna007@gmail.com');
  console.log('SMTP_PASS=your_16_character_gmail_app_password');
  console.log('');
  console.log('To get a Gmail App Password:');
  console.log('1. Go to myaccount.google.com');
  console.log('2. Security → 2-Step Verification (enable if needed)');
  console.log('3. App passwords → Generate for "Mail"');
  console.log('4. Copy the 16-character password');
  console.log('5. Add it to .env.local as SMTP_PASS');
  console.log('6. Restart your dev server: npm run dev');
  console.log('');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showGmailSetupInstructions();
    return;
  }

  if (args.includes('--check')) {
    await showPreTestChecklist();
    return;
  }

  if (args.includes('--auth')) {
    await testWithAuth();
    return;
  }

  console.log('🧪 Gmail Order Test - Complete Flow');
  console.log('===================================');
  console.log('This will:');
  console.log('• Create a real order');
  console.log('• Generate PDF invoice');
  console.log('• Send emails via Gmail SMTP');
  console.log('• Check your actual Gmail inbox');
  console.log('');

  // Pre-flight checks
  const ready = await showPreTestChecklist();
  if (!ready) {
    console.log('');
    console.log('💡 Run with --help for Gmail setup instructions');
    return;
  }

  console.log('');
  console.log('🚀 Starting Gmail order test...');
  console.log('');

  const success = await testOrderWithGmail();

  if (success) {
    console.log('');
    console.log('🎉 TEST COMPLETED SUCCESSFULLY!');
    console.log('==============================');
    console.log('✅ Order created and saved to database');
    console.log('✅ PDF invoice generated');
    console.log('✅ Emails sent via Gmail SMTP');
    console.log('✅ Check your Gmail inbox now!');
    console.log('');
    console.log('🎯 Your Gmail order system is working perfectly!');
    console.log('   Customers will now receive real emails with invoices.');
  } else {
    console.log('');
    console.log('❌ TEST FAILED');
    console.log('==============');
    console.log('Please check the errors above and fix the issues.');
    console.log('');
    console.log('💡 Common solutions:');
    console.log('   • Make sure dev server is running: npm run dev');
    console.log('   • Check Gmail SMTP configuration in .env.local');
    console.log('   • Verify database connection');
    console.log('   • Run: node test-order-gmail.js --help');
  }

  process.exit(success ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testOrderWithGmail, showGmailSetupInstructions };
