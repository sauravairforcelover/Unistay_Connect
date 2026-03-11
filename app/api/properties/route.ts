import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { SharedPropertyService, LandlordPropertyService } from "@/services";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") as any;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const type = searchParams.get("type") || undefined;
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;

    const properties = await SharedPropertyService.getProperties({
      search,
      status,
      limit,
      type,
      minPrice,
      maxPrice,
    });

    return NextResponse.json(properties);
  } catch (error: any) {
    console.error("Properties API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "landlord") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, price, images, address, amenities, type } = body;

    if (!title || !description || !price || !address || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const property = await LandlordPropertyService.createProperty(session.user.id, {
      title,
      description,
      price: parseFloat(price),
      images: images || [],
      address,
      amenities: amenities || [],
      type,
    });

    return NextResponse.json(property);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create property" },
      { status: 500 }
    );
  }
}
