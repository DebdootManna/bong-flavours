require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testGmailSMTP() {
  console.log('📧 Testing Gmail SMTP for Real Email Delivery');
  console.log('==============================================');

  // Check environment variables first
  console.log('🔍 Checking environment variables...');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
  console.log('SMTP_USER:', process.env.SMTP_USER || 'NOT SET');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***SET***' : 'NOT SET');
  console.log('');

  // Gmail SMTP configuration - use env vars if available, fallback to hardcoded
  const gmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER || 'mannadebdoot007@gmail.com',
      pass: process.env.SMTP_PASS || 'YOUR_APP_PASSWORD_HERE'
    },
    debug: true,
    logger: true,
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    tls: {
      rejectUnauthorized: false
    }
  };

  // Validate configuration
  if (gmailConfig.auth.pass === 'YOUR_APP_PASSWORD_HERE') {
    console.log('❌ Gmail App Password not configured!');
    console.log('');
    console.log('💡 QUICK SETUP:');
    console.log('1. Add to your .env.local file:');
    console.log('   SMTP_HOST=smtp.gmail.com');
    console.log('   SMTP_PORT=587');
    console.log('   SMTP_SECURE=false');
    console.log('   SMTP_USER=mannadebdoot007@gmail.com');
    console.log('   SMTP_PASS=your_gmail_app_password');
    console.log('');
    console.log('2. Generate Gmail App Password:');
    console.log('   → Go to myaccount.google.com');
    console.log('   → Security → 2-Step Verification → App passwords');
    console.log('   → Generate for "Mail" app');
    console.log('');
    throw new Error('Gmail App Password not configured');
  }

  console.log('🔧 Gmail SMTP Configuration:');
  console.log(`   Host: ${gmailConfig.host}`);
  console.log(`   Port: ${gmailConfig.port}`);
  console.log(`   Secure: ${gmailConfig.secure}`);
  console.log(`   User: ${gmailConfig.auth.user}`);
  console.log(`   Pass: ${gmailConfig.auth.pass.replace(/./g, '*')} (${gmailConfig.auth.pass.length} chars)`);

  try {
    // Create transporter
    console.log('\n🔗 Creating Gmail transporter...');
    const transporter = nodemailer.createTransport(gmailConfig);

    // Verify connection
    console.log('🔍 Verifying Gmail SMTP connection...');
    const isValid = await transporter.verify();

    if (!isValid) {
      throw new Error('SMTP verification failed');
    }

    console.log('✅ Gmail SMTP connection verified successfully!');

    // Send test email
    console.log('\n📤 Sending test email...');

    const testEmail = {
      from: '"Bong Flavours" <mannadebdoot007@gmail.com>',
      to: 'mannadebdoot007@gmail.com', // Send to yourself first
      subject: '🧪 Test Email from Bong Flavours System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6F1D1B;">🎉 Email System Test Successful!</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>✅ Test Results:</h3>
            <ul>
              <li>✅ Gmail SMTP connection: WORKING</li>
              <li>✅ Email delivery: WORKING</li>
              <li>✅ HTML formatting: WORKING</li>
              <li>✅ Ready for production use!</li>
            </ul>
          </div>

          <p><strong>Test Details:</strong></p>
          <ul>
            <li>Sent at: ${new Date().toLocaleString()}</li>
            <li>From: Bong Flavours System</li>
            <li>SMTP Host: smtp.gmail.com</li>
            <li>Status: SUCCESS</li>
          </ul>

          <p>If you received this email, your Gmail SMTP is configured correctly and ready for production!</p>

          <div style="background: #6F1D1B; color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4>🚀 Next Steps:</h4>
            <ol>
              <li>Replace Mailtrap config with Gmail config in .env.local</li>
              <li>Test order creation with real email delivery</li>
              <li>Your customers will receive real emails with invoices!</li>
            </ol>
          </div>

          <p style="color: #666; font-size: 12px;">
            This is an automated test email from your Bong Flavours restaurant system.
          </p>
        </div>
      `,
      text: `
        Email System Test Successful!

        Test Results:
        ✅ Gmail SMTP connection: WORKING
        ✅ Email delivery: WORKING
        ✅ Ready for production use!

        Sent at: ${new Date().toLocaleString()}

        If you received this email, your Gmail SMTP is configured correctly!
      `
    };

    const info = await transporter.sendMail(testEmail);

    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Check your Gmail inbox: mannadebdoot007@gmail.com`);

    console.log('\n🎉 SUCCESS! Gmail SMTP is working!');
    console.log('================================');
    console.log('✅ You can now use Gmail for real email delivery');
    console.log('✅ Customers will receive actual emails');
    console.log('✅ Restaurant notifications will be delivered');

    return true;

  } catch (error) {
    console.error('\n❌ Gmail SMTP Test Failed');
    console.error('=========================');
    console.error(`Error: ${error.message}`);

    if (error.code === 'EAUTH') {
      console.error('\n🔐 AUTHENTICATION ERROR:');
      console.error('========================');
      console.error('❌ Invalid username/password combination');
      console.error('\n💡 SOLUTION:');
      console.error('1. Enable 2-Factor Authentication on your Gmail');
      console.error('2. Go to Google Account → Security → 2-Step Verification');
      console.error('3. Click "App passwords" → Select "Mail" → Generate password');
      console.error('4. Use that 16-character app password (not your regular password)');
      console.error('5. Add to .env.local: SMTP_PASS=your_app_password');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.error('\n🌐 CONNECTION ERROR:');
      console.error('====================');
      console.error('❌ Cannot connect to Gmail SMTP server');
      console.error('💡 Check your internet connection');
      console.error('💡 Try different port: 465 with secure=true');
    } else if (error.message.includes('Username and Password not accepted')) {
      console.error('\n🔒 CREDENTIALS ERROR:');
      console.error('=====================');
      console.error('❌ Gmail rejected your credentials');
      console.error('💡 Make sure you are using an App Password, not your regular password');
      console.error('💡 App password should be 16 characters long');
    } else if (error.message.includes('self signed certificate')) {
      console.error('\n🔒 TLS CERTIFICATE ERROR:');
      console.error('=========================');
      console.error('❌ TLS certificate issue');
      console.error('💡 This is expected in development - email should still work');
    }

    console.error('\n🔍 DEBUGGING INFO:');
    console.error('==================');
    console.error('Error code:', error.code || 'NO_CODE');
    console.error('Error errno:', error.errno || 'NO_ERRNO');
    console.error('Full error object:', JSON.stringify(error, null, 2));

    return false;
  }
}

// Instructions for setup
function showSetupInstructions() {
  console.log('📝 GMAIL SETUP INSTRUCTIONS');
  console.log('============================');
  console.log('');
  console.log('Before running this test, you need to:');
  console.log('');
  console.log('1. 🔐 Enable 2-Factor Authentication:');
  console.log('   → Go to myaccount.google.com');
  console.log('   → Security → 2-Step Verification → Turn On');
  console.log('');
  console.log('2. 🔑 Generate App Password:');
  console.log('   → Security → 2-Step Verification → App passwords');
  console.log('   → Select app: "Mail"');
  console.log('   → Select device: "Other" → Type "Bong Flavours"');
  console.log('   → Copy the 16-character password');
  console.log('');
  console.log('3. ✏️  Update this file:');
  console.log('   → Replace "YOUR_APP_PASSWORD_HERE" with your app password');
  console.log('   → Save the file');
  console.log('');
  console.log('4. 🧪 Run the test:');
  console.log('   → node test-gmail-smtp.js');
  console.log('');
  console.log('⚠️  SECURITY NOTE:');
  console.log('   → Never commit your app password to Git');
  console.log('   → Consider using environment variables');
  console.log('');
}

// Alternative: Use environment variables for security
function testWithEnvVariables() {
  console.log('🔒 Testing Gmail with Environment Variables');
  console.log('==========================================');

  // Check if env variables are set
  const gmailUser = process.env.GMAIL_USER || process.env.PRODUCTION_SMTP_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.PRODUCTION_SMTP_PASS;

  if (!gmailUser || !gmailPass) {
    console.log('❌ Gmail credentials not found in environment variables');
    console.log('');
    console.log('💡 Add to your .env.local:');
    console.log('GMAIL_USER=mannadebdoot007@gmail.com');
    console.log('GMAIL_APP_PASSWORD=your_16_character_app_password');
    return false;
  }

  console.log('✅ Found Gmail credentials in environment');
  return { user: gmailUser, pass: gmailPass };
}

// Production email configuration generator
function generateProductionConfig() {
  console.log('\n📋 PRODUCTION EMAIL CONFIGURATION');
  console.log('==================================');
  console.log('');
  console.log('Add these to your .env.local for production emails:');
  console.log('');
  console.log('# Replace Mailtrap with Gmail for production');
  console.log('SMTP_HOST=smtp.gmail.com');
  console.log('SMTP_PORT=587');
  console.log('SMTP_SECURE=false');
  console.log('SMTP_USER=mannadebdoot007@gmail.com');
  console.log('SMTP_PASS=your_gmail_app_password_here');
  console.log('');
  console.log('After updating .env.local:');
  console.log('1. Restart your development server');
  console.log('2. Test order creation');
  console.log('3. Check your Gmail for real emails!');
  console.log('');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showSetupInstructions();
    return;
  }

  if (args.includes('--config')) {
    generateProductionConfig();
    return;
  }

  // Check if credentials are available (env vars or hardcoded)
  const hasEnvCreds = process.env.SMTP_USER && process.env.SMTP_PASS;
  const scriptContent = require('fs').readFileSync(__filename, 'utf8');
  const hasHardcodedCreds = !scriptContent.includes('YOUR_APP_PASSWORD_HERE');

  if (!hasEnvCreds && !hasHardcodedCreds) {
    console.log('⚠️  Gmail credentials not configured!');
    console.log('');
    console.log('💡 EASIEST SETUP - Add to .env.local:');
    console.log('SMTP_HOST=smtp.gmail.com');
    console.log('SMTP_PORT=587');
    console.log('SMTP_SECURE=false');
    console.log('SMTP_USER=mannadebdoot007@gmail.com');
    console.log('SMTP_PASS=your_gmail_app_password');
    console.log('');
    showSetupInstructions();
    console.log('💡 Or run: node test-gmail-smtp.js --help');
    return;
  }

  if (hasEnvCreds) {
    console.log('✅ Using Gmail credentials from .env.local');
  } else {
    console.log('✅ Using hardcoded Gmail credentials');
  }

  // Try environment variables first
  const envCreds = testWithEnvVariables();
  if (envCreds) {
    // Use environment variables
    console.log('🔒 Using credentials from environment variables');
  }

  // Run the test
  const success = await testGmailSMTP();

  if (success) {
    generateProductionConfig();
  }

  process.exit(success ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testGmailSMTP, showSetupInstructions, generateProductionConfig };
