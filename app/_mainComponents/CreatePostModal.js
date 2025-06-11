"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  BsImage,
  BsX,
  BsTextParagraph,
  BsCardImage,
  BsIncognito,
} from "react-icons/bs";
import Image from "next/image";
import { toast } from "react-toastify";
import { createPost } from "../_utils/postActions";
import { useQueryClient } from "@tanstack/react-query";

export default function CreatePostModal({
  isOpen,
  onClose,
  isGroupPost,
  communityName,
}) {
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.auth.user);
  const [postType, setPostType] = useState("text");
  const [loading, setLoading] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    communityId: isGroupPost,
    communityName: communityName,
    tags: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  console.log("CommunityName: ", communityName);

  const handleContentChange = (e) => {
    const content = e.target.value;
    setFormData((prev) => ({ ...prev, content, tags }));
  };

  const formatTag = (tag) => {
    return (
      tag
        .toLowerCase()
        .trim()
        // Replace multiple spaces with single space
        .replace(/\s+/g, " ")
        // Capitalize first letter of each word
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 3) {
      const formattedTag = formatTag(tagInput);
      if (!tags.includes(formattedTag)) {
        setTags([...tags, formattedTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = new FormData();
      postData.append("title", formData.title);
      postData.append("content", formData.content);
      postData.append("communityId", formData.communityId);
      postData.append("anonymous", anonymous);
      postData.append("tags", tags.join(", "));
      if (selectedFile) postData.append("photo", selectedFile);

      console.log(selectedFile);

      const res = await createPost(postData);
      if (res.success) {
        toast.success("Post created successfully!");
        onClose();
        setFormData({
          title: "",
          content: "",
          communityId: "",
          tags: "",
        });
        setTags([]);
        setSelectedFile(null);
        setFilePreview(null);
        setAnonymous(false);
      }
    } catch (error) {
      toast.error("Failed to create post");
      console.error("Error:", error);
    } finally {
      setLoading(false);
      communityName && queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50">
        <div className="container mx-auto px-4 pt-8 pb-4">
          <div className="relative bg-white rounded-2xl w-full max-w-2xl mx-auto shadow-2xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px]">
              <div className="h-full w-full bg-white rounded-2xl flex flex-col max-h-[calc(100vh-80px)]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 rounded-md border-b bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                      <BsTextParagraph className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Create a Post
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Share your thoughts with the community
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 group shadow-sm hover:shadow-md"
                  >
                    <BsX className="w-7 h-7 text-gray-600 group-hover:text-gray-800 group-hover:rotate-90 transition-all duration-200" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto min-h-[32rem] px-6 py-8">
                  <form className="space-y-6">
                    {/* Post Type Selector */}
                    <div className="flex space-x-4 p-1 bg-gray-50 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setPostType("text")}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                          postType === "text"
                            ? "bg-white shadow-md transform -translate-y-0.5"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <BsTextParagraph
                          className={`w-5 h-5 ${
                            postType === "text"
                              ? "text-blue-500"
                              : "text-gray-500"
                          }`}
                        />
                        <span
                          className={
                            postType === "text"
                              ? "text-blue-500 font-medium"
                              : "text-gray-500"
                          }
                        >
                          Text Post
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPostType("media")}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                          postType === "media"
                            ? "bg-white shadow-md transform -translate-y-0.5"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <BsCardImage
                          className={`w-5 h-5 ${
                            postType === "media"
                              ? "text-purple-500"
                              : "text-gray-500"
                          }`}
                        />
                        <span
                          className={
                            postType === "media"
                              ? "text-purple-500 font-medium"
                              : "text-gray-500"
                          }
                        >
                          Media Post
                        </span>
                      </button>
                    </div>

                    {/* Anonymous Toggle Button (only for group posts) */}
                    {isGroupPost && (
                      <div className="flex justify-start mb-4">
                        <button
                          type="button"
                          onClick={() => setAnonymous((prev) => !prev)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md
                            border-2
                            ${
                              anonymous
                                ? "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white border-gray-800"
                                : "bg-gradient-to-r from-gray-50 to-white text-gray-700 border-gray-200"
                            }
                            hover:scale-105 hover:shadow-lg group`}
                        >
                          <BsIncognito
                            className={`w-5 h-5 transition-colors duration-200 ${
                              anonymous
                                ? "text-yellow-300"
                                : "text-gray-400 group-hover:text-gray-600"
                            }`}
                          />
                          <span
                            className={`transition-colors duration-200 ${
                              anonymous
                                ? "text-yellow-100"
                                : "text-gray-700 group-hover:text-gray-900"
                            }`}
                          >
                            {anonymous
                              ? "Posting as Anonymous"
                              : "Post as Anonymous"}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Title */}
                    <div className="group">
                      <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 rounded-xl focus:ring-0 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                        required
                      />
                    </div>

                    {/* Content */}
                    <div className="group">
                      <textarea
                        placeholder="What's on your mind?"
                        value={formData.content}
                        onChange={handleContentChange}
                        className="w-full px-4 py-3 border-2 rounded-xl focus:ring-0 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300 h-48 resize-none"
                        required
                      />
                    </div>

                    {/* Tags Preview */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Add Tags (max 3)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
                          >
                            <span className="text-blue-800 text-sm font-medium">
                              #{tag}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-blue-400 hover:text-blue-600"
                            >
                              <BsX className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          placeholder="Add a tag..."
                          disabled={tags.length >= 3}
                          className="flex-1 px-4 py-2 border-2 rounded-xl focus:ring-0 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          disabled={!tagInput.trim() || tags.length >= 3}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Tag
                        </button>
                      </div>
                      {tags.length >= 3 && (
                        <p className="text-sm text-orange-500">
                          Maximum number of tags reached (3)
                        </p>
                      )}
                    </div>

                    {/* Image Upload */}
                    {postType === "media" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                          <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200">
                            <BsImage className="w-8 h-8 text-gray-400 group-hover:text-purple-500" />
                            <span className="mt-2 text-sm text-gray-500">
                              Click to upload image
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,video/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                        {filePreview && (
                          <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                            <Image
                              src={filePreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedFile(null);
                                  setFilePreview(null);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                              >
                                <BsX className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </form>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-white rounded-b-2xl">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading || !formData.content}
                      onClick={handleSubmit}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none font-medium"
                    >
                      {loading ? (
                        <span className="flex items-center space-x-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>Creating...</span>
                        </span>
                      ) : (
                        "Create Post"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
