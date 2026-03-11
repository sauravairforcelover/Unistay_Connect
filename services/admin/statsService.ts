import { prisma } from "@/lib/prisma";

export class AdminStatsService {
  /**
   * Get platform-wide statistics
   */
  static async getPlatformStats() {
    const [
      totalUsers,
      totalProperties,
      totalBookings,
      pendingBookings,
      totalMessages,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.message.count(),
    ]);

    // Get user breakdown
    const [students, landlords, admins] = await Promise.all([
      prisma.user.count({ where: { role: "student" } }),
      prisma.user.count({ where: { role: "landlord" } }),
      prisma.user.count({ where: { role: "admin" } }),
    ]);

    // Get property breakdown
    const [availableProperties, rentedProperties, pendingProperties] =
      await Promise.all([
        prisma.property.count({ where: { status: "available" } }),
        prisma.property.count({ where: { status: "rented" } }),
        prisma.property.count({ where: { status: "pending" } }),
      ]);

    // Get booking breakdown
    const [approvedBookings, rejectedBookings, cancelledBookings] =
      await Promise.all([
        prisma.booking.count({ where: { status: "approved" } }),
        prisma.booking.count({ where: { status: "rejected" } }),
        prisma.booking.count({ where: { status: "cancelled" } }),
      ]);

    return {
      users: {
        total: totalUsers,
        students,
        landlords,
        admins,
      },
      properties: {
        total: totalProperties,
        available: availableProperties,
        rented: rentedProperties,
        pending: pendingProperties,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        approved: approvedBookings,
        rejected: rejectedBookings,
        cancelled: cancelledBookings,
      },
      messages: {
        total: totalMessages,
      },
    };
  }
}

