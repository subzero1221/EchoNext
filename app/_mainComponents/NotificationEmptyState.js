"use client";

import { Bell } from "lucide-react";

export default function NotificationEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
        <Bell className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-200 mb-2">
        No notifications yet
      </h3>
      <p className="text-slate-400 max-w-sm">
        When you receive notifications, they will appear here. This includes
        friend requests, comments, and reactions to your posts.
      </p>
    </div>
  );
}
