"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(email, password);

      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/app/menu");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
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
            Welcome to Bong Flavours
          </h2>
          <p
            className="mt-2 font-subheading text-base"
            style={{ color: "#FFE6A7" }}
          >
            Sign in to your account
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
                autoComplete="current-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-opacity-30 font-body text-base rounded-md focus:outline-none focus:ring-2 focus:z-10"
                style={{
                  backgroundColor: "#FFE6A7",
                  color: "#6F1D1B",
                  borderColor: "#FFE6A7",
                  fontSize: "16px",
                }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link
              href="/signup"
              className="font-subheading text-base font-medium hover:underline"
              style={{ color: "#FFE6A7" }}
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
