"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import Head from "next/head";

const CartPage = () => {
  const { user, loading } = useAuth();
  const { state: cartState, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  // Calculate pricing breakdown
  const subtotal = cartState.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = 40;
  const taxRate = 0.18;
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax + deliveryFee;

  // Redirect if not authenticated
  if (!loading && !user) {
    router.push("/login");
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
              Loading cart...
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
        <div className="container mx-auto px-4 max-w-4xl">
          <h1
            className="font-bold text-[#FFE6A7] text-center mb-8"
            style={{ fontFamily: "Oswald", fontSize: "32px" }}
          >
            Your Cart
          </h1>

          {cartState.items.length === 0 ? (
            <div className="text-center py-12">
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
                Add some delicious Bengali dishes to get started!
              </p>
              <button
                onClick={() => router.push("/app/menu")}
                className="bg-[#FFE6A7] text-[#6F1D1B] px-6 py-3 rounded-md hover:opacity-80 transition-opacity font-medium"
                style={{ fontFamily: "serif", fontSize: "18px" }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div
                  className="rounded-lg shadow-lg p-6"
                  style={{ backgroundColor: "#FFE6A7" }}
                >
                  <h2
                    className="font-bold text-[#6F1D1B] mb-6"
                    style={{ fontFamily: "Oswald", fontSize: "24px" }}
                  >
                    Order Items ({cartState.items.length})
                  </h2>

                  <div className="space-y-4">
                    {cartState.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border border-[#6F1D1B] rounded-lg"
                      >
                        <div className="flex-1">
                          <h3
                            className="font-medium text-[#6F1D1B] mb-1"
                            style={{ fontFamily: "Oswald", fontSize: "20px" }}
                          >
                            {item.name}
                          </h3>
                          {item.variantName && (
                            <p
                              className="text-[#6F1D1B] mb-2"
                              style={{
                                fontFamily: "sans-serif",
                                fontSize: "16px",
                              }}
                            >
                              Variant: {item.variantName}
                            </p>
                          )}
                          <p
                            className="font-bold text-[#6F1D1B]"
                            style={{ fontFamily: "Oswald", fontSize: "20px" }}
                          >
                            ₹{item.price} each
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-[#6F1D1B] text-[#FFE6A7] rounded-md">
                            <button
                              onClick={() => {
                                if (item.quantity === 1) {
                                  removeFromCart(
                                    item.menuItemId,
                                    item.variantIndex,
                                  );
                                } else {
                                  updateQuantity(
                                    item.menuItemId,
                                    item.variantIndex,
                                    item.quantity - 1,
                                  );
                                }
                              }}
                              className="px-3 py-2 hover:opacity-80 rounded-l-md transition-opacity"
                              style={{ fontFamily: "serif", fontSize: "18px" }}
                            >
                              -
                            </button>
                            <span
                              className="px-4 py-2 font-medium"
                              style={{ fontFamily: "serif", fontSize: "18px" }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.menuItemId,
                                  item.variantIndex,
                                  item.quantity + 1,
                                )
                              }
                              className="px-3 py-2 hover:opacity-80 rounded-r-md transition-opacity"
                              style={{ fontFamily: "serif", fontSize: "18px" }}
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() =>
                              removeFromCart(item.menuItemId, item.variantIndex)
                            }
                            className="text-red-600 hover:text-red-800 p-2"
                            title="Remove item"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="text-right ml-4">
                          <p
                            className="font-bold text-[#6F1D1B]"
                            style={{ fontFamily: "Oswald", fontSize: "20px" }}
                          >
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continue Shopping */}
                  <div className="mt-6 pt-6 border-t border-[#6F1D1B]">
                    <Link
                      href="/app/menu"
                      className="inline-flex items-center bg-[#6F1D1B] text-[#FFE6A7] px-4 py-2 rounded-md hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "serif", fontSize: "18px" }}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add More Items
                    </Link>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
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

                  {/* Checkout Button */}
                  <Link
                    href="/app/checkout"
                    className="w-full bg-[#6F1D1B] text-[#FFE6A7] py-3 rounded-md hover:opacity-80 transition-opacity font-bold text-center block"
                    style={{ fontFamily: "serif", fontSize: "18px" }}
                  >
                    Proceed to Checkout
                  </Link>

                  {/* Estimated Delivery */}
                  <div className="mt-4 p-3 border border-[#6F1D1B] rounded-md">
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
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
