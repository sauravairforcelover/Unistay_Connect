import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { SharedPropertyService, LandlordPropertyService } from "@/services";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await SharedPropertyService.getPropertyById(params.id);
    return NextResponse.json(property);
  } catch (error: any) {
    if (error.message === "Property not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to fetch property" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "landlord") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await LandlordPropertyService.deleteProperty(params.id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Property not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete property" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "landlord") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, price, images, address, amenities, type, status } = body;

    const updatedProperty = await LandlordPropertyService.updateProperty(
      params.id,
      session.user.id,
      {
        title,
        description,
        price: price ? parseFloat(price) : undefined,
        images,
        address,
        amenities,
        type,
        status: status as any,
      }
    );

    return NextResponse.json(updatedProperty);
  } catch (error: any) {
    if (error.message === "Property not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to update property" },
      { status: 500 }
    );
  }
}
