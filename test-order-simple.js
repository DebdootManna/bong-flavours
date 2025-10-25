// Simple test script for order processing without Next.js server
const fs = require('fs');
const path = require('path');

// Mock data for testing
const mockOrderData = {
  orderId: 'TEST' + Date.now(),
  customerName: 'Test Customer',
  customerEmail: 'test@example.com',
  customerPhone: '+91 9999999999',
  deliveryAddress: 'Test Address, Test City, 110001',
  items: [
    { name: 'Paneer Kathi Roll', quantity: 2, price: 140 },
    { name: 'Egg Chicken Kathi Roll', quantity: 1, price: 170 }
  ],
  subtotal: 450,
  tax: 81,
  deliveryFee: 40,
  total: 571,
  orderDate: new Date().toLocaleDateString('en-IN'),
  paymentMethod: 'Cash on Delivery'
};

console.log('🧪 Simple Order Processing Test');
console.log('='.repeat(50));
console.log('Order Data:', JSON.stringify(mockOrderData, null, 2));

// Test 1: Generate HTML Invoice
function generateInvoiceHTML(data) {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td class="item-name">${item.name}</td>
      <td class="item-qty">${item.quantity}</td>
      <td class="item-price">₹${item.price.toFixed(2)}</td>
      <td class="item-total">₹${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `
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
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="company-info">
          <h1>Bong Flavours</h1>
          <p>Authentic Bengali Restaurant</p>
          <p>Phone: 8238018577</p>
          <p>Email: mannadebdoot007@gmail.com</p>
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
        <p>For any queries regarding this invoice, please contact us at 8238018577</p>
      </div>

      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="background: #6F1D1B; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Print Invoice</button>
      </div>
    </body>
    </html>
  `;
}

// Test 2: Generate Email Content
function generateEmailContent(data) {
  const itemsList = data.items.map(item =>
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.quantity * item.price}</td>
    </tr>`
  ).join('');

  return {
    customerEmail: `
      <h2>Order Confirmation - Bong Flavours</h2>
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <p>Dear ${data.customerName},</p>
        <p>Thank you for your order! Your order #${data.orderId} has been received and is being prepared.</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Order Summary:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 5px;">Item</th>
                <th style="text-align: center; padding: 5px;">Qty</th>
                <th style="text-align: right; padding: 5px;">Price</th>
                <th style="text-align: right; padding: 5px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr style="font-weight: bold; border-top: 2px solid #ddd;">
                <td colspan="3" style="text-align: right; padding: 10px 5px;">Total:</td>
                <td style="text-align: right; padding: 10px 5px;">₹${data.total}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p><strong>Delivery Address:</strong> ${data.deliveryAddress}</p>
        <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>

        <p>Your order will be delivered within 45-60 minutes. For any queries, please call us at 8238018577.</p>

        <p>Thank you for choosing Bong Flavours!</p>
        <p>Best regards,<br>Bong Flavours Team</p>
      </div>
    `,
    restaurantEmail: `
      <h2>New Order Received - #${data.orderId}</h2>
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h3>Customer Details:</h3>
        <p><strong>Name:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> ${data.customerEmail}</p>
        <p><strong>Phone:</strong> ${data.customerPhone}</p>
        <p><strong>Address:</strong> ${data.deliveryAddress}</p>

        <h3>Order Items:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
            <tr style="background: #f9f9f9; font-weight: bold;">
              <td colspan="3" style="padding: 10px; text-align: right;">Total:</td>
              <td style="padding: 10px; text-align: right;">₹${data.total}</td>
            </tr>
          </tbody>
        </table>

        <p><strong>Payment:</strong> ${data.paymentMethod}</p>
      </div>
    `
  };
}

// Run Tests
async function runTests() {
  try {
    console.log('\n1️⃣ Testing HTML Invoice Generation...');
    const invoiceHTML = generateInvoiceHTML(mockOrderData);
    const invoiceFile = path.join(__dirname, `test-invoice-${mockOrderData.orderId}.html`);
    fs.writeFileSync(invoiceFile, invoiceHTML);
    console.log('✅ HTML Invoice generated:', invoiceFile);
    console.log('📄 File size:', fs.statSync(invoiceFile).size, 'bytes');

    console.log('\n2️⃣ Testing Email Content Generation...');
    const emailContent = generateEmailContent(mockOrderData);

    // Save customer email
    const customerEmailFile = path.join(__dirname, `test-customer-email-${mockOrderData.orderId}.html`);
    fs.writeFileSync(customerEmailFile, emailContent.customerEmail);
    console.log('✅ Customer email generated:', customerEmailFile);

    // Save restaurant email
    const restaurantEmailFile = path.join(__dirname, `test-restaurant-email-${mockOrderData.orderId}.html`);
    fs.writeFileSync(restaurantEmailFile, emailContent.restaurantEmail);
    console.log('✅ Restaurant email generated:', restaurantEmailFile);

    console.log('\n3️⃣ Testing Environment Check...');
    require('dotenv').config({ path: '.env.local' });

    console.log('SMTP_HOST:', process.env.SMTP_HOST || '❌ Not set');
    console.log('SMTP_USER:', process.env.SMTP_USER || '❌ Not set');
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ Not set');

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n💡 Next Steps:');
    console.log('1. Open the generated HTML files in your browser');
    console.log('2. Test print/save as PDF from browser');
    console.log('3. Configure SMTP settings for email sending');
    console.log('4. Use Mailtrap for development email testing');

    console.log('\n📋 Generated Files:');
    console.log('- Invoice HTML:', invoiceFile);
    console.log('- Customer Email:', customerEmailFile);
    console.log('- Restaurant Email:', restaurantEmailFile);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
runTests();
