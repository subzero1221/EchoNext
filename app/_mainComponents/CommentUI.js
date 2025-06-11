"use client";

import { BsArrowDownCircle, BsArrowUpCircle } from "react-icons/bs";
import { handleCommenteVote, getComment } from "../_utils/postActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../_contextComponents/AuthProvider";
import { motion } from "framer-motion";

export function CommentUI({ comment }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentData, setCommentData] = useState(comment);

  const voteMutation = useMutation({
    mutationFn: (type) => handleCommenteVote(comment?._id, type),
    onSuccess: async () => {
      const updatedComment = await getComment(comment?._id);
      setCommentData(updatedComment);
    },
  });

  const upVoted = commentData.upVotes.includes(user?._id);
  const downVoted = commentData.downVotes.includes(user?._id);

  return (
    commentData && (
      <div className="flex items-center bg-purple-500/5 rounded-xl p-1.5 border border-purple-500/10">
        <motion.button
          onClick={() => voteMutation.mutate("up")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`group flex items-center space-x-1 px-2 py-1 rounded-lg 
          hover:bg-purple-500/10 transition-all duration-200
          ${upVoted ? "bg-purple-500/10" : ""}`}
        >
          <BsArrowUpCircle
            className={`w-4 h-4 transition-all duration-200 
            ${
              upVoted
                ? "text-purple-400 scale-110"
                : "text-slate-400 group-hover:text-purple-400 group-hover:scale-110"
            }`}
          />
          <motion.span
            key={commentData.upVotes.length}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-sm font-medium transition-colors
            ${upVoted ? "text-purple-400" : "text-slate-400"}`}
          >
            {commentData.upVotes.length}
          </motion.span>
        </motion.button>

        <div className="h-6 w-px bg-purple-500/10 mx-1"></div>

        <motion.button
          onClick={() => voteMutation.mutate("down")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`group flex items-center space-x-1 px-2 py-1 rounded-lg 
          hover:bg-purple-500/10 transition-all duration-200
          ${downVoted ? "bg-purple-500/10" : ""}`}
        >
          <BsArrowDownCircle
            className={`w-4 h-4 transition-all duration-200 
            ${
              downVoted
                ? "text-red-400 scale-110"
                : "text-slate-400 group-hover:text-red-400 group-hover:scale-110"
            }`}
          />
          <motion.span
            key={commentData.downVotes.length}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-sm font-medium transition-colors
            ${downVoted ? "text-red-400" : "text-slate-400"}`}
          >
            {commentData.downVotes.length}
          </motion.span>
        </motion.button>

        {/* Loading State */}
        {voteMutation.isLoading && (
          <div className="ml-2">
            <div
              className="w-4 h-4 border-2 border-purple-500 border-t-transparent 
            rounded-full animate-spin"
            ></div>
          </div>
        )}
      </div>
    )
  );
}
