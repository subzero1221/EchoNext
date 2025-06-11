"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  getUserPosts,
  getUserComments,
  getUserData,
  getUserShares,
} from "../_utils/userActions";
import PostCard from "./PostCard";
import { useAuth } from "../_contextComponents/AuthProvider";
import { useChat } from "../_contextComponents/ChatProvider";
import Link from "next/link";
import {
  BsArrowRight,
  BsPersonPlus,
  BsChatDots,
  BsIncognito,
} from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import ActOnOtherUser from "./ActOnOtherUser";

export default function UserProfile({ userId }) {
  const [activeTab, setActiveTab] = useState("posts");
  const { user } = useAuth();
  const { startNewChat } = useChat();

  const handleStartChat = async () => {
    if (!userData?.userData) return;

    await startNewChat(
      userId,
      userData.userData.nickName,
      userData.userData.avatar !== "userDefault.jpg"
        ? userData.userData.avatarUrl
        : "/userDefault.jpg"
    );
  };

  if (userId === "Anonymous") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center pb-64">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-8 border border-purple-500/10 flex flex-col items-center max-w-xs">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src="/Anonymous.jpg"
              alt="Anonymous"
              fill
              className="rounded-full object-cover ring-4 ring-purple-500/20"
            />
            <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1">
              <BsIncognito className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Anonymous User
          </h1>
          <p className="text-slate-400 text-center mb-2">
            Post author chose to remain anonymous.
          </p>
        </div>
      </div>
    );
  }

  const { data: userPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });

  const { data: userData, isLoading: isLoadingUserData } = useQuery({
    queryKey: ["userData", userId],
    queryFn: () => getUserData(userId),
    enabled: !!userId,
  });

  const { data: userShares, isLoading: isLoadingSharedPosts } = useQuery({
    queryKey: ["sharedPosts", userId],
    queryFn: () => getUserShares(userId),
    enabled: !!userId,
  });

  const { data: userComments, isLoading: isLoadingComments } = useQuery({
    queryKey: ["userComments", userId],
    queryFn: () => getUserComments(userId),
    enabled: !!userId,
  });

  if (userId === user?._id)
    return (
      <div className="text-2xl text-white flex justify-center align-center mt-64 mr-48">
        User not found 🚫
      </div>
    );

  console.log(userShares);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-6 border border-purple-500/10">
          <div className="flex items-center space-x-4">
            <div className="relative w-20 h-20">
              {userData && (
                <Image
                  src={
                    userData.userData.avatar !== "userDefault.jpg"
                      ? userData.userData.avatarUrl
                      : "/userDefault.jpg"
                  }
                  alt="Profile"
                  fill
                  className="rounded-full object-cover ring-4 ring-purple-500/20"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {userData && userData.userData.nickName}
                </h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleStartChat}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    <BsChatDots className="w-5 h-5" />
                    <span>Message</span>
                  </button>
                  {userId && <ActOnOtherUser recipientId={userId} />}
                </div>
              </div>
              <p className="text-slate-400">
                {userPosts?.length || 0} posts · {userComments?.length || 0}{" "}
                comments
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 w-9/10">
          {/* Left Column - Posts and Comments */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-4 border border-purple-500/10">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "posts"
                      ? "bg-purple-500/20 text-purple-400"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "comments"
                      ? "bg-purple-500/20 text-purple-400"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Comments
                </button>
                <button
                  onClick={() => setActiveTab("shares")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "shares"
                      ? "bg-purple-500/20 text-purple-400"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Shares
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {activeTab === "posts" && (
                <>
                  {userPosts?.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </>
              )}

              {activeTab === "shares" && (
                <>
                  {userShares?.map((share) => (
                    <PostCard key={share.post._id} post={share.post} />
                  ))}
                </>
              )}

              {activeTab === "comments" && (
                <>
                  {userComments?.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-4 border border-purple-500/10"
                    >
                      <div className="mb-4">
                        <p className="text-slate-300">{comment.content}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-slate-400 mb-1">
                          Comment on post:
                        </p>
                        <p className="text-slate-200 line-clamp-2">
                          {comment.postId?.content}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                          Commented on:{" "}
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                        <Link
                          href={`/postfeed/${comment.postId?._id}`}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                        >
                          View Post
                          <BsArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Right Column - User Info */}
          <div className="space-y-4">
            {isLoadingUserData ? (
              <div></div>
            ) : (
              <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-4 border border-purple-500/10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  About User
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400">Member since</p>
                    <p className="text-white">{userData.userData.activeFrom}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Karma</p>
                    <p className="text-white">1,234</p>
                  </div>
                </div>
              </div>
            )}

            {isLoadingUserData ? (
              <div></div>
            ) : (
              <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-4 border border-purple-500/10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Communities
                </h2>
                <div className="space-y-2">
                  {userData.communities.map((community, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Image
                        className="w-8 h-8 rounded-full bg-slate-700"
                        src={
                          community.photo !== "communityDefault.jpg"
                            ? community.photoUrl
                            : "/communityDefault.jpg"
                        }
                        width={8}
                        height={8}
                        alt={community.photo}
                      />
                      <span className="text-slate-300">r/{community.name}</span>
                      <Link
                        href={`/communities/${community._id}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                      >
                        <FaArrowRight />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
