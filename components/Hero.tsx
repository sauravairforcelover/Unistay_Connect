"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="@container">
      <div className="@[480px]:p-4">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwHylGvo6VkyzB_YTHKqHgOCmn0XZ9y6q5DBVHcgKXQNxX8U0GH7-ehONXrFU7MKAJXlOMXl5xHrDJ_KRFYGxNjAXWQ_fp_YShM99WwOc4zy_NiXdCGGs85p7CzGTwFVTtjAm0rvfzWzAR-fqDoQOBHW4X13owkcX2ZCLGhTefbvb6eeyMLmXaK-x8ZzUE-6ZD-HLUR-Qcj9nlFedm_2yAv5ZBh822Nws5-q6BhpM5jyzbbO-yn1wRD51B10U_JFhRnfWk5RQFFl4")`,
          }}
        >
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
              Find Your Perfect Student Accommodation
            </h1>
            <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
              Discover verified student housing near your university. Connect with landlords and fellow students.
            </h2>
          </div>
          <form onSubmit={handleSearch} className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-[#617589] flex border border-[#dbe0e6] bg-white items-center justify-center pl-[15px] rounded-l-xl border-r-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Location, Budget, Type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-full placeholder:text-[#617589] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
              />
              <div className="flex items-center justify-center rounded-r-xl border-l-0 border border-[#dbe0e6] bg-white pr-[7px]">
                <button
                  type="submit"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                >
                  <span className="truncate">Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

