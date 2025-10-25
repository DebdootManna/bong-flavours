"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  variants?: Array<{
    name: string;
    price: number;
  }>;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  image?: string;
}

const AuthenticatedMenuPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { state, addToCart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showVegOnly, setShowVegOnly] = useState<boolean>(false);
  const [selectedVariants, setSelectedVariants] = useState<{
    [itemId: string]: number;
  }>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchMenu();
    }
  }, [user]);

  const fetchMenu = async () => {
    try {
      const response = await fetch("/api/menu");
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.items || []);
      } else {
        setError("Failed to load menu");
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      setError("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "All", name: "All" },
    { id: "Shorbot", name: "Shorbot" },
    { id: "Starters", name: "Starters" },
    {
      id: "Kolkata Kathi Roll & Mughlai Paratha",
      name: "Kathi Roll & Mughlai Paratha",
    },
    { id: "Kolkata Biryani", name: "Kolkata Biryani" },
    { id: "Kolkata Chinese", name: "Kolkata Chinese" },
    { id: "Main Course", name: "Main Course" },
    { id: "Rice", name: "Rice" },
    { id: "Roti/Paratha/Loochi (Puri)", name: "Roti/Paratha/Loochi (Puri)" },
    { id: "Accompaniments & Desserts", name: "Accompaniments & Desserts" },
  ];

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory)
      return false;
    if (showVegOnly && !item.isVeg) return false;
    if (
      searchTerm &&
      !item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  const getItemQuantityInCart = (itemId: string, variantIndex?: number) => {
    const cartItem = state.items.find(
      (item) =>
        item.menuItemId === itemId && item.variantIndex === variantIndex,
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (item: MenuItem, variantIndex?: number) => {
    const selectedVariantIndex =
      variantIndex ?? selectedVariants[item._id] ?? 0;
    const price =
      item.variants && item.variants.length > selectedVariantIndex
        ? item.variants[selectedVariantIndex].price
        : item.price;

    const variantName =
      item.variants && item.variants.length > selectedVariantIndex
        ? item.variants[selectedVariantIndex].name
        : undefined;

    addToCart({
      id:
        item._id +
        (variantIndex !== undefined ? `-variant-${variantIndex}` : ""),
      menuItemId: item._id,
      name: item.name + (variantName ? ` (${variantName})` : ""),
      price: price,
      quantity: 1,
      variantIndex: variantIndex,
      variantName: variantName,
    });
  };

  const handleUpdateQuantity = (
    itemId: string,
    newQuantity: number,
    variantIndex?: number,
  ) => {
    if (newQuantity === 0) {
      removeFromCart(itemId, variantIndex);
    } else {
      updateQuantity(itemId, variantIndex, newQuantity);
    }
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  if (authLoading || loading) {
    return (
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
            Loading menu...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#6F1D1B" }}
      >
        <div className="text-center">
          <h2
            className="font-bold mb-4 text-[#FFE6A7]"
            style={{ fontFamily: "Oswald", fontSize: "26px" }}
          >
            Unable to Load Menu
          </h2>
          <p
            className="mb-6 text-[#FFE6A7]"
            style={{ fontFamily: "serif", fontSize: "18px" }}
          >
            {error}
          </p>
          <button
            onClick={fetchMenu}
            className="bg-[#FFE6A7] text-[#6F1D1B] px-6 py-2 rounded-md transition-colors"
            style={{ fontFamily: "serif", fontSize: "18px" }}
          >
            Try Again
          </button>
        </div>
      </div>
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
        <div
          className="shadow-md border-b"
          style={{ backgroundColor: "#FFE6A7" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1
                  className="font-bold text-[#6F1D1B]"
                  style={{ fontFamily: "Oswald", fontSize: "30px" }}
                >
                  Our Menu
                </h1>
                <p
                  className="text-[#6F1D1B]"
                  style={{ fontFamily: "serif", fontSize: "18px" }}
                >
                  Authentic Bengali Cuisine
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Cart Summary */}
                <Link
                  href="/app/cart"
                  className="flex items-center bg-[#6F1D1B] text-[#FFE6A7] px-4 py-2 rounded-md hover:opacity-80 transition-opacity"
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"
                    />
                  </svg>
                  Cart ({getTotalItems()}) - ₹{getTotalPrice().toFixed(2)}
                </Link>

                {/* Profile Button */}
                <Link
                  href="/app/profile"
                  className="flex items-center bg-[#6F1D1B] text-[#FFE6A7] px-4 py-2 rounded-md hover:opacity-80 transition-opacity"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFE6A7] bg-[#FFE6A7] text-[#6F1D1B] placeholder-[#6F1D1B]"
                style={{ fontFamily: "serif", fontSize: "18px" }}
              />
            </div>

            {/* Veg Filter */}
            <div className="flex items-center">
              <label
                className="flex items-center text-[#FFE6A7]"
                style={{ fontFamily: "serif", fontSize: "18px" }}
              >
                <input
                  type="checkbox"
                  checked={showVegOnly}
                  onChange={(e) => setShowVegOnly(e.target.checked)}
                  className="mr-2 h-4 w-4 text-[#FFE6A7] rounded border-[#FFE6A7]"
                />
                Vegetarian Only
              </label>
            </div>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedCategory === category.id
                    ? "bg-[#FFE6A7] text-[#6F1D1B]"
                    : "bg-[#6F1D1B] border border-[#FFE6A7] text-[#FFE6A7] hover:bg-[#FFE6A7] hover:text-[#6F1D1B]"
                }`}
                style={{ fontFamily: "sans-serif", fontSize: "18px" }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <h3
                className="font-medium text-[#FFE6A7] mb-2"
                style={{ fontFamily: "Oswald", fontSize: "22px" }}
              >
                No items found
              </h3>
              <p
                className="text-[#FFE6A7]"
                style={{ fontFamily: "serif", fontSize: "18px" }}
              >
                Try adjusting your filters or search term.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const selectedVariantIndex = selectedVariants[item._id] ?? 0;
                const displayPrice =
                  item.variants && item.variants.length > 0
                    ? (item.variants[selectedVariantIndex]?.price ?? item.price)
                    : item.price;
                const quantityInCart = getItemQuantityInCart(
                  item._id,
                  item.variants ? selectedVariantIndex : undefined,
                );

                return (
                  <div
                    key={item._id}
                    className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: "#FFE6A7" }}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className="font-semibold text-[#6F1D1B]"
                              style={{ fontFamily: "Oswald", fontSize: "22px" }}
                            >
                              {item.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${
                                item.isVeg
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                              style={{ fontSize: "14px" }}
                            >
                              {item.isVeg ? "VEG" : "NON-VEG"}
                            </span>
                          </div>
                          {item.description && (
                            <p
                              className="text-[#6F1D1B] mb-3"
                              style={{ fontFamily: "serif", fontSize: "16px" }}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Variant Selection */}
                      {item.variants && item.variants.length > 0 && (
                        <div className="mb-4">
                          <label
                            className="block font-medium text-[#6F1D1B] mb-2"
                            style={{
                              fontFamily: "sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            Size/Variant:
                          </label>
                          <select
                            value={selectedVariantIndex}
                            onChange={(e) =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [item._id]: parseInt(e.target.value),
                              }))
                            }
                            className="w-full px-3 py-2 border border-[#6F1D1B] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] bg-white text-[#6F1D1B]"
                            style={{ fontFamily: "serif", fontSize: "16px" }}
                          >
                            {item.variants.map((variant, index) => (
                              <option key={index} value={index}>
                                {variant.name} - ₹{variant.price}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex justify-between items-center mb-4">
                        <span
                          className="font-bold text-[#6F1D1B]"
                          style={{ fontFamily: "Oswald", fontSize: "24px" }}
                        >
                          ₹{displayPrice}
                        </span>
                        <div>
                          {item.isAvailable ? (
                            <span
                              className="text-green-600 font-medium"
                              style={{ fontFamily: "serif", fontSize: "16px" }}
                            >
                              Available
                            </span>
                          ) : (
                            <span
                              className="text-red-600 font-medium"
                              style={{ fontFamily: "serif", fontSize: "16px" }}
                            >
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      {!item.isAvailable ? (
                        <button
                          disabled
                          className="w-full bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed font-medium"
                          style={{ fontFamily: "serif", fontSize: "18px" }}
                        >
                          Out of Stock
                        </button>
                      ) : quantityInCart === 0 ? (
                        <button
                          onClick={() =>
                            handleAddToCart(
                              item,
                              item.variants ? selectedVariantIndex : undefined,
                            )
                          }
                          className="w-full bg-[#6F1D1B] text-[#FFE6A7] py-2 px-4 rounded-md hover:opacity-80 transition-opacity font-medium"
                          style={{ fontFamily: "serif", fontSize: "18px" }}
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-[#6F1D1B] text-[#FFE6A7] rounded-md">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item._id,
                                quantityInCart - 1,
                                item.variants
                                  ? selectedVariantIndex
                                  : undefined,
                              )
                            }
                            className="px-4 py-2 hover:opacity-80 rounded-l-md transition-opacity"
                            style={{ fontFamily: "serif", fontSize: "18px" }}
                          >
                            -
                          </button>
                          <span
                            className="px-4 py-2 font-medium"
                            style={{ fontFamily: "serif", fontSize: "18px" }}
                          >
                            {quantityInCart}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item._id,
                                quantityInCart + 1,
                                item.variants
                                  ? selectedVariantIndex
                                  : undefined,
                              )
                            }
                            className="px-4 py-2 hover:opacity-80 rounded-r-md transition-opacity"
                            style={{ fontFamily: "serif", fontSize: "18px" }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Floating Checkout Button */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Link
              href="/app/checkout"
              className="bg-[#FFE6A7] text-[#6F1D1B] px-8 py-3 rounded-full shadow-lg hover:opacity-80 transition-opacity font-semibold"
              style={{ fontFamily: "serif", fontSize: "18px" }}
            >
              Proceed to Checkout ({getTotalItems()} items) - ₹
              {getTotalPrice().toFixed(2)}
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthenticatedMenuPage;
