const puppeteer = require('puppeteer');

console.log('🧪 Puppeteer PDF Generation Test');
console.log('='.repeat(50));

// Test HTML content
const testHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Puppeteer Test Invoice</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
      background: white;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #6F1D1B;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .company-name {
      color: #6F1D1B;
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }
    .invoice-info {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .items-table th {
      background: #6F1D1B;
      color: white;
      padding: 12px;
      text-align: left;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #ddd;
    }
    .total {
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      color: #6F1D1B;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="company-name">Bong Flavours</h1>
    <p>Authentic Bengali Restaurant</p>
  </div>

  <div class="invoice-info">
    <h2>Test Invoice #TEST001</h2>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <p><strong>Customer:</strong> Test Customer</p>
    <p><strong>Email:</strong> test@example.com</p>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Paneer Kathi Roll</td>
        <td>2</td>
        <td>₹140</td>
        <td>₹280</td>
      </tr>
      <tr>
        <td>Rice</td>
        <td>1</td>
        <td>₹80</td>
        <td>₹80</td>
      </tr>
    </tbody>
  </table>

  <div class="total">
    <p>Total: ₹360</p>
  </div>

  <div style="margin-top: 50px; text-align: center; color: #666;">
    <p>Thank you for choosing Bong Flavours!</p>
    <p>Generated at: ${new Date().toISOString()}</p>
  </div>
</body>
</html>
`;

async function testPuppeteerConfigs() {
  const configs = [
    {
      name: 'Basic Config',
      config: {
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    },
    {
      name: 'Enhanced Config',
      config: {
        headless: "new",
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      }
    },
    {
      name: 'Legacy Headless',
      config: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    }
  ];

  for (const testConfig of configs) {
    console.log(`\n🧪 Testing ${testConfig.name}...`);

    let browser;
    try {
      const startTime = Date.now();

      console.log('  📦 Launching browser...');
      browser = await puppeteer.launch(testConfig.config);

      console.log('  📄 Creating page...');
      const page = await browser.newPage();

      console.log('  📝 Setting content...');
      await page.setContent(testHTML, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      console.log('  🖨️  Generating PDF...');
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

      const duration = Date.now() - startTime;
      console.log(`  ✅ ${testConfig.name} SUCCESS!`);
      console.log(`     Duration: ${duration}ms`);
      console.log(`     PDF Size: ${pdf.length} bytes`);

      // Save the PDF
      const fs = require('fs');
      const filename = `test-pdf-${testConfig.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      fs.writeFileSync(filename, pdf);
      console.log(`     Saved: ${filename}`);

      await browser.close();

      // If we get here, this config works - break and use it
      console.log(`\n🎉 Found working configuration: ${testConfig.name}`);
      break;

    } catch (error) {
      console.error(`  ❌ ${testConfig.name} FAILED:`);
      console.error(`     Error: ${error.message}`);

      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error(`     Close error: ${closeError.message}`);
        }
      }
    }
  }
}

async function testSystemInfo() {
  console.log('\n🖥️  System Information:');
  console.log('Node.js version:', process.version);
  console.log('Platform:', process.platform);
  console.log('Architecture:', process.arch);

  // Check available memory
  const usage = process.memoryUsage();
  console.log('Memory usage:');
  console.log('  RSS:', Math.round(usage.rss / 1024 / 1024), 'MB');
  console.log('  Heap Total:', Math.round(usage.heapTotal / 1024 / 1024), 'MB');
  console.log('  Heap Used:', Math.round(usage.heapUsed / 1024 / 1024), 'MB');

  // Check Puppeteer version
  try {
    const puppeteerPkg = require('puppeteer/package.json');
    console.log('Puppeteer version:', puppeteerPkg.version);
  } catch (error) {
    console.log('Puppeteer version: Could not determine');
  }
}

async function runAllTests() {
  try {
    await testSystemInfo();
    await testPuppeteerConfigs();

    console.log('\n✨ Test completed!');
    console.log('\n💡 If all configs failed, try:');
    console.log('1. npm install puppeteer --force');
    console.log('2. Restart your terminal');
    console.log('3. Check available system memory');

  } catch (error) {
    console.error('\n❌ Test script failed:', error);
  }
}

// Run the tests
runAllTests();
