"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  BsGrid,
  BsListUl,
  BsSearch,
  BsArrowUp,
  BsPeople,
} from "react-icons/bs";
import { getFiltredPosts } from "../_utils/postActions";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const categories = [
  { id: "all", name: "All Disscusions", count: "" },
  { id: "Sports", name: "Sports", count: "" },
  { id: "Technology", name: "Technology", count: "" },
  { id: "Health", name: "Health", count: "" },
  { id: "Business", name: "Business", count: "" },
  { id: "Entertainment", name: "Entertainment", count: "" },
  { id: "Politics", name: "Politics", count: "" },
  { id: "Science", name: "Science", count: "" },
  { id: "Lifestyle", name: "Lifestyle", count: "" },
  { id: "Education", name: "Education", count: "" },
  { id: "Fashion", name: "Fashion", count: "" },
  { id: "Gaming", name: "Gaming", count: "" },
  { id: "Fitness", name: "Fitness", count: "" },
  { id: "Parenting", name: "Parenting", count: "" },
  { id: "News", name: "News", count: "" },
  { id: "Social Media", name: "Social Media", count: "" },
  { id: "Automotive", name: "Automotive", count: "" },
  { id: "Real Estate", name: "Real Estate", count: "" },
  { id: "Marketing", name: "Marketing", count: "" },
  { id: "Law", name: "Law", count: "" },
  { id: "Environment", name: "Environment", count: "" },
  { id: "Psychology", name: "Psychology", count: "" },
  { id: "Design", name: "Design", count: "" },
  { id: "Space", name: "Space", count: "" },
  { id: "Engineering", name: "Engineering", count: "" },
  { id: "Economy", name: "Economy", count: "" },
  { id: "AI", name: "AI", count: "" },
  { id: "Food & Drink", name: "Food & Drink", count: "" },
  { id: "Movies", name: "Movies", count: "" },
  { id: "TV Shows", name: "TV Shows", count: "" },
  { id: "Fiction", name: "Fiction", count: "" },
  { id: "Non-fiction", name: "Non-fiction", count: "" },
  { id: "Programming", name: "Programming", count: "" },
  { id: "Web Development", name: "Web Development", count: "" },
  { id: "Health & Fitness", name: "Health & Fitness", count: "" },
  { id: "Interior Design", name: "Interior Design", count: "" },
  { id: "Fitness & Wellness", name: "Fitness & Wellness", count: "" },
  { id: "Special Interest", name: "Special Interest", count: "" },
];

export default function DiscussionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const {
    data: discussions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["filtredPosts", currentPage, sortBy],
    queryFn: () =>
      getFiltredPosts(selectedCategory, selectedTags, currentPage, sortBy),
  });

  const [viewMode, setViewMode] = useState("list");
  const [customTag, setCustomTag] = useState("");

  const handleAddCustomTag = () => {
    const capitalizedTag =
      customTag.charAt(0).toUpperCase() + customTag.slice(1).toLowerCase();

    if (
      customTag &&
      !selectedTags.includes(capitalizedTag) &&
      selectedTags.length < 3
    ) {
      setSelectedTags((prev) => [...prev, capitalizedTag]);
    }

    setCustomTag("");
  };

  const handleSearch = () => {
    refetch();
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === "next" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Discussions
          </h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl 
            hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-purple-500/20"
          >
            {isLoading ? "Searching..." : "Start Search"}
          </motion.button>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Categories & Filters */}
          <div className="w-72 flex-shrink-0">
            <div className="sticky top-12 space-y-6">
              <div className="bg-slate-800/50 rounded-xl shadow-xl p-6 border border-purple-500/10">
                <h2 className="text-lg font-semibold text-slate-200 mb-4">
                  Categories
                </h2>
                <div
                  className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 
                scrollbar-track-slate-800/50"
                >
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all 
                      duration-200 ${
                        selectedCategory === category.id
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/20"
                          : "hover:bg-purple-500/10 text-slate-300"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-slate-400">{}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl shadow-xl p-6 border border-purple-500/10">
                <h2 className="text-lg font-semibold text-slate-200 mb-4">
                  Add Your Searching Tags
                </h2>
                <div className="mt-4">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCustomTag()}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-purple-500/20 rounded-xl 
                    text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-2 
                    focus:ring-purple-500/20"
                    placeholder="Type a tag and press Enter"
                    disabled={selectedTags.length >= 3}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddCustomTag}
                    disabled={!customTag || selectedTags.length >= 3}
                    className="mt-2 px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 
                    hover:bg-purple-500/30 transition-all duration-200 disabled:opacity-50"
                  >
                    Add Tag
                  </motion.button>
                </div>

                {/* Selected Tags */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    Selected Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        key={tag}
                        onClick={() =>
                          setSelectedTags((prev) =>
                            prev.filter((t) => t !== tag)
                          )
                        }
                        className="px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-300 
                        hover:bg-purple-500/30 transition-all duration-200 border border-purple-500/20"
                      >
                        {tag} ✕
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-slate-800/50 rounded-xl shadow-xl p-4 mb-6 border border-purple-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <div className="flex items-center bg-slate-700/50 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === "grid"
                          ? "bg-purple-500/20 text-purple-300"
                          : "text-slate-400 hover:text-purple-300"
                      }`}
                    >
                      <BsGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === "list"
                          ? "bg-purple-500/20 text-purple-300"
                          : "text-slate-400 hover:text-purple-300"
                      }`}
                    >
                      <BsListUl className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Sort Options */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-700/50 border-purple-500/20 rounded-lg px-4 py-2 text-slate-300 
                    focus:ring-2 focus:ring-purple-500/20 outline-none"
                  >
                    <option value="createdAt">New</option>
                    <option value="upVotes">Top</option>
                    <option value="controversial">Controversial</option>
                  </select>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    className="pl-10 pr-4 py-2 bg-slate-700/50 rounded-lg text-slate-300 
                    placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/20 
                    border border-purple-500/20 w-64"
                  />
                  <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Discussions List */}
            <div
              className={`space-y-4 ${
                viewMode === "grid" ? "grid grid-cols-2 gap-4" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                  <div
                    className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 
                  rounded-full animate-spin"
                  ></div>
                </div>
              ) : (
                discussions?.map((discussion) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={discussion._id}
                    className="bg-slate-800/50 rounded-xl shadow-xl hover:shadow-2xl transition-all 
                    duration-200 p-6 border border-purple-500/10 hover:border-purple-500/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                          <Image
                            src={"/userDefault.jpg"}
                            width={100}
                            height={100}
                            alt="avatar"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/postfeed/${discussion._id}`}
                            className="font-semibold text-white hover:text-blue-600 transition-colors hover:underline"
                          >
                            {discussion.title}
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-white">
                            <span>{discussion.createdBy.nickName}</span>
                            <span>•</span>
                            <span>{discussion.lastActive}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-white mb-4 line-clamp-2">
                      {discussion.content}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      {discussion.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-white text-sm">
                      <div className="flex items-center gap-1">
                        <BsArrowUp />
                        {discussion.upVotes.length}
                      </div>
                      <div className="flex items-center gap-1">
                        <BsPeople />
                        {discussion?.comments?.length}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Pagination */}
            {!isLoading && discussions.length >= 10 && (
              <div className="flex justify-between items-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePageChange("prev")}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                  rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 
                  shadow-lg shadow-purple-500/20"
                >
                  Previous
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePageChange("next")}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                  rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 
                  shadow-lg shadow-purple-500/20"
                >
                  Next
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
