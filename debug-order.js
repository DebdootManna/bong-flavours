const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Debug Script for Order System');
console.log('='.repeat(50));

// 1. Check environment variables
console.log('\n📋 Environment Variables Check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
console.log('SMTP_HOST:', process.env.SMTP_HOST || '❌ Not set');
console.log('SMTP_PORT:', process.env.SMTP_PORT || '❌ Not set');
console.log('SMTP_USER:', process.env.SMTP_USER || '❌ Not set');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set (hidden)' : '❌ Not set');
console.log('SMTP_SECURE:', process.env.SMTP_SECURE || 'false');

// 2. Test SMTP Connection
async function testSMTPConnection() {
  console.log('\n📧 Testing SMTP Connection...');

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('⚠️ SMTP not configured - will use console fallback');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: true,
    logger: true
  });

  try {
    console.log('🔗 Verifying SMTP connection...');
    const verification = await transporter.verify();
    console.log('✅ SMTP connection verified:', verification);
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response);
    return false;
  }
}

// 3. Test Email Sending
async function testEmailSending() {
  console.log('\n📤 Testing Email Sending...');

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('⚠️ SMTP not configured - simulating console fallback');
    logTestEmailToConsole();
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const testEmail = {
    from: `"Bong Flavours Debug" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER, // Send to self for testing
    subject: 'Test Email from Bong Flavours Debug Script',
    html: `
      <h2>Test Email</h2>
      <p>This is a test email sent at ${new Date().toISOString()}</p>
      <p>If you receive this, your SMTP configuration is working!</p>
    `,
  };

  try {
    console.log('📨 Sending test email...');
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
  } catch (error) {
    console.error('❌ Test email failed:');
    console.error('Error:', error.message);
    logTestEmailToConsole();
  }
}

function logTestEmailToConsole() {
  console.log('\n📧 EMAIL FALLBACK - Logging test email to console:');
  console.log('='.repeat(60));
  console.log(`📤 From: "Bong Flavours Debug" <${process.env.SMTP_USER || 'not-configured'}>`);
  console.log(`📨 To: ${process.env.SMTP_USER || 'test@example.com'}`);
  console.log(`📋 Subject: Test Email from Bong Flavours Debug Script`);
  console.log('📄 Content: Test email HTML content would be here');
  console.log('='.repeat(60));
}

// 4. Test PDF Generation
async function testPDFGeneration() {
  console.log('\n📄 Testing PDF Generation...');

  try {
    const puppeteer = require('puppeteer');
    console.log('✅ Puppeteer module loaded');

    // Test browser launch with different configurations
    const configs = [
      {
        name: 'Default Config',
        config: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      },
      {
        name: 'Pipe Config',
        config: {
          headless: true,
          pipe: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--remote-debugging-pipe'
          ]
        }
      },
      {
        name: 'Single Process Config',
        config: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
            '--no-zygote'
          ]
        }
      }
    ];

    for (const testConfig of configs) {
      console.log(`\n🧪 Testing ${testConfig.name}...`);
      try {
        const browser = await puppeteer.launch(testConfig.config);
        console.log(`✅ ${testConfig.name} - Browser launched successfully`);

        const page = await browser.newPage();
        await page.setContent('<h1>Test PDF</h1><p>This is a test PDF generation.</p>');

        const pdf = await page.pdf({
          format: 'A4',
          printBackground: true
        });

        console.log(`✅ ${testConfig.name} - PDF generated successfully (${pdf.length} bytes)`);
        await browser.close();

        // Save test PDF
        const testPdfPath = path.join(__dirname, `test-pdf-${testConfig.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
        fs.writeFileSync(testPdfPath, pdf);
        console.log(`💾 Test PDF saved: ${testPdfPath}`);

        break; // If successful, no need to test other configs
      } catch (error) {
        console.error(`❌ ${testConfig.name} failed:`, error.message);
      }
    }
  } catch (error) {
    console.error('❌ PDF generation test failed:', error.message);
    console.log('💡 Try: npm install puppeteer');
  }
}

// 5. Check system resources
function checkSystemInfo() {
  console.log('\n🖥️  System Information:');
  console.log('Node.js version:', process.version);
  console.log('Platform:', process.platform);
  console.log('Architecture:', process.arch);
  console.log('Memory usage:', process.memoryUsage());

  // Check if running in containerized environment
  try {
    if (fs.existsSync('/.dockerenv')) {
      console.log('🐳 Running in Docker container');
    }
  } catch (e) {
    // Ignore
  }
}

// 6. Test database connection (simplified)
async function testDatabaseConnection() {
  console.log('\n🗄️  Testing Database Connection...');

  if (!process.env.MONGODB_URI) {
    console.log('❌ MONGODB_URI not set');
    return;
  }

  try {
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connection successful');

    // Test collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name).join(', '));

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  try {
    checkSystemInfo();
    await testDatabaseConnection();
    await testSMTPConnection();
    await testEmailSending();
    await testPDFGeneration();

    console.log('\n🎉 Debug script completed!');
    console.log('\n💡 Recommendations:');

    if (!process.env.SMTP_HOST) {
      console.log('- Configure SMTP settings in .env.local for email functionality');
      console.log('- Or use Mailtrap for development: https://mailtrap.io');
    }

    console.log('- Check server logs during order placement for detailed error information');
    console.log('- Restart Next.js server after changing environment variables');

  } catch (error) {
    console.error('❌ Debug script failed:', error);
  }
}

// Run the script
runAllTests();
