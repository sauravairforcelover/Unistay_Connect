"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookmarkButton from "./BookmarkButton";

interface Property {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch("/api/properties?status=available&limit=3");
        if (response.ok) {
          const data = await response.json();
          setProperties(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <>
        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Featured Accommodations
        </h2>
        <div className="px-4 py-3">
          <p className="text-[#617589]">Loading...</p>
        </div>
      </>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Featured Accommodations
      </h2>
      <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-stretch p-4 gap-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60 relative"
            >
              <Link
                href={`/properties/${property.id}`}
                className="flex h-full flex-1 flex-col gap-4"
              >
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col"
                  style={{
                    backgroundImage: `url(${property.images[0] || "https://via.placeholder.com/400x300"})`,
                  }}
                ></div>
                <div>
                  <p className="text-[#111418] text-base font-medium leading-normal">{property.title}</p>
                  <p className="text-[#617589] text-sm font-normal leading-normal">
                    ${property.price}/month
                  </p>
                </div>
              </Link>
              <div className="absolute top-2 right-2">
                <BookmarkButton propertyId={property.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
