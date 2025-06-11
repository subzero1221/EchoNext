"use client";

import { useQuery } from "@tanstack/react-query";
import { getCommunity } from "../_utils/communityActions";
import { useAuth } from "../_contextComponents/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  approvePost,
  declinePost,
  getPendingCommunityPosts,
} from "../_utils/postActions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import UnauthorizedAccess from "./UnauthorizedAccess";
import PendingPostCard from "./PendingPostCard";
import { MdOutlinePendingActions } from "react-icons/md";

export default function PendingPostsPage({ communityId }) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAuthorized, setIsAuthorized] = useState(true);

  const { data: community } = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => getCommunity(communityId),
  });

  const { data: pendingPosts, refetch } = useQuery({
    queryKey: ["pendingPosts", communityId],
    queryFn: () => getPendingCommunityPosts(communityId),
    enabled: !!community && isAuthorized,
  });

  console.log("Pending POSTS:", pendingPosts);

  useEffect(() => {
    if (community) {
      const isAdmin = community.admin.includes(user?._id);
      const isCreator = community.creator._id === user?._id;
      const isPrivate = community.communityType === "Private";

      if (!isPrivate || (!isAdmin && !isCreator)) {
        setIsAuthorized(false);
      }
    }
  }, [community, user]);

  const handleApprovePost = async (postId) => {
    try {
      const res = await approvePost(postId, communityId);
      if (res.success) {
        toast.success("Post approved successfully");
        queryClient.invalidateQueries({
          queryKey: ["pendingPosts", communityId],
        });
        queryClient.invalidateQueries({
          queryKey: ["communityPosts", communityId],
        });
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to approve post");
    }
  };

  const handleDeclinePost = async (postId) => {
    try {
      const res = await declinePost(postId, communityId);
      if (res.success) {
        toast.success("Post declined successfully");
        queryClient.invalidateQueries({
          queryKey: ["pendingPosts", communityId],
        });
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to decline post");
    }
  };

  if (!community) return null;

  if (!isAuthorized) {
    return (
      <UnauthorizedAccess
        message="You need to be an admin or creator of this private community to view pending posts."
        redirectPath={`/communities/${communityId}`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Pending Posts</h1>
          <button
            onClick={() => router.push(`/communities/${communityId}`)}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Back to Community
          </button>
        </div>

        {!pendingPosts || pendingPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg flex ml-72 mb-6">
              No pending posts to review{" "}
            </p>
            <MdOutlinePendingActions className="text-purple-400 items-center justify-center ml-96 text-2xl" />
          </div>
        ) : (
          <div className="space-y-6">
            {pendingPosts.map((post) => (
              <div
                key={post._id}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <PendingPostCard post={post} communityName={community.name} />
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => handleApprovePost(post._id)}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDeclinePost(post._id)}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
  );
}
