"use client";
import { useState } from "react";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";

import { createTimeAgo } from "../_utils/config";
import SinglePostComments from "./SinglePostComments";
import AddComment from "./AddComment";
import PostImage from "./PostImage";
import PostUI from "./PostUI";
import { ReactionUI } from "./ReactionUi";
import { deletePost } from "../_utils/postActions";
import { toast } from "react-toastify";
import { useAuth } from "../_contextComponents/AuthProvider";
import { useRouter } from "next/navigation";
import DeleteModal from "./DeleteModal";
import Link from "next/link";
import ReactPlayer from "react-player";

export default function SinglePost({ post }) {
  const { user } = useAuth();
  const router = useRouter();
  const timeAgo = createTimeAgo("en-US");
  const dateString = post.createdAt;
  const date = new Date(dateString);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCreator = user?._id === post.createdBy._id;

  const copyPostUrl = () => {
    const baseUrl = window.location.origin;
    navigator.clipboard.writeText(`${baseUrl}/postfeed/${post._id}`);
    setShowDropdown(false);
  };

  async function handleDeletePost() {
    try {
      const res = await deletePost(post._id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
    } finally {
      setShowDropdown(false);
      router.back("/postfeed");
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-900 to-slate-800  rounded-2xl shadow-xl border border-purple-500/10">
      {/* Post Header */}
      <div className="p-8 border-b border-purple-500/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12 overflow-hidden rounded-xl ring-2 ring-purple-500/20">
              {post.isAnonymous ? (
                <Image
                  src="/Anonymous.jpg"
                  alt={post.createdBy.nickName}
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src={
                    post.createdBy.avatar !== "userDefault.jpg"
                      ? post.createdBy.avatarUrl
                      : "/userDefault.jpg"
                  }
                  alt={post.createdBy.nickName}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white hover:text-purple-300 transition-colors">
                <Link href={`/user/${post.createdBy._id}`}>
                  {post.createdBy.nickName}
                </Link>
              </h3>
              <div className="flex items-center text-sm text-slate-400 space-x-2">
                <span className="hover:text-purple-400 transition-colors">
                  {"brotherman"}
                </span>
                <span>•</span>
                <span>{timeAgo.format(date)}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              className="p-2 hover:bg-purple-50 rounded-full transition-all duration-200 ease-in-out"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <BsThreeDots className="w-5 h-5 text-slate-600 hover:text-purple-600" />
            </button>

            {showDropdown && (
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
                  {isCreator && (
                    <button
                      onClick={() => setIsModalOpen(true)}
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
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-6">{post.title}</h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post?.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-purple-500/10 text-purple-300 rounded-lg 
              border border-purple-500/20 text-sm font-medium hover:bg-purple-500/20 
              transition-all duration-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="prose prose-invert max-w-none mb-6">
          {post.content.split("\n").map((paragraph, idx) => (
            <p key={idx} className="mb-4 text-slate-300">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="ml-20">
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
        </div>
        {/* Reactions Section */}
        <ReactionUI postId={post._id} />

        {/* Action Buttons */}
        <PostUI post={post} />
      </div>

      {/* Comments Section */}
      <div className="p-8 bg-slate-900/50 rounded-b-2xl">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-3">
          <span>Comments</span>
          <span className="h-px flex-1 bg-gradient-to-r from-purple-500/20 to-transparent"></span>
        </h2>
        {/*<AddComment postId={post._id} />*/}
        <SinglePostComments postId={post._id} />
        {isModalOpen && (
          <DeleteModal
            closeModal={() => setIsModalOpen(false)}
            handleDelete={handleDeletePost}
            keyWord={"post"}
          />
        )}
      </div>
    </div>
  );
}
