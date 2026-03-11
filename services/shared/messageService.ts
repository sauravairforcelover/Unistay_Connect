import { prisma } from "@/lib/prisma";

export class MessageService {
  /**
   * Get all conversations for a user
   */
  static async getConversations(userId: string) {
    const allMessages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true },
        },
        receiver: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    // Group by conversation partner and get latest message
    const conversationMap = new Map();
    allMessages.forEach((msg) => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          id: partnerId,
          participantId: partnerId,
          participantName: partner?.name || "Unknown",
          participantAvatar: partner?.avatar,
          lastMessage: msg.content,
          lastMessageTime: msg.timestamp,
        });
      }
    });

    return Array.from(conversationMap.values());
  }

  /**
   * Get messages between two users
   */
  static async getMessages(userId: string, receiverId: string) {
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true },
        },
        receiver: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });
  }

  /**
   * Send a message
   */
  static async sendMessage(senderId: string, receiverId: string, content: string) {
    // Validate that receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new Error("Receiver not found");
    }

    return await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true },
        },
        receiver: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }
}

