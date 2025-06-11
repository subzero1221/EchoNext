"use client";

import { useState } from "react";
import Image from "next/image";
import PostCard from "./PostCard";
import { useAuth } from "../_contextComponents/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getSavedPosts, getSharedPosts } from "../_utils/saveActions";
import { getFriends } from "../_utils/friendActions";
import RenderFriends from "./RenderFriends";
import { IsPostsForFeedLoading } from "./IsPostsForFeedLoading";

export default function MyWall() {
  const [activeTab, setActiveTab] = useState("share");

  const { data: savedPosts, isLoading: isLoadingSaved } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: () => getSavedPosts(),
    enabled: activeTab === "save",
  });

  const { data: sharedPosts, isLoading: isLoadingShared } = useQuery({
    queryKey: ["sharedPosts"],
    queryFn: () => getSharedPosts(),
    enabled: activeTab === "share",
  });

  const { data: friends, isLoading: isLoadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: () => getFriends(),
  });

  const isLoading = activeTab === "share" ? isLoadingShared : isLoadingSaved;
  const posts = activeTab === "share" ? sharedPosts : savedPosts;

  const { user } = useAuth();

  console.log("sharedPosts:", sharedPosts);

  if (!user)
    return (
      <div className="text-2xl text-white flex justify-center align-center mt-64 mr-48">
        Log in to get access 🚫
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* User Header */}
        <div className="mb-8 bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-6 border border-purple-500/10">
          <div className="flex items-center space-x-4">
            <div className="relative w-20 h-20">
              <Image
                src={user?.avatarUrl || "/userDefault.jpg"}
                alt="Profile"
                fill
                className="rounded-full object-cover ring-4 ring-purple-500/20"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {user?.nickName}'s Wall
              </h1>
              <p className="text-slate-400">
                {posts?.length || 0} posts · {friends?.length} friends
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <RenderFriends />

          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl mb-6 border border-purple-500/10">
              <div className="border-b border-purple-500/10">
                <nav className="flex -mb-px" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("share")}
                    className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-all duration-300 ${
                      activeTab === "share"
                        ? "border-purple-500 text-purple-400"
                        : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    Shared Posts
                  </button>
                  <button
                    onClick={() => setActiveTab("save")}
                    className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-all duration-300 ${
                      activeTab === "save"
                        ? "border-purple-500 text-purple-400"
                        : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    Saved Posts
                  </button>
                </nav>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="space-y-6 w-4/5 ml-24">
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-6 animate-pulse border border-purple-500/10"
                    >
                      <div className="h-4 bg-slate-700 rounded w-3/4 mb-4" />
                      <div className="h-4 bg-slate-700 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : posts?.length > 0 ? (
                <div className="space-y-6 transition-all duration-300">
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      user={user}
                      className="transition-all duration-300 hover:shadow-xl"
                      myWallType={activeTab}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-8 text-center border border-purple-500/10">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-slate-200">
                    No posts found
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {activeTab === "share"
                      ? "Start sharing posts to see them here."
                      : "Save posts to see them here."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
