"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { sendMessage, getMessages, getConversations } from "@/messaging/lib/messaging";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
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

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

export default function MessagesComponent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const receiverId = searchParams.get("receiverId");
    if (receiverId) {
      setSelectedChat(receiverId);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadConversations() {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const data = await getConversations();
        setConversations(data);
        setError("");
      } catch (error) {
        console.error("Failed to load conversations:", error);
        setError("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, [session]);

  useEffect(() => {
    async function loadMessages() {
      if (!selectedChat || !session?.user?.id) {
        setMessages([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getMessages(selectedChat);
        setMessages(data);
        setError("");
      } catch (error) {
        console.error("Failed to load messages:", error);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [selectedChat, session]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !selectedChat || !session?.user?.id || sending) return;

    setSending(true);
    setError("");
    try {
      await sendMessage(session.user.id, selectedChat, message);
      setMessage("");
      // Reload messages
      const data = await getMessages(selectedChat);
      setMessages(data);
      // Reload conversations to update last message
      const convData = await getConversations();
      setConversations(convData);
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find((c) => c.participantId === selectedChat);

  if (loading && conversations.length === 0) {
    return (
      <>
        <div className="layout-content-container flex flex-col w-80">
          <h2 className="text-[#111418] tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">
            Messages
          </h2>
          <div className="px-4 py-3">
            <p className="text-[#617589]">Loading conversations...</p>
          </div>
        </div>
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="p-4">
            <p className="text-[#617589]">Select a conversation to start messaging.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="layout-content-container flex flex-col w-80 border-r border-[#dbe0e6]">
        <h2 className="text-[#111418] tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">
          Messages
        </h2>
        <div className="px-4 py-3">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-12">
            <div className="text-[#637588] flex border-none bg-[#f0f2f4] items-center justify-center pl-4 rounded-l-xl border-r-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-full placeholder:text-[#637588] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            />
          </div>
        </div>
        {error && (
          <div className="px-4 py-2">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="px-4 py-3">
              <p className="text-[#617589] text-sm">
                {searchQuery ? "No conversations found." : "No conversations yet."}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.participantId)}
                className={`flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 w-full hover:bg-[#f0f2f4] transition-colors ${
                  selectedChat === conversation.participantId ? "bg-[#f0f2f4]" : ""
                }`}
              >
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 flex-shrink-0"
                  style={{
                    backgroundImage: conversation.participantAvatar
                      ? `url(${conversation.participantAvatar})`
                      : "none",
                    backgroundColor: conversation.participantAvatar ? "transparent" : "#dbe0e6",
                  }}
                ></div>
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">
                    {conversation.participantName}
                  </p>
                  <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        {selectedConversation ? (
          <>
            <div className="flex items-center gap-4 px-4 py-3 border-b border-[#dbe0e6]">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 flex-shrink-0"
                style={{
                  backgroundImage: selectedConversation.participantAvatar
                    ? `url(${selectedConversation.participantAvatar})`
                    : "none",
                  backgroundColor: selectedConversation.participantAvatar ? "transparent" : "#dbe0e6",
                }}
              ></div>
              <div>
                <h2 className="text-[#111418] text-lg font-bold leading-tight">
                  {selectedConversation.participantName}
                </h2>
                <p className="text-[#617589] text-sm">Active now</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[#617589]">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64px"
                    height="64px"
                    fill="#dbe0e6"
                    viewBox="0 0 256 256"
                    className="mb-4"
                  >
                    <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"></path>
                  </svg>
                  <p className="text-[#617589] text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === session?.user?.id;
                    const participant = isMe ? msg.sender : msg.receiver;
                    const time = new Date(msg.timestamp).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        {!isMe && (
                          <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 flex-shrink-0"
                            style={{
                              backgroundImage: participant?.avatar
                                ? `url(${participant.avatar})`
                                : "none",
                              backgroundColor: participant?.avatar ? "transparent" : "#dbe0e6",
                            }}
                          ></div>
                        )}
                        <div className={`flex flex-col gap-1 max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                          <div className="flex items-center gap-2">
                            {!isMe && (
                              <p className="text-[#637588] text-xs font-medium">
                                {participant?.name || "Unknown"}
                              </p>
                            )}
                            <p className="text-[#637588] text-xs">{time}</p>
                          </div>
                          <p
                            className={`text-base font-normal leading-normal rounded-2xl px-4 py-3 ${
                              isMe
                                ? "bg-[#1380ec] text-white rounded-br-sm"
                                : "bg-[#f0f2f4] text-[#111418] rounded-bl-sm"
                            }`}
                          >
                            {msg.content}
                          </p>
                        </div>
                        {isMe && (
                          <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 flex-shrink-0"
                            style={{
                              backgroundImage: session?.user?.avatar
                                ? `url(${session.user.avatar})`
                                : "none",
                              backgroundColor: session?.user?.avatar ? "transparent" : "#dbe0e6",
                            }}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            <div className="flex items-center px-4 py-3 gap-3 border-t border-[#dbe0e6]">
              <div className="flex flex-1 items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sending}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#1380ec] h-12 placeholder:text-[#637588] px-4 text-base font-normal leading-normal disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !message.trim()}
                  className="flex items-center justify-center rounded-xl h-12 w-12 bg-[#1380ec] text-white hover:bg-[#0f6bc7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M237.66,106.19a8,8,0,0,0-6.5-6.5L153.05,84.5,98.14,29.59a16,16,0,0,0-22.63,0L29.59,85.51a16,16,0,0,0,0,22.63l54.91,54.91L84.5,153.05,18.31,231.16a8,8,0,0,0,12.35,10.19l78.11-66.19,7.87,7.88a16,16,0,0,0,22.63,0l45.92-45.92a16,16,0,0,0,0-22.63ZM48,100.69,79.31,132,48,163.31Zm48,48L87.31,180,180,87.31,208.69,116Z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64px"
                height="64px"
                fill="#dbe0e6"
                viewBox="0 0 256 256"
                className="mx-auto mb-4"
              >
                <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"></path>
              </svg>
              <p className="text-[#617589] text-lg mb-2">Select a conversation</p>
              <p className="text-[#617589] text-sm">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
