require('dotenv').config({ path: '.env.local' });
const puppeteer = require('puppeteer');
const os = require('os');

async function testSystemChrome() {
  console.log('🧪 Testing System Chrome for PDF Generation');
  console.log('============================================');

  const systemChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  console.log('🔍 System Info:');
  console.log(`   Platform: ${os.platform()} ${os.arch()}`);
  console.log(`   Memory: ${Math.round(os.freemem() / 1024 / 1024)} MB available`);
  console.log(`   Chrome Path: ${systemChromePath}`);

  const testHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>PDF Test</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { color: #6F1D1B; font-size: 24px; margin-bottom: 20px; }
        .content { font-size: 16px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="header">Bong Flavours - PDF Test</div>
      <div class="content">
        <p>This is a test PDF generated at ${new Date().toLocaleString()}</p>
        <p>If you can see this, the PDF generation is working!</p>
      </div>
    </body>
    </html>
  `;

  let browser;
  try {
    console.log('🚀 Launching Chrome...');

    browser = await puppeteer.launch({
      executablePath: systemChromePath,
      headless: true,
      timeout: 30000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    console.log('✅ Chrome launched successfully!');

    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });

    console.log('📝 Setting page content...');
    await page.setContent(testHTML, { waitUntil: 'domcontentloaded' });

    console.log('🖨️ Generating PDF...');
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    console.log('✅ PDF generated successfully!');
    console.log(`📏 PDF size: ${pdf.length} bytes`);

    // Save test PDF
    const fs = require('fs');
    fs.writeFileSync('test-invoice.pdf', pdf);
    console.log('💾 Test PDF saved as test-invoice.pdf');

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('🔍 Error details:', error);
    return false;
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Chrome closed');
    }
  }
}

// Test the invoice generation system specifically
async function testInvoiceGeneration() {
  console.log('\n📄 Testing Invoice Generation System');
  console.log('====================================');

  try {
    // Import the invoice generation function
    const { generateInvoiceWithFallback } = require('./src/lib/invoice.ts');

    const testInvoiceData = {
      orderId: 'CHROME_TEST_001',
      customerName: 'Chrome Test Customer',
      customerEmail: 'chrometest@example.com',
      customerPhone: '9999999999',
      deliveryAddress: 'Test Address for Chrome, Test City',
      items: [
        { name: 'Fish Cutlet (Test)', quantity: 1, price: 110 },
        { name: 'Fish Kobiraji (Test)', quantity: 1, price: 210 }
      ],
      subtotal: 320,
      tax: 58,
      deliveryFee: 40,
      total: 418,
      orderDate: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      paymentMethod: 'Cash on Delivery'
    };

    console.log('🔄 Generating invoice with fallback system...');
    const startTime = Date.now();

    const result = await generateInvoiceWithFallback(testInvoiceData);

    const duration = Date.now() - startTime;

    console.log(`✅ Invoice generated in ${duration}ms`);
    console.log(`📋 Type: ${result.isPDF ? 'PDF' : 'HTML'}`);
    console.log(`📁 Filename: ${result.filename}`);
    console.log(`📏 Size: ${result.buffer.length} bytes`);

    // Save the result
    const fs = require('fs');
    fs.writeFileSync(`test-${result.filename}`, result.buffer);
    console.log(`💾 Test invoice saved as test-${result.filename}`);

    if (result.isPDF) {
      console.log('🎉 PDF generation is working perfectly!');
    } else {
      console.log('⚠️ Using HTML fallback - PDF had issues but system is functional');
    }

    return result;

  } catch (error) {
    console.error('❌ Invoice generation test failed:', error.message);
    console.error('🔍 Stack trace:', error.stack?.split('\n').slice(0, 5).join('\n'));
    return null;
  }
}

async function runTests() {
  console.log('🎯 Chrome & PDF Generation Test Suite');
  console.log('======================================\n');

  const chromeTest = await testSystemChrome();
  const invoiceTest = await testInvoiceGeneration();

  console.log('\n📊 TEST RESULTS');
  console.log('================');
  console.log(`🌐 System Chrome: ${chromeTest ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`📄 Invoice Generation: ${invoiceTest ? '✅ WORKING' : '❌ FAILED'}`);

  if (chromeTest && invoiceTest) {
    console.log('\n🎉 ALL TESTS PASSED! PDF generation is working!');
  } else if (invoiceTest && !invoiceTest.isPDF) {
    console.log('\n⚠️ PDF generation has issues but HTML fallback works');
    console.log('💡 You can use the HTML invoices and print them as PDFs');
  } else {
    console.log('\n❌ Issues detected. Check the error messages above.');
  }

  return { chromeTest, invoiceTest };
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testSystemChrome, testInvoiceGeneration, runTests };
