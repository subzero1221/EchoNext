"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteComment,
  getComments,
  handleCommenteVote,
} from "../_utils/postActions";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  BsArrowDownCircle,
  BsArrowUpCircle,
  BsReply,
  BsTrash,
} from "react-icons/bs";
import Image from "next/image";
import { createTimeAgo } from "../_utils/config";
import { useAuth } from "../_contextComponents/AuthProvider";
import { toast } from "react-toastify";
import CommentReplies from "./CommentReplies";
import { CommentUI } from "./CommentUI";
import AddComment from "./AddComment";

export default function SinglePostComments({ postId }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });

  const timeAgo = createTimeAgo("en-US");

  const openModal = (commentId) => {
    setSelectedCommentId(commentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCommentId(null);
  };

  const handleDeleteComment = async () => {
    if (!selectedCommentId) return;

    queryClient.setQueryData(["comments", postId], (oldComments) => {
      return oldComments
        ? oldComments.filter((c) => c._id !== selectedCommentId)
        : [];
    });

    try {
      const res = await deleteComment(selectedCommentId, user._id);
      if (!res.ok) {
        toast.error(res.message);
        queryClient.invalidateQueries(["comments", postId]);
      }
      toast.success("Comment deleted successfully");
    } catch (err) {
      toast.error("Failed to delete comment");
      queryClient.invalidateQueries(["comments", postId]);
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <AddComment postId={postId} isLoading={isLoading} />
      <div className="space-y-6">
        {comments &&
          comments.map((comment) => (
            <div
              key={comment._id}
              className="border-b border-purple-500/10 pb-6 hover:bg-purple-500/5 
            transition-colors duration-200 rounded-xl p-4"
            >
              <div className="flex space-x-4">
                <div
                  className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 
              ring-2 ring-purple-500/20"
                >
                  <Image
                    src={
                      comment.createdBy.avatar !== "userDefault.jpg"
                        ? comment?.createdBy?.avatarUrl
                        : "/userDefault.jpg"
                    }
                    alt={"user avatar"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className="font-medium text-purple-300 hover:text-purple-200 
                  transition-colors"
                    >
                      {comment.createdBy.nickName}
                    </span>
                    <span className="text-sm text-slate-500">
                      {/*timeAgo.format(new Date(comment.createdAt))*/}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3">{comment.content}</p>

                  <div className="flex items-center space-x-4">
                    <CommentUI comment={comment} />
                    {comment?.createdBy?._id.toString() === user?._id && (
                      <button
                        onClick={() => openModal(comment._id)}
                        className="ml-auto flex items-center space-x-2 px-3 py-1.5 
                      rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 
                      transition-all duration-200 group"
                      >
                        <BsTrash className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Delete</span>
                      </button>
                    )}
                  </div>

                  <CommentReplies
                    commentId={comment._id}
                    isReplying={replyingTo === comment._id}
                  />
                </div>
              </div>
            </div>
          ))}

        {/* Delete Confirmation Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/80 
          backdrop-blur-sm z-50"
            onClick={closeModal}
          >
            <div
              className="bg-slate-900 text-white p-6 rounded-xl shadow-xl w-96 
            border border-purple-500/20 transform transition-all scale-100 
            opacity-100 animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-center mb-4 text-purple-300">
                Delete Comment?
              </h2>
              <p className="text-slate-400 text-center mb-6">
                This action cannot be undone. Your comment will be permanently
                deleted.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 border border-purple-500/20 rounded-lg 
                text-purple-300 hover:bg-purple-500/10 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteComment}
                  className="px-5 py-2 bg-red-500/20 text-red-400 rounded-lg 
                hover:bg-red-500/30 transition-all duration-200 border 
                border-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
