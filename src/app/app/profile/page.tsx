"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zipCode?: string;
}

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [editMode, setEditMode] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("auth-token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/auth/profile-v2", {
        headers,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          city: data.user.city || "",
          zipCode: data.user.zipCode || "",
        });
      } else {
        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: "",
          address: "",
          city: "",
          zipCode: "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
      });
    }
  }, [user]);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/orders", {
        headers,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchProfile();
    fetchOrders();
  }, [user, router, fetchProfile, fetchOrders]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const token = localStorage.getItem("auth-token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/auth/profile-v2", {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setEditMode(false);
        setUpdateMessage("Profile updated successfully!");
        setTimeout(() => setUpdateMessage(""), 3000);
      } else {
        setUpdateMessage("Failed to update profile. Please try again.");
        setTimeout(() => setUpdateMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateMessage("Failed to update profile. Please try again.");
      setTimeout(() => setUpdateMessage(""), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-purple-100 text-purple-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return null;
  }

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
              Loading profile...
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
      <div className="min-h-screen py-8" style={{ backgroundColor: "#6F1D1B" }}>
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div
            className="rounded-lg shadow-lg p-6 mb-6"
            style={{ backgroundColor: "#FFE6A7" }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1
                  className="font-bold text-[#6F1D1B] mb-2"
                  style={{ fontFamily: "Oswald", fontSize: "30px" }}
                >
                  My Account
                </h1>
                <p
                  className="text-[#6F1D1B]"
                  style={{ fontFamily: "serif", fontSize: "18px" }}
                >
                  Welcome back, {user.name}!
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/app/menu"
                  className="bg-[#6F1D1B] text-[#FFE6A7] px-4 py-2 rounded-md hover:opacity-80 transition-opacity text-center"
                  style={{ fontFamily: "serif", fontSize: "16px" }}
                >
                  Browse Menu
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  style={{ fontFamily: "serif", fontSize: "16px" }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            className="rounded-lg shadow-lg mb-6"
            style={{ backgroundColor: "#FFE6A7" }}
          >
            <div className="flex border-b border-[#6F1D1B]">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-6 font-medium transition-colors ${
                  activeTab === "profile"
                    ? "border-b-2 border-[#6F1D1B] text-[#6F1D1B]"
                    : "text-[#6F1D1B] hover:text-[#6F1D1B] opacity-60"
                }`}
                style={{ fontFamily: "sans-serif", fontSize: "18px" }}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-6 font-medium transition-colors ${
                  activeTab === "orders"
                    ? "border-b-2 border-[#6F1D1B] text-[#6F1D1B]"
                    : "text-[#6F1D1B] hover:text-[#6F1D1B] opacity-60"
                }`}
                style={{ fontFamily: "sans-serif", fontSize: "18px" }}
              >
                Order History ({orders.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Success Message */}
              {updateMessage && (
                <div
                  className={`mb-6 p-4 rounded-md ${
                    updateMessage.includes("success")
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                  style={{ fontFamily: "serif", fontSize: "16px" }}
                >
                  {updateMessage}
                </div>
              )}

              {activeTab === "profile" && profile && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2
                      className="font-bold text-[#6F1D1B]"
                      style={{ fontFamily: "Oswald", fontSize: "24px" }}
                    >
                      Profile Information
                    </h2>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="bg-[#6F1D1B] text-[#FFE6A7] px-4 py-2 rounded-md hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "serif", fontSize: "16px" }}
                    >
                      {editMode ? "Cancel" : "Edit Profile"}
                    </button>
                  </div>

                  {editMode ? (
                    <form onSubmit={handleProfileUpdate}>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label
                            className="block font-medium text-[#6F1D1B] mb-2"
                            style={{
                              fontFamily: "sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) =>
                              setProfile({ ...profile, name: e.target.value })
                            }
                            className="w-full border border-[#6F1D1B] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] bg-white text-[#6F1D1B]"
                            style={{ fontFamily: "serif", fontSize: "16px" }}
                            required
                          />
                        </div>
                        <div>
                          <label
                            className="block font-medium text-[#6F1D1B] mb-2"
                            style={{
                              fontFamily: "sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            Email *
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              setProfile({ ...profile, email: e.target.value })
                            }
                            className="w-full border border-[#6F1D1B] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] bg-white text-[#6F1D1B]"
                            style={{ fontFamily: "serif", fontSize: "16px" }}
                            required
                          />
                        </div>
                        <div>
                          <label
                            className="block font-medium text-[#6F1D1B] mb-2"
                            style={{
                              fontFamily: "sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            Phone *
                          </label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile({ ...profile, phone: e.target.value })
                            }
                            className="w-full border border-[#6F1D1B] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] bg-white text-[#6F1D1B]"
                            style={{ fontFamily: "serif", fontSize: "16px" }}
                            required
                          />
                        </div>
                        <div>
                          <label
                            className="block font-medium text-[#6F1D1B] mb-2"
                            style={{
                              fontFamily: "sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            City
                          </label>
                          <input
                            type="text"
                            value={profile.city}
                            onChange={(e) =>
                              setProfile({ ...profile, city: e.target.value })
                            }
                            className="w-full border border-[#6F1D1B] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] bg-white text-[#6F1D1B]"
                            style={{ fontFamily: "serif", fontSize: "16px" }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label
                            className="block font-medium text-[#6F1D1B] mb-2"
                            style={{
                              fontFamily: "sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            Address
                          </label>
                          <textarea
                            value={profile.address}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                address: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full border border-[#6F1D1B] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] bg-white text-[#6F1D1B]"
                            style={{ fontFamily: "serif", fontSize: "16px" }}
                          />
                        </div>
                        <div>
                          <label
                            className="block font-medium text-[#6F1D1B] mb-2"
                            style={{
                              fontFamily: "sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            value={profile.zipCode}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                zipCode: e.target.value,
                              })
                            }
                            className="w-full border border-[#6F1D1B] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] bg-white text-[#6F1D1B]"
                            style={{ fontFamily: "serif", fontSize: "16px" }}
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="px-6 py-2 border border-[#6F1D1B] text-[#6F1D1B] rounded-md hover:bg-[#6F1D1B] hover:text-[#FFE6A7] transition-colors"
                          style={{ fontFamily: "serif", fontSize: "16px" }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#6F1D1B] text-[#FFE6A7] px-6 py-2 rounded-md hover:opacity-80 transition-opacity"
                          style={{ fontFamily: "serif", fontSize: "16px" }}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3
                          className="font-medium text-[#6F1D1B] mb-1"
                          style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                        >
                          Full Name
                        </h3>
                        <p
                          className="text-[#6F1D1B]"
                          style={{ fontFamily: "serif", fontSize: "18px" }}
                        >
                          {profile.name}
                        </p>
                      </div>
                      <div>
                        <h3
                          className="font-medium text-[#6F1D1B] mb-1"
                          style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                        >
                          Email
                        </h3>
                        <p
                          className="text-[#6F1D1B]"
                          style={{ fontFamily: "serif", fontSize: "18px" }}
                        >
                          {profile.email}
                        </p>
                      </div>
                      <div>
                        <h3
                          className="font-medium text-[#6F1D1B] mb-1"
                          style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                        >
                          Phone
                        </h3>
                        <p
                          className="text-[#6F1D1B]"
                          style={{ fontFamily: "serif", fontSize: "18px" }}
                        >
                          {profile.phone}
                        </p>
                      </div>
                      <div>
                        <h3
                          className="font-medium text-[#6F1D1B] mb-1"
                          style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                        >
                          City
                        </h3>
                        <p
                          className="text-[#6F1D1B]"
                          style={{ fontFamily: "serif", fontSize: "18px" }}
                        >
                          {profile.city || "Not provided"}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <h3
                          className="font-medium text-[#6F1D1B] mb-1"
                          style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                        >
                          Address
                        </h3>
                        <p
                          className="text-[#6F1D1B]"
                          style={{ fontFamily: "serif", fontSize: "18px" }}
                        >
                          {profile.address || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <h3
                          className="font-medium text-[#6F1D1B] mb-1"
                          style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                        >
                          ZIP Code
                        </h3>
                        <p
                          className="text-[#6F1D1B]"
                          style={{ fontFamily: "serif", fontSize: "18px" }}
                        >
                          {profile.zipCode || "Not provided"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2
                    className="font-bold text-[#6F1D1B] mb-6"
                    style={{ fontFamily: "Oswald", fontSize: "24px" }}
                  >
                    Order History
                  </h2>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-[#6F1D1B] mb-4">
                        <svg
                          className="w-16 h-16 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <h3
                        className="font-bold text-[#6F1D1B] mb-2"
                        style={{ fontFamily: "Oswald", fontSize: "22px" }}
                      >
                        No orders yet
                      </h3>
                      <p
                        className="text-[#6F1D1B] mb-6"
                        style={{ fontFamily: "serif", fontSize: "18px" }}
                      >
                        You haven't placed any orders yet.
                      </p>
                      <Link
                        href="/app/menu"
                        className="inline-block bg-[#6F1D1B] text-[#FFE6A7] px-6 py-3 rounded-md hover:opacity-80 transition-opacity"
                        style={{ fontFamily: "serif", fontSize: "18px" }}
                      >
                        Start Ordering
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="border border-[#6F1D1B] rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                            <div>
                              <h3
                                className="font-bold text-[#6F1D1B]"
                                style={{
                                  fontFamily: "Oswald",
                                  fontSize: "20px",
                                }}
                              >
                                Order #{order.orderNumber}
                              </h3>
                              <p
                                className="text-[#6F1D1B]"
                                style={{
                                  fontFamily: "serif",
                                  fontSize: "16px",
                                }}
                              >
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3 mt-2 md:mt-0">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                                style={{ fontSize: "14px" }}
                              >
                                {order.status}
                              </span>
                              <span
                                className="font-bold text-[#6F1D1B]"
                                style={{
                                  fontFamily: "Oswald",
                                  fontSize: "18px",
                                }}
                              >
                                ₹{order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="mb-3">
                            <p
                              className="text-[#6F1D1B] mb-1"
                              style={{
                                fontFamily: "sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              Items:
                            </p>
                            <div
                              className="text-[#6F1D1B]"
                              style={{ fontFamily: "serif", fontSize: "16px" }}
                            >
                              {order.items.map((item, index) => (
                                <span key={index}>
                                  {item.name} (×{item.quantity})
                                  {index < order.items.length - 1 && ", "}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-[#6F1D1B]">
                            <p
                              className="text-[#6F1D1B]"
                              style={{
                                fontFamily: "sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              Payment:{" "}
                              {order.paymentMethod === "cod"
                                ? "Cash on Delivery"
                                : "Online"}
                            </p>
                            <button
                              onClick={() =>
                                window.open(
                                  `/api/invoices/${order._id}`,
                                  "_blank",
                                )
                              }
                              className="bg-[#6F1D1B] text-[#FFE6A7] px-4 py-2 rounded-md hover:opacity-80 transition-opacity"
                              style={{ fontFamily: "serif", fontSize: "14px" }}
                            >
                              View Invoice
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
