// Messaging system utilities
// This is a separate messaging system that can be extended with real-time features

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  receiver?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export async function sendMessage(
  senderId: string,
  receiverId: string,
  content: string
): Promise<Message> {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      receiverId,
      content,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}

export async function getMessages(receiverId: string): Promise<Message[]> {
  const response = await fetch(`/api/messages?receiverId=${receiverId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const data = await response.json();
  return data.map((msg: any) => ({
    ...msg,
    timestamp: new Date(msg.timestamp),
  }));
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch("/api/messages");

  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  const data = await response.json();
  // API returns conversations directly
  return data.map((conv: any) => ({
    id: conv.id || conv.participantId,
    participantId: conv.participantId,
    participantName: conv.participantName,
    participantAvatar: conv.participantAvatar,
    lastMessage: conv.lastMessage,
    lastMessageTime: conv.lastMessageTime ? new Date(conv.lastMessageTime) : undefined,
    unreadCount: conv.unreadCount || 0,
  }));
}

