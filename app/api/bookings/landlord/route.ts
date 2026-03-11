import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { LandlordBookingService } from "@/services";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "landlord") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await LandlordBookingService.getLandlordBookings(session.user.id);
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "landlord") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const booking = await LandlordBookingService.updateBookingStatus(
      bookingId,
      session.user.id,
      status as any
    );

    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}
