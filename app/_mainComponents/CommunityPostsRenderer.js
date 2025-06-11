"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommunityPosts } from "../_utils/postActions";
import {
  FaGlobe,
  FaLock,
  FaUserFriends,
  FaUsers,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { MdCake } from "react-icons/md";
import { FcRules } from "react-icons/fc";
import PostCard from "./PostCard";
import { useState } from "react";
import {
  addCommunityRule,
  deleteCommunityRule,
} from "../_utils/communityActions";
import { toast } from "react-toastify";

const communityTypes = [
  {
    id: "Public",
    icon: <FaGlobe className="w-4 h-4 text-green-500" />,
    title: "Public",
    description: "Anyone can view, post, and comment to this community",
  },
  {
    id: "Restricted",
    icon: <FaUserFriends className="w-4 h-4 text-blue-500" />,
    title: "Restricted",
    description: "Anyone can view, but only approved users can post",
  },
  {
    id: "Private",
    icon: <FaLock className="w-4 h-4 text-purple-500" />,
    title: "Private",
    description: "Only approved users can view and post",
  },
];

export default function CommunityPosts({ community, user }) {
  const queryClient = useQueryClient();
  const [newRule, setNewRule] = useState("");
  const [isAddingRule, setIsAddingRule] = useState(false);

  const {
    data: posts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["communityPosts", community._id],
    queryFn: () => getCommunityPosts(community._id),
  });

  const [isFollowing, setIsFollowing] = useState(
    community.members.find((member) => member._id === user?._id)
  );

  const formattedDate = new Date(community?.createdAt).toLocaleString();

  const communityTypeConfig = communityTypes.find(
    (type) => type.id === community?.communityType
  );

  const isAdmin = community.admin.includes(user?._id);
  const isCreator = community.creator._id === user?._id;
  const canManageRules = isAdmin || isCreator;

  const handleAddRule = async () => {
    if (!newRule.trim()) {
      toast.error("Rule cannot be empty");
      return;
    }

    try {
      const res = await addCommunityRule(community._id, newRule.trim());
      if (res.success) {
        toast.success("Rule added successfully");
        setNewRule("");
        setIsAddingRule(false);
        queryClient.invalidateQueries(["community", community._id]);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to add rule");
    }
  };

  const handleDeleteRule = async (ruleIndex) => {
    try {
      const res = await deleteCommunityRule(community._id, ruleIndex);
      if (res.success) {
        toast.success("Rule deleted successfully");
        queryClient.invalidateQueries(["community", community._id]);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to delete rule");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        {isFollowing || community?.communityType === "Public" ? (
          posts ? (
            posts.map((post) => (
              <PostCard
                post={post}
                communityName={community?.name}
                communityId={community?._id}
                key={post._id}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">No posts yet.</p>
          )
        ) : (
          <p className="text-gray-200 text-center text-xl mt-12 mr-12">
            This community is Private, join to get access.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4">
            About Community
          </h2>
          <p className="text-slate-300 mb-4">{community?.description}</p>
          <div className="border-t border-slate-700 pt-4">
            <div className="flex items-center gap-2 mb-3">
              {communityTypeConfig?.icon || (
                <FaUsers className="text-slate-400" />
              )}
              <div>
                <div className="text-white font-medium">
                  {communityTypeConfig?.title || community?.communityType}
                </div>
                <div className="text-slate-400 text-sm">
                  {communityTypeConfig?.description}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <FaUsers className="text-slate-400" />
              <div>
                <div className="text-white font-medium">
                  {community?.creator?.nickName}
                </div>
                <div className="text-slate-400 text-sm">Creator</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MdCake className="text-slate-400" />
              <div>
                <div className="text-white font-medium">Created</div>
                <div className="text-slate-400 text-sm">{formattedDate}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex">
              <p>
                <FcRules className="h-7 w-7 mr-1 pb-1" />{" "}
              </p>{" "}
              Community Rules
            </h2>
            {canManageRules && (
              <button
                onClick={() => setIsAddingRule(!isAddingRule)}
                className="p-1.5 rounded-full hover:bg-slate-700 transition-colors"
              >
                <FaPlus className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {isAddingRule && (
            <div className="mb-4">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Enter new rule..."
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setIsAddingRule(false);
                    setNewRule("");
                  }}
                  className="px-3 py-1 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRule}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Rule
                </button>
              </div>
            </div>
          )}

          <ul className="space-y-2">
            {community?.communityRules?.map((rule, index) => (
              <li
                key={index}
                className="flex items-center justify-between group text-slate-300 text-sm"
              >
                <span>
                  {index + 1}. {rule}
                </span>
                {canManageRules && (
                  <button
                    onClick={() => handleDeleteRule(index)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-700 rounded transition-all"
                  >
                    <FaTrash className="w-3 h-3 text-red-500" />
                  </button>
                )}
              </li>
            ))}
            {(!community?.communityRules ||
              community.communityRules.length === 0) && (
              <li className="text-slate-400 text-sm">No rules set yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
