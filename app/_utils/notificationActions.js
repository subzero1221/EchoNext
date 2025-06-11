import { URL } from "./config";

export async function getNotifications(filter, page) {
  try {
    const res = await fetch(
      `${URL}/notifications/getNotifications?filter=${filter}&page=${page}&limit=10`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to get notifications");
    }

    const data = await res.json();
    console.log(data);
    return {
      data: data.notificationsWithExtraData,
      totalPages: data.totalPages,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function getNotificationsLength() {
  try {
    const res = await fetch(`${URL}/notifications/getNotificationsLength`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to get notifications");
    }

    const data = await res.json();
    console.log(data);
    return data.notifications;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    const res = await fetch(
      `${URL}/notifications/markNotificationAsRead/${notificationId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to read notification");
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
