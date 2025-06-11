"use client";

import Link from "next/link";
import PostUI from "./PostUI";
import PostImage from "./PostImage";
import ReactPlayer from "react-player";
import { getPosts } from "../_utils/postActions";
import { useQuery } from "@tanstack/react-query";
import { IsPostsForFeedLoading } from "./IsPostsForFeedLoading";

export default function PostFeed() {
  const {
    data: postsForFeed,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["postsForFeed"],
    queryFn: () => getPosts(),
  });

  if (isLoading) {
    return <IsPostsForFeedLoading />;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 md:ml-96 sm:px-6 lg:px-8">
      {postsForFeed.map((post) => (
        <article
          key={post._id}
          className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl shadow-xl hover:shadow-2xl 
          transition-all duration-300 border border-purple-500/10 hover:border-purple-500/20"
        >
          <div className="flex-1 p-4 sm:p-6">
            {/* Post Header */}
            <div className="flex flex-wrap items-center text-xs sm:text-sm text-slate-400 mb-4 gap-2">
              {post.community?.name && (
                <Link
                  href={`/communities/${post.community._id}`}
                  className="flex items-center space-x-1 font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>{`r/${post?.community?.name}`}</span>
                </Link>
              )}
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="text-slate-500">Posted by</span>
              <Link
                href={`user/${post?.createdBy._id}`}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors break-all"
              >
                u/{post?.createdBy.nickName}
              </Link>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="text-slate-500 text-xs">
                {post?.createdAt.split("T").at(0)}
              </span>
            </div>

            {/* Post Title */}
            <Link
              href={`/postfeed/${post._id}`}
              className="block text-lg sm:text-xl font-semibold text-white mb-3 hover:text-purple-300 transition-colors"
            >
              {post.title}
            </Link>

            {/* Tags */}
            {post?.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 bg-purple-500/10 text-purple-300 
                    text-xs sm:text-sm rounded-lg border border-purple-500/20 font-medium 
                    hover:bg-purple-500/20 transition-all duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Content */}
            <p className="text-slate-300 mb-6 line-clamp-3 text-sm sm:text-base">
              {post.content}
            </p>

            {/* Post Media */}
            {post?.mediaType === "image" ? (
              <PostImage
                imageUrl={post.mediaUrl}
                highQualityUrl={post.mediaUrl}
              />
            ) : post?.mediaType === "video" ? (
              <div className="w-full aspect-video overflow-hidden rounded-2xl shadow-md mb-4">
                <ReactPlayer
                  url={post.mediaUrl}
                  controls
                  width="100%"
                  height="100%"
                  style={{ aspectRatio: "16/9" }}
                  config={{
                    file: {
                      attributes: {
                        controlsList: "nodownload",
                      },
                    },
                  }}
                />
              </div>
            ) : null}

            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent my-4"></div>

            {/* Action Buttons */}
            <PostUI post={post} />
          </div>
        </article>
      ))}
    </div>
  );
}
