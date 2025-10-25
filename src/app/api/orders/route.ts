import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { generateInvoiceWithFallback } from "@/lib/invoice";
import { sendOrderEmail } from "@/lib/mailer";

interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  specialInstructions?: string;
}

// Order item schema for validation
const orderItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  variant: z.string().optional(),
  specialInstructions: z.string().optional(),
});

// Create order schema
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

// GET /api/orders - Get user's orders
export async function GET(req: NextRequest) {
  try {
    // Verify authentication - check both header and cookie
    let token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      // Fallback to cookie
      token = req.cookies.get("auth-token")?.value;
    }

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    await dbConnect();

    // Build query
    const query: { userId?: string; status?: string } = {};

    // If not admin, only show user's orders
    if (payload.role !== "admin") {
      query.userId = payload.id;
    }

    // Filter by status if provided
    if (status && status !== "all") {
      query.status = status;
    }

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/orders - Create new order
export async function POST(req: NextRequest) {
  try {
    console.log("🚀 POST /api/orders - Starting order creation");

    // Verify authentication - check both header and cookie
    let token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      // Fallback to cookie
      token = req.cookies.get("auth-token")?.value;
    }

    if (!token) {
      console.log("❌ No authentication token found");
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);
    console.log("✅ Token verified for user:", payload.id, payload.name);

    const body = await req.json();
    console.log("📥 Received order data:", JSON.stringify(body, null, 2));

    // Validate input
    const validatedData = createOrderSchema.parse(body);
    console.log("✅ Order data validation passed");

    await dbConnect();

    // Get user details
    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate unique order number
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `BF${timestamp.slice(-8)}${random}`;
    };

    let orderNumber = generateOrderNumber();

    // Ensure uniqueness
    let existingOrder = await Order.findOne({ orderNumber });
    while (existingOrder) {
      orderNumber = generateOrderNumber();
      existingOrder = await Order.findOne({ orderNumber });
    }

    // Calculate totals
    let subtotal = 0;
    validatedData.items.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    // Calculate tax (18% GST) and delivery fee
    const deliveryFee = 40;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax + deliveryFee;

    // Create order data matching the Order model
    const orderData = {
      orderNumber,
      userId: payload.id,
      customerInfo: validatedData.customerInfo,
      items: validatedData.items,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: "placed" as const,
      paymentMethod: validatedData.paymentMethod,
      paymentStatus: "pending" as const,
      deliveryInfo: validatedData.deliveryInfo,
      notes: validatedData.notes,
    };

    // Create order
    const order = await Order.create(orderData);

    // Populate user details for response
    await order.populate("userId", "name email phone");

    // Generate and send invoice automatically with retry logic
    let invoiceGenerated = false;
    let emailsSent = false;

    console.log("Starting invoice generation for order:", order.orderNumber);

    // Prepare invoice data
    const invoiceData = {
      orderId: order.orderNumber,
      customerName: order.customerInfo.name,
      customerEmail: order.customerInfo.email,
      customerPhone: order.customerInfo.phone,
      deliveryAddress: order.deliveryInfo.address,
      items: order.items.map((item: OrderItem) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      deliveryFee: order.deliveryFee || 40,
      total: order.total,
      orderDate: new Date(order.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      paymentMethod:
        order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment",
    };

    // Generate invoice with fallback system
    let invoiceBuffer: Buffer | null = null;
    let invoiceType: string = 'unknown';
    let invoiceFilename: string = `invoice-${order.orderNumber}.pdf`;

    try {
      console.log("📄 Starting invoice generation for order:", order.orderNumber);
      console.log("🔧 System info - Memory:", process.memoryUsage());
      console.log("🔧 Platform:", process.platform, process.arch);

      const invoiceStartTime = Date.now();
      const invoiceResult = await generateInvoiceWithFallback(invoiceData);
      const invoiceDuration = Date.now() - invoiceStartTime;

      invoiceBuffer = invoiceResult.buffer;
      invoiceType = invoiceResult.contentType;
      invoiceFilename = invoiceResult.filename;
      invoiceGenerated = true;

      console.log(`✅ Invoice generated successfully in ${invoiceDuration}ms`);
      console.log(`📊 Invoice type: ${invoiceResult.isPDF ? 'PDF' : 'HTML'}, Size: ${invoiceBuffer.length} bytes`);

      if (!invoiceResult.isPDF) {
        console.log("⚠️ Note: HTML fallback was used due to PDF generation issues");
      }
    } catch (invoiceError) {
      console.error("❌ Invoice generation completely failed:", invoiceError);
      console.error("💡 Order will be created without invoice - can be generated later");
    }

    // Try to send emails (with or without PDF attachment)
    try {
      console.log("📧 Starting email sending process...");

      // Prepare email data
      const emailData = {
        orderId: order.orderNumber,
        customerName: order.customerInfo.name,
        customerEmail: order.customerInfo.email,
        items: order.items.map((item: OrderItem) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: order.total,
        address: order.deliveryInfo.address,
        phone: order.customerInfo.phone,
      };

      if (invoiceGenerated && invoiceBuffer) {
        console.log(`📎 Sending emails with ${invoiceType.includes('pdf') ? 'PDF' : 'HTML'} attachment`);
        await sendOrderEmail(emailData, invoiceBuffer, invoiceFilename);
      } else {
        console.log("📧 Sending emails without attachment (invoice generation failed)");
        // Send emails without attachment
        await sendOrderEmail(emailData, Buffer.alloc(0));
      }

      emailsSent = true;
      console.log("✅ Order emails sent successfully for order:", order.orderNumber);

    } catch (emailError) {
      console.error("❌ Failed to send order emails (order still created):", emailError);
      console.error("Email Error details:", {
        message: emailError instanceof Error ? emailError.message : String(emailError),
        code: (emailError as { code?: string })?.code,
        stack: emailError instanceof Error ? emailError.stack?.split('\n').slice(0, 3).join('\n') : undefined
      });
    }

    // Update order with results
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (invoiceGenerated) {
      updateData.invoiceUrl = `invoice-${order.orderNumber}.pdf`;
    }

    await Order.findByIdAndUpdate(order._id, updateData);

    console.log("📊 Order processing summary:", {
      orderNumber: order.orderNumber,
      orderId: order._id,
      invoiceGenerated,
      emailsSent,
      customerEmail: order.customerInfo.email,
      totalAmount: order.total,
      timestamp: new Date().toISOString()
    });

    // Log specific guidance based on results
    if (!invoiceGenerated) {
      console.log("💡 PDF generation failed - you can manually generate it later at:");
      console.log(`   GET /api/invoices/${order._id}`);
    }

    if (!emailsSent) {
      console.log("💡 Email sending failed - check SMTP configuration or use Mailtrap");
    }

    return NextResponse.json(
      {
        message: "Order created successfully",
        orderNumber: order.orderNumber,
        orderId: order._id,
        total: order.total,
        status: order.status,
        invoiceGenerated,
        emailsSent,
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 },
      );
    }

    console.error("Create order error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
