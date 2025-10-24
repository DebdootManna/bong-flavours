"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

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
    // Check if user is logged in and is admin
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      router.push("/");
      return;
    }

    setUser(parsedUser);

    // Define fetchDashboardData inside useEffect to avoid dependency warning
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get auth token for API requests
        const token = localStorage.getItem("auth-token");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Fetch all data in parallel
        const [usersRes, ordersRes, bookingsRes] = await Promise.all([
          fetch("/api/admin/users", { headers }),
          fetch("/api/admin/orders", { headers }),
          fetch("/api/admin/bookings", { headers }),
        ]);

        let usersData: User[] = [];
        let ordersData: Order[] = [];
        let bookingsData: Booking[] = [];

        if (usersRes.ok) {
          const userData = await usersRes.json();
          usersData = userData.users || [];
          setUsers(usersData);
        }

        if (ordersRes.ok) {
          const orderData = await ordersRes.json();
          ordersData = orderData.orders || [];
          setOrders(ordersData);
        }

        if (bookingsRes.ok) {
          const bookingData = await bookingsRes.json();
          bookingsData = bookingData.bookings || [];
          setBookings(bookingsData);
        }

        // Calculate stats
        const totalRevenue = ordersData.reduce(
          (sum, order) => sum + order.totalAmount,
          0,
        );
        setStats({
          totalUsers: usersData.length,
          totalOrders: ordersData.length,
          totalBookings: bookingsData.length,
          totalRevenue,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const refreshData = async () => {
    try {
      setLoading(true);

      // Get auth token for API requests
      const token = localStorage.getItem("auth-token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Fetch all data in parallel
      const [usersRes, ordersRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/users", { headers }),
        fetch("/api/admin/orders", { headers }),
        fetch("/api/admin/bookings", { headers }),
      ]);

      let usersData: User[] = [];
      let ordersData: Order[] = [];
      let bookingsData: Booking[] = [];

      if (usersRes.ok) {
        const userData = await usersRes.json();
        usersData = userData.users || [];
        setUsers(usersData);
      }

      if (ordersRes.ok) {
        const orderData = await ordersRes.json();
        ordersData = orderData.orders || [];
        setOrders(ordersData);
      }

      if (bookingsRes.ok) {
        const bookingData = await bookingsRes.json();
        bookingsData = bookingData.bookings || [];
        setBookings(bookingsData);
      }

      // Calculate stats
      const totalRevenue = ordersData.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      );
      setStats({
        totalUsers: usersData.length,
        totalOrders: ordersData.length,
        totalBookings: bookingsData.length,
        totalRevenue,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        refreshData(); // Refresh data
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        refreshData(); // Refresh data
      }
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "#6F1D1B" }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFE6A7] mx-auto"></div>
            <p
              className="mt-4 text-[#FFE6A7]"
              style={{ fontFamily: "serif", fontSize: "18px" }}
            >
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="min-h-screen" style={{ backgroundColor: "#6F1D1B" }}>
        {/* Header */}
        <header className="shadow" style={{ backgroundColor: "#FFE6A7" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1
                  className="font-bold text-[#6F1D1B]"
                  style={{ fontFamily: "Oswald", fontSize: "32px" }}
                >
                  Bong Flavours Admin
                </h1>
                <p
                  className="text-[#6F1D1B]"
                  style={{ fontFamily: "serif", fontSize: "18px" }}
                >
                  Welcome back, {user?.name}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                style={{ fontFamily: "serif", fontSize: "16px" }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-[#FFE6A7]">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview" },
                { id: "analytics", label: "Analytics" },
                { id: "orders", label: "Orders" },
                { id: "bookings", label: "Bookings" },
                { id: "users", label: "Users" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium ${
                    activeTab === tab.id
                      ? "border-[#FFE6A7] text-[#FFE6A7]"
                      : "border-transparent text-[#FFE6A7] opacity-60 hover:opacity-100"
                  }`}
                  style={{ fontFamily: "sans-serif", fontSize: "18px" }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "overview" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div
                  className="p-6 rounded-lg shadow"
                  style={{ backgroundColor: "#FFE6A7" }}
                >
                  <h3
                    className="font-medium text-[#6F1D1B]"
                    style={{ fontFamily: "sans-serif", fontSize: "18px" }}
                  >
                    Total Users
                  </h3>
                  <p
                    className="font-bold text-[#6F1D1B]"
                    style={{ fontFamily: "Oswald", fontSize: "32px" }}
                  >
                    {stats.totalUsers}
                  </p>
                </div>
                <div
                  className="p-6 rounded-lg shadow"
                  style={{ backgroundColor: "#FFE6A7" }}
                >
                  <h3
                    className="font-medium text-[#6F1D1B]"
                    style={{ fontFamily: "sans-serif", fontSize: "18px" }}
                  >
                    Total Orders
                  </h3>
                  <p
                    className="font-bold text-[#6F1D1B]"
                    style={{ fontFamily: "Oswald", fontSize: "32px" }}
                  >
                    {stats.totalOrders}
                  </p>
                </div>
                <div
                  className="p-6 rounded-lg shadow"
                  style={{ backgroundColor: "#FFE6A7" }}
                >
                  <h3
                    className="font-medium text-[#6F1D1B]"
                    style={{ fontFamily: "sans-serif", fontSize: "18px" }}
                  >
                    Total Bookings
                  </h3>
                  <p
                    className="font-bold text-[#6F1D1B]"
                    style={{ fontFamily: "Oswald", fontSize: "32px" }}
                  >
                    {stats.totalBookings}
                  </p>
                </div>
                <div
                  className="p-6 rounded-lg shadow"
                  style={{ backgroundColor: "#FFE6A7" }}
                >
                  <h3
                    className="font-medium text-[#6F1D1B]"
                    style={{ fontFamily: "sans-serif", fontSize: "18px" }}
                  >
                    Total Revenue
                  </h3>
                  <p
                    className="font-bold text-[#6F1D1B]"
                    style={{ fontFamily: "Oswald", fontSize: "32px" }}
                  >
                    ₹{stats.totalRevenue}
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Orders
                  </h3>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="flex justify-between items-center py-2 border-b border-gray-100"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.user.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">
                            ₹{order.totalAmount}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "preparing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Bookings
                  </h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking._id}
                        className="flex justify-between items-center py-2 border-b border-gray-100"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {booking.user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.date).toLocaleDateString()} at{" "}
                            {booking.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">
                            {booking.guests} guests
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "requested"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Analytics Dashboard
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Order Status Distribution */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Order Status Distribution
                  </h3>
                  <div className="space-y-2">
                    {[
                      "pending",
                      "confirmed",
                      "preparing",
                      "delivered",
                      "cancelled",
                    ].map((status) => {
                      const count = orders.filter(
                        (order) => order.status === status,
                      ).length;
                      const percentage =
                        orders.length > 0
                          ? ((count / orders.length) * 100).toFixed(1)
                          : "0";
                      return (
                        <div
                          key={status}
                          className="flex justify-between items-center"
                        >
                          <span className="capitalize text-sm">{status}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{count}</span>
                            <span className="text-xs text-gray-500">
                              ({percentage}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Booking Status Distribution */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Booking Status Distribution
                  </h3>
                  <div className="space-y-2">
                    {["requested", "confirmed", "completed", "cancelled"].map(
                      (status) => {
                        const count = bookings.filter(
                          (booking) => booking.status === status,
                        ).length;
                        const percentage =
                          bookings.length > 0
                            ? ((count / bookings.length) * 100).toFixed(1)
                            : "0";
                        return (
                          <div
                            key={status}
                            className="flex justify-between items-center"
                          >
                            <span className="capitalize text-sm">{status}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {count}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({percentage}%)
                              </span>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Average Order Value */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Order Analytics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Order Value</span>
                      <span className="font-medium">
                        ₹
                        {orders.length > 0
                          ? (stats.totalRevenue / orders.length).toFixed(0)
                          : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Highest Order</span>
                      <span className="font-medium">
                        ₹
                        {orders.length > 0
                          ? Math.max(...orders.map((o) => o.totalAmount))
                          : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Items Sold</span>
                      <span className="font-medium">
                        {orders.reduce(
                          (sum, order) =>
                            sum +
                            order.items.reduce(
                              (itemSum, item) => itemSum + item.quantity,
                              0,
                            ),
                          0,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Growth */}
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  User Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {users.filter((u) => u.role === "customer").length}
                    </p>
                    <p className="text-sm text-blue-600">Customers</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {users.filter((u) => u.role === "admin").length}
                    </p>
                    <p className="text-sm text-green-600">Admins</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {users.length}
                    </p>
                    <p className="text-sm text-purple-600">Total Users</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Orders
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{order.totalAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "preparing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "pending"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Bookings
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guests
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.date).toLocaleDateString()} at{" "}
                          {booking.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              updateBookingStatus(booking._id, e.target.value)
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
