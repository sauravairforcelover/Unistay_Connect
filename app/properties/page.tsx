"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookmarkButton from "@/components/BookmarkButton";

interface Property {
  id: string;
  title: string;
  price: number;
  images: string[];
  address: string;
  status: string;
}

function PropertiesContent() {
  const [viewMode, setViewMode] = useState<"list" | "map">("map");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "available";
        
        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (status) queryParams.append("status", status);

        const response = await fetch(`/api/properties?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [searchParams]);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">
          Find your perfect student accommodation
        </p>
      </div>
      <div className="flex gap-3 p-3 flex-wrap pr-4">
        <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f0f2f4] pl-4 pr-2">
          <p className="text-[#111418] text-sm font-medium leading-normal">Rent</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </button>
        <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f0f2f4] pl-4 pr-2">
          <p className="text-[#111418] text-sm font-medium leading-normal">Type</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </button>
        <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f0f2f4] pl-4 pr-2">
          <p className="text-[#111418] text-sm font-medium leading-normal">Distance</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </button>
        <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f0f2f4] pl-4 pr-2">
          <p className="text-[#111418] text-sm font-medium leading-normal">Amenities</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </button>
      </div>
      <div className="flex justify-stretch">
        <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
          <button
            onClick={() => setViewMode("list")}
            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] ${
              viewMode === "list" ? "bg-[#1380ec] text-white" : "bg-[#f0f2f4]"
            }`}
          >
            <span className="truncate">List View</span>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] ${
              viewMode === "map" ? "bg-[#1380ec] text-white" : "bg-[#f0f2f4] text-[#111418]"
            }`}
          >
            <span className="truncate">Map View</span>
          </button>
        </div>
      </div>
      {loading ? (
        <div className="p-4">
          <p className="text-[#617589]">Loading properties...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="p-4">
          <p className="text-[#617589]">No properties found.</p>
        </div>
      ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {properties.map((property) => (
                <div key={property.id} className="flex flex-col gap-3 pb-3 relative">
                  <Link href={`/properties/${property.id}`} className="flex flex-col gap-3">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
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
      )}
    </>
  );
}

export default function PropertiesPage() {
  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <PropertiesContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
