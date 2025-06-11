"use client";
import { useState } from "react";
import Image from "next/image";
import {
  FaUsers,
  FaUserShield,
  FaUserTimes,
  FaUserMinus,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { adminAction, removeMember } from "../_utils/communityActions";

export default function CommunityMembersModal({
  isOpen,
  onClose,
  community,
  user,
}) {
  const queryClient = useQueryClient();
  const isCreator = community.creator._id === user?._id;
  const isAdmin = community.admin.includes(user?._id);

  const handleAdminAction = async (memberId, action) => {
    try {
      const res = await adminAction(community._id, memberId, action);
      queryClient.invalidateQueries({ queryKey: ["community", community._id] });
    } catch (err) {
      toast.error("Failed to update admin status");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const res = await removeMember(community._id, memberId);

      if (!res.success) throw new Error("Failed to remove member");
      toast.success("Member removed from community");
      queryClient.invalidateQueries({ queryKey: ["community", community._id] });
    } catch (err) {
      toast.error("Failed to remove member");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg w-[32rem] max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaUsers className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">
                Community Members
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {community.members.map((member) => {
              const isMemberCreator = community.creator._id === member._id;
              const isMemberAdmin = community.admin.includes(member._id);
              const canManageMember =
                isCreator || (isAdmin && !isMemberAdmin && !isMemberCreator);
              const canManageAdmin = isCreator && !isMemberCreator;

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={member.avatarUrl || "/userDefault.jpg"}
                        alt={member.nickName}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={`/user/${member._id}`}>
                          <h4 className="text-white font-medium truncate">
                            {member.nickName}
                          </h4>
                        </Link>
                        {isMemberAdmin && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                        {isMemberCreator && (
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                            Creator
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  {member._id !== user?._id && (
                    <div className="flex gap-2 flex-shrink-0 ml-4">
                      {canManageAdmin && !isMemberCreator && (
                        <>
                          {!isMemberAdmin ? (
                            <button
                              onClick={() =>
                                handleAdminAction(member._id, "make")
                              }
                              className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors"
                              title="Make Admin"
                            >
                              <FaUserShield className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleAdminAction(member._id, "remove")
                              }
                              className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-md transition-colors"
                              title="Remove Admin"
                            >
                              <FaUserShield className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                      {canManageMember && !isMemberCreator && (
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                          title="Remove Member"
                        >
                          <FaUserMinus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
