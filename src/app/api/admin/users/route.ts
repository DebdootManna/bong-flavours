import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

// GET /api/admin/users - Get all users
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

    // Get all users with basic info
    const users = await User.find({})
      .select("name email role phone createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users: users || [],
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/users - Update user role
export async function PUT(req: NextRequest) {
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

    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { message: "User ID and role are required" },
        { status: 400 },
      );
    }

    if (!["customer", "admin"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    await dbConnect();

    // Prevent admin from changing their own role
    if (userId === payload.id) {
      return NextResponse.json(
        {
          message:
            "You cannot change your own role. Another admin must do this.",
        },
        { status: 403 },
      );
    }

    // Find and update the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.role = role;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/users - Delete user
export async function DELETE(req: NextRequest) {
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

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Prevent admin from deleting themselves
    if (userId === payload.id) {
      return NextResponse.json(
        {
          message:
            "You cannot delete your own account. Another admin must do this.",
        },
        { status: 403 },
      );
    }

    // Find and delete the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
