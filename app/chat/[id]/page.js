"use client";

import { useChat } from "../../_contextComponents/ChatProvider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IoArrowBack } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { recentChats, messages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const chat = recentChats.find((c) => c.id === id);
  const chatMessages = messages[id] || [];

  useEffect(() => {
    if (!chat) {
      router.push("/");
      return;
    }
    scrollToBottom();
  }, [chat, chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessage(newMessage);
    setNewMessage("");
  };

  if (!chat) return null;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Chat Header */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-slate-900 border-b border-purple-500/20 z-10">
        <div className="max-w-4xl mx-auto px-4 h-full flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-400 hover:text-white transition-colors"
          >
            <IoArrowBack className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-purple-500/50">
              <Image
                src={chat.avatar}
                alt={chat.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-white font-semibold">{chat.name}</h2>
              <p className="text-sm text-gray-400">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="pt-20 pb-24 max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-xl p-4 ${
                  message.sender === "me"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800 text-white"
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
