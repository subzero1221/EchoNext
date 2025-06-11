"use client";

import { useChat } from "../_contextComponents/ChatProvider";
import { useChatData } from "../_customhooks/useChatData";
import { useAuth } from "../_contextComponents/AuthProvider";

import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";
import { useRef, useState, useEffect, useCallback } from "react";

export default function RecentChats() {
  const { user } = useAuth();
  const { isChatOpen, openChat, selectChat, closeChat } = useChat();

  const {
    recentChats,
    messages,
    isLoadingChats,
    isLoadingMessages,
    sendMessage,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    onlineUsers,
  } = useChatData();

  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const messagesContainerRef = useRef(null);
  const isScrollAdjustment = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (isScrollAdjustment.current) return;
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (openChat && messages?.length > 0) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [openChat, scrollToBottom, messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || isScrollAdjustment.current) return;

    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;
    if (nearBottom) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const handleScroll = useCallback(
    async (e) => {
      const container = e.currentTarget;

      if (container.scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
        isScrollAdjustment.current = true;

        const anchorElement = container.firstElementChild;
        const anchorOffset = anchorElement?.offsetTop ?? 0;
        const prevScrollHeight = container.scrollHeight;
        const prevScrollTop = container.scrollTop;

        container.style.scrollBehavior = "auto";
        container.style.overflowAnchor = "none";

        await fetchNextPage();

        await new Promise((resolve) => setTimeout(resolve, 0));
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const scrollHeightDiff = container.scrollHeight - prevScrollHeight;
        const newScrollTop = prevScrollTop + scrollHeightDiff;

        container.scrollTop = newScrollTop;

        requestAnimationFrame(() => {
          container.style.scrollBehavior = "";
          container.style.overflowAnchor = "";
          isScrollAdjustment.current = false;
        });
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;
    const formData = new FormData();
    formData.append("content", newMessage);
    if (file) {
      formData.append("media", file);
    }

    sendMessage(formData);
    setNewMessage("");
    setFile(null);
  };

  const formatDate = (date) => {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "Invalid date";
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch {
      return "Invalid date";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (
      droppedFile &&
      (droppedFile.type.startsWith("image") ||
        droppedFile.type.startsWith("video"))
    ) {
      setFile(droppedFile);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.kind === "file") {
        const pastedFile = item.getAsFile();
        if (
          pastedFile &&
          (pastedFile.type.startsWith("image") ||
            pastedFile.type.startsWith("video"))
        ) {
          setFile(pastedFile);
          break;
        }
      }
    }
  };

  console.log("online users:", onlineUsers);

  const selectedChat = recentChats.find((chat) => chat._id === openChat);

  if (!isChatOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[800px] bg-slate-900 rounded-xl shadow-xl border border-purple-500/20 z-50">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/20 flex justify-between items-center">
        <h3 className="text-white font-semibold">Chats</h3>
        <button
          onClick={closeChat}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <IoClose className="h-5 w-5" />
        </button>
      </div>

      <div className="flex h-[600px]">
        {/* Recent Chats List */}
        <div className={`w-1/3 border-r border-purple-500/20`}>
          <div className="h-full overflow-y-auto">
            {isLoadingChats ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-purple-500 rounded-full"></div>
              </div>
            ) : recentChats.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                No recent chats
              </div>
            ) : (
              recentChats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => selectChat(chat._id)}
                  className={`w-full p-4 flex items-center space-x-3 hover:bg-purple-500/10 transition-colors border-b border-purple-500/10 ${
                    openChat === chat._id ? "bg-purple-500/10" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-purple-500/50">
                      <Image
                        src={
                          chat.otherParticipant?.avatarUrl || "/userDefault.jpg"
                        }
                        alt={chat.otherParticipant?.nickName || "User"}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                      {onlineUsers.includes(chat.otherParticipant?._id) && (
                        <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full ring-1 ring-white" />
                      )}
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-white font-medium truncate">
                        {chat.otherParticipant?.nickName || "Unknown"}{" "}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {formatDate(chat.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {chat.lastMessage?.content || ""}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Content */}
        {openChat && selectedChat && (
          <div className="w-2/3 flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-purple-500/20 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-purple-500/50">
                <Image
                  src={
                    selectedChat.otherParticipant?.avatarUrl ||
                    "/userDefault.jpg"
                  }
                  alt={selectedChat.otherParticipant?.nickName || "User"}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-white font-medium">
                  {selectedChat.otherParticipant?.nickName || "Unknown"}
                </h4>
                <p className="text-xs text-gray-400">
                  {onlineUsers.includes(selectedChat.otherParticipant._id) &&
                    "Online 🟢"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{
                height: "calc(100% - 120px)",
                maxHeight: "calc(100% - 120px)",
              }}
            >
              {isLoadingMessages ? (
                <div className="flex justify-center py-2">
                  <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-purple-500 rounded-full"></div>
                </div>
              ) : messages?.length === 0 ? (
                <div className="text-center text-gray-400">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message, i) => (
                  <div
                    key={message._id + i}
                    className={`flex ${
                      message.sender._id === user?._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl p-3 ${
                        message.sender._id === user?._id
                          ? "bg-purple-600 text-white rounded-br-none"
                          : "bg-gray-700 text-white rounded-bl-none"
                      }`}
                    >
                      {/* Text Content */}
                      {message.content && (
                        <p className="text-sm">{message.content}</p>
                      )}

                      {/* Media (Image or Video) */}
                      {message.fileUrl && (
                        <div className="mt-2">
                          {message.fileType === "video" ? (
                            <video
                              src={message.fileUrl}
                              controls
                              className="max-w-full max-h-[300px] rounded-md"
                            />
                          ) : (
                            <img
                              src={message.fileUrl}
                              alt="sent media"
                              className="max-w-full max-h-[300px] rounded-md"
                            />
                          )}
                        </div>
                      )}

                      {/* Timestamp */}
                      <p className="text-xs mt-1 opacity-70">
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-purple-500/20">
              <form
                onSubmit={handleSendMessage}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onPaste={handlePaste}
                className={`flex items-center space-x-3 p-2 bg-slate-800 rounded-xl ${
                  isDragging ? "ring-2 ring-purple-500" : ""
                }`}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
              >
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition">
                    📎
                  </div>
                </label>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message or drop a file..."
                    className="w-full bg-slate-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {file && (
                    <div className="absolute -bottom-6 left-2 flex items-center text-xs text-purple-400 max-w-[90%] truncate space-x-2">
                      <span className="truncate">📎 {file.name}</span>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-red-400 hover:text-red-500 transition"
                        title="Remove file"
                      >
                        ❌
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all text-sm shadow-md"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
