import Link from "next/link";
import PostUI from "./PostUI";
import PostImage from "./PostImage";
import { usePathname } from "next/navigation";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteMyWallPost } from "../_utils/saveActions";
import { useQueryClient } from "@tanstack/react-query";
import ReactPlayer from "react-player";

export default function PostCard({
  post,
  communityName,
  communityId,
  myWallType,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const postId = post._id;
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const mywall = pathname === "/mywall";

  const copyPostUrl = () => {
    const baseUrl = window.location.origin;
    navigator.clipboard.writeText(`${baseUrl}/postfeed/${post._id}`);
    setShowDropdown(false);
  };

  const handleDeleteFromWall = async () => {
    try {
      const res = await deleteMyWallPost(post._id, myWallType);
      if (res.success) toast.success(`${myWallType} deleted from your wall`);
    } catch (err) {
    } finally {
      setShowDropdown(false);
      queryClient.invalidateQueries({ queryKey: [`${myWallType}dPosts`] });
    }
  };

  return (
    <article
      className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl shadow-xl hover:shadow-2xl 
    transition-all duration-300 border border-purple-500/10 hover:border-purple-500/20"
    >
      <div className="flex-1 p-4 sm:p-6">
        {/* Post Header */}
        <div className="flex flex-wrap items-center text-xs sm:text-sm text-slate-400 mb-4 gap-2">
          {communityName && (
            <Link
              href={`/communities/${communityId}`}
              className="flex items-center space-x-1 font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>{`r/${communityName}`}</span>
            </Link>
          )}
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-slate-500">Posted by</span>
          <Link
            href={`/user/${post?.createdBy?._id}`}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors break-all"
          >
            u/{post?.createdBy?.nickName}
          </Link>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-slate-500 text-xs">
            {post?.createdAt?.split("T").at(0)}
          </span>
          <div className="relative ml-96">
            <button
              className="p-2 hover:bg-purple-50 rounded-full transition-all duration-200 ease-in-out"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <BsThreeDots className="w-5 h-5 text-slate-600 hover:text-purple-600" />
            </button>
            {mywall && showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-50 border border-purple-100 overflow-hidden transform origin-top-right transition-all duration-200 ease-out">
                <div className="py-1">
                  <button
                    onClick={copyPostUrl}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150 flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                      />
                    </svg>
                    <span>Copy Post URL</span>
                  </button>

                  <button
                    onClick={handleDeleteFromWall}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Delete post</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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

        {/* Post Image */}
        {post?.mediaType === "image" ? (
          <PostImage imageUrl={post.mediaUrl} highQualityUrl={post.mediaUrl} />
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
  );
}
