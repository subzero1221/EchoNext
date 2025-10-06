import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addComment } from "../_utils/postActions";
import { useAuth } from "../_contextComponents/AuthProvider";
import Image from "next/image";
import { toast } from "react-toastify";

export default function AddComment({ postId, isLoading}) {
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Login to get access", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      return;
    }
    try {
      const res = await addComment(postId, commentText);
      console.log(res);
    } catch (err) {
    } finally {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setCommentText("");
      }
  };

  return (
    <div className="mb-6">
      <div className="flex items-start space-x-4">
        {user ? (
          <Image
            src={
              user.avatar !== "userDefault.jpg"
                ? user.avatarUrl
                : "/userDefault.jpg"
            }
            alt="gela"
            width={40} // Adjust to your preferred size
            height={40}
            className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 object-cover"
          />
        ) : (
          ""
        )}

        <div className="flex-grow">
          <textarea
            placeholder="Add a comment..."
            className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 
                   focus:border-blue-500 transition-all duration-200 min-h-[100px]"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
