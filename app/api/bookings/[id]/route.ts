import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { StudentBookingService } from "@/services";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await StudentBookingService.getBookingById(
      params.id,
      session.user.id
    );

    return NextResponse.json(booking);
  } catch (error: any) {
    if (error.message === "Booking not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to fetch booking" },
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
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (status === "cancelled") {
      // Only students can cancel their own bookings
      if (session.user?.role !== "student") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      await StudentBookingService.cancelBooking(params.id, session.user.id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}
