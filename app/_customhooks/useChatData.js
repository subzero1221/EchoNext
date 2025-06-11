"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getRecentChats,
  getMessages,
  sendMessageAction,
} from "../_utils/messageActions";
import { useChat } from "../_contextComponents/ChatProvider";
import { useEffect, useState } from "react";

export function useChatData() {
  const { openChat, socket, user } = useChat();
  const queryClient = useQueryClient();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { data: recentChats = [], isLoading: isLoadingChats } = useQuery({
    queryKey: ["recentChats"],
    queryFn: async () => {
      const response = await getRecentChats();
      if (!response.success) throw new Error("Failed to fetch chats");
      return response.recentChats;
    },
    enabled: !!user?._id,
  });

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = useInfiniteQuery({
    queryKey: ["messagesData", openChat],
    queryFn: ({ pageParam = 1 }) => getMessages(openChat, pageParam), // ✅ use pageParam!
    enabled: !!openChat,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length + 1;
      } else {
        return undefined;
      }
    },
  });

  useEffect(() => {
    if (!socket) return;

    socket.emit("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  }, [socket]);

  const sendMessageMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await sendMessageAction(formData);
      if (!response.success) throw new Error("Failed to send message");
      return response.message;
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(["messagesData", openChat], (oldData) => {
        if (!oldData) return oldData;

        const newPages = [...oldData.pages];
        const lastPage = newPages[0];

        const lastPageIndex = 0;

        const updatedLastPage = {
          ...lastPage,
          messages: [
            ...lastPage.messages,
            {
              _id: newMessage._id,
              content: newMessage.content,
              createdAt: newMessage.createdAt,
              fileUrl: newMessage.fileUrl,
              fileType: newMessage.fileType,
              sender: {
                _id: user._id,
              },
            },
          ],
        };

        newPages[lastPageIndex] = updatedLastPage;

        return {
          ...oldData,
          pages: newPages,
        };
      });

      queryClient.setQueryData(["recentChats"], (old = []) => {
        return old.map((chat) => {
          if (chat._id === openChat) {
            return {
              ...chat,
              lastMessage: newMessage,
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        });
      });
    },
  });

  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleNewMessage = (message) => {
      queryClient.setQueryData(["messagesData", message.chat], (old = []) => {
        if (message.chat === openChat) {
          return [...old, message];
        }
        return old;
      });

      queryClient.setQueryData(["recentChats"], (old = []) => {
        return old.map((chat) => {
          if (chat._id === message.chat) {
            return {
              ...chat,
              lastMessage: message,
              updatedAt: message.createdAt,
              unreadCount:
                chat._id === openChat ? 0 : (chat.unreadCount || 0) + 1,
            };
          }
          return chat;
        });
      });
    };

    socket.on("forwardMessage", handleNewMessage);
    return () => socket.off("forwardMessage", handleNewMessage);
  }, [socket, openChat, user, queryClient]);

  const sendMessage = async (formData) => {
    const text = formData.get("content");
    const file = formData.get("media");

    if (!openChat || (!text?.trim() && !file) || !user?._id) return;

    const chat = recentChats.find((c) => c._id === openChat);
    if (!chat) return;

    const recipientId = chat.otherParticipant._id;
    formData.append("recipientId", recipientId);

    await sendMessageMutation.mutateAsync(formData);
  };

  return {
    recentChats,
    messages: messagesData?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.messages),
    isLoadingChats,
    isLoadingMessages,
    sendMessage,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSending: sendMessageMutation.isPending,
    hasMore: messagesData?.pages.at(0).hasMore,
    onlineUsers,
  };
}
