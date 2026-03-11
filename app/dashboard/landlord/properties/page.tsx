"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getStatusColor } from "@/lib/utils";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  status: string;
  type: string;
  images: string[];
  amenities: string[];
  createdAt: string;
  bookings?: any[];
}

export default function LandlordPropertiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
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

    async function fetchProperties() {
      try {
        const response = await fetch("/api/properties/landlord");
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        } else {
          setError("Failed to load properties");
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setError("An error occurred while loading properties");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchProperties();
    }
  }, [session, status, router]);

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== propertyId));
      } else {
        alert("Failed to delete property");
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
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
              <p className="text-[#617589]">Loading properties...</p>
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
                My Properties
              </p>
            </div>
            <Link
              href="/dashboard/landlord/properties/new"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">+ Add New Property</span>
            </Link>
          </div>

          {error && (
            <div className="px-4 py-3">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {properties.length === 0 && !loading && (
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
                  <path d="M239.73,208H224V96a16,16,0,0,0-16-16H164a4,4,0,0,0-4,4V208H144V32.41a16.43,16.43,0,0,0-6.16-13,16,16,0,0,0-18.72-.69L39.12,72A16,16,0,0,0,32,85.34V208H16.27A8.18,8.18,0,0,0,8,215.47,8,8,0,0,0,16,224H240a8,8,0,0,0,8-8.53A8.18,8.18,0,0,0,239.73,208Z"></path>
                </svg>
                <p className="text-[#617589] text-lg mb-2">No properties yet</p>
                <p className="text-[#617589] text-sm mb-4">
                  Start by adding your first property listing!
                </p>
                <Link
                  href="/dashboard/landlord/properties/new"
                  className="inline-flex items-center justify-center rounded-xl h-10 px-4 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  Add Property
                </Link>
              </div>
            </div>
          )}

          {properties.length > 0 && (
            <div className="px-4 py-3">
              <div className="flex flex-col gap-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex gap-4 rounded-xl border border-[#dbe0e6] bg-white p-4 hover:shadow-md transition-shadow"
                  >
                    <Link
                      href={`/properties/${property.id}`}
                      className="flex-shrink-0"
                    >
                      <div
                        className="w-32 h-32 bg-center bg-no-repeat bg-cover rounded-xl"
                        style={{
                          backgroundImage: `url(${property.images[0] || "https://via.placeholder.com/300"})`,
                        }}
                      ></div>
                    </Link>
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link
                            href={`/properties/${property.id}`}
                            className="text-[#111418] text-lg font-bold leading-tight hover:text-[#1380ec] transition-colors"
                          >
                            {property.title}
                          </Link>
                          <p className="text-[#617589] text-sm font-normal leading-normal">
                            {property.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${getStatusColor(
                              property.status
                            )}`}
                          >
                            {property.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-[#617589]">Price: </span>
                          <span className="text-[#111418] font-bold">
                            ${property.price}/month
                          </span>
                        </div>
                        <div>
                          <span className="text-[#617589]">Type: </span>
                          <span className="text-[#111418] font-medium capitalize">
                            {property.type}
                          </span>
                        </div>
                        {property.bookings && property.bookings.length > 0 && (
                          <div>
                            <span className="text-[#617589]">Bookings: </span>
                            <span className="text-[#111418] font-medium">
                              {property.bookings.length}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Link
                          href={`/dashboard/landlord/properties/${property.id}/edit`}
                          className="px-4 py-2 rounded-xl bg-[#f0f2f4] text-[#111418] text-sm font-medium hover:bg-[#e0e4e8] transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                        <Link
                          href={`/properties/${property.id}`}
                          className="px-4 py-2 rounded-xl bg-[#1380ec] text-white text-sm font-medium hover:bg-[#0f6bc7] transition-colors"
                        >
                          View
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

