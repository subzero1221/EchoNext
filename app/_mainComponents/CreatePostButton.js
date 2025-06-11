"use client";

import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import CreatePostModal from "./CreatePostModal";

export default function CreatePostButton({ isGroupPost, communityName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={
          isGroupPost
            ? `px-6 py-1.5 rounded-full text-sm font-medium bg-white text-slate-900
          hover:bg-slate-100 transition-all flex items-center gap-2`
            : `flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full 
          hover:bg-blue-600 transition-colors duration-200 font-medium`
        }
      >
        <BsPencilSquare className="w-5 h-5" />
        <span>Create Post</span>
      </button>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isGroupPost={isGroupPost}
        communityName={communityName}
      />
    </>
  );
}
