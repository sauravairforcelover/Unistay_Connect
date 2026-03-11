import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { MessageService } from "@/services";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get("receiverId");

    if (receiverId) {
      // Get messages between two users
      const messages = await MessageService.getMessages(session.user.id, receiverId);
      return NextResponse.json(messages);
    } else {
      // Get all conversations
      const conversations = await MessageService.getConversations(session.user.id);
      return NextResponse.json(conversations);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const message = await MessageService.sendMessage(
      session.user.id,
      receiverId,
      content
    );

    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
