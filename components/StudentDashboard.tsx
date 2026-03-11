"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  address: string;
  images: string[];
  price: number;
}

export default function StudentDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch("/api/properties?status=available&limit=4");
        if (response.ok) {
          const data = await response.json();
          setProperties(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <div className="layout-content-container flex flex-col w-80">
        <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: session?.user?.avatar
                    ? `url(${session.user.avatar})`
                    : "none",
                  backgroundColor: session?.user?.avatar ? "transparent" : "#dbe0e6",
                }}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-[#111418] text-base font-medium leading-normal">
                  {session?.user?.name || "Student"}
                </h1>
                <p className="text-[#617589] text-sm font-normal leading-normal">Student</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard/student"
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f0f2f4]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Profile</p>
              </Link>
              <Link href="/properties" className="flex items-center gap-3 px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Properties</p>
              </Link>
              <Link href="/dashboard/student/bookings" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f0f2f4]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,16V161.57l-51.77-32.35a8,8,0,0,0-8.48,0L72,161.56V48ZM132.23,177.22a8,8,0,0,0-8.48,0L72,209.57V180.43l56-35,56,35v29.14Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Bookings</p>
              </Link>
              <Link href="/messages" className="flex items-center gap-3 px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Chats</p>
              </Link>
              <Link href="/dashboard/student/bookmarks" className="flex items-center gap-3 px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"></path>
                </svg>
                <p className="text-[#111418] text-sm font-medium leading-normal">Bookmarks</p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
              </svg>
              <p className="text-[#111418] text-sm font-medium leading-normal">Logout</p>
            </button>
          </div>
        </div>
      </div>
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#111418]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">UniStayConnect</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f0f2f4] text-[#111418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
              </svg>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: session?.user?.avatar
                  ? `url(${session.user.avatar})`
                  : "none",
                backgroundColor: session?.user?.avatar ? "transparent" : "#dbe0e6",
              }}
            ></div>
          </div>
        </header>
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">
            Recommended Properties
          </p>
        </div>
        {loading ? (
          <div className="p-4">
            <p className="text-[#617589]">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-4">
            <p className="text-[#617589]">No properties available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
            {properties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`} className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style={{
                    backgroundImage: `url(${property.images[0] || "https://via.placeholder.com/400x300"})`,
                  }}
                ></div>
                <div>
                  <p className="text-[#111418] text-base font-medium leading-normal">{property.title}</p>
                  <p className="text-[#617589] text-sm font-normal leading-normal">{property.address}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
