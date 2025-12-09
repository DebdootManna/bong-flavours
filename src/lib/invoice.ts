import puppeteer from "puppeteer";

import os from "os";
// PDF invoice generation system for Bong Flavours restaurant

interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  deliveryFee?: number;
  total: number;
  orderDate: string;
  paymentMethod: string;
}

function generateInvoiceHTML(data: InvoiceData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td class="item-name">${item.name}</td>
      <td class="item-qty">${item.quantity}</td>
      <td class="item-price">₹${item.price.toFixed(2)}</td>
      <td class="item-total">₹${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice #${data.orderId}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          background: white;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          border-bottom: 3px solid #6F1D1B;
          padding-bottom: 20px;
        }
        .company-info h1 {
          color: #6F1D1B;
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .company-info p {
          margin: 5px 0;
          color: #666;
        }
        .invoice-info {
          text-align: right;
        }
        .invoice-info h2 {
          color: #6F1D1B;
          margin: 0;
          font-size: 24px;
        }
        .invoice-info p {
          margin: 5px 0;
          color: #666;
        }
        .customer-info {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .customer-info h3 {
          color: #6F1D1B;
          margin: 0 0 15px 0;
          font-size: 18px;
        }
        .customer-info p {
          margin: 5px 0;
          color: #333;
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
          font-weight: bold;
        }
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        .item-qty, .item-price, .item-total {
          text-align: right;
        }
        .totals {
          float: right;
          width: 300px;
        }
        .totals table {
          width: 100%;
          border-collapse: collapse;
        }
        .totals td {
          padding: 8px 12px;
          border-bottom: 1px solid #ddd;
        }
        .totals .label {
          text-align: right;
          font-weight: bold;
        }
        .totals .amount {
          text-align: right;
        }
        .total-row {
          background: #f0f0f0;
          font-weight: bold;
          font-size: 16px;
        }
        .total-row .amount {
          color: #6F1D1B;
        }
        .footer {
          clear: both;
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #6F1D1B;
          text-align: center;
          color: #666;
        }
        .payment-info {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 5px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
        }
        .payment-info strong {
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="company-info">
          <h1>Bong Flavours</h1>
          <p>Authentic Bengali Restaurant</p>
          <p>Phone: ${process.env.NEXT_PUBLIC_RESTAURANT_PHONE || "8238018577"}</p>
          <p>Email: ${process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || "mannadebdoot007@gmail.com"}</p>
        </div>
        <div class="invoice-info">
          <h2>INVOICE</h2>
          <p><strong>Invoice #:</strong> ${data.orderId}</p>
          <p><strong>Date:</strong> ${data.orderDate}</p>
        </div>
      </div>

      <div class="customer-info">
        <h3>Bill To:</h3>
        <p><strong>${data.customerName}</strong></p>
        <p>Email: ${data.customerEmail}</p>
        <p>Phone: ${data.customerPhone}</p>
        <p>Delivery Address: ${data.deliveryAddress}</p>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Item Description</th>
            <th style="width: 80px;">Qty</th>
            <th style="width: 100px;">Price</th>
            <th style="width: 100px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr>
            <td class="label">Subtotal:</td>
            <td class="amount">₹${data.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="label">Tax (18%):</td>
            <td class="amount">₹${data.tax.toFixed(2)}</td>
          </tr>
          ${
            data.deliveryFee
              ? `
          <tr>
            <td class="label">Delivery Fee:</td>
            <td class="amount">₹${data.deliveryFee.toFixed(2)}</td>
          </tr>
          `
              : ""
          }
          <tr class="total-row">
            <td class="label">Total:</td>
            <td class="amount">₹${data.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div class="payment-info">
        <strong>Payment Method: ${data.paymentMethod}</strong>
      </div>

      <div class="footer">
        <p>Thank you for choosing Bong Flavours!</p>
        <p>For any queries regarding this invoice, please contact us at ${process.env.NEXT_PUBLIC_RESTAURANT_PHONE || "8238018577"}</p>
      </div>
    </body>
    </html>
  `;
}


export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const html = generateInvoiceHTML(data);

  console.log("📄 Starting PDF generation for order:", data.orderId);

  // Check available memory and system resources
  const availableMemoryMB = Math.round(os.freemem() / 1024 / 1024);
  console.log("💾 Available memory:", availableMemoryMB, "MB");
  console.log("🖥️ Platform:", os.platform(), os.arch());

  // Find system Chrome paths based on platform
  const getSystemChromePaths = () => {
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
  };

  // Test if a Chrome executable exists
  const testExecutable = async (path: string): Promise<boolean> => {
    try {
      const fs = await import('fs/promises');
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  };

  // Find available Chrome executable
  let systemChrome: string | undefined;
  const chromePaths = getSystemChromePaths();
  for (const chromePath of chromePaths) {
    if (await testExecutable(chromePath)) {
      systemChrome = chromePath;
      console.log("🔍 Found system Chrome:", chromePath);
      break;
    }
  }

  // Progressive configuration attempts - prioritize system Chrome
  const configs = [];

  // Always try system Chrome first if available
  if (systemChrome) {
    configs.push({
      name: "System Chrome (Standard)",
      config: {
        executablePath: systemChrome,
                  headless: true,        timeout: 30000,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-first-run",
          "--disable-default-apps"
        ]
      }
    });

    configs.push({
      name: "System Chrome (Minimal)",
      config: {
        executablePath: systemChrome,
        headless: true,
        timeout: 25000,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--single-process",
          "--no-zygote"
        ]
      }
    });
  }

  // Only try bundled Chrome if system Chrome not available
  if (!systemChrome) {
    configs.push({
      name: "Bundled Chrome (if available)",
      config: {
                  headless: true,        timeout: 25000,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-software-rasterizer",
          "--single-process",
          "--no-zygote",
          "--memory-pressure-off"
        ]
      }
    });
  }

  let browser;
  let lastError;

  // Try each configuration
  for (const { name, config } of configs) {
    try {
      console.log(`🚀 Attempting PDF generation with ${name}...`);

      // Kill any existing Chrome processes that might be hanging
      try {
        const { execSync } = await import('child_process');
        if (os.platform() === 'darwin') {
          execSync('pkill -f "Chrome for Testing" || true', { stdio: 'ignore' });
          execSync('pkill -f "chrome-headless-shell" || true', { stdio: 'ignore' });
        }
      } catch {
        // Ignore errors from process killing
      }

      browser = await puppeteer.launch(config);
      console.log(`✅ Browser launched successfully with ${name}`);
      break;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.warn(`⚠️ ${name} failed:`, errorMsg);
      lastError = error;

      // Clean up any partial browser instance
      if (browser) {
        try {
          await browser.close();
        } catch {}
        browser = undefined;
      }
    }
  }

  if (!browser) {
    console.error("❌ All Puppeteer configurations failed. Last error:", lastError);
    throw new Error(`PDF generation failed - all browser configs exhausted: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
  }

  try {
    const page = await browser.newPage();

    // Set minimal viewport and timeouts
    await page.setViewport({ width: 800, height: 600 });
    page.setDefaultTimeout(15000);

    // Disable images and other resources to save memory
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    console.log("📝 Setting page content...");
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 15000
    });

    console.log("🖨️ Generating PDF...");
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      timeout: 20000
    });

    console.log("✅ PDF generated successfully for order:", data.orderId, "Size:", pdf.length, "bytes");
    return Buffer.from(pdf);
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log("🔒 Browser closed successfully");
      } catch (closeError) {
        console.warn("⚠️ Error closing browser:", closeError);
      }
    }
  }
}

// New function: Generate HTML invoice as fallback
export function generateInvoiceHTMLBuffer(data: InvoiceData): Buffer {
  const html = generateInvoiceHTML(data);
  console.log("📄 Generated HTML invoice fallback for order:", data.orderId);
  return Buffer.from(html, 'utf8');
}

// New function: Safe PDF generation with HTML fallback
export async function generateInvoiceWithFallback(data: InvoiceData): Promise<{
  buffer: Buffer;
  isPDF: boolean;
  contentType: string;
  filename: string;
}> {
  try {
    console.log("🎯 Attempting PDF generation for order:", data.orderId);
    const pdfBuffer = await generateInvoicePDF(data);
    return {
      buffer: pdfBuffer,
      isPDF: true,
      contentType: 'application/pdf',
      filename: `invoice-${data.orderId}.pdf`
    };
  } catch (error) {
    console.warn("🔄 PDF generation failed, using HTML fallback:", error instanceof Error ? error.message : String(error));
    const htmlBuffer = generateInvoiceHTMLBuffer(data);
    return {
      buffer: htmlBuffer,
      isPDF: false,
      contentType: 'text/html',
      filename: `invoice-${data.orderId}.html`
    };
  }
}

export function calculateOrderTotals(
  items: Array<{ price: number; quantity: number }>,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxRate = 0.18; // 18% tax
  const tax = Math.round(subtotal * taxRate);
  const deliveryFee = 40;
  const total = subtotal + tax + deliveryFee;

  return { subtotal, tax, deliveryFee, total };
}
