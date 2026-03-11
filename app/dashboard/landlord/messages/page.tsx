"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import MessagesComponent from "@/components/MessagesComponent";

function MessagesContent() {
  return <MessagesComponent />;
}

export default function LandlordMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="p-4">
            <p className="text-[#617589]">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  if (status === "authenticated" && session?.user?.role !== "landlord") {
    router.push("/");
    return null;
  }

  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <div className="gap-1 px-6 flex flex-1 justify-center py-5">
        <Suspense fallback={<div className="p-4">Loading messages...</div>}>
          <MessagesContent />
        </Suspense>
      </div>
    </div>
  );
}

