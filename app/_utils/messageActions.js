import { URL } from "./config";

export const getRecentChats = async () => {
  try {
    const response = await fetch(`${URL}/chats/getRecentChats?page=1`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recent chats");
    }

    const data = await response.json();
    console.log("Frontend received recent chats:", data);

    if (
      !data.processedRecentChats ||
      !Array.isArray(data.processedRecentChats)
    ) {
      console.error("Invalid response format:", data);
      return { success: false, error: "Invalid response format" };
    }

    return { success: true, recentChats: data.processedRecentChats };
  } catch (error) {
    console.error("Error in getUserRecentChats:", error);
    return { success: false, error: error.message };
  }
};

export async function startChat(recipientId) {
  console.log("creating chat!");
  try {
    const res = await fetch(`${URL}/chats/startChat/${recipientId}`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to start chat");
    }

    const data = await res.json();
    console.log(data);
    return {
      success: true,
      chat: data.chat,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export const getMessages = async (chatId, page = 1) => {
  try {
    console.log("Fetching messages for chat:", chatId, "page:", page);
    const response = await fetch(
      `${URL}/messages/getMessages/${chatId}?page=${page}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Messages");
    }

    const data = await response.json();
    console.log("Received messages:", data);

    return { success: true, messages: data.messages, hasMore: data.hasMore };
  } catch (error) {
    console.error("Error in getMessages:", error);
    return { success: false, error: error.message };
  }
};

export async function sendMessageAction(formData) {
  console.log("Sending Message!");
  try {
    const res = await fetch(`${URL}/messages/sendMessage`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to send Message");
    }

    const data = await res.json();
    console.log(data);
    return {
      success: true,
      message: data.message,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}
