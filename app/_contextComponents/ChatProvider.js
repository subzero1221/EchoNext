"use client";

import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthProvider";
import useSocket from "../_customhooks/useSocket";
import { startChat } from "../_utils/messageActions";
import { useQueryClient } from "@tanstack/react-query";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [openChat, setOpenChat] = useState(null);
  const { socket } = useSocket(user);

  const toggleChat = () => {
    if (!user?._id) return;
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setOpenChat(null);
    }
  };

  const selectChat = (chatId) => {
    if (!user?._id) return;
    setOpenChat(chatId);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setOpenChat(null);
  };

  const startNewChat = async (recipientId) => {
    if (!user) return;
    setIsChatOpen(true);
    try {
      const res = await startChat(recipientId);
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["recentChats"] });
        setOpenChat(res.chat._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        openChat,
        toggleChat,
        selectChat,
        closeChat,
        socket,
        startNewChat,
        user,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
