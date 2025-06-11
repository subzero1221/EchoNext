"use client";

import { useState } from "react";
import { BsPersonPlus, BsChatDots } from "react-icons/bs";
import { MdOutlinePending } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { getRelationship, sendFriendRequest } from "../_utils/friendActions";
import { useAuth } from "../_contextComponents/AuthProvider";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IoMdPersonAdd } from "react-icons/io";

export default function ActOnOtherUser({ recipientId }) {
  const user = useAuth();
  const queryClient = useQueryClient();

  const {
    data: relationship,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["relationship", recipientId],
    queryFn: () => getRelationship(recipientId),
    enabled: !!recipientId,
  });

  const relation = relationship?.relationshipType;

  console.log(relation);

  if (!user || user._id === recipientId) return null;

  const handleSendFriendRequest = async () => {
    try {
      const res = await sendFriendRequest(recipientId);
      if (res.success) {
        toast.success(res.message || "Friend request sent!");

        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not send friend request.");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {isLoading ? (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500/20 text-gray-400"
        >
          Loading...
        </button>
      ) : relation === "received" ? (
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
          <IoMdPersonAdd className="w-5 h-5" />
          Accept Request
        </button>
      ) : relation === "friends" ? (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400"
        >
          <FaUserFriends className="w-5 h-5" />
          Friends
        </button>
      ) : relation === "sent" ? (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-500/20 text-slate-400"
        >
          <MdOutlinePending className="w-5 h-5" />
          Requested
        </button>
      ) : (
        <button
          onClick={handleSendFriendRequest}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
        >
          <BsPersonPlus className="w-5 h-5" />
          Add Friend
        </button>
      )}

      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
        <BsChatDots className="w-5 h-5" />
        Message
      </button>
    </div>
  );
}
