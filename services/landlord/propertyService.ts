import { prisma } from "@/lib/prisma";
import { PropertyStatus } from "@prisma/client";

export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  images: string[];
  address: string;
  amenities: string[];
  type: string;
}

export interface UpdatePropertyData {
  title?: string;
  description?: string;
  price?: number;
  images?: string[];
  address?: string;
  amenities?: string[];
  type?: string;
  status?: PropertyStatus;
}

export class LandlordPropertyService {
  /**
   * Get all properties for a landlord
   */
  static async getLandlordProperties(landlordUserId: string) {
    // Find landlord record
    const landlord = await prisma.propertyLandlord.findUnique({
      where: { userId: landlordUserId },
    });

    if (!landlord) {
      return [];
    }

    return await prisma.property.findMany({
      where: {
        landlordId: landlord.id,
      },
      include: {
        bookings: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
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
   * Create a new property
   */
  static async createProperty(landlordUserId: string, data: CreatePropertyData) {
    // Find or create landlord record
    let landlord = await prisma.propertyLandlord.findUnique({
      where: { userId: landlordUserId },
    });

    if (!landlord) {
      landlord = await prisma.propertyLandlord.create({
        data: { userId: landlordUserId },
      });
    }

    return await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        images: data.images,
        address: data.address,
        amenities: data.amenities,
        type: data.type,
        landlordId: landlord.id,
        status: "pending",
      },
    });
  }

  /**
   * Update a property (only if owned by landlord)
   */
  static async updateProperty(
    propertyId: string,
    landlordUserId: string,
    data: UpdatePropertyData
  ) {
    const landlord = await prisma.propertyLandlord.findUnique({
      where: { userId: landlordUserId },
    });

    if (!landlord) {
      throw new Error("Landlord not found");
    }

    // Check if property belongs to landlord
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    if (property.landlordId !== landlord.id) {
      throw new Error("Unauthorized: Property does not belong to this landlord");
    }

    return await prisma.property.update({
      where: { id: propertyId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.price && { price: data.price }),
        ...(data.images && { images: data.images }),
        ...(data.address && { address: data.address }),
        ...(data.amenities && { amenities: data.amenities }),
        ...(data.type && { type: data.type }),
        ...(data.status && { status: data.status }),
      },
    });
  }

  /**
   * Delete a property (only if owned by landlord)
   */
  static async deleteProperty(propertyId: string, landlordUserId: string) {
    const landlord = await prisma.propertyLandlord.findUnique({
      where: { userId: landlordUserId },
    });

    if (!landlord) {
      throw new Error("Landlord not found");
    }

    // Check if property belongs to landlord
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    if (property.landlordId !== landlord.id) {
      throw new Error("Unauthorized: Property does not belong to this landlord");
    }

    await prisma.property.delete({
      where: { id: propertyId },
    });

    return { success: true };
  }

  /**
   * Get a single property (only if owned by landlord)
   */
  static async getPropertyById(propertyId: string, landlordUserId: string) {
    const landlord = await prisma.propertyLandlord.findUnique({
      where: { userId: landlordUserId },
    });

    if (!landlord) {
      throw new Error("Landlord not found");
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        bookings: {
          include: {
            student: {
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

    if (!property) {
      throw new Error("Property not found");
    }

    if (property.landlordId !== landlord.id) {
      throw new Error("Unauthorized: Property does not belong to this landlord");
    }

    return property;
  }
}

