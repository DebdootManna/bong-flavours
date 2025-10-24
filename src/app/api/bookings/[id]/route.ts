import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

// Update booking schema
const updateBookingSchema = z.object({
  status: z
    .enum(["requested", "confirmed", "cancelled", "completed"])
    .optional(),
  tableNumber: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/bookings/[id] - Get specific booking
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
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

    await dbConnect();

    // Find booking
    const query: { _id: string; userId?: string } = { _id: id };

    // If not admin, only allow access to own bookings
    if (payload.role !== "admin") {
      query.userId = payload.id;
    }

    const booking = await Booking.findOne(query).populate(
      "userId",
      "name email phone",
    );

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/bookings/[id] - Update booking (admin only)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
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

    const body = await req.json();

    // Validate input
    const validatedData = updateBookingSchema.parse(body);

    await dbConnect();

    // Update booking
    const booking = await Booking.findByIdAndUpdate(id, validatedData, {
      new: true,
    }).populate("userId", "name email phone");

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 },
      );
    }

    console.error("Update booking error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH /api/bookings/[id] - Update booking status (admin only) - alias for PUT
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return PUT(req, context);
}

// DELETE /api/bookings/[id] - Cancel booking
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
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

    await dbConnect();

    // Find booking
    const query: { _id: string; userId?: string } = { _id: id };

    // If not admin, only allow access to own bookings
    if (payload.role !== "admin") {
      query.userId = payload.id;
    }

    const booking = await Booking.findOne(query);

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 },
      );
    }

    // Check if booking can be cancelled
    if (["completed", "cancelled"].includes(booking.status)) {
      return NextResponse.json(
        { message: "Booking cannot be cancelled" },
        { status: 400 },
      );
    }

    // Update booking status to cancelled
    booking.status = "cancelled";
    await booking.save();

    return NextResponse.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
