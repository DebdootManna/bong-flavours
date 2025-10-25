const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local', override: true });

async function testEmail() {
  console.log('🧪 Testing Email Configuration...\n');

  // Display current configuration
  console.log('📧 Email Configuration:');
  console.log(`   SMTP_HOST: ${process.env.SMTP_HOST}`);
  console.log(`   SMTP_PORT: ${process.env.SMTP_PORT}`);
  console.log(`   SMTP_SECURE: ${process.env.SMTP_SECURE}`);
  console.log(`   SMTP_USER: ${process.env.SMTP_USER}`);
  console.log(`   SMTP_PASS: ${process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'Missing'}`);
  console.log(`   RESTAURANT_EMAIL: ${process.env.NEXT_PUBLIC_RESTAURANT_EMAIL}\n`);

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: true, // Enable debug logging
    logger: true // Enable logger
  });

  try {
    console.log('🔗 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Send test email
    console.log('📤 Sending test email...');
    const mailOptions = {
      from: `"Bong Flavours Test" <${process.env.SMTP_USER}>`,
      to: process.env.NEXT_PUBLIC_RESTAURANT_EMAIL,
      subject: '🎉 Email Test - Bong Flavours Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6F1D1B;">🍛 Bong Flavours Email Test</h1>
          <p>Congratulations! Your email configuration is working perfectly.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📊 Test Details:</h3>
            <ul>
              <li><strong>Sent from:</strong> ${process.env.SMTP_USER}</li>
              <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</li>
              <li><strong>Test Time:</strong> ${new Date().toISOString()}</li>
            </ul>
          </div>
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50;">
            <p><strong>✅ Email system is ready for:</strong></p>
            <ul>
              <li>Order confirmation emails to customers</li>
              <li>Invoice delivery</li>
              <li>Admin notifications</li>
            </ul>
          </div>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            This test email was sent from your Bong Flavours restaurant website.<br>
            If you received this, your email configuration is working correctly!
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   To: ${mailOptions.to}`);
    console.log(`   From: ${mailOptions.from}`);

    // Test order email simulation
    console.log('\n🛒 Testing order email simulation...');
    const orderEmailOptions = {
      from: `"Bong Flavours" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to sender as test
      subject: 'New Order #BF000123 - Test Order',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6F1D1B;">🍽️ New Order Received!</h1>
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Order #BF000123</h3>
            <p><strong>Customer:</strong> Test Customer</p>
            <p><strong>Email:</strong> customer@example.com</p>
            <p><strong>Phone:</strong> 9876543210</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3>Order Items:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #e9ecef;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
              <tr>
                <td style="padding: 10px;">Kolkata Biryani</td>
                <td style="padding: 10px; text-align: center;">2</td>
                <td style="padding: 10px; text-align: right;">₹800</td>
              </tr>
              <tr style="background: #f8f9fa; font-weight: bold;">
                <td colspan="2" style="padding: 10px; text-align: right;">Total:</td>
                <td style="padding: 10px; text-align: right;">₹800</td>
              </tr>
            </table>
          </div>
          <p style="margin-top: 20px; color: #666;">
            This is a test order email. Your email system is ready for real orders!
          </p>
        </div>
      `
    };

    const orderResult = await transporter.sendMail(orderEmailOptions);
    console.log('✅ Order email simulation sent successfully!');
    console.log(`   Message ID: ${orderResult.messageId}\n`);

    console.log('🎉 All email tests passed! Your email system is ready.');
    console.log('📬 Check your inbox for the test emails.');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);

    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication Error Solutions:');
      console.log('   1. Check if username/password is correct');
      console.log('   2. For Outlook: Enable "Less secure app access" or use App Password');
      console.log('   3. For Gmail: Use App Password with 2FA enabled');
      console.log('   4. Check if account is locked or requires verification');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Connection Error Solutions:');
      console.log('   1. Check SMTP host and port settings');
      console.log('   2. Verify internet connection');
      console.log('   3. Check firewall/proxy settings');
    } else {
      console.log('\n💡 General troubleshooting:');
      console.log('   1. Double-check all SMTP settings');
      console.log('   2. Try different email provider');
      console.log('   3. Check environment variables are loaded correctly');
    }
  }
}

// Run the test
testEmail().catch(console.error);
