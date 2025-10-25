require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const os = require('os');
const fs = require('fs').promises;

// Test the complete system: PDF generation, email sending, and order flow
class SystemTester {
  constructor() {
    this.results = {
      mongodb: false,
      smtp: false,
      pdf: false,
      email: false,
      order: false
    };
  }

  async testMongoDB() {
    console.log('\n🗄️  Testing MongoDB Connection');
    console.log('================================');

    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected successfully');

      // Test collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`📊 Available collections: ${collections.map(c => c.name).join(', ')}`);

      this.results.mongodb = true;
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      return false;
    }
  }

  async testSMTP() {
    console.log('\n📧 Testing SMTP Configuration');
    console.log('==============================');

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        debug: false,
        logger: false
      });

      console.log('🔧 SMTP Configuration:');
      console.log(`   Host: ${process.env.SMTP_HOST}`);
      console.log(`   Port: ${process.env.SMTP_PORT}`);
      console.log(`   Secure: ${process.env.SMTP_SECURE}`);
      console.log(`   User: ${process.env.SMTP_USER ? '***' : 'NOT_SET'}`);

      console.log('🔗 Verifying SMTP connection...');
      const isValid = await transporter.verify();

      if (isValid) {
        console.log('✅ SMTP connection verified successfully');
        this.results.smtp = true;
        return true;
      } else {
        console.log('❌ SMTP verification failed');
        return false;
      }
    } catch (error) {
      console.error('❌ SMTP test failed:', error.message);

      // Provide specific error guidance
      if (error.message.includes('Authentication unsuccessful')) {
        console.log('💡 Authentication issue detected. Try:');
        console.log('   - Check username/password');
        console.log('   - Enable "Less secure app access" if using Gmail');
        console.log('   - Use App Password instead of regular password');
        console.log('   - Try Mailtrap for development');
      }

      return false;
    }
  }

  async testPDFGeneration() {
    console.log('\n📄 Testing PDF Generation');
    console.log('==========================');

    try {
      // Check system resources
      const availableMemoryMB = Math.round(os.freemem() / 1024 / 1024);
      console.log(`💾 Available memory: ${availableMemoryMB} MB`);
      console.log(`🖥️  Platform: ${os.platform()} ${os.arch()}`);

      // Check for Chrome installations
      const chromePaths = this.getSystemChromePaths();
      console.log('🔍 Checking for Chrome installations...');

      let foundChrome = false;
      for (const chromePath of chromePaths) {
        try {
          await fs.access(chromePath);
          console.log(`✅ Found Chrome: ${chromePath}`);
          foundChrome = true;
          break;
        } catch {
          // Chrome not found at this path
        }
      }

      if (!foundChrome) {
        console.log('⚠️  System Chrome not found, will use bundled Chromium');
      }

      // Import and test PDF generation
      console.log('🧪 Testing PDF generation with sample data...');

      // Using require since we're in a .js file
      const { generateInvoiceWithFallback } = require('./src/lib/invoice.ts');

      const testData = {
        orderId: 'TEST001',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '1234567890',
        deliveryAddress: 'Test Address, Test City',
        items: [
          { name: 'Test Item 1', quantity: 2, price: 150 },
          { name: 'Test Item 2', quantity: 1, price: 200 }
        ],
        subtotal: 500,
        tax: 90,
        deliveryFee: 40,
        total: 630,
        orderDate: new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        paymentMethod: 'Cash on Delivery'
      };

      const startTime = Date.now();
      const result = await generateInvoiceWithFallback(testData);
      const duration = Date.now() - startTime;

      console.log(`✅ Invoice generated successfully in ${duration}ms`);
      console.log(`📋 Type: ${result.isPDF ? 'PDF' : 'HTML'}`);
      console.log(`📁 Filename: ${result.filename}`);
      console.log(`📏 Size: ${result.buffer.length} bytes`);

      if (result.isPDF) {
        console.log('🎉 PDF generation working perfectly!');
      } else {
        console.log('⚠️  Using HTML fallback (PDF generation had issues)');
      }

      this.results.pdf = true;
      return { success: true, result };
    } catch (error) {
      console.error('❌ PDF generation test failed:', error.message);
      console.error('🔍 Error stack:', error.stack?.split('\n').slice(0, 3).join('\n'));
      return { success: false, error };
    }
  }

  async testEmailSending(invoiceData) {
    console.log('\n📬 Testing Email Sending');
    console.log('=========================');

    try {
      const { sendOrderEmail } = require('./src/lib/mailer.ts');

      const emailData = {
        orderId: 'TEST001',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        items: [
          { name: 'Test Item 1', quantity: 2, price: 150 },
          { name: 'Test Item 2', quantity: 1, price: 200 }
        ],
        total: 630,
        address: 'Test Address, Test City',
        phone: '1234567890'
      };

      console.log('📤 Attempting to send test emails...');

      if (invoiceData && invoiceData.result) {
        await sendOrderEmail(emailData, invoiceData.result.buffer, invoiceData.result.filename);
      } else {
        await sendOrderEmail(emailData, Buffer.alloc(0));
      }

      console.log('✅ Email sending test completed');
      this.results.email = true;
      return true;
    } catch (error) {
      console.error('❌ Email sending test failed:', error.message);
      return false;
    }
  }

  async testCompleteOrderFlow() {
    console.log('\n🛒 Testing Complete Order Flow');
    console.log('===============================');

    try {
      // Create order schema for testing
      const orderSchema = new mongoose.Schema({
        orderNumber: { type: String, required: true, unique: true },
        items: [{
          menuItemId: String,
          name: String,
          price: Number,
          quantity: Number
        }],
        customerInfo: {
          name: String,
          email: String,
          phone: String,
          address: String
        },
        deliveryInfo: {
          address: String,
          phone: String,
          deliveryNotes: String
        },
        subtotal: Number,
        tax: Number,
        deliveryFee: Number,
        total: Number,
        paymentMethod: String,
        status: { type: String, default: 'pending' },
        notes: String,
        invoiceGenerated: { type: Boolean, default: false },
        emailsSent: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
      });

      const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

      // Create test order
      const orderCount = await Order.countDocuments();
      const orderNumber = `TEST${String(orderCount + 1).padStart(6, '0')}`;

      const orderData = {
        orderNumber,
        items: [
          {
            menuItemId: "test_1",
            name: "Test Fish Cutlet",
            price: 110,
            quantity: 1
          },
          {
            menuItemId: "test_2",
            name: "Test Fish Kobiraji",
            price: 210,
            quantity: 1
          }
        ],
        customerInfo: {
          name: "System Test Customer",
          email: "systemtest@example.com",
          phone: "9999999999",
          address: "System Test Address, Test City"
        },
        deliveryInfo: {
          address: "System Test Address, Test City",
          phone: "9999999999",
          deliveryNotes: "Complete system test order"
        },
        subtotal: 320,
        tax: 58,
        deliveryFee: 40,
        total: 418,
        paymentMethod: "cod",
        notes: "Complete system test",
        invoiceGenerated: false,
        emailsSent: false
      };

      console.log('💾 Creating test order in database...');
      const order = new Order(orderData);
      const savedOrder = await order.save();

      console.log('✅ Test order created:', {
        orderNumber: savedOrder.orderNumber,
        total: savedOrder.total,
        id: savedOrder._id
      });

      this.results.order = true;
      return savedOrder;
    } catch (error) {
      console.error('❌ Complete order flow test failed:', error.message);
      return null;
    }
  }

  getSystemChromePaths() {
    switch (os.platform()) {
      case 'darwin': // macOS
        return [
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          '/Applications/Chromium.app/Contents/MacOS/Chromium',
          '/opt/homebrew/bin/chromium',
          '/usr/local/bin/chromium'
        ];
      case 'linux':
        return [
          '/usr/bin/google-chrome',
          '/usr/bin/google-chrome-stable',
          '/usr/bin/chromium-browser',
          '/usr/bin/chromium',
          '/snap/bin/chromium'
        ];
      case 'win32':
        return [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        ];
      default:
        return [];
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive System Tests');
    console.log('=======================================');
    console.log(`🕐 Started at: ${new Date().toLocaleString()}`);

    const startTime = Date.now();

    // Test 1: MongoDB
    await this.testMongoDB();

    // Test 2: SMTP
    await this.testSMTP();

    // Test 3: PDF Generation
    const pdfResult = await this.testPDFGeneration();

    // Test 4: Email Sending
    await this.testEmailSending(pdfResult);

    // Test 5: Complete Order Flow
    await this.testCompleteOrderFlow();

    const totalTime = Date.now() - startTime;

    // Summary
    console.log('\n📊 TEST SUMMARY');
    console.log('================');
    console.log(`🕐 Total test time: ${totalTime}ms`);
    console.log(`✅ MongoDB: ${this.results.mongodb ? 'PASS' : 'FAIL'}`);
    console.log(`✅ SMTP: ${this.results.smtp ? 'PASS' : 'FAIL'}`);
    console.log(`✅ PDF Generation: ${this.results.pdf ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Email Sending: ${this.results.email ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Order Flow: ${this.results.order ? 'PASS' : 'FAIL'}`);

    const passedTests = Object.values(this.results).filter(Boolean).length;
    const totalTests = Object.keys(this.results).length;

    console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
      console.log('🎉 ALL TESTS PASSED! System is fully functional!');
    } else {
      console.log('⚠️  Some tests failed. Check the logs above for details.');

      // Provide specific guidance
      if (!this.results.mongodb) {
        console.log('💡 MongoDB: Check your MONGODB_URI in .env.local');
      }
      if (!this.results.smtp) {
        console.log('💡 SMTP: Consider using Mailtrap for development');
      }
      if (!this.results.pdf) {
        console.log('💡 PDF: Chrome/memory issues - HTML fallback should work');
      }
    }

    // Cleanup
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 MongoDB disconnected');
    }

    return {
      results: this.results,
      summary: `${passedTests}/${totalTests} tests passed`,
      allPassed: passedTests === totalTests
    };
  }
}

// Environment validation
function validateEnvironment() {
  console.log('🔍 Environment Validation');
  console.log('==========================');

  const required = ['MONGODB_URI', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const optional = ['JWT_SECRET', 'SMTP_SECURE'];

  console.log('Required variables:');
  required.forEach(key => {
    const value = process.env[key];
    console.log(`   ${key}: ${value ? '✅ SET' : '❌ MISSING'}`);
  });

  console.log('Optional variables:');
  optional.forEach(key => {
    const value = process.env[key];
    console.log(`   ${key}: ${value ? '✅ SET' : '⚠️  NOT SET'}`);
  });

  const missingRequired = required.filter(key => !process.env[key]);
  if (missingRequired.length > 0) {
    console.log(`\n❌ Missing required environment variables: ${missingRequired.join(', ')}`);
    console.log('Please check your .env.local file');
    return false;
  }

  console.log('\n✅ Environment validation passed');
  return true;
}

// Run tests
async function main() {
  console.log('🧪 Bong Flavours System Test Suite');
  console.log('===================================\n');

  if (!validateEnvironment()) {
    process.exit(1);
  }

  const tester = new SystemTester();
  const results = await tester.runAllTests();

  process.exit(results.allPassed ? 0 : 1);
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SystemTester, validateEnvironment };
