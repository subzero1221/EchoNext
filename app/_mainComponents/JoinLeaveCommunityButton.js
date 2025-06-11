"use client";

import { useQueryClient } from "@tanstack/react-query";
import { joinCommunity, leaveCommunity } from "../_utils/communityActions";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { FaUserShield, FaCrown, FaSignOutAlt } from "react-icons/fa";

export default function JoinLeaveCommunity({
  user,
  community,
  setIsDeleteModalOpen,
}) {
  const [isMember, setIsMember] = useState(
    community.members.find((member) => member._id === user?._id)
  );
  const [isJoinRequested, setIsJoinRequested] = useState(
    community.joinRequests.includes(user?._id)
  );
  const [isCreator, setIsCreator] = useState(
    community.creator._id === user?._id
  );
  const [isAdmin, setIsAdmin] = useState(community.admin.includes(user?._id));
  const [showDropdown, setShowDropdown] = useState(false);

  const queryClient = useQueryClient();

  async function handleJoinCommunity() {
    if (!user) return toast.info("Log in to get access");
    try {
      const res = await joinCommunity(community._id);
      if (res.success) {
        toast.success(res.message);
        community.communityType === "Public" &&
          setIsMember(res.members?.includes(user._id));
        community.communityType !== "Public" && setIsJoinRequested(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    }
  }

  async function handleLeaveCommunity() {
    try {
      const res = await leaveCommunity(community._id);
      if (res.success) {
        toast.success("Successfully left the community");
        setIsMember(false);
        setIsAdmin(false);
        queryClient.invalidateQueries({
          queryKey: ["community", community._id],
        });
        queryClient.invalidateQueries({
          queryKey: ["communityPosts", community._id],
        });
        queryClient.invalidateQueries({ queryKey: ["communities"] });
      }
    } catch (err) {
      toast.error("Failed to leave community");
    }
    setShowDropdown(false);
  }

  return (
    <div className="flex items-center gap-2">
      {isCreator ? (
        <button
          disabled
          className="flex items-center gap-2 px-6 py-1.5 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400 cursor-default"
        >
          <FaCrown className="w-4 h-4" />
          Creator
        </button>
      ) : isAdmin ? (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-6 py-1.5 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
          >
            <FaUserShield className="w-4 h-4" />
            Admin
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-50 border border-purple-100 overflow-hidden">
              <button
                onClick={handleLeaveCommunity}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 flex items-center space-x-2"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Leave Community</span>
              </button>
            </div>
          )}
        </div>
      ) : isMember ? (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-6 py-1.5 rounded-full text-sm font-medium bg-slate-500 text-white hover:bg-slate-600 transition-colors"
          >
            Member
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-50 border border-purple-100 overflow-hidden">
              <button
                onClick={handleLeaveCommunity}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 flex items-center space-x-2"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Leave Community</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleJoinCommunity}
          className={`px-6 py-1.5 rounded-full text-sm font-medium ${
            isJoinRequested
              ? "bg-gray-500 text-white hover:bg-gray-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } transition-all`}
        >
          {isJoinRequested ? "Requested" : "Join"}
        </button>
      )}

      {isCreator && (
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-6 py-1.5 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>
      )}
    </div>
  );
}
