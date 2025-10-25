import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    tests: {}
  };

  // Test 1: Environment Variables
  try {
    results.tests.environment = {
      status: 'success',
      variables: {
        MONGODB_URI: !!process.env.MONGODB_URI,
        JWT_SECRET: !!process.env.JWT_SECRET,
        SMTP_USER: !!process.env.SMTP_USER,
        NODE_ENV: process.env.NODE_ENV
      }
    };
  } catch (error) {
    results.tests.environment = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  // Test 2: Database Connection
  try {
    await dbConnect();
    results.tests.database = {
      status: 'success',
      message: 'Connected to MongoDB successfully'
    };
  } catch (error) {
    results.tests.database = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Database connection failed'
    };
  }

  // Test 3: Database Collections
  try {
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();

    results.tests.collections = {
      status: 'success',
      counts: {
        users: userCount,
        orders: orderCount
      }
    };
  } catch (error) {
    results.tests.collections = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Collection query failed'
    };
  }

  // Test 4: Authentication (if token provided)
  try {
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('auth-token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (token) {
      const payload = verifyToken(token);
      results.tests.authentication = {
        status: 'success',
        tokenValid: true,
        userId: payload.id,
        userRole: payload.role
      };
    } else {
      results.tests.authentication = {
        status: 'info',
        tokenValid: false,
        message: 'No token provided'
      };
    }
  } catch (error) {
    results.tests.authentication = {
      status: 'error',
      tokenValid: false,
      error: error instanceof Error ? error.message : 'Auth verification failed'
    };
  }

  // Test 5: Sample Order Validation
  try {
    const sampleOrderData = {
      items: [{
        menuItemId: 'test-item-id',
        name: 'Test Item',
        price: 100,
        quantity: 1
      }],
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '9876543210',
        address: 'Test Address'
      },
      deliveryInfo: {
        address: 'Test Delivery Address',
        phone: '9876543210'
      },
      paymentMethod: 'cod' as const
    };

    // Import validation schema
    const { z } = await import('zod');

    const orderItemSchema = z.object({
      menuItemId: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      variant: z.string().optional(),
      specialInstructions: z.string().optional(),
    });

    const createOrderSchema = z.object({
      items: z.array(orderItemSchema).min(1, "At least one item is required"),
      customerInfo: z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        address: z.string().min(1),
      }),
      deliveryInfo: z.object({
        address: z.string().min(1),
        phone: z.string().min(1),
        deliveryNotes: z.string().optional(),
      }),
      paymentMethod: z.enum(["cod", "online"]).default("cod"),
      notes: z.string().optional(),
    });

    createOrderSchema.parse(sampleOrderData);

    results.tests.orderValidation = {
      status: 'success',
      message: 'Order validation schema working correctly'
    };
  } catch (error) {
    results.tests.orderValidation = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Validation failed'
    };
  }

  // Calculate overall status
  const failedTests = Object.values(results.tests).filter((test: any) => test.status === 'error');
  results.overall = {
    status: failedTests.length === 0 ? 'success' : 'error',
    passedTests: Object.keys(results.tests).length - failedTests.length,
    totalTests: Object.keys(results.tests).length,
    failedTests: failedTests.length
  };

  return NextResponse.json(results, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    return NextResponse.json({
      message: 'Debug POST endpoint working',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to parse request body',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
