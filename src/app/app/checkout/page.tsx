"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Head from "next/head";

interface DeliveryInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  landmark: string;
  specialInstructions: string;
}

const CheckoutPage = () => {
  const { user } = useAuth();
  const { state: cartState, clearCart } = useCart();
  const router = useRouter();

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    landmark: "",
    specialInstructions: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<DeliveryInfo>>({});

  // Calculate totals
  const subtotal = cartState.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = 40;
  const taxRate = 0.18;
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax + deliveryFee;

  // Fetch user profile data and auto-populate form
  useEffect(() => {
    const fetchUserProfile = async () => {
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
          setDeliveryInfo((prev) => ({
            ...prev,
            fullName: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            city: data.city || "",
            pincode: data.zipCode || "",
          }));
        } else {
          setDeliveryInfo((prev) => ({
            ...prev,
            fullName: user.name || "",
            email: user.email || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setDeliveryInfo((prev) => ({
          ...prev,
          fullName: user.name || "",
          email: user.email || "",
        }));
      }
    };

    fetchUserProfile();
  }, [user]);

  const validateForm = () => {
    const newErrors: Partial<DeliveryInfo> = {};

    if (!deliveryInfo.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!deliveryInfo.phone.trim())
      newErrors.phone = "Phone number is required";
    if (!deliveryInfo.email.trim()) newErrors.email = "Email is required";
    if (!deliveryInfo.address.trim()) newErrors.address = "Address is required";
    if (!deliveryInfo.city.trim()) newErrors.city = "City is required";
    if (!deliveryInfo.pincode.trim()) newErrors.pincode = "Pincode is required";

    if (deliveryInfo.phone && !/^[6-9]\d{9}$/.test(deliveryInfo.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (deliveryInfo.email && !/^\S+@\S+\.\S+$/.test(deliveryInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (deliveryInfo.pincode && !/^\d{6}$/.test(deliveryInfo.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof DeliveryInfo, value: string) => {
    setDeliveryInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cartState.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("auth-token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const orderData = {
        items: cartState.items,
        deliveryInfo,
        paymentMethod,
        subtotal,
        tax,
        deliveryFee,
        total,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const result = await response.json();

      const invoiceUrl = `/api/invoices/${result.order._id}`;
      window.open(invoiceUrl, "_blank");

      clearCart();
      router.push(`/app/order-success?orderId=${result.order._id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
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
            <h2
              className="font-bold text-[#FFE6A7] mb-4"
              style={{ fontFamily: "Oswald", fontSize: "26px" }}
            >
              Please Login
            </h2>
            <p
              className="text-[#FFE6A7] mb-6"
              style={{ fontFamily: "serif", fontSize: "18px" }}
            >
              You need to be logged in to checkout
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-[#FFE6A7] text-[#6F1D1B] px-6 py-3 rounded-md hover:opacity-80 transition-opacity font-medium"
              style={{ fontFamily: "serif", fontSize: "18px" }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  if (cartState.items.length === 0) {
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
            <div className="text-6xl mb-4">🛒</div>
            <h2
              className="font-bold text-[#FFE6A7] mb-4"
              style={{ fontFamily: "Oswald", fontSize: "26px" }}
            >
              Your cart is empty
            </h2>
            <p
              className="text-[#FFE6A7] mb-6"
              style={{ fontFamily: "serif", fontSize: "18px" }}
            >
              Add some items to your cart before checkout
            </p>
            <button
              onClick={() => router.push("/app/menu")}
              className="bg-[#FFE6A7] text-[#6F1D1B] px-6 py-3 rounded-md hover:opacity-80 transition-opacity font-medium"
              style={{ fontFamily: "serif", fontSize: "18px" }}
            >
              Browse Menu
            </button>
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
          <h1
            className="font-bold text-[#FFE6A7] text-center mb-8"
            style={{ fontFamily: "Oswald", fontSize: "32px" }}
          >
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Delivery Information Form */}
            <div
              className="rounded-lg shadow-lg p-6"
              style={{ backgroundColor: "#FFE6A7" }}
            >
              <h2
                className="font-bold text-[#6F1D1B] mb-6"
                style={{ fontFamily: "Oswald", fontSize: "24px" }}
              >
                Delivery Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block font-medium text-[#6F1D1B] mb-2"
                      style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-[#6F1D1B] ${
                        errors.fullName
                          ? "border-red-500 focus:ring-red-200"
                          : "border-[#6F1D1B] focus:ring-[#6F1D1B]"
                      }`}
                      style={{ fontFamily: "serif", fontSize: "16px" }}
                    />
                    {errors.fullName && (
                      <p
                        className="text-red-500 text-sm mt-1"
                        style={{ fontFamily: "serif", fontSize: "14px" }}
                      >
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block font-medium text-[#6F1D1B] mb-2"
                      style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={deliveryInfo.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-[#6F1D1B] ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-200"
                          : "border-[#6F1D1B] focus:ring-[#6F1D1B]"
                      }`}
                      style={{ fontFamily: "serif", fontSize: "16px" }}
                    />
                    {errors.phone && (
                      <p
                        className="text-red-500 text-sm mt-1"
                        style={{ fontFamily: "serif", fontSize: "14px" }}
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className="block font-medium text-[#6F1D1B] mb-2"
                    style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={deliveryInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-[#6F1D1B] ${
                      errors.email
                        ? "border-red-500 focus:ring-red-200"
                        : "border-[#6F1D1B] focus:ring-[#6F1D1B]"
                    }`}
                    style={{ fontFamily: "serif", fontSize: "16px" }}
                  />
                  {errors.email && (
                    <p
                      className="text-red-500 text-sm mt-1"
                      style={{ fontFamily: "serif", fontSize: "14px" }}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block font-medium text-[#6F1D1B] mb-2"
                    style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                  >
                    Delivery Address *
                  </label>
                  <textarea
                    value={deliveryInfo.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-[#6F1D1B] ${
                      errors.address
                        ? "border-red-500 focus:ring-red-200"
                        : "border-[#6F1D1B] focus:ring-[#6F1D1B]"
                    }`}
                    style={{ fontFamily: "serif", fontSize: "16px" }}
                  />
                  {errors.address && (
                    <p
                      className="text-red-500 text-sm mt-1"
                      style={{ fontFamily: "serif", fontSize: "14px" }}
                    >
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block font-medium text-[#6F1D1B] mb-2"
                      style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-[#6F1D1B] ${
                        errors.city
                          ? "border-red-500 focus:ring-red-200"
                          : "border-[#6F1D1B] focus:ring-[#6F1D1B]"
                      }`}
                      style={{ fontFamily: "serif", fontSize: "16px" }}
                    />
                    {errors.city && (
                      <p
                        className="text-red-500 text-sm mt-1"
                        style={{ fontFamily: "serif", fontSize: "14px" }}
                      >
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block font-medium text-[#6F1D1B] mb-2"
                      style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                    >
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.pincode}
                      onChange={(e) =>
                        handleInputChange("pincode", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-[#6F1D1B] ${
                        errors.pincode
                          ? "border-red-500 focus:ring-red-200"
                          : "border-[#6F1D1B] focus:ring-[#6F1D1B]"
                      }`}
                      style={{ fontFamily: "serif", fontSize: "16px" }}
                    />
                    {errors.pincode && (
                      <p
                        className="text-red-500 text-sm mt-1"
                        style={{ fontFamily: "serif", fontSize: "14px" }}
                      >
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className="block font-medium text-[#6F1D1B] mb-2"
                    style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                  >
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo.landmark}
                    onChange={(e) =>
                      handleInputChange("landmark", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-[#6F1D1B] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] bg-white text-[#6F1D1B]"
                    style={{ fontFamily: "serif", fontSize: "16px" }}
                  />
                </div>

                <div>
                  <label
                    className="block font-medium text-[#6F1D1B] mb-2"
                    style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                  >
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={deliveryInfo.specialInstructions}
                    onChange={(e) =>
                      handleInputChange("specialInstructions", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-[#6F1D1B] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] bg-white text-[#6F1D1B]"
                    style={{ fontFamily: "serif", fontSize: "16px" }}
                    placeholder="Any special cooking requests or delivery instructions..."
                  />
                </div>

                {/* Payment Method */}
                <div className="pt-4 border-t border-[#6F1D1B]">
                  <h3
                    className="font-bold text-[#6F1D1B] mb-4"
                    style={{ fontFamily: "Oswald", fontSize: "20px" }}
                  >
                    Payment Method
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as "cash" | "online")
                        }
                        className="mr-3 h-4 w-4 text-[#6F1D1B]"
                      />
                      <span
                        className="text-[#6F1D1B]"
                        style={{ fontFamily: "serif", fontSize: "18px" }}
                      >
                        Cash on Delivery (COD)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as "cash" | "online")
                        }
                        className="mr-3 h-4 w-4 text-[#6F1D1B]"
                      />
                      <span
                        className="text-[#6F1D1B]"
                        style={{ fontFamily: "serif", fontSize: "18px" }}
                      >
                        Online Payment
                      </span>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div
              className="rounded-lg shadow-lg p-6 sticky top-4"
              style={{ backgroundColor: "#FFE6A7" }}
            >
              <h2
                className="font-bold text-[#6F1D1B] mb-6"
                style={{ fontFamily: "Oswald", fontSize: "24px" }}
              >
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => (
                  <div
                    key={`${item.id}-${item.variantIndex || 0}`}
                    className="flex justify-between items-center py-2 border-b border-[#6F1D1B]"
                  >
                    <div className="flex-1">
                      <h4
                        className="font-medium text-[#6F1D1B]"
                        style={{ fontFamily: "Oswald", fontSize: "18px" }}
                      >
                        {item.name}
                      </h4>
                      <p
                        className="text-[#6F1D1B]"
                        style={{ fontFamily: "serif", fontSize: "16px" }}
                      >
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                    <span
                      className="font-medium text-[#6F1D1B]"
                      style={{ fontFamily: "Oswald", fontSize: "18px" }}
                    >
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span
                    className="text-[#6F1D1B]"
                    style={{ fontFamily: "serif", fontSize: "18px" }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="font-medium text-[#6F1D1B]"
                    style={{ fontFamily: "serif", fontSize: "18px" }}
                  >
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className="text-[#6F1D1B]"
                    style={{ fontFamily: "serif", fontSize: "18px" }}
                  >
                    Tax (18%)
                  </span>
                  <span
                    className="font-medium text-[#6F1D1B]"
                    style={{ fontFamily: "serif", fontSize: "18px" }}
                  >
                    ₹{tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className="text-[#6F1D1B]"
                    style={{ fontFamily: "serif", fontSize: "18px" }}
                  >
                    Delivery Fee
                  </span>
                  <span
                    className="font-medium text-[#6F1D1B]"
                    style={{ fontFamily: "serif", fontSize: "18px" }}
                  >
                    ₹{deliveryFee.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-[#6F1D1B] pt-3">
                  <div className="flex justify-between">
                    <span
                      className="font-bold text-[#6F1D1B]"
                      style={{ fontFamily: "Oswald", fontSize: "22px" }}
                    >
                      Total
                    </span>
                    <span
                      className="font-bold text-[#6F1D1B]"
                      style={{ fontFamily: "Oswald", fontSize: "22px" }}
                    >
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-[#6F1D1B] text-[#FFE6A7] py-3 rounded-md hover:opacity-80 transition-opacity font-bold disabled:opacity-50"
                  style={{ fontFamily: "serif", fontSize: "18px" }}
                >
                  {isLoading
                    ? "Placing Order..."
                    : `Place Order - ₹${total.toFixed(2)}`}
                </button>

                <button
                  onClick={() => router.push("/app/cart")}
                  className="w-full bg-transparent border border-[#6F1D1B] text-[#6F1D1B] py-2 rounded-md hover:bg-[#6F1D1B] hover:text-[#FFE6A7] transition-colors"
                  style={{ fontFamily: "serif", fontSize: "18px" }}
                >
                  Back to Cart
                </button>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 p-3 border border-[#6F1D1B] rounded-md">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-[#6F1D1B] mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p
                      className="text-[#6F1D1B] font-medium"
                      style={{ fontFamily: "sans-serif", fontSize: "16px" }}
                    >
                      Estimated Delivery
                    </p>
                    <p
                      className="text-[#6F1D1B]"
                      style={{ fontFamily: "serif", fontSize: "16px" }}
                    >
                      30-45 minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
