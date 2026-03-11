"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // TODO: Create API endpoint for contact form
      // For now, just show success message
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">
              About Us
            </p>
          </div>
          <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Our Mission and Vision
          </h2>
          <div className="p-4">
            <div
              className="bg-cover bg-center flex flex-col items-stretch justify-end rounded-xl pt-[132px]"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAlQ9Q1lJrn1HhmFpi9I7sjfgwTolupUeXdiXSG8Q45afsG2zB1gMGXBWqQg4xFJHPOhHov7-LkO9enrNJAS0AzRo871HtlBx6ZGw-HeAmgvmUirPYEhefnANPByhg7jEgpc8FsNzI2fZzm0zJ_j9uHlwONtu9en8SLnoBUUWz8RtfW9VOs1rRCp7dDAsXUxgt8fxCljAd-9UnI0unro8nTIBb6146Jel7asc3ayT2OSQNnMG6LyXZkE8--F6brLyM_y6tMiCsIHu8")`,
              }}
            >
              <div className="flex w-full items-end justify-between gap-4 p-4">
                <div className="flex max-w-[440px] flex-1 flex-col gap-1">
                  <p className="text-white tracking-light text-2xl font-bold leading-tight max-w-[440px]">
                    Connecting Students, Landlords, and Alumni
                  </p>
                  <p className="text-white text-base font-medium leading-normal">
                    UniStayConnect aims to create a seamless and supportive ecosystem for students, landlords, and alumni. Our mission is to simplify the accommodation search process, foster a vibrant student community, and facilitate valuable connections between current students and alumni.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Contact Us
          </h2>
          {success && (
            <div className="px-4 py-2">
              <p className="text-green-600 text-sm">Message sent successfully!</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">Name</p>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">Email</p>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">Subject</p>
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">Message</p>
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] min-h-36 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                ></textarea>
              </label>
            </div>
            <div className="flex px-4 py-3 justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
              >
                <span className="truncate">{loading ? "Sending..." : "Send Message"}</span>
              </button>
            </div>
          </form>
          <div className="flex px-4 py-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl object-cover"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_hIOIlkUxGmO6fuo3yGLiuVeKGxOOxuQMF_Dk5e0HzBoM2WyVVmlLJkW8q3BC3GI5kEtoIkXov6t2vwAeexrl8ROJxlh-yQSqUj_AnUDpR9s1tPAR004K15ytx281bW0f6_ffb4JnqrymG2smFO7DdQDXjVG7hqJ_zbcZQxkyILcshKWgdzuWKuaFO6o8-k_yLu1uORzY9wNEU0QeM3cv728Ymf0nTfr21tpVMAf7WKE8t2PUTmr89VsH-dxvRNVr-plueekdrWU")`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
