"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface BookmarkButtonProps {
  propertyId: string;
  className?: string;
}

export default function BookmarkButton({ propertyId, className = "" }: BookmarkButtonProps) {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkBookmark() {
      if (!session?.user || session.user.role !== "student") {
        setChecking(false);
        return;
      }

      try {
        const response = await fetch(`/api/bookmarks/check?propertyId=${propertyId}`);
        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error("Failed to check bookmark:", error);
      } finally {
        setChecking(false);
      }
    }

    checkBookmark();
  }, [propertyId, session]);

  const handleToggle = async () => {
    if (!session?.user || session.user.role !== "student") {
      alert("Please login as a student to bookmark properties");
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        const response = await fetch(`/api/bookmarks?propertyId=${propertyId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setIsBookmarked(false);
        } else {
          alert("Failed to remove bookmark");
        }
      } else {
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ propertyId }),
        });
        if (response.ok) {
          setIsBookmarked(true);
        } else {
          const data = await response.json();
          alert(data.error || "Failed to add bookmark");
        }
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user || session.user.role !== "student" || checking) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-lg transition-colors ${
        isBookmarked
          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
          : "bg-[#f0f2f4] text-[#617589] hover:bg-[#e0e4e8]"
      } disabled:opacity-50 ${className}`}
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          {isBookmarked ? (
            <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"></path>
          ) : (
            <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,16V161.57l-51.77-32.35a8,8,0,0,0-8.48,0L72,161.56V48ZM132.23,177.22a8,8,0,0,0-8.48,0L72,209.57V180.43l56-35,56,35v29.14Z"></path>
          )}
        </svg>
      )}
    </button>
  );
}

