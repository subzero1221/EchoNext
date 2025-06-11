"use client";
import { useQuery } from "@tanstack/react-query";
import { getPendingCommunityPosts } from "../_utils/postActions";
import { useRouter } from "next/navigation";
import { FaClipboardCheck } from "react-icons/fa";

export default function PendingPostsManager({ community, user }) {
  const router = useRouter();
  const isAdmin = community.admin.includes(user?._id);
  const isCreator = community.creator._id === user?._id;
  const isPrivate = community.communityType === "Private";

  const { data: pendingPosts } = useQuery({
    queryKey: ["pendingPosts", community._id],
    queryFn: () => getPendingCommunityPosts(community._id),
    enabled: isPrivate && (isAdmin || isCreator),
  });

  if (!isPrivate || (!isAdmin && !isCreator)) return null;

  return (
    <button
      onClick={() => router.push(`/communities/${community._id}/pending`)}
      className="relative p-2 rounded-full hover:bg-slate-700"
    >
      <FaClipboardCheck className="w-5 h-5 text-white" />
      {pendingPosts?.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {pendingPosts.length}
        </span>
      )}
    </button>
  );
}
