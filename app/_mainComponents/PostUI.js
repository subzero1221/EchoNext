"use client";

import { useState } from "react";
import {
  BsArrowDownCircle,
  BsArrowUpCircle,
  BsBookmark,
  BsChatDots,
  BsShare,
} from "react-icons/bs";
import { getComments, handleVote } from "../_utils/postActions";
import { useAuth } from "../_contextComponents/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SaveShareModal from "./SaveShareModal";
import { savePost, sharePost } from "../_utils/saveActions";

export default function PostUI({ post }) {
  const {
    data: comments,
    isLoading,
    Error,
  } = useQuery({
    queryKey: ["comments", post._id],
    queryFn: () => getComments(post._id),
    enabled: !!post._id,
  });

  const { user } = useAuth();
  const [upVotes, setUpVotes] = useState(post.upVotes);
  const [downVotes, setDownVotes] = useState(post.downVotes);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

 

  const upVoted = upVotes?.includes(user?._id);
  const downVoted = downVotes?.includes(user?._id);

  const handleUpVote = async () => {
    if (!user) {
      toast.info("Login to get access", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      return;
    }

    try {
      const updatedPost = await handleVote(post._id, "up");

      setUpVotes(updatedPost.upVotes);
      setDownVotes(updatedPost.downVotes);
    } catch (error) {
      console.error("Error updating upvote:", error);
    }
  };

  const handleDownVote = async () => {
    if (!user) {
      toast.info("Login to get access", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      return;
    }
    try {
      const updatedPost = await handleVote(post._id, "down");
      setUpVotes(updatedPost.upVotes);
      setDownVotes(updatedPost.downVotes);
    } catch (error) {
      console.error("Error updating downvote:", error);
    }
  };

  const handleCommentClick = () => {
    if (pathname === `/postfeed` || `/communities/${post._id}`) {
      router.push(`/postfeed/${post._id}`);
    }
  };

  const hanldeSave = async () => {
    try {
      const res = await savePost(post._id);
      if (res.success) toast.success("Post was saved on your wall");
      if (!res.success) toast.info(res.message);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaveModalOpen(false);
    }
  };

  const hanldeShare = async () => {
    try {
      const res = await sharePost(post._id);
      console.log("res:", res);
      if (res.success) toast.success("Post was shared on your wall");
      if (!res.success) toast.info(res.message);
    } catch (err) {
      console.error(err);
    } finally {
      setIsShareModalOpen(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-300">
      {/* Vote Buttons Group */}
      <div className="flex items-center bg-purple-500/5 rounded-xl p-1.5 border border-purple-500/10">
        <button
          onClick={handleUpVote}
          className="group flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-purple-500/10 transition-all duration-200"
        >
          <BsArrowUpCircle
            className={`w-5 h-5 transition-all duration-200 ${
              upVoted
                ? "text-purple-400 scale-110"
                : "text-slate-400 group-hover:text-purple-400 group-hover:scale-110"
            }`}
          />
          <span
            className={`font-medium ${
              upVoted ? "text-purple-400" : "text-slate-400"
            }`}
          >
            {upVotes?.length}
          </span>
        </button>

        <div className="h-8 w-px bg-purple-500/10 mx-1"></div>

        <button
          onClick={handleDownVote}
          className="group flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-purple-500/10 transition-all duration-200"
        >
          <BsArrowDownCircle
            className={`w-5 h-5 transition-all duration-200 ${
              downVoted
                ? "text-red-400 scale-110"
                : "text-slate-400 group-hover:text-red-400 group-hover:scale-110"
            }`}
          />
          <span
            className={`font-medium ${
              downVoted ? "text-red-400" : "text-slate-400"
            }`}
          >
            {downVotes?.length}
          </span>
        </button>
      </div>

      {/* Comment Button */}
      <button
        onClick={handleCommentClick}
        className="group flex items-center space-x-2 px-4 py-2 rounded-xl 
        hover:bg-purple-500/10 border border-transparent hover:border-purple-500/10 
        transition-all duration-200"
      >
        <BsChatDots
          className="w-5 h-5 text-slate-400 group-hover:text-purple-400 
        group-hover:scale-110 transition-all duration-200"
        />
        <span className="text-sm text-slate-400 group-hover:text-purple-400">
          {!isLoading && comments?.length} Comments
        </span>
      </button>

      {/* Share Button */}
      <button
        onClick={() => setIsShareModalOpen(true)}
        className="group flex items-center space-x-2 px-4 py-2 rounded-xl 
      hover:bg-purple-500/10 border border-transparent hover:border-purple-500/10 
      transition-all duration-200"
      >
        <BsShare
          className="w-5 h-5 text-slate-400 group-hover:text-blue-400 
        group-hover:scale-110 transition-all duration-200"
        />
        <span className="text-sm text-slate-400 group-hover:text-blue-400">
          Share
        </span>
      </button>

      {isShareModalOpen && (
        <SaveShareModal
          handler={hanldeShare}
          keyWord={"Share"}
          closeModal={() => setIsShareModalOpen(false)}
        />
      )}

      {/* Save Button */}
      <button
        onClick={() => setIsSaveModalOpen(true)}
        className="group flex items-center space-x-2 px-4 py-2 rounded-xl 
      hover:bg-purple-500/10 border border-transparent hover:border-purple-500/10 
      transition-all duration-200"
      >
        <BsBookmark
          className="w-5 h-5 text-slate-400 group-hover:text-green-400 
        group-hover:scale-110 transition-all duration-200"
        />
        <span className="text-sm text-slate-400 group-hover:text-green-400">
          Save
        </span>
      </button>
      {isSaveModalOpen && (
        <SaveShareModal
          handler={hanldeSave}
          keyWord={"Save"}
          closeModal={() => setIsSaveModalOpen(false)}
        />
      )}
    </div>
  );
}
