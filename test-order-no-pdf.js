require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Simple order creation test without PDF generation
async function testOrderWithoutPDF() {
  console.log('🧪 Testing Order Creation (No PDF)');
  console.log('==================================================');

  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Test order data
    const orderData = {
      items: [
        {
          menuItemId: "item_25",
          name: "Fish Cutlet (1 pcs)",
          price: 110,
          quantity: 1
        },
        {
          menuItemId: "item_26",
          name: "Fish Kobiraji",
          price: 210,
          quantity: 1
        }
      ],
      customerInfo: {
        name: "Test Customer",
        email: "test@example.com",
        phone: "9999999999",
        address: "Test Address, Test City"
      },
      deliveryInfo: {
        address: "Test Address, Test City",
        phone: "9999999999",
        deliveryNotes: "Test order - no PDF"
      },
      paymentMethod: "cod",
      notes: "Test order without PDF generation"
    };

    console.log('📝 Making API request to create order...');

    // Simulate the API call
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // You might need a real token
      },
      body: JSON.stringify(orderData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Order created successfully:', result);
    } else {
      const error = await response.text();
      console.log('❌ Order creation failed:', response.status, error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 MongoDB disconnected');
    }
  }
}

// Alternative: Test direct order creation in database
async function testDirectOrderCreation() {
  console.log('\n🔨 Testing Direct Order Creation in Database');
  console.log('==================================================');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Import the Order model
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

    // Calculate totals
    const items = [
      { price: 110, quantity: 1 },
      { price: 210, quantity: 1 }
    ];
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.18);
    const deliveryFee = 40;
    const total = subtotal + tax + deliveryFee;

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `BF${String(orderCount + 1).padStart(6, '0')}`;

    // Create order
    const order = new Order({
      orderNumber,
      items: [
        {
          menuItemId: "item_25",
          name: "Fish Cutlet (1 pcs)",
          price: 110,
          quantity: 1
        },
        {
          menuItemId: "item_26",
          name: "Fish Kobiraji",
          price: 210,
          quantity: 1
        }
      ],
      customerInfo: {
        name: "Direct Test Customer",
        email: "directtest@example.com",
        phone: "8888888888",
        address: "Direct Test Address, Direct Test City"
      },
      deliveryInfo: {
        address: "Direct Test Address, Direct Test City",
        phone: "8888888888",
        deliveryNotes: "Direct database test order"
      },
      subtotal,
      tax,
      deliveryFee,
      total,
      paymentMethod: "cod",
      notes: "Direct database test - no PDF, no email",
      invoiceGenerated: false,
      emailsSent: false
    });

    const savedOrder = await order.save();
    console.log('✅ Order saved directly to database:', {
      orderNumber: savedOrder.orderNumber,
      total: savedOrder.total,
      id: savedOrder._id
    });

    console.log('📋 Order details:', {
      items: savedOrder.items.length,
      subtotal: savedOrder.subtotal,
      tax: savedOrder.tax,
      deliveryFee: savedOrder.deliveryFee,
      total: savedOrder.total,
      status: savedOrder.status
    });

  } catch (error) {
    console.error('❌ Direct order creation failed:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 MongoDB disconnected');
    }
  }
}

// Run tests
async function runTests() {
  await testDirectOrderCreation();
  // Uncomment below to test API endpoint (requires server running)
  // await testOrderWithoutPDF();
}

runTests().catch(console.error);
