"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Header from "@/components/Header";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "landlord",
  });
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto login after registration
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        if (formData.role === "landlord") {
          router.push("/dashboard/landlord");
        } else {
          router.push("/dashboard/student");
        }
        router.refresh();
      } else {
        router.push("/auth/login");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header showAuth={false} />
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
          <h2 className="text-[#111418] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
            Welcome to UniStayConnect
          </h2>
          <div className="pb-3">
            <div className="flex border-b border-[#dbe0e6] px-4 gap-8">
              <Link
                href="/auth/login"
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#617589] pb-[13px] pt-4"
              >
                <p className="text-[#617589] text-sm font-bold leading-normal tracking-[0.015em]">Login</p>
              </Link>
              <Link
                href="/auth/signup"
                className="flex flex-col items-center justify-center border-b-[3px] border-b-[#111418] text-[#111418] pb-[13px] pt-4"
              >
                <p className="text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]">Sign Up</p>
              </Link>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">Name</p>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">Email</p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">Password</p>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">Confirm Password</p>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">Role</p>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as "student" | "landlord" })}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 p-[15px] text-base font-normal leading-normal"
                >
                  <option value="student">Student</option>
                  <option value="landlord">Landlord</option>
                </select>
              </label>
            </div>
            {error && (
              <div className="px-4 py-2">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
            <div className="flex px-4 py-3">
              <button
                type="submit"
                disabled={loading}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
              >
                <span className="truncate">{loading ? "Signing up..." : "Sign Up"}</span>
              </button>
            </div>
          </form>
          <p className="text-[#617589] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
            Or continue with
          </p>
          <div className="flex justify-center">
            <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] grow"
              >
                <span className="truncate">Continue with Google</span>
              </button>
            </div>
          </div>
          <p className="text-[#617589] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">
            Already have an account? <Link href="/auth/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

