import { prisma } from "@/lib/prisma";
import { PropertyStatus } from "@prisma/client";

export class AdminPropertyService {
  /**
   * Get all properties
   */
  static async getAllProperties() {
    return await prisma.property.findMany({
      include: {
        landlord: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        bookings: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Update property status (approve/reject)
   */
  static async updatePropertyStatus(propertyId: string, status: PropertyStatus) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    return await prisma.property.update({
      where: { id: propertyId },
      data: { status },
      include: {
        landlord: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Delete property
   */
  static async deleteProperty(propertyId: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    // Delete related data
    await prisma.booking.deleteMany({
      where: { propertyId },
    });

    await prisma.bookmark.deleteMany({
      where: { propertyId },
    });

    // Delete property
    await prisma.property.delete({
      where: { id: propertyId },
    });

    return { success: true };
  }

  /**
   * Get property statistics
   */
  static async getPropertyStats() {
    const [
      total,
      available,
      rented,
      pending,
      rejected,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: "available" } }),
      prisma.property.count({ where: { status: "rented" } }),
      prisma.property.count({ where: { status: "pending" } }),
      prisma.property.count({ where: { status: "rejected" } }),
    ]);

    return {
      total,
      available,
      rented,
      pending,
      rejected,
    };
  }
}

