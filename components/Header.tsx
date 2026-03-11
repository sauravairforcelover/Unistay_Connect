"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  showAuth?: boolean;
}

export default function Header({ showAuth = true }: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getDashboardPath = () => {
    if (!session?.user?.role) return "/";
    if (session.user.role === "admin") return "/admin";
    if (session.user.role === "landlord") return "/dashboard/landlord";
    return "/dashboard/student";
  };

  return (
    <header className="relative flex items-center justify-between whitespace-nowrap px-10 py-3">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-4 text-[#111418]">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">
            UniStayConnect
          </h2>
        </Link>
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex items-center gap-10 rounded-full px-6 py-3 backdrop-blur-md border border-white/10 shadow-sm" style={{ background: "linear-gradient(90deg, rgba(19,128,236,0.10), rgba(255,255,255,0.18))" }}>
          <Link className="text-[#111418] text-sm font-medium leading-normal" href="/">
            Home
          </Link>
          <Link className="text-[#111418] text-sm font-medium leading-normal" href="/properties">
            Accommodation
          </Link>
          <Link className="text-[#111418] text-sm font-medium leading-normal" href="/about">
            Community
          </Link>
          <Link className="text-[#111418] text-sm font-medium leading-normal" href="/about">
            About
          </Link>
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        {showAuth && !session && (
          <div className="flex gap-2">
            <Link
              href="/auth/signup"
              className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Sign Up</span>
            </Link>
            <Link
              href="/auth/login"
              className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Login</span>
            </Link>
          </div>
        )}
        {session && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(getDashboardPath())}
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f0f2f4] text-[#111418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
              </svg>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
              style={{
                backgroundImage: session.user?.avatar
                  ? `url(${session.user.avatar})`
                  : "none",
                backgroundColor: session.user?.avatar ? "transparent" : "#dbe0e6",
              }}
              onClick={() => router.push(getDashboardPath())}
            ></div>
          </div>
        )}
      </div>
    </header>
  );
}
