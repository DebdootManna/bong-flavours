import { NextRequest, NextResponse } from 'next/server'
import { generateInvoicePDF } from '@/lib/invoice'
import { sendOrderEmail } from '@/lib/mailer'

// Test endpoint to debug order processing, PDF generation, and email sending
export async function GET(_req: NextRequest) {
  console.log('🧪 Test Order API - Starting diagnostic tests')

  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as Array<{
      name: string
      status: 'success' | 'error'
      details: Record<string, unknown>
      duration: number
    }>
  }

  // Test 1: Environment Variables Check
  const envTest = {
    name: 'Environment Variables',
    status: 'success' as const,
    details: {
      SMTP_HOST: process.env.SMTP_HOST ? 'Set' : 'Not set',
      SMTP_USER: process.env.SMTP_USER ? 'Set' : 'Not set',
      SMTP_PASS: process.env.SMTP_PASS ? 'Set' : 'Not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    },
    duration: 0
  }
  results.tests.push(envTest)

  // Test 2: PDF Generation
  const pdfStartTime = Date.now()
  try {
    console.log('📄 Testing PDF generation...')

    const testInvoiceData = {
      orderId: 'TEST001',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '+91 9999999999',
      deliveryAddress: 'Test Address, Test City',
      items: [
        { name: 'Test Paneer Curry', quantity: 2, price: 150 },
        { name: 'Test Rice', quantity: 1, price: 80 }
      ],
      subtotal: 380,
      tax: 68,
      deliveryFee: 40,
      total: 488,
      orderDate: new Date().toLocaleDateString('en-IN'),
      paymentMethod: 'Cash on Delivery'
    }

    const pdfBuffer = await generateInvoicePDF(testInvoiceData)

    results.tests.push({
      name: 'PDF Generation',
      status: 'success',
      details: {
        pdfSize: pdfBuffer.length,
        message: 'PDF generated successfully'
      },
      duration: Date.now() - pdfStartTime
    })

    console.log('✅ PDF generation test passed')

    // Test 3: Email Sending
    const emailStartTime = Date.now()
    try {
      console.log('📧 Testing email sending...')

      const testEmailData = {
        orderId: 'TEST001',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        items: [
          { name: 'Test Paneer Curry', quantity: 2, price: 150 },
          { name: 'Test Rice', quantity: 1, price: 80 }
        ],
        total: 488,
        address: 'Test Address, Test City',
        phone: '+91 9999999999'
      }

      await sendOrderEmail(testEmailData, pdfBuffer)

      results.tests.push({
        name: 'Email Sending',
        status: 'success',
        details: {
          message: 'Email sending completed (check console for SMTP status)',
          emailTo: [testEmailData.customerEmail, process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || 'admin@bongflavours.com']
        },
        duration: Date.now() - emailStartTime
      })

      console.log('✅ Email sending test completed')

    } catch (emailError) {
      console.error('❌ Email test failed:', emailError)
      results.tests.push({
        name: 'Email Sending',
        status: 'error',
        details: {
          error: emailError instanceof Error ? emailError.message : String(emailError),
          stack: emailError instanceof Error ? emailError.stack : undefined
        },
        duration: Date.now() - emailStartTime
      })
    }

  } catch (pdfError) {
    console.error('❌ PDF test failed:', pdfError)
    results.tests.push({
      name: 'PDF Generation',
      status: 'error',
      details: {
        error: pdfError instanceof Error ? pdfError.message : String(pdfError),
        stack: pdfError instanceof Error ? pdfError.stack : undefined
      },
      duration: Date.now() - pdfStartTime
    })
  }

  // Test 4: System Resources
  const systemTest = {
    name: 'System Resources',
    status: 'success' as const,
    details: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    },
    duration: 0
  }
  results.tests.push(systemTest)

  console.log('🎉 Test Order API - All tests completed')

  return NextResponse.json(results, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  })
}

// Test endpoint for simulating order creation with debugging
export async function POST(req: NextRequest) {
  try {
    console.log('🧪 Test Order API - POST - Simulating order creation')

    const body = await req.json()
    console.log('📥 Received test order data:', JSON.stringify(body, null, 2))

    // Simulate order processing with the actual flow
    const testOrder = {
      orderNumber: `TEST${Date.now()}`,
      userId: 'test-user-id',
      customerInfo: body.customerInfo || {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+91 9999999999',
        address: 'Test Address'
      },
      items: body.items || [
        { menuItemId: 'test-1', name: 'Test Item', price: 150, quantity: 1 }
      ],
      subtotal: 150,
      tax: 27,
      deliveryFee: 40,
      total: 217,
      status: 'placed',
      paymentMethod: body.paymentMethod || 'cod',
      paymentStatus: 'pending',
      deliveryInfo: body.deliveryInfo || {
        address: 'Test Address',
        phone: '+91 9999999999'
      },
      createdAt: new Date()
    }

    console.log('📊 Test order object created:', testOrder.orderNumber)

    // Test PDF generation
    try {
      const invoiceData = {
        orderId: testOrder.orderNumber,
        customerName: testOrder.customerInfo.name,
        customerEmail: testOrder.customerInfo.email,
        customerPhone: testOrder.customerInfo.phone,
        deliveryAddress: testOrder.deliveryInfo.address,
        items: testOrder.items.map((item: { name: string; quantity: number; price: number }) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: testOrder.subtotal,
        tax: testOrder.tax,
        deliveryFee: testOrder.deliveryFee,
        total: testOrder.total,
        orderDate: new Date().toLocaleDateString('en-IN'),
        paymentMethod: 'Cash on Delivery'
      }

      console.log('📄 Generating test invoice...')
      const invoicePdf = await generateInvoicePDF(invoiceData)
      console.log('✅ Test invoice generated successfully')

      // Test email sending
      try {
        const emailData = {
          orderId: testOrder.orderNumber,
          customerName: testOrder.customerInfo.name,
          customerEmail: testOrder.customerInfo.email,
          items: testOrder.items,
          total: testOrder.total,
          address: testOrder.deliveryInfo.address,
          phone: testOrder.customerInfo.phone
        }

        console.log('📧 Sending test emails...')
        await sendOrderEmail(emailData, invoicePdf)
        console.log('✅ Test emails processed successfully')

        return NextResponse.json({
          success: true,
          message: 'Test order processed successfully',
          order: testOrder,
          pdfGenerated: true,
          emailSent: true,
          timestamp: new Date().toISOString()
        })

      } catch (emailError) {
        console.error('❌ Test email failed:', emailError)
        return NextResponse.json({
          success: false,
          message: 'Test order created but email failed',
          order: testOrder,
          pdfGenerated: true,
          emailSent: false,
          emailError: emailError instanceof Error ? emailError.message : String(emailError),
          timestamp: new Date().toISOString()
        })
      }

    } catch (pdfError) {
      console.error('❌ Test PDF generation failed:', pdfError)
      return NextResponse.json({
        success: false,
        message: 'Test order created but PDF generation failed',
        order: testOrder,
        pdfGenerated: false,
        emailSent: false,
        pdfError: pdfError instanceof Error ? pdfError.message : String(pdfError),
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('❌ Test order API failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Test order API failed',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
