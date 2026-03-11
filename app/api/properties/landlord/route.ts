import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { LandlordPropertyService } from "@/services";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "landlord") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const properties = await LandlordPropertyService.getLandlordProperties(
      session.user.id
    );
    return NextResponse.json(properties);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
