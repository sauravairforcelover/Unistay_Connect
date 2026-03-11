import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export class StudentBookingService {
  /**
   * Get all bookings for a student
   */
  static async getStudentBookings(studentId: string) {
    return await prisma.booking.findMany({
      where: {
        studentId,
      },
      include: {
        property: {
          include: {
            landlord: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Create a new booking request
   */
  static async createBooking(
    studentId: string,
    propertyId: string,
    startDate: Date,
    endDate: Date
  ) {
    // Check if property exists and is available
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    if (property.status !== "available") {
      throw new Error("Property is not available for booking");
    }

    return await prisma.booking.create({
      data: {
        studentId,
        propertyId,
        startDate,
        endDate,
        status: "pending",
      },
      include: {
        property: true,
      },
    });
  }

  /**
   * Cancel a booking (student can only cancel their own bookings)
   */
  static async cancelBooking(bookingId: string, studentId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.studentId !== studentId) {
      throw new Error("Unauthorized: Cannot cancel another student's booking");
    }

    if (booking.status === "cancelled") {
      throw new Error("Booking is already cancelled");
    }

    return await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "cancelled",
      },
    });
  }

  /**
   * Get a single booking by ID (for student)
   */
  static async getBookingById(bookingId: string, studentId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: {
          include: {
            landlord: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.studentId !== studentId) {
      throw new Error("Unauthorized");
    }

    return booking;
  }
}

