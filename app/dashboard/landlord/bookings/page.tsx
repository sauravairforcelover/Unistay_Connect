"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { formatDate, getStatusColor } from "@/lib/utils";

interface Booking {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  property: {
    id: string;
    title: string;
  };
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export default function LandlordBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "landlord") {
      router.push("/");
      return;
    }

    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings/landlord");
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          setError("Failed to load bookings");
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setError("An error occurred while loading bookings");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchBookings();
    }
  }, [session, status, router]);

  const handleBookingAction = async (bookingId: string, action: "approved" | "rejected") => {
    try {
      const response = await fetch("/api/bookings/landlord", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          status: action,
        }),
      });

      if (response.ok) {
        // Reload bookings
        const bookingsRes = await fetch("/api/bookings/landlord");
        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setBookings(data);
        }
      } else {
        alert("Failed to update booking");
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="p-4">
              <p className="text-[#617589]">Loading bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/landlord"
                className="text-[#617589] hover:text-[#111418] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
                </svg>
              </Link>
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">
                Booking Requests
              </p>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {bookings.length === 0 && !loading && (
            <div className="p-4">
              <div className="text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64px"
                  height="64px"
                  fill="#dbe0e6"
                  viewBox="0 0 256 256"
                  className="mx-auto mb-4"
                >
                  <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"></path>
                </svg>
                <p className="text-[#617589] text-lg mb-2">No booking requests yet</p>
                <p className="text-[#617589] text-sm">
                  Booking requests from students will appear here
                </p>
              </div>
            </div>
          )}

          {bookings.length > 0 && (
            <div className="px-4 py-3">
              <div className="flex flex-col gap-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex gap-4 rounded-xl border border-[#dbe0e6] bg-white p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[#111418] text-lg font-bold leading-tight">
                            {booking.property.title}
                          </p>
                          <p className="text-[#617589] text-sm font-normal leading-normal">
                            Student: {booking.student.name}
                          </p>
                          <p className="text-[#617589] text-sm font-normal leading-normal">
                            Email: {booking.student.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-[#617589]">Check-in: </span>
                          <span className="text-[#111418] font-medium">
                            {formatDate(booking.startDate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#617589]">Check-out: </span>
                          <span className="text-[#111418] font-medium">
                            {formatDate(booking.endDate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#617589]">Requested: </span>
                          <span className="text-[#111418] font-medium">
                            {formatDate(booking.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleBookingAction(booking.id, "approved")}
                              className="px-4 py-2 rounded-xl bg-green-50 text-green-600 text-sm font-medium hover:bg-green-100 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleBookingAction(booking.id, "rejected")}
                              className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <Link
                          href={`/messages?receiverId=${booking.student.id}`}
                          className="px-4 py-2 rounded-xl bg-[#1380ec] text-white text-sm font-medium hover:bg-[#0f6bc7] transition-colors"
                        >
                          Message Student
                        </Link>
                        <Link
                          href={`/properties/${booking.property.id}`}
                          className="px-4 py-2 rounded-xl bg-[#f0f2f4] text-[#111418] text-sm font-medium hover:bg-[#e0e4e8] transition-colors"
                        >
                          View Property
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

