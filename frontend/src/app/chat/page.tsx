"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import api from "@/lib/api";

interface Chat {
  id: number;
  title: string;
}

interface Message {
  id?: number;
  role: string;
  content: string;
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchChats();
  }, [router]);

  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  const fetchChats = async () => {
    try {
      const res = await api.get("/chat/all");
      setChats(res.data);
      if (res.data.length > 0 && !activeChatId) {
        setActiveChatId(res.data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch chats", error);
    }
  };

  const fetchMessages = async (chatId: number) => {
    try {
      const res = await api.get(`/chat/${chatId}`);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  const handleSendMessage = async (content: string) => {
    let chatId = activeChatId;
    if (!chatId) {
      // Create a chat if none exists
      try {
        const res = await api.post("/chat/create", { title: content.substring(0, 30) || "New Chat" });
        chatId = res.data.id;
        setChats((prev) => [...prev, res.data]);
        setActiveChatId(chatId);
      } catch (error) {
        console.error("Failed to create chat", error);
        return;
      }
    }

    const newMsg: Message = { role: "user", content };
    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const res = await api.post("/chat/generate", {
        chat_id: chatId,
        message: content,
      });
      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Failed to generate response", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not generate response." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleDeleteChat = async (chatId: number) => {
    try {
      await api.delete(`/chat/${chatId}`);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete chat", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        onLogout={handleLogout}
        onDeleteChat={handleDeleteChat}
      />
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
