"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookmarkButton from "./BookmarkButton";

interface PropertyDetailProps {
  propertyId: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  address: string;
  amenities: string[];
  type: string;
  status: string;
  landlord?: {
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export default function PropertyDetail({ propertyId }: PropertyDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await fetch(`/api/properties/${propertyId}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        }
      } catch (error) {
        console.error("Failed to fetch property:", error);
      } finally {
        setLoading(false);
      }
    }

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const handleBookNow = async () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (session.user?.role !== "student") {
      alert("Only students can book properties");
      return;
    }

    setBookingLoading(true);
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() + 1);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 12);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: propertyId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      if (response.ok) {
        alert("Booking request submitted successfully!");
        router.push("/dashboard/student");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to create booking");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-[#617589]">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-4">
        <p className="text-[#617589]">Property not found.</p>
      </div>
    );
  }

  const landlordId = property.landlord?.user?.id;

  return (
    <>
      <div className="@container">
        <div className="@[480px]:px-4 @[480px]:py-3">
          <div
            className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-white @[480px]:rounded-xl min-h-80"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url(${property.images[selectedImage] || property.images[0] || "https://via.placeholder.com/800x600"})`,
            }}
          >
            <div className="flex justify-center gap-2 p-5">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`size-1.5 rounded-full ${index === selectedImage ? "bg-white" : "bg-white opacity-50"}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <div className="flex min-w-72 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">{property.title}</p>
              <p className="text-[#617589] text-sm font-normal leading-normal">{property.address}</p>
            </div>
            <BookmarkButton propertyId={propertyId} />
          </div>
        </div>
      </div>
      <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Overview</h3>
      <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">{property.description}</p>
      <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Key Details</h3>
      <div className="p-4">
        <div className="flex justify-between gap-x-6 py-2">
          <p className="text-[#617589] text-sm font-normal leading-normal">Rent</p>
          <p className="text-[#111418] text-sm font-normal leading-normal text-right">${property.price}/month</p>
        </div>
        <div className="flex justify-between gap-x-6 py-2">
          <p className="text-[#617589] text-sm font-normal leading-normal">Availability</p>
          <p className="text-[#111418] text-sm font-normal leading-normal text-right capitalize">{property.status}</p>
        </div>
        <div className="flex justify-between gap-x-6 py-2">
          <p className="text-[#617589] text-sm font-normal leading-normal">Type</p>
          <p className="text-[#111418] text-sm font-normal leading-normal text-right capitalize">{property.type}</p>
        </div>
      </div>
      <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Amenities</h3>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {property.amenities.map((amenity, index) => (
          <div key={index} className="flex flex-1 gap-3 rounded-lg border border-[#dbe0e6] bg-white p-4 items-center">
            <div className="text-[#111418]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M140,204a12,12,0,1,1-12-12A12,12,0,0,1,140,204ZM237.08,87A172,172,0,0,0,18.92,87,8,8,0,0,0,29.08,99.37a156,156,0,0,1,197.84,0A8,8,0,0,0,237.08,87ZM205,122.77a124,124,0,0,0-153.94,0A8,8,0,0,0,61,135.31a108,108,0,0,1,134.06,0,8,8,0,0,0,11.24-1.3A8,8,0,0,0,205,122.77Zm-32.26,35.76a76.05,76.05,0,0,0-89.42,0,8,8,0,0,0,9.42,12.94,60,60,0,0,1,70.58,0,8,8,0,1,0,9.42-12.94Z"></path>
              </svg>
            </div>
            <h2 className="text-[#111418] text-base font-bold leading-tight">{amenity}</h2>
          </div>
        ))}
      </div>
      <div className="flex justify-stretch">
        <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
          {landlordId && (
            <Link
              href={`/messages?receiverId=${landlordId}`}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Message Owner</span>
            </Link>
          )}
        </div>
      </div>
      {session?.user?.role === "student" && (
        <div className="flex px-4 py-3">
          <button
            onClick={handleBookNow}
            disabled={bookingLoading || property.status !== "available"}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-[#1380ec] text-white text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
          >
            <span className="truncate">
              {bookingLoading ? "Processing..." : property.status === "available" ? "Book Now" : "Not Available"}
            </span>
          </button>
        </div>
      )}
    </>
  );
}
