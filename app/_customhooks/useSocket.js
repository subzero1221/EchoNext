import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { socketURL } from "../_utils/config";

export default function useSocket(user, initial = []) {
  const [notifications, setNotifications] = useState(initial);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const socketInstance = io(socketURL, {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
      setSocket(socketInstance);
      socketInstance.emit("userOnline", user._id);
    });

    socketInstance.on("newNotification", (newNotification) => {
      console.log("New notification received from socket:", newNotification);
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [user]);

  return { notifications, socket };
}
