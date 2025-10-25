require('dotenv').config({ path: '.env.local' });

async function testOrderAPI() {
  console.log('🎯 Testing Complete Order API Flow');
  console.log('===================================');

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
      email: "apitest@bongflavours.com",
      phone: "9876543210",
      address: "123 Test Street, API City, Test State 12345"
    },
    deliveryInfo: {
      address: "123 Test Street, API City, Test State 12345",
      phone: "9876543210",
      deliveryNotes: "Please call before delivery - API test order"
    },
    paymentMethod: "cod",
    notes: "Complete API test order - PDF and email should work"
  };

  try {
    console.log('📝 Preparing order request...');
    console.log('🔗 Target URL: http://localhost:3000/api/orders');
    console.log('📦 Order items:', orderData.items.length);
    console.log('👤 Customer:', orderData.customerInfo.name);

    const startTime = Date.now();

    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Note: For testing without authentication
        // In production, you'd need a valid JWT token
      },
      body: JSON.stringify(orderData)
    });

    const requestTime = Date.now() - startTime;

    console.log(`⏱️ Request completed in ${requestTime}ms`);
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const result = await response.json();

      console.log('\n🎉 ORDER CREATED SUCCESSFULLY!');
      console.log('==============================');
      console.log(`📋 Order ID: ${result.orderNumber || result.orderId || 'N/A'}`);
      console.log(`💰 Total Amount: ₹${result.total || 'N/A'}`);
      console.log(`📧 Invoice Generated: ${result.invoiceGenerated ? '✅ YES' : '❌ NO'}`);
      console.log(`📮 Emails Sent: ${result.emailsSent ? '✅ YES' : '❌ NO'}`);

      if (result.message) {
        console.log(`💬 Message: ${result.message}`);
      }

      if (result.invoiceGenerated) {
        console.log('\n📄 INVOICE DETAILS:');
        console.log('===================');
        console.log('✅ PDF generation successful');
        console.log('✅ Invoice attached to emails');
        console.log('🎯 System is fully operational!');
      } else {
        console.log('\n⚠️ INVOICE STATUS:');
        console.log('==================');
        console.log('❌ PDF generation had issues');
        console.log('💡 Check server logs for details');
        console.log('💡 HTML fallback should be available');
      }

      if (result.emailsSent) {
        console.log('\n📧 EMAIL STATUS:');
        console.log('================');
        console.log('✅ Restaurant notification sent');
        console.log('✅ Customer confirmation sent');
        console.log('📬 Check your email inbox (or Mailtrap)');
      }

      console.log('\n📊 FULL RESPONSE:');
      console.log('=================');
      console.log(JSON.stringify(result, null, 2));

    } else {
      console.log('\n❌ ORDER CREATION FAILED');
      console.log('=========================');

      const errorText = await response.text();
      console.log(`📄 Error response: ${errorText}`);

      try {
        const errorJson = JSON.parse(errorText);
        console.log('🔍 Parsed error details:');
        console.log(JSON.stringify(errorJson, null, 2));

        if (errorJson.details) {
          console.log('\n🚨 Specific Issues:');
          console.log(errorJson.details);
        }
      } catch {
        console.log('🔍 Raw error text:', errorText);
      }

      // Provide troubleshooting guidance
      console.log('\n💡 TROUBLESHOOTING:');
      console.log('===================');
      if (response.status === 401) {
        console.log('🔐 Authentication issue - check JWT token');
      } else if (response.status === 400) {
        console.log('📝 Invalid request data - check order format');
      } else if (response.status === 500) {
        console.log('🖥️ Server error - check server logs');
        console.log('🔧 Common causes: MongoDB connection, SMTP issues, PDF generation');
      } else if (response.status === 404) {
        console.log('🔍 API endpoint not found - check server is running');
      }
    }

  } catch (error) {
    console.error('\n💥 NETWORK ERROR');
    console.error('=================');
    console.error('❌ Failed to connect to server');
    console.error(`🔍 Error: ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 SOLUTION:');
      console.error('============');
      console.error('🚀 Start the development server:');
      console.error('   npm run dev');
      console.error('⏱️ Wait for "Ready" message');
      console.error('🔄 Then run this test again');
    }
  }
}

// Helper function to test server availability
async function testServerHealth() {
  console.log('🏥 Testing Server Health...');

  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Server is running and responsive');
      return true;
    } else {
      console.log(`⚠️ Server responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Server is not accessible');
    console.log(`🔍 Error: ${error.message}`);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🧪 Bong Flavours API Test Suite');
  console.log('================================\n');

  // Check server health first
  const serverOk = await testServerHealth();

  if (!serverOk) {
    console.log('\n🛑 Cannot proceed - server is not running');
    console.log('💡 Please start the server with: npm run dev');
    process.exit(1);
  }

  console.log(''); // Add spacing

  // Run the order test
  await testOrderAPI();

  console.log('\n🏁 Test completed!');
  console.log('==================');
  console.log('📊 Check the results above');
  console.log('📋 If successful, check your email and server logs');
  console.log('🎯 If failed, follow the troubleshooting guidance');
}

// Execute the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testOrderAPI, testServerHealth };
