import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export class AdminUserService {
  /**
   * Get all users
   */
  static async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        bookings: {
          include: {
            property: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Update user role
   */
  static async updateUserRole(userId: string, newRole: UserRole) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // If changing to landlord, create landlord profile if it doesn't exist
    if (newRole === "landlord" && user.role !== "landlord") {
      const existingLandlord = await prisma.propertyLandlord.findUnique({
        where: { userId },
      });

      if (!existingLandlord) {
        await prisma.propertyLandlord.create({
          data: { userId },
        });
      }
    }

    return await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete related data
    await prisma.bookmark.deleteMany({
      where: { userId },
    });

    await prisma.booking.deleteMany({
      where: { studentId: userId },
    });

    await prisma.message.deleteMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });

    await prisma.notification.deleteMany({
      where: { userId },
    });

    // Delete landlord profile if exists
    await prisma.propertyLandlord.deleteMany({
      where: { userId },
    });

    // Finally delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  }

  /**
   * Get user statistics
   */
  static async getUserStats() {
    const [total, students, landlords, admins] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "student" } }),
      prisma.user.count({ where: { role: "landlord" } }),
      prisma.user.count({ where: { role: "admin" } }),
    ]);

    return {
      total,
      students,
      landlords,
      admins,
    };
  }
}

