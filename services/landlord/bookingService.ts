import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export class LandlordBookingService {
  /**
   * Get all booking requests for landlord's properties
   */
  static async getLandlordBookings(landlordUserId: string) {
    // Find landlord record
    const landlord = await prisma.propertyLandlord.findUnique({
      where: { userId: landlordUserId },
    });

    if (!landlord) {
      return [];
    }

    // Get all property IDs for this landlord
    const properties = await prisma.property.findMany({
      where: { landlordId: landlord.id },
      select: { id: true },
    });

    const propertyIds = properties.map((p) => p.id);

    // Get bookings for these properties
    return await prisma.booking.findMany({
      where: {
        propertyId: { in: propertyIds },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Update booking status (approve/reject)
   */
  static async updateBookingStatus(
    bookingId: string,
    landlordUserId: string,
    status: BookingStatus
  ) {
    // Find landlord record
    const landlord = await prisma.propertyLandlord.findUnique({
      where: { userId: landlordUserId },
    });

    if (!landlord) {
      throw new Error("Landlord not found");
    }

    // Get booking with property
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Check if property belongs to landlord
    if (booking.property.landlordId !== landlord.id) {
      throw new Error("Unauthorized: Booking does not belong to this landlord");
    }

    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  /**
   * Get booking statistics for landlord
   */
  static async getBookingStats(landlordUserId: string) {
    const landlord = await prisma.propertyLandlord.findUnique({
      where: { userId: landlordUserId },
    });

    if (!landlord) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        cancelled: 0,
      };
    }

    const properties = await prisma.property.findMany({
      where: { landlordId: landlord.id },
      select: { id: true },
    });

    const propertyIds = properties.map((p) => p.id);

    const [total, pending, approved, rejected, cancelled] = await Promise.all([
      prisma.booking.count({
        where: { propertyId: { in: propertyIds } },
      }),
      prisma.booking.count({
        where: { propertyId: { in: propertyIds }, status: "pending" },
      }),
      prisma.booking.count({
        where: { propertyId: { in: propertyIds }, status: "approved" },
      }),
      prisma.booking.count({
        where: { propertyId: { in: propertyIds }, status: "rejected" },
      }),
      prisma.booking.count({
        where: { propertyId: { in: propertyIds }, status: "cancelled" },
      }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
      cancelled,
    };
  }
}

