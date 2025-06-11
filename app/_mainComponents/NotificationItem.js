"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { Check, X, MessageSquare, Reply, Heart } from "lucide-react";
import Link from "next/link";

export default function NotificationItem({
  notification,
  handleMarkAsRead,
  handleAcceptFriendRequest,
  handleDeclineFriendRequest,
  isLoading,
}) {
  const { _id, type, sender, message, about, aboutData, createdAt, isRead } =
    notification;

  const getReactionEmoji = (reactionType) => {
    switch (reactionType?.toLowerCase()) {
      case "cool":
        return "😎";
      case "love":
        return "❤️";
      case "haha":
        return "😂";
      case "sad":
        return "😢";
      case "angry":
        return "😠";
      default:
        return "👍";
    }
  };

  const getNotificationIcon = () => {
    switch (type) {
      case "friend_request":
        return "👋";
      case "accepted_friend_request":
        return "✅";
      case "declined_friend_request":
        return "❌";
      case "comment":
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case "reply":
        return <Reply className="w-5 h-5 text-purple-400" />;
      case "react":
        return <Heart className="w-5 h-5 text-red-400" />;
      default:
        return "🔔";
    }
  };

  console.log(notification);

  return (
    <div
      className={`p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${
        !isRead ? "bg-slate-800/30" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Link href={`/user/${sender._id}`}>
            <Image
              src={sender.avatarUrl || "/userDefault.jpg"}
              width={64}
              height={64}
              className="w-14 h-14 rounded-full object-cover hover:opacity-90 transition-opacity"
              alt={sender.nickName || "User avatar"}
            />
          </Link>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/user/${sender._id}`}
              className="font-medium text-slate-200 hover:text-purple-400 transition-colors"
            >
              {sender.nickName}
            </Link>
            <span className="text-slate-400">
              {type !== "community" && message}
            </span>
            <span className="text-slate-500 text-sm">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
          {type === "comment" && (
            <div className="space-y-1">
              <Link
                href={`/postfeed/${aboutData?.postId?._id}`}
                className="block text-slate-300 text-sm hover:text-purple-400 transition-colors"
              >
                {aboutData?.postId
                  ? aboutData?.postId.title
                  : aboutData?.commentId.commentId?.postId.title}
              </Link>
              <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300">{aboutData.content}</span>
              </div>
            </div>
          )}
          {type === "community" && (
            <div className="space-y-1">
              <div className="text-slate-300 text-sm mt-3">
                {message.split(" ").slice(0, -1).join(" ")}{" "}
                <Link
                  href={`/communities/${about.id}`}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {message.split(" ").pop()}
                </Link>
              </div>
            </div>
          )}
          {type === "react" && (
            <div className="mt-2 space-y-1">
              <Link
                href={`/postfeed/${aboutData?.postId?._id}`}
                className="block text-slate-300 text-sm hover:text-purple-400 transition-colors"
              >
                {aboutData?.postId
                  ? aboutData?.postId.title
                  : aboutData?.commentId.commentId?.postId.title}
              </Link>
              <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg">
                <span className="text-2xl">
                  {getReactionEmoji(message?.split(" ").at(5))}
                </span>
                <span className="text-slate-300">
                  Reacted with {message?.split(" ").at(5)}
                </span>
              </div>
            </div>
          )}
          {type === "reply" && (
            <div className="mt-2 space-y-2">
              <Link
                href={`/postfeed/${aboutData?.commentId?.postId?._id}`}
                className="block text-slate-300 text-sm hover:text-purple-400 transition-colors"
              >
                {aboutData?.commentId.postId.title}
              </Link>
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">
                    {aboutData?.commentId.content}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg ml-4 border-l-2 border-purple-500/50">
                  <Reply className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">{aboutData.content}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center">
            {getNotificationIcon()}
          </div>
          {!isRead && type !== "friend_request" && (
            <Button
              size="sm"
              variant="flat"
              onClick={() => handleMarkAsRead(_id)}
              className="bg-purple-500/20 text-sm text-purple-400 hover:bg-purple-500/30"
              startContent={<Check className="w-4 h-4" />}
            >
              Mark as read
            </Button>
          )}
          {type === "friend_request" && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="flat"
                onClick={() => handleAcceptFriendRequest(sender._id)}
                isDisabled={isLoading}
                className="bg-green-500/20 text-sm text-green-400 hover:bg-green-500/30"
                startContent={<Check className="w-4 h-4" />}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="flat"
                onClick={() => handleDeclineFriendRequest(sender._id)}
                isDisabled={isLoading}
                className="bg-red-500/20 text-sm text-red-400 hover:bg-red-500/30"
                startContent={<X className="w-4 h-4" />}
              >
                Decline
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
