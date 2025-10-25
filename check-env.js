require('dotenv').config({ path: '.env.local' });

console.log('🔍 Environment Variables Diagnostic');
console.log('===================================');
console.log('');

// Check if .env.local exists
const fs = require('fs');
const path = '.env.local';

if (fs.existsSync(path)) {
  console.log('✅ .env.local file exists');
} else {
  console.log('❌ .env.local file NOT FOUND');
  console.log('💡 Create .env.local file in your project root');
  process.exit(1);
}

console.log('');
console.log('📧 SMTP Configuration:');
console.log('======================');
console.log('SMTP_HOST:', process.env.SMTP_HOST || '❌ NOT SET');
console.log('SMTP_PORT:', process.env.SMTP_PORT || '❌ NOT SET');
console.log('SMTP_SECURE:', process.env.SMTP_SECURE || '❌ NOT SET');
console.log('SMTP_USER:', process.env.SMTP_USER || '❌ NOT SET');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ SET (' + process.env.SMTP_PASS.length + ' chars)' : '❌ NOT SET');

console.log('');
console.log('🏪 Restaurant Configuration:');
console.log('============================');
console.log('NEXT_PUBLIC_RESTAURANT_EMAIL:', process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || '❌ NOT SET');
console.log('NEXT_PUBLIC_RESTAURANT_PHONE:', process.env.NEXT_PUBLIC_RESTAURANT_PHONE || '❌ NOT SET');
console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL || '❌ NOT SET');

console.log('');
console.log('🗄️ Database Configuration:');
console.log('===========================');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ SET' : '❌ NOT SET');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ SET' : '❌ NOT SET');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '❌ NOT SET');

console.log('');

// Check if Gmail SMTP is configured
const isGmailConfigured =
  process.env.SMTP_HOST === 'smtp.gmail.com' &&
  process.env.SMTP_PORT === '587' &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

if (isGmailConfigured) {
  console.log('✅ Gmail SMTP appears to be configured correctly!');
  console.log('');
  console.log('🧪 Test your configuration:');
  console.log('   node test-gmail-smtp.js');
} else {
  console.log('❌ Gmail SMTP is NOT configured correctly');
  console.log('');
  console.log('💡 To configure Gmail SMTP for real email delivery:');
  console.log('');
  console.log('1. Add these lines to your .env.local:');
  console.log('   SMTP_HOST=smtp.gmail.com');
  console.log('   SMTP_PORT=587');
  console.log('   SMTP_SECURE=false');
  console.log('   SMTP_USER=mannadebdoot007@gmail.com');
  console.log('   SMTP_PASS=your_gmail_app_password');
  console.log('');
  console.log('2. Generate Gmail App Password:');
  console.log('   → Go to myaccount.google.com');
  console.log('   → Security → 2-Step Verification (enable if not enabled)');
  console.log('   → App passwords → Generate for "Mail"');
  console.log('   → Copy the 16-character password');
  console.log('');
  console.log('3. Test configuration:');
  console.log('   node test-gmail-smtp.js');
}

console.log('');
console.log('🔄 Current Status Summary:');
console.log('==========================');

const issues = [];
if (!process.env.SMTP_HOST) issues.push('SMTP_HOST missing');
if (!process.env.SMTP_PORT) issues.push('SMTP_PORT missing');
if (!process.env.SMTP_USER) issues.push('SMTP_USER missing');
if (!process.env.SMTP_PASS) issues.push('SMTP_PASS missing');

if (issues.length === 0) {
  console.log('✅ All SMTP variables are set');
  console.log('📤 Your app should be able to send emails');
  console.log('');
  console.log('Next steps:');
  console.log('1. Test with: node test-gmail-smtp.js');
  console.log('2. Create a test order to verify end-to-end flow');
} else {
  console.log('❌ Issues found:');
  issues.forEach(issue => console.log(`   • ${issue}`));
  console.log('');
  console.log('🚫 Email sending will NOT work until these are fixed');
}

console.log('');
