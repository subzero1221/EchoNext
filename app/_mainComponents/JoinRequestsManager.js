"use client";
import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { answerUserRequest } from "../_utils/communityActions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";

export default function JoinRequestsManager({ community, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const isAdmin = community.admin.includes(user?._id);
  const isCreator = community.creator._id === user?._id;

  if (!isAdmin && !isCreator) return null;

  const handleAnswerRequest = async (userId, answer) => {
    try {
      const res = await answerUserRequest(community._id, userId, answer);
      if (res.success) {
        toast.success(answer ? "Request accepted" : "Request declined");
        queryClient.invalidateQueries({
          queryKey: ["community", community._id],
        });
      }
    } catch (err) {
      toast.error("Failed to process request");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-700"
      >
        <FaBell className="w-5 h-5 text-white" />
        {community.joinRequests.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {community.joinRequests.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[28rem] bg-slate-800 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4">
            <h3 className="text-white font-semibold mb-4">Join Requests</h3>
            {community.joinRequests.length === 0 ? (
              <p className="text-slate-400 text-sm">No pending requests</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {community.joinRequests.map((requestUser) => (
                  <div
                    key={requestUser._id}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          src={requestUser.avatarUrl || "/userDefault.jpg"}
                          alt={requestUser.nickName}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-white font-medium truncate">
                          {requestUser.nickName}
                        </h4>
                        <p className="text-slate-400 text-sm truncate">
                          {requestUser.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-4">
                      <button
                        onClick={() =>
                          handleAnswerRequest(requestUser._id, "accept")
                        }
                        className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors whitespace-nowrap"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleAnswerRequest(requestUser._id, "decline")
                        }
                        className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors whitespace-nowrap"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
