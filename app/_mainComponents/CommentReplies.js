"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addReply, deleteReply, getReplies } from "../_utils/postActions";
import { BsReply, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useAuth } from "../_contextComponents/AuthProvider";
import { createTimeAgo } from "../_utils/config";
import { toast } from "react-toastify";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CommentReplies({ commentId, isReplying }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [selectedReplyId, setSelectedReplyId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: replies, isLoading } = useQuery({
    queryKey: ["replies", commentId],
    queryFn: () => getReplies(commentId),
  });

  const timeAgo = createTimeAgo("en-US");

  const submitReply = async () => {
    if (!user) {
      toast.info("Login to get access", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      return;
    }
    if (!replyText.trim()) return;
    try {
      const res = await addReply(commentId, replyText);
    } catch (err) {
      toast.error(err);
    } finally {
      queryClient.invalidateQueries(["replies", commentId]);
      setReplyText("");
    }
  };

  const openModal = (commentId) => {
    setSelectedReplyId(commentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReplyId(null);
  };

  const handleDeleteReply = async () => {
    if (!selectedReplyId) return;

    queryClient.setQueryData(["replies", commentId], (oldReplies) => {
      return oldReplies
        ? oldReplies.filter((c) => c._id !== selectedReplyId)
        : [];
    });

    try {
      const res = await deleteReply(selectedReplyId, user._id);
      if (!res.ok) {
        toast.error(res.message);
        queryClient.invalidateQueries(["replies", commentId]);
      }
      toast.success("Reply deleted successfully");
    } catch (err) {
      toast.error("Failed to delete Reply");
      queryClient.invalidateQueries(["replies", commentId]);
    } finally {
      closeModal();
    }
  };

  return (
    <div className="mt-4">
      {replies && (
        <motion.button
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center space-x-2 text-sm text-purple-400 hover:text-purple-300 
          transition-colors duration-200 group"
          whileHover={{ scale: 1.02 }}
        >
          <BsReply className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
          <span className="flex items-center space-x-1">
            {showReplies ? (
              <>
                <span>Hide Replies</span>
                <BsChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>Show Replies</span>
                <span className="text-purple-500">({replies.length})</span>
                <BsChevronDown className="w-3 h-3" />
              </>
            )}
          </span>
        </motion.button>
      )}

      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-6 mt-3 border-l border-purple-500/20 pl-4"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2 text-purple-400">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading replies...</span>
              </div>
            ) : (
              replies?.map((reply) => (
                <motion.div
                  key={reply?._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-4 border-t border-purple-500/10 group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg overflow-hidden ring-2 ring-purple-500/20">
                      <Image
                        src={
                          reply?.createdBy.avatar !== "userDefault.jpg"
                            ? reply.createdBy.avatarUrl
                            : "/userDefault.jpg"
                        }
                        alt="user avatar"
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-sm text-purple-300">
                      {reply?.createdBy.nickName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {timeAgo.format(new Date(reply.createdAt))}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mt-2">{reply.content}</p>

                  {reply?.createdBy._id === user?._id && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => openModal(reply._id)}
                      className="mt-2 text-xs px-2 py-1 rounded-lg text-red-400 
                      hover:bg-red-500/10 transition-colors duration-200"
                    >
                      Delete
                    </motion.button>
                  )}
                </motion.div>
              ))
            )}

            {/* Reply Input */}
            <div className="mt-4 space-y-2">
              <textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-purple-500/5 text-slate-300 placeholder-slate-500 
                border border-purple-500/20 p-3 rounded-xl focus:outline-none 
                focus:ring-2 focus:ring-purple-500/30 focus:border-transparent 
                transition-all duration-200 resize-none"
                rows="2"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitReply}
                className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-xl 
                hover:bg-purple-500/30 transition-all duration-200 flex items-center 
                space-x-2"
              >
                <BsReply className="w-4 h-4" />
                <span>Post Reply</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 text-white p-6 rounded-xl shadow-xl w-96 
            border border-purple-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-center mb-4 text-purple-300">
              Delete Reply?
            </h2>
            <p className="text-slate-400 text-center mb-6">
              This action cannot be undone. Your reply will be permanently
              deleted.
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={closeModal}
                className="px-5 py-2 border border-purple-500/20 rounded-lg 
                text-purple-300 hover:bg-purple-500/10 transition-all duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleDeleteReply}
                className="px-5 py-2 bg-red-500/20 text-red-400 rounded-lg 
                hover:bg-red-500/30 transition-all duration-200 border border-red-500/20"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
