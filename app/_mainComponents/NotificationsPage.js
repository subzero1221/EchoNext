"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationAsRead,
} from "../_utils/notificationActions";
import { useAuth } from "../_contextComponents/AuthProvider";
import { toast } from "react-toastify";
import {
  acceptFriendRequest,
  declineFriendRequest,
} from "../_utils/friendActions";
import NotificationFilterButtons from "./NotificationFilterButtons";
import NotificationItem from "./NotificationItem";
import NotificationEmptyState from "./NotificationEmptyState";
import PaginationControl from "./PaginationControl";

export default function NotificationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ["notifications", activeFilter, currentPage],
    queryFn: () => getNotifications(activeFilter, currentPage),
    enabled: !!user,
  });

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationsLength"] });
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleAcceptFriendRequest = async (requesterId) => {
    setIsLoading(true);
    try {
      await acceptFriendRequest(requesterId);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (error) {
      toast.error("Failed to process friend request");
    }
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notificationsLength"] });
    setIsLoading(false);
  };

  const handleDeclineFriendRequest = async (requesterId) => {
    setIsLoading(true);
    try {
      await declineFriendRequest(requesterId);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (error) {
      toast.error("Failed to process friend request");
    }
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notificationsLength"] });
    setIsLoading(false);
  };

  if (!user) {
    return (
      <div className="text-2xl text-white flex justify-center align-center mt-64 mr-48">
        Log in to get access 🚫
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Notifications</h1>

        <NotificationFilterButtons
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <div className="space-y-1">
          {isLoadingNotifications ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 border-b border-slate-800 animate-pulse"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800/50"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-800/50 rounded w-1/4"></div>
                      <div className="h-3 bg-slate-800/50 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications?.data?.length === 0 ? (
            <NotificationEmptyState />
          ) : (
            notifications?.data?.map((notification, index) => (
              <div key={notification._id}>
                <NotificationItem
                  notification={notification}
                  handleMarkAsRead={handleMarkAsRead}
                  handleAcceptFriendRequest={handleAcceptFriendRequest}
                  handleDeclineFriendRequest={handleDeclineFriendRequest}
                  isLoading={isLoading}
                />
                {index < notifications.data.length - 1 && (
                  <div className="h-px bg-purple-400 mx-4"></div>
                )}
              </div>
            ))
          )}
        </div>

        {notifications?.totalPages > 1 && (
          <PaginationControl
            currentPage={currentPage}
            totalPages={notifications.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
