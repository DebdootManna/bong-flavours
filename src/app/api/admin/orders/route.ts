import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

// GET /api/admin/orders - Get all orders
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const token =
      req.cookies.get("auth-token")?.value ||
      req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);

    // Check if user is admin
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    await dbConnect();

    // Get all orders with user info
    const orders = await Order.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .select(
        "orderNumber customerInfo items total status paymentStatus createdAt",
      );

    // Transform orders to match the expected format
    const transformedOrders = orders.map((order) => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      user: {
        name:
          (order.userId as unknown as PopulatedUser)?.name ||
          order.customerInfo?.name ||
          "Guest User",
        email:
          (order.userId as unknown as PopulatedUser)?.email ||
          order.customerInfo?.email ||
          "N/A",
      },
      items: order.items || [],
      totalAmount: order.total || 0,
      status: order.status || "pending",
      createdAt: order.createdAt,
    }));

    return NextResponse.json({
      success: true,
      orders: transformedOrders || [],
    });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
