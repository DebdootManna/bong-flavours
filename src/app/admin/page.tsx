"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  createdAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface Booking {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  date: string;
  time: string;
  guests: number;
  status: string;
  specialRequests: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          if (userData.user.role === "admin") {
            setUser(userData.user);
            await fetchDashboardData();
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, ordersRes, bookingsRes, dashboardRes] =
        await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/orders"),
          fetch("/api/admin/bookings"),
          fetch("/api/admin/dashboard"),
        ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);
      }

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        setStats(dashboardData.stats || stats);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        refreshData();
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        refreshData();
      }
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#6F1D1B" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFE6A7] mx-auto"></div>
          <p className="mt-4 text-[#FFE6A7] font-body text-lg">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#6F1D1B" }}>
      {/* Header */}
      <header className="shadow" style={{ backgroundColor: "#FFE6A7" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="font-title text-4xl font-bold text-[#6F1D1B]">
                Bong Flavours Admin
              </h1>
              <p className="text-[#6F1D1B] font-body text-lg">
                Welcome back, {user?.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors font-heading text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav
        className="border-b"
        style={{ backgroundColor: "#FFE6A7", borderColor: "#6F1D1B" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "users", label: "Users" },
              { id: "orders", label: "Orders" },
              { id: "bookings", label: "Bookings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-heading text-base font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-[#6F1D1B] text-[#6F1D1B]"
                    : "border-transparent text-[#6F1D1B] hover:text-[#6F1D1B] hover:border-[#6F1D1B]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === "overview" && (
            <div>
              <h2 className="font-heading text-3xl font-bold text-[#FFE6A7] mb-6">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#FFE6A7] rounded-lg p-6 shadow">
                  <h3 className="font-heading text-xl font-bold text-[#6F1D1B] mb-2">
                    Total Users
                  </h3>
                  <p className="font-title text-3xl font-bold text-[#6F1D1B]">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="bg-[#FFE6A7] rounded-lg p-6 shadow">
                  <h3 className="font-heading text-xl font-bold text-[#6F1D1B] mb-2">
                    Total Orders
                  </h3>
                  <p className="font-title text-3xl font-bold text-[#6F1D1B]">
                    {stats.totalOrders}
                  </p>
                </div>
                <div className="bg-[#FFE6A7] rounded-lg p-6 shadow">
                  <h3 className="font-heading text-xl font-bold text-[#6F1D1B] mb-2">
                    Total Bookings
                  </h3>
                  <p className="font-title text-3xl font-bold text-[#6F1D1B]">
                    {stats.totalBookings}
                  </p>
                </div>
                <div className="bg-[#FFE6A7] rounded-lg p-6 shadow">
                  <h3 className="font-heading text-xl font-bold text-[#6F1D1B] mb-2">
                    Total Revenue
                  </h3>
                  <p className="font-title text-3xl font-bold text-[#6F1D1B]">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2 className="font-heading text-3xl font-bold text-[#FFE6A7] mb-6">
                Users Management
              </h2>
              <div className="bg-[#FFE6A7] rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#6F1D1B]">
                    <thead className="bg-[#6F1D1B]">
                      <tr>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#FFE6A7] divide-y divide-[#6F1D1B]">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base text-[#6F1D1B]">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base text-[#6F1D1B]">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base text-[#6F1D1B]">
                            {user.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === "admin"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base text-[#6F1D1B]">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="font-heading text-3xl font-bold text-[#FFE6A7] mb-6">
                Orders Management
              </h2>
              <div className="bg-[#FFE6A7] rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#6F1D1B]">
                    <thead className="bg-[#6F1D1B]">
                      <tr>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Order #
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#FFE6A7] divide-y divide-[#6F1D1B]">
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base text-[#6F1D1B]">
                            {order.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base text-[#6F1D1B]">
                            {order.user.name}
                          </td>
                          <td className="px-6 py-4 font-body text-base text-[#6F1D1B]">
                            {order.items.map((item, index) => (
                              <div key={index}>
                                {item.name} x{item.quantity}
                              </div>
                            ))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base text-[#6F1D1B]">
                            ₹{order.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "preparing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : order.status === "delivered"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base text-[#6F1D1B]">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order._id, e.target.value)
                              }
                              className="bg-[#6F1D1B] text-[#FFE6A7] px-2 py-1 rounded text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="delivered">Delivered</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h2 className="font-heading text-3xl font-bold text-[#FFE6A7] mb-6">
                Bookings Management
              </h2>
              <div className="bg-[#FFE6A7] rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#6F1D1B]">
                    <thead className="bg-[#6F1D1B]">
                      <tr>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Guests
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Special Requests
                        </th>
                        <th className="px-6 py-3 text-left font-heading text-sm font-bold text-[#FFE6A7] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#FFE6A7] divide-y divide-[#6F1D1B]">
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base text-[#6F1D1B]">
                            {booking.user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base text-[#6F1D1B]">
                            {new Date(booking.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base text-[#6F1D1B]">
                            {booking.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base text-[#6F1D1B]">
                            {booking.guests}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-body text-base text-[#6F1D1B]">
                            {booking.specialRequests || "None"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-base">
                            <select
                              value={booking.status}
                              onChange={(e) =>
                                updateBookingStatus(booking._id, e.target.value)
                              }
                              className="bg-[#6F1D1B] text-[#FFE6A7] px-2 py-1 rounded text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
