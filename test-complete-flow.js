require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Test the complete flow: order creation + invoice generation + email sending
async function testCompleteFlow() {
  console.log('🚀 Testing Complete Order Flow');
  console.log('=====================================');

  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Import required modules
    const { generateInvoiceWithFallback, calculateOrderTotals } = require('./src/lib/invoice.ts');
    const { sendOrderEmail } = require('./src/lib/mailer.ts');

    // Create test order data
    const items = [
      {
        name: "Fish Cutlet (1 pcs)",
        price: 110,
        quantity: 1
      },
      {
        name: "Fish Kobiraji",
        price: 210,
        quantity: 1
      }
    ];

    // Calculate totals
    const { subtotal, tax, deliveryFee, total } = calculateOrderTotals(items);
    console.log('📊 Order totals calculated:', { subtotal, tax, deliveryFee, total });

    // Prepare invoice data
    const invoiceData = {
      orderId: 'BF999999',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '9999999999',
      deliveryAddress: 'Test Address, Test City',
      items: items,
      subtotal: subtotal,
      tax: tax,
      deliveryFee: deliveryFee,
      total: total,
      orderDate: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      paymentMethod: "Cash on Delivery"
    };

    console.log('📄 Starting invoice generation...');

    // Generate invoice with fallback
    const invoiceResult = await generateInvoiceWithFallback(invoiceData);

    console.log('✅ Invoice generated successfully!');
    console.log(`📋 Type: ${invoiceResult.isPDF ? 'PDF' : 'HTML'}`);
    console.log(`📁 Filename: ${invoiceResult.filename}`);
    console.log(`📏 Size: ${invoiceResult.buffer.length} bytes`);

    // Prepare email data
    const emailData = {
      orderId: invoiceData.orderId,
      customerName: invoiceData.customerName,
      customerEmail: invoiceData.customerEmail,
      items: items,
      total: total,
      address: invoiceData.deliveryAddress,
      phone: invoiceData.customerPhone
    };

    console.log('📧 Starting email sending...');

    // Send emails
    await sendOrderEmail(emailData, invoiceResult.buffer, invoiceResult.filename);

    console.log('✅ Emails sent successfully!');
    console.log('🎉 Complete flow test completed successfully!');

    // Summary
    console.log('\n📈 FLOW SUMMARY:');
    console.log('================');
    console.log(`✅ Order totals: ₹${total} (subtotal: ₹${subtotal}, tax: ₹${tax}, delivery: ₹${deliveryFee})`);
    console.log(`✅ Invoice: ${invoiceResult.isPDF ? 'PDF' : 'HTML'} (${invoiceResult.buffer.length} bytes)`);
    console.log(`✅ Emails: Sent to restaurant and customer`);
    console.log(`✅ Attachment: ${invoiceResult.filename}`);

  } catch (error) {
    console.error('❌ Flow test failed:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5).join('\n')
    });
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 MongoDB disconnected');
    }
  }
}

// Test individual components
async function testInvoiceGeneration() {
  console.log('\n🧪 Testing Invoice Generation Only');
  console.log('===================================');

  try {
    const { generateInvoiceWithFallback } = require('./src/lib/invoice.ts');

    const testData = {
      orderId: 'TEST001',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '1234567890',
      deliveryAddress: 'Test Address',
      items: [{ name: 'Test Item', quantity: 1, price: 100 }],
      subtotal: 100,
      tax: 18,
      deliveryFee: 40,
      total: 158,
      orderDate: new Date().toLocaleDateString(),
      paymentMethod: 'Cash on Delivery'
    };

    console.log('🔄 Generating invoice...');
    const result = await generateInvoiceWithFallback(testData);

    console.log('✅ Invoice generation test passed!');
    console.log(`📋 Type: ${result.isPDF ? 'PDF' : 'HTML'}`);
    console.log(`📏 Size: ${result.buffer.length} bytes`);

  } catch (error) {
    console.error('❌ Invoice generation test failed:', error.message);
  }
}

async function testEmailConfiguration() {
  console.log('\n📬 Testing Email Configuration');
  console.log('===============================');

  try {
    const nodemailer = require('nodemailer');

    // Test SMTP connection
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('🔗 Verifying SMTP connection...');
    const isValid = await transporter.verify();
    console.log('✅ SMTP connection valid:', isValid);

  } catch (error) {
    console.error('❌ Email configuration test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🎯 Starting Complete Flow Testing');
  console.log('==================================\n');

  await testEmailConfiguration();
  await testInvoiceGeneration();
  await testCompleteFlow();

  console.log('\n🏁 All tests completed!');
}

// Execute if run directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testCompleteFlow,
  testInvoiceGeneration,
  testEmailConfiguration,
  runAllTests
};
