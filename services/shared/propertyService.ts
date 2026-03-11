import { prisma } from "@/lib/prisma";
import { PropertyStatus } from "@prisma/client";

export interface PropertyFilters {
  search?: string;
  status?: PropertyStatus | PropertyStatus[];
  limit?: number;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class SharedPropertyService {
  /**
   * Get all properties with optional filters (public access)
   */
  static async getProperties(filters: PropertyFilters = {}) {
    const where: any = {};

    // Status filter
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        where.status = { in: filters.status };
      } else {
        where.status = filters.status;
      }
    } else {
      // Default to available and pending for public view
      where.status = { in: ["available", "pending"] };
    }

    // Search filter
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { address: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    // Type filter
    if (filters.type) {
      where.type = filters.type;
    }

    // Price filters
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice) {
        where.price.lte = filters.maxPrice;
      }
    }

    const properties = await prisma.property.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
      ...(filters.limit && { take: filters.limit }),
    });

    return properties;
  }

  /**
   * Get a single property by ID (public access)
   */
  static async getPropertyById(propertyId: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
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
    });

    if (!property) {
      throw new Error("Property not found");
    }

    return property;
  }
}

