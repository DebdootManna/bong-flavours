import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { verifyToken } from "@/lib/auth";

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

// GET /api/admin/bookings - Get all bookings
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

    // Get all bookings with user info
    const bookings = await Booking.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .select(
        "name email date time numPersons status specialRequests createdAt",
      );

    // Transform bookings to match the expected format
    const transformedBookings = bookings.map((booking) => ({
      _id: booking._id,
      user: {
        name:
          (booking.userId as unknown as PopulatedUser)?.name ||
          booking.name ||
          "Guest User",
        email:
          (booking.userId as unknown as PopulatedUser)?.email ||
          booking.email ||
          "N/A",
      },
      date: booking.date,
      time: booking.time,
      guests: booking.numPersons || 1,
      status: booking.status || "pending",
      specialRequests: booking.specialRequests || "",
      createdAt: booking.createdAt,
    }));

    return NextResponse.json({
      success: true,
      bookings: transformedBookings || [],
    });
  } catch (error) {
    console.error("Admin bookings fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
