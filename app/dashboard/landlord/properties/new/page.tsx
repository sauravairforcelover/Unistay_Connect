"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

export default function AddPropertyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    type: "studio",
    amenities: [] as string[],
    images: [] as string[],
  });
  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");

  if (status === "loading") {
    return (
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="p-4">
              <p className="text-[#617589]">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "landlord") {
    router.push("/auth/login");
    return null;
  }

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()],
      });
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
    });
  };

  const handleAddImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage.trim()],
      });
      setNewImage("");
    }
  };

  const handleRemoveImage = (image: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter((img) => img !== image),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.title || !formData.description || !formData.price || !formData.address || !formData.type) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.images.length === 0) {
      setError("Please add at least one image");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          address: formData.address,
          type: formData.type,
          amenities: formData.amenities,
          images: formData.images,
        }),
      });

      if (response.ok) {
        const property = await response.json();
        router.push(`/dashboard/landlord/properties`);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create property");
      }
    } catch (error) {
      console.error("Failed to create property:", error);
      setError("An error occurred. Please try again.");
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
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/landlord/properties"
                className="text-[#617589] hover:text-[#111418] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
                </svg>
              </Link>
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">
                Add New Property
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="px-4 py-3">
              <label className="flex flex-col gap-2">
                <p className="text-[#111418] text-base font-medium leading-normal">Property Title *</p>
                <input
                  type="text"
                  placeholder="e.g., Cozy Studio Apartment Near Campus"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#1380ec] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>

            <div className="px-4 py-3">
              <label className="flex flex-col gap-2">
                <p className="text-[#111418] text-base font-medium leading-normal">Description *</p>
                <textarea
                  placeholder="Describe your property in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={6}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#1380ec] placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>

            <div className="px-4 py-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <p className="text-[#111418] text-base font-medium leading-normal">Price (per month) *</p>
                  <input
                    type="number"
                    placeholder="1200"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#1380ec] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <p className="text-[#111418] text-base font-medium leading-normal">Property Type *</p>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#1380ec] h-14 p-[15px] text-base font-normal leading-normal"
                  >
                    <option value="studio">Studio</option>
                    <option value="shared">Shared Room</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="dorm">Dormitory</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="px-4 py-3">
              <label className="flex flex-col gap-2">
                <p className="text-[#111418] text-base font-medium leading-normal">Address *</p>
                <input
                  type="text"
                  placeholder="123 University Avenue, Studentville, CA"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#1380ec] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>

            <div className="px-4 py-3">
              <label className="flex flex-col gap-2">
                <p className="text-[#111418] text-base font-medium leading-normal">Amenities</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., Wi-Fi, Kitchen, Parking"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAmenity();
                      }
                    }}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#1380ec] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
                  >
                    Add
                  </button>
                </div>
                {formData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#f0f2f4] text-[#111418] text-sm"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(amenity)}
                          className="text-[#617589] hover:text-[#111418]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </label>
            </div>

            <div className="px-4 py-3">
              <label className="flex flex-col gap-2">
                <p className="text-[#111418] text-base font-medium leading-normal">Property Images *</p>
                <p className="text-[#617589] text-sm">Add image URLs (at least one required)</p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddImage();
                      }
                    }}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#1380ec] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
                  >
                    Add
                  </button>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div
                          className="w-full h-32 bg-center bg-no-repeat bg-cover rounded-xl"
                          style={{ backgroundImage: `url(${image})` }}
                        ></div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </label>
            </div>

            <div className="flex gap-3 px-4 py-3">
              <Link
                href="/dashboard/landlord/properties"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Cancel</span>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 flex-1 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
              >
                <span className="truncate">{loading ? "Creating..." : "Create Property"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

