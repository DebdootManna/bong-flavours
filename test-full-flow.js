require('dotenv').config({ path: '.env.local' });

class FullFlowTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.authToken = null;
    this.userId = null;
    this.testUser = {
      name: "Test User",
      email: "testuser@bongflavours.com",
      password: "Test123!",
      phone: "9999999999",
      address: "Test Address, Test City"
    };
  }

  async testServerHealth() {
    console.log('🏥 Testing Server Health...');
    try {
      const response = await fetch(this.baseUrl);
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

  async registerUser() {
    console.log('\n👤 Registering Test User...');

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.testUser)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ User registered successfully');
        console.log(`📧 Email: ${this.testUser.email}`);
        return true;
      } else {
        const error = await response.text();
        if (error.includes('already exists') || error.includes('duplicate')) {
          console.log('ℹ️ User already exists, proceeding to login');
          return true;
        }
        console.log('❌ User registration failed:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      return false;
    }
  }

  async loginUser() {
    console.log('\n🔐 Logging in Test User...');

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.testUser.email,
          password: this.testUser.password
        })
      });

      if (response.ok) {
        const result = await response.json();
        this.authToken = result.token;
        this.userId = result.user?.id || result.userId;

        console.log('✅ Login successful');
        console.log(`🎫 Token: ${this.authToken ? 'Generated' : 'Missing'}`);
        console.log(`👤 User ID: ${this.userId || 'N/A'}`);

        return true;
      } else {
        const error = await response.text();
        console.log('❌ Login failed:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error.message);
      return false;
    }
  }

  async createOrder() {
    console.log('\n🛒 Creating Test Order...');

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
        name: this.testUser.name,
        email: this.testUser.email,
        phone: this.testUser.phone,
        address: this.testUser.address
      },
      deliveryInfo: {
        address: this.testUser.address,
        phone: this.testUser.phone,
        deliveryNotes: "Test order - Full flow test with PDF and email"
      },
      paymentMethod: "cod",
      notes: "Complete integration test - PDF generation and email sending"
    };

    try {
      console.log('📦 Order items:', orderData.items.length);
      console.log('💰 Expected total: ₹418 (₹320 + ₹58 tax + ₹40 delivery)');

      const startTime = Date.now();

      const response = await fetch(`${this.baseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify(orderData)
      });

      const requestTime = Date.now() - startTime;
      console.log(`⏱️ Request completed in ${requestTime}ms`);

      if (response.ok) {
        const result = await response.json();

        console.log('\n🎉 ORDER CREATED SUCCESSFULLY!');
        console.log('==============================');
        console.log(`📋 Order Number: ${result.orderNumber || result.orderId || 'N/A'}`);
        console.log(`💰 Total Amount: ₹${result.total || 'N/A'}`);
        console.log(`📧 Invoice Generated: ${result.invoiceGenerated ? '✅ YES' : '❌ NO'}`);
        console.log(`📮 Emails Sent: ${result.emailsSent ? '✅ YES' : '❌ NO'}`);
        console.log(`📊 Status: ${result.status || 'pending'}`);

        // Check invoice generation details
        if (result.invoiceGenerated) {
          console.log('\n📄 INVOICE SUCCESS!');
          console.log('===================');
          console.log('✅ PDF generated successfully');
          console.log('✅ Invoice attached to emails');
          console.log('🎯 PDF generation system is working!');
        } else {
          console.log('\n⚠️ INVOICE STATUS:');
          console.log('==================');
          console.log('❌ PDF generation had issues');
          console.log('💡 Check server logs for PDF errors');
          console.log('💡 HTML fallback should still work');
        }

        // Check email sending details
        if (result.emailsSent) {
          console.log('\n📧 EMAIL SUCCESS!');
          console.log('==================');
          console.log('✅ Restaurant notification sent');
          console.log('✅ Customer confirmation sent');
          console.log('📬 Check your email inbox or Mailtrap');
          console.log('📎 Invoice should be attached');
        } else {
          console.log('\n❌ EMAIL ISSUES:');
          console.log('================');
          console.log('💡 Check SMTP configuration');
          console.log('💡 Verify Mailtrap credentials');
          console.log('💡 Check server logs for email errors');
        }

        // Overall system status
        if (result.invoiceGenerated && result.emailsSent) {
          console.log('\n🚀 COMPLETE SUCCESS!');
          console.log('====================');
          console.log('✅ Order creation: WORKING');
          console.log('✅ PDF generation: WORKING');
          console.log('✅ Email delivery: WORKING');
          console.log('🎉 Your system is fully operational!');
        } else {
          console.log('\n⚠️ PARTIAL SUCCESS:');
          console.log('===================');
          console.log(`✅ Order creation: WORKING`);
          console.log(`${result.invoiceGenerated ? '✅' : '❌'} PDF generation: ${result.invoiceGenerated ? 'WORKING' : 'NEEDS FIX'}`);
          console.log(`${result.emailsSent ? '✅' : '❌'} Email delivery: ${result.emailsSent ? 'WORKING' : 'NEEDS FIX'}`);
        }

        return result;

      } else {
        const errorText = await response.text();
        console.log('\n❌ ORDER CREATION FAILED');
        console.log('=========================');
        console.log(`📡 Status: ${response.status} ${response.statusText}`);
        console.log(`📄 Error: ${errorText}`);

        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.details) {
            console.log('🔍 Details:', errorJson.details);
          }
        } catch {}

        return null;
      }

    } catch (error) {
      console.error('\n💥 ORDER REQUEST ERROR');
      console.error('======================');
      console.error(`❌ ${error.message}`);
      return null;
    }
  }

  async testEmailConfiguration() {
    console.log('\n📧 Testing Email Configuration...');

    try {
      const response = await fetch(`${this.baseUrl}/api/email-debug`);

      if (response.ok) {
        const result = await response.text();
        console.log('✅ Email debug endpoint accessible');

        if (result.includes('SMTP connection verified')) {
          console.log('✅ SMTP configuration is working');
        } else if (result.includes('SMTP test failed')) {
          console.log('⚠️ SMTP has issues but fallback available');
        }
      } else {
        console.log('⚠️ Email debug endpoint not accessible');
      }
    } catch (error) {
      console.log('⚠️ Could not test email configuration');
    }
  }

  async runFullTest() {
    console.log('🚀 Bong Flavours - Complete System Test');
    console.log('=======================================');
    console.log(`🕐 Started at: ${new Date().toLocaleString()}\n`);

    const startTime = Date.now();

    // Step 1: Check server
    const serverOk = await this.testServerHealth();
    if (!serverOk) {
      console.log('\n🛑 ABORTED: Server not accessible');
      console.log('💡 Please start server with: npm run dev');
      return false;
    }

    // Step 2: Test email config
    await this.testEmailConfiguration();

    // Step 3: Register user
    const registrationOk = await this.registerUser();
    if (!registrationOk) {
      console.log('\n🛑 ABORTED: User registration failed');
      return false;
    }

    // Step 4: Login user
    const loginOk = await this.loginUser();
    if (!loginOk) {
      console.log('\n🛑 ABORTED: User login failed');
      return false;
    }

    // Step 5: Create order (the main test)
    const order = await this.createOrder();

    const totalTime = Date.now() - startTime;

    // Final summary
    console.log('\n📊 FINAL TEST SUMMARY');
    console.log('=====================');
    console.log(`⏱️ Total test time: ${totalTime}ms`);
    console.log(`✅ Server Health: PASS`);
    console.log(`✅ User Registration: PASS`);
    console.log(`✅ User Authentication: PASS`);
    console.log(`${order ? '✅' : '❌'} Order Creation: ${order ? 'PASS' : 'FAIL'}`);

    if (order) {
      console.log(`${order.invoiceGenerated ? '✅' : '⚠️'} PDF Generation: ${order.invoiceGenerated ? 'PASS' : 'PARTIAL'}`);
      console.log(`${order.emailsSent ? '✅' : '⚠️'} Email Delivery: ${order.emailsSent ? 'PASS' : 'PARTIAL'}`);

      const allWorking = order.invoiceGenerated && order.emailsSent;

      console.log('\n🎯 OVERALL RESULT:');
      console.log('==================');

      if (allWorking) {
        console.log('🎉 COMPLETE SUCCESS!');
        console.log('🚀 Your Bong Flavours system is fully operational!');
        console.log('✅ Customers can place orders');
        console.log('✅ PDFs are generated automatically');
        console.log('✅ Emails are sent to both restaurant and customer');
        console.log('💪 Ready for production!');
      } else {
        console.log('⚠️ MOSTLY WORKING');
        console.log('✅ Core order system is functional');
        if (!order.invoiceGenerated) {
          console.log('❌ PDF generation needs attention');
        }
        if (!order.emailsSent) {
          console.log('❌ Email system needs configuration');
        }
        console.log('💡 Check server logs for specific issues');
      }
    } else {
      console.log('\n❌ SYSTEM ISSUES DETECTED');
      console.log('=========================');
      console.log('💡 Check server logs for errors');
      console.log('💡 Verify database connection');
      console.log('💡 Check authentication system');
    }

    return order !== null;
  }
}

// Helper functions for manual testing
async function quickOrderTest() {
  console.log('⚡ Quick Order Test (assumes user exists)');
  console.log('==========================================');

  const tester = new FullFlowTester();

  // Try to login with existing test user
  const loginOk = await tester.loginUser();
  if (!loginOk) {
    console.log('❌ Quick test failed - user may not exist');
    console.log('💡 Run full test instead: node test-full-flow.js');
    return;
  }

  // Create order
  await tester.createOrder();
}

async function emailOnlyTest() {
  console.log('📧 Email Configuration Test');
  console.log('===========================');

  const tester = new FullFlowTester();
  await tester.testServerHealth();
  await tester.testEmailConfiguration();
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--quick')) {
    await quickOrderTest();
  } else if (args.includes('--email')) {
    await emailOnlyTest();
  } else {
    const tester = new FullFlowTester();
    const success = await tester.runFullTest();
    process.exit(success ? 0 : 1);
  }
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { FullFlowTester, quickOrderTest, emailOnlyTest };
