"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (formData.name.length < 2) {
      setError("Name must be at least 2 characters");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError(
        "Phone number must be exactly 10 digits starting with 6, 7, 8, or 9",
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to menu page
        router.push("/menu");
      } else {
        // Handle validation errors specifically
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err: { message: string }) => err.message)
            .join(", ");
          setError(errorMessages);
        } else {
          setError(data.message || data.error || "Signup failed");
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#6F1D1B" }}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2
            className="mt-6 font-title text-5xl font-bold"
            style={{ color: "#FFE6A7" }}
          >
            Join Bong Flavours
          </h2>
          <p
            className="mt-2 font-subheading text-base"
            style={{ color: "#FFE6A7" }}
          >
            Create your account to start ordering
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block font-subheading text-base font-medium"
                style={{ color: "#FFE6A7" }}
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-opacity-30 font-body text-base rounded-md focus:outline-none focus:ring-2 focus:z-10"
                style={{
                  backgroundColor: "#FFE6A7",
                  color: "#6F1D1B",
                  borderColor: "#FFE6A7",
                  fontSize: "16px",
                }}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-subheading text-base font-medium"
                style={{ color: "#FFE6A7" }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-opacity-30 font-body text-base rounded-md focus:outline-none focus:ring-2 focus:z-10"
                style={{
                  backgroundColor: "#FFE6A7",
                  color: "#6F1D1B",
                  borderColor: "#FFE6A7",
                  fontSize: "16px",
                }}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block font-subheading text-base font-medium"
                style={{ color: "#FFE6A7" }}
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-opacity-30 font-body text-base rounded-md focus:outline-none focus:ring-2 focus:z-10"
                style={{
                  backgroundColor: "#FFE6A7",
                  color: "#6F1D1B",
                  borderColor: "#FFE6A7",
                  fontSize: "16px",
                }}
                placeholder="10-digit phone number (e.g., 9876543210)"
                value={formData.phone}
                onChange={handleChange}
              />
              <p
                className="mt-1 font-body text-sm"
                style={{ color: "#FFE6A7", opacity: 0.8 }}
              >
                Enter 10 digits starting with 6, 7, 8, or 9
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-subheading text-base font-medium"
                style={{ color: "#FFE6A7" }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-opacity-30 font-body text-base rounded-md focus:outline-none focus:ring-2 focus:z-10"
                style={{
                  backgroundColor: "#FFE6A7",
                  color: "#6F1D1B",
                  borderColor: "#FFE6A7",
                  fontSize: "16px",
                }}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div
                className="font-body text-base text-center"
                style={{ color: "#FFE6A7" }}
              >
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent font-heading text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200 hover:opacity-90"
                style={{
                  backgroundColor: "#FFE6A7",
                  color: "#6F1D1B",
                }}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link
              href="/login"
              className="font-subheading text-base font-medium hover:underline"
              style={{ color: "#FFE6A7" }}
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
