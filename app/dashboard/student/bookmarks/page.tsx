"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

interface Bookmark {
  id: string;
  propertyId: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    address: string;
    images: string[];
    type: string;
    status: string;
    landlord: {
      user: {
        id: string;
        name: string;
      };
    };
  };
}

export default function StudentBookmarksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "student") {
      router.push("/");
      return;
    }

    async function fetchBookmarks() {
      try {
        const response = await fetch("/api/bookmarks");
        if (response.ok) {
          const data = await response.json();
          setBookmarks(data);
        } else {
          setError("Failed to load bookmarks");
        }
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        setError("An error occurred while loading bookmarks");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchBookmarks();
    }
  }, [session, status, router]);

  const handleRemoveBookmark = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/bookmarks?propertyId=${propertyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBookmarks(bookmarks.filter((b) => b.propertyId !== propertyId));
      } else {
        alert("Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
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
              <p className="text-[#617589]">Loading bookmarks...</p>
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
                href="/dashboard/student"
                className="text-[#617589] hover:text-[#111418] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
                </svg>
              </Link>
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">
                My Bookmarks
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

          {bookmarks.length === 0 && !loading && (
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
                  <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,16V161.57l-51.77-32.35a8,8,0,0,0-8.48,0L72,161.56V48ZM132.23,177.22a8,8,0,0,0-8.48,0L72,209.57V180.43l56-35,56,35v29.14Z"></path>
                </svg>
                <p className="text-[#617589] text-lg mb-2">No bookmarks yet</p>
                <p className="text-[#617589] text-sm mb-4">
                  Save properties you like to view them later!
                </p>
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center rounded-xl h-10 px-4 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  Browse Properties
                </Link>
              </div>
            </div>
          )}

          {bookmarks.length > 0 && (
            <div className="px-4 py-3">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="flex flex-col gap-3 rounded-xl border border-[#dbe0e6] bg-white p-4 hover:shadow-md transition-shadow"
                  >
                    <Link href={`/properties/${bookmark.property.id}`}>
                      <div
                        className="w-full h-48 bg-center bg-no-repeat bg-cover rounded-xl"
                        style={{
                          backgroundImage: `url(${bookmark.property.images[0] || "https://via.placeholder.com/400x300"})`,
                        }}
                      ></div>
                    </Link>
                    <div className="flex-1 flex flex-col gap-2">
                      <Link
                        href={`/properties/${bookmark.property.id}`}
                        className="text-[#111418] text-lg font-bold leading-tight hover:text-[#1380ec] transition-colors"
                      >
                        {bookmark.property.title}
                      </Link>
                      <p className="text-[#617589] text-sm font-normal leading-normal line-clamp-2">
                        {bookmark.property.description}
                      </p>
                      <p className="text-[#617589] text-sm font-normal leading-normal">
                        {bookmark.property.address}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <p className="text-[#111418] text-lg font-bold">
                          ${bookmark.property.price}/month
                        </p>
                        <button
                          onClick={() => handleRemoveBookmark(bookmark.property.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="Remove bookmark"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"></path>
                          </svg>
                        </button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Link
                          href={`/properties/${bookmark.property.id}`}
                          className="flex-1 px-4 py-2 rounded-xl bg-[#1380ec] text-white text-sm font-medium hover:bg-[#0f6bc7] transition-colors text-center"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/messages?receiverId=${bookmark.property.landlord.user.id}`}
                          className="px-4 py-2 rounded-xl bg-[#f0f2f4] text-[#111418] text-sm font-medium hover:bg-[#e0e4e8] transition-colors"
                        >
                          Message
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

