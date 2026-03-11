"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  status: string;
  images: string[];
}

interface Booking {
  id: string;
  student: {
    name: string;
    email: string;
  };
  property: {
    title: string;
  };
  startDate: string;
  endDate: string;
  status: string;
}

export default function LandlordDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [propertiesRes, bookingsRes] = await Promise.all([
          fetch("/api/properties/landlord"),
          fetch("/api/bookings/landlord"),
        ]);

        if (propertiesRes.ok) {
          const data = await propertiesRes.json();
          setProperties(data);
        }

        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setBookings(data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
        setBookingsLoading(false);
      }
    }

    fetchData();
  }, []);

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
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
      alert("Failed to update booking. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      <div className="layout-content-container flex flex-col w-80">
        <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{
                    backgroundImage: session?.user?.avatar
                      ? `url(${session.user.avatar})`
                      : "none",
                    backgroundColor: session?.user?.avatar ? "transparent" : "#dbe0e6",
                  }}
                ></div>
                <h1 className="text-[#111418] text-base font-medium leading-normal">UniStayConnect</h1>
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/dashboard/landlord" className="flex items-center gap-3 px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link href="/dashboard/landlord" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f0f2f4]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link
                href="/dashboard/landlord/properties"
                className="flex items-center gap-3 px-3 py-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M239.73,208H224V96a16,16,0,0,0-16-16H164a4,4,0,0,0-4,4V208H144V32.41a16.43,16.43,0,0,0-6.16-13,16,16,0,0,0-18.72-.69L39.12,72A16,16,0,0,0,32,85.34V208H16.27A8.18,8.18,0,0,0,8,215.47,8,8,0,0,0,16,224H240a8,8,0,0,0,8-8.53A8.18,8.18,0,0,0,239.73,208Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Properties</p>
              </Link>
              <Link href="/dashboard/landlord/bookings" className="flex items-center gap-3 px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Bookings</p>
              </Link>
              <Link href="/dashboard/landlord/messages" className="flex items-center gap-3 px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Messages</p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
              </svg>
              <p className="text-[#111418] text-sm font-medium leading-normal">Back to App</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">Properties</p>
        </div>
        <div className="flex px-4 py-3 justify-end">
          <button
            onClick={() => router.push("/dashboard/landlord/properties/new")}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#4299f0] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Add New Property</span>
          </button>
        </div>
        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Your Properties
        </h2>
        {loading ? (
          <div className="px-4 py-3">
            <p className="text-[#617589]">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="px-4 py-3">
            <p className="text-[#617589]">No properties yet. Add your first property!</p>
          </div>
        ) : (
          <div className="px-4 py-3 @container">
            <div className="flex overflow-hidden rounded-xl border border-[#dbe0e6] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="px-4 py-3 text-left text-[#111418] w-14 text-sm font-medium leading-normal">Property</th>
                    <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Address</th>
                    <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Rent</th>
                    <th className="px-4 py-3 text-left text-[#111418] w-60 text-sm font-medium leading-normal">Status</th>
                    <th className="px-4 py-3 text-left text-[#111418] w-60 text-[#617589] text-sm font-medium leading-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-t border-t-[#dbe0e6]">
                      <td className="h-[72px] px-4 py-2 w-14 text-sm font-normal leading-normal">
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10"
                          style={{
                            backgroundImage: `url(${property.images[0] || "https://via.placeholder.com/100"})`,
                          }}
                        ></div>
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#617589] text-sm font-normal leading-normal">
                        {property.address}
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#617589] text-sm font-normal leading-normal">
                        ${property.price}/month
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-full">
                          <span className="truncate capitalize">{property.status}</span>
                        </button>
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-[#617589] text-sm font-bold leading-normal tracking-[0.015em]">
                        <Link href={`/dashboard/landlord/properties/${property.id}`}>Edit</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Booking Requests
        </h2>
        {bookingsLoading ? (
          <div className="px-4 py-3">
            <p className="text-[#617589]">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="px-4 py-3">
            <p className="text-[#617589]">No booking requests yet.</p>
          </div>
        ) : (
          <div className="px-4 py-3 @container">
            <div className="flex overflow-hidden rounded-xl border border-[#dbe0e6] bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Student</th>
                    <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Property</th>
                    <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Dates</th>
                    <th className="px-4 py-3 text-left text-[#111418] w-60 text-sm font-medium leading-normal">Status</th>
                    <th className="px-4 py-3 text-left text-[#111418] w-60 text-[#617589] text-sm font-medium leading-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-t-[#dbe0e6]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                        {booking.student.name}
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#617589] text-sm font-normal leading-normal">
                        {booking.property.title}
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#617589] text-sm font-normal leading-normal">
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-full">
                          <span className="truncate capitalize">{booking.status}</span>
                        </button>
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-[#617589] text-sm font-bold leading-normal tracking-[0.015em]">
                        {booking.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleBookingAction(booking.id, "approved")}
                              className="text-green-600 hover:underline"
                            >
                              Accept
                            </button>
                            <span>|</span>
                            <button
                              onClick={() => handleBookingAction(booking.id, "rejected")}
                              className="text-red-600 hover:underline"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
