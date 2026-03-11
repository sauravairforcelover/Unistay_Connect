import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { StudentBookmarkService } from "@/services";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ isBookmarked: false });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
    }

    // Only students can bookmark
    if (session.user?.role !== "student") {
      return NextResponse.json({ isBookmarked: false });
    }

    const isBookmarked = await StudentBookmarkService.isBookmarked(
      session.user.id,
      propertyId
    );

    return NextResponse.json({ isBookmarked });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to check bookmark" },
      { status: 500 }
    );
  }
}
