import { prisma } from "@/lib/prisma";

export class StudentBookmarkService {
  /**
   * Get all bookmarks for a student
   */
  static async getStudentBookmarks(studentId: string) {
    return await prisma.bookmark.findMany({
      where: {
        userId: studentId,
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
   * Add a property to bookmarks
   */
  static async addBookmark(studentId: string, propertyId: string) {
    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    // Check if already bookmarked
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_propertyId: {
          userId: studentId,
          propertyId,
        },
      },
    });

    if (existing) {
      throw new Error("Property already bookmarked");
    }

    return await prisma.bookmark.create({
      data: {
        userId: studentId,
        propertyId,
      },
      include: {
        property: true,
      },
    });
  }

  /**
   * Remove a bookmark
   */
  static async removeBookmark(studentId: string, propertyId: string) {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_propertyId: {
          userId: studentId,
          propertyId,
        },
      },
    });

    if (!bookmark) {
      throw new Error("Bookmark not found");
    }

    await prisma.bookmark.delete({
      where: {
        userId_propertyId: {
          userId: studentId,
          propertyId,
        },
      },
    });

    return { success: true };
  }

  /**
   * Check if a property is bookmarked
   */
  static async isBookmarked(studentId: string, propertyId: string): Promise<boolean> {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_propertyId: {
          userId: studentId,
          propertyId,
        },
      },
    });

    return !!bookmark;
  }
}

