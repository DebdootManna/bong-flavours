"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function BookingPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage("Please login to make a booking");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(
          "Booking request submitted successfully! We will confirm your reservation shortly.",
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          guests: 2,
          specialRequests: "",
        });
      } else {
        const data = await response.json();
        setMessage(
          data.message || "Failed to submit booking. Please try again.",
        );
      }
    } catch (error) {
      console.error("Booking error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date for min date input
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: "#6F1D1B" }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-title text-5xl font-bold text-[#FFE6A7] mb-4">
            Book a Table
          </h1>
          <p className="text-[#FFE6A7] font-subheading text-lg max-w-2xl mx-auto">
            Reserve your spot for an authentic Bengali dining experience
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Login Notice */}
          {!user && (
            <div className="bg-[#FFE6A7] border border-[#6F1D1B] rounded-lg p-4 mb-6">
              <p className="text-[#6F1D1B] font-body text-base text-center">
                Please <strong>login</strong> to make a reservation
              </p>
            </div>
          )}

          {/* Success/Error Message */}
          {message && (
            <div
              className={`rounded-lg p-4 mb-6 ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              <p className="font-body text-base text-center">{message}</p>
            </div>
          )}

          {/* Booking Form */}
          <div className="bg-[#FFE6A7] rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block font-subheading text-base font-medium text-[#6F1D1B] mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={!user}
                  className="w-full px-4 py-3 border border-[#6F1D1B] rounded-lg font-body text-base text-[#6F1D1B] focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100 disabled:opacity-50"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-subheading text-base font-medium text-[#6F1D1B] mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!user}
                  className="w-full px-4 py-3 border border-[#6F1D1B] rounded-lg font-body text-base text-[#6F1D1B] focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100 disabled:opacity-50"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block font-subheading text-base font-medium text-[#6F1D1B] mb-2"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={!user}
                  className="w-full px-4 py-3 border border-[#6F1D1B] rounded-lg font-body text-base text-[#6F1D1B] focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100 disabled:opacity-50"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block font-subheading text-base font-medium text-[#6F1D1B] mb-2"
                  >
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    required
                    disabled={!user}
                    className="w-full px-4 py-3 border border-[#6F1D1B] rounded-lg font-body text-base text-[#6F1D1B] focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="block font-subheading text-base font-medium text-[#6F1D1B] mb-2"
                  >
                    Time *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    disabled={!user}
                    className="w-full px-4 py-3 border border-[#6F1D1B] rounded-lg font-body text-base text-[#6F1D1B] focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100 disabled:opacity-50"
                  >
                    <option value="">Select time</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="13:30">1:30 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="20:30">8:30 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label
                  htmlFor="guests"
                  className="block font-subheading text-base font-medium text-[#6F1D1B] mb-2"
                >
                  Number of Guests *
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  disabled={!user}
                  className="w-full px-4 py-3 border border-[#6F1D1B] rounded-lg font-body text-base text-[#6F1D1B] focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100 disabled:opacity-50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Requests */}
              <div>
                <label
                  htmlFor="specialRequests"
                  className="block font-subheading text-base font-medium text-[#6F1D1B] mb-2"
                >
                  Special Requests (Optional)
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={4}
                  disabled={!user}
                  className="w-full px-4 py-3 border border-[#6F1D1B] rounded-lg font-body text-base text-[#6F1D1B] focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100 disabled:opacity-50 resize-none"
                  placeholder="Any special dietary requirements, celebrations, or preferences..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!user || isSubmitting}
                  className="w-full bg-[#6F1D1B] text-[#FFE6A7] py-4 px-6 rounded-lg font-heading text-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6F1D1B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? "Submitting..." : "Book Table"}
                </button>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-[#6F1D1B]">
              <h3 className="font-heading text-xl font-bold text-[#6F1D1B] mb-4">
                Booking Information
              </h3>
              <div className="space-y-2 font-body text-base text-[#6F1D1B]">
                <p>• Bookings are subject to availability</p>
                <p>• We will confirm your reservation within 24 hours</p>
                <p>• For groups larger than 8, please call us directly</p>
                <p>• Cancellations must be made at least 2 hours in advance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
