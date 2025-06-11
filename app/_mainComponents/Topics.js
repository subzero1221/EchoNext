"use client";
import Image from "next/image";
import { useState } from "react";
import {
  BsFire,
  BsPeople,
  BsGraphUp,
  BsClock,
  BsArrowRight,
  BsChat,
  BsEye,
  BsBookmark,
} from "react-icons/bs";
import { IoIosTrendingUp } from "react-icons/io";
import { getTopics } from "../_utils/postActions";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createTimeAgo } from "../_utils/config";
import { FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";

export default function Topics() {
  const [timeFilter, setTimeFilter] = useState("today");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const timeAgo = createTimeAgo("en-US");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["topics", timeFilter],
    queryFn: () => getTopics(timeFilter, page),
    staleTime: 1000 * 60 * 5,
  });

  console.log("Topics:", posts);

  return (
    <div
      className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-6 max-w-4xl mx-auto 
    border border-purple-500/10"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <BsFire className="w-6 h-6 text-orange-400" />
          <h2
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 
          bg-clip-text text-transparent"
          >
            Trending Topics
          </h2>
        </div>

        {/* Time Filter */}
        <div className="flex gap-2 bg-purple-500/5 p-1 rounded-xl border border-purple-500/10">
          {["Today", "Week", "Month"].map((period) => (
            <motion.button
              key={period}
              onClick={() => setTimeFilter(period.toLowerCase())}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  timeFilter === period.toLowerCase()
                    ? "bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10"
                    : "text-slate-400 hover:text-purple-300"
                }`}
            >
              {period}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="relative min-h-[200px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 
            rounded-full animate-spin"
            ></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6"
            >
              {posts?.map((post, i) => (
                <motion.div
                  key={post._id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative bg-slate-800/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300
                  border border-purple-500/10 hover:border-purple-500/20 group"
                >
                  <div
                    className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 
                  text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2
                  shadow-lg shadow-purple-500/20"
                  >
                    <IoIosTrendingUp className="animate-pulse" />#{i + 1}
                  </div>

                  <div className="flex items-start gap-6">
                    {/* Topic Image */}
                    <div
                      className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 
                    bg-purple-500/10 ring-2 ring-purple-500/20"
                    >
                      {post?.mediaType === "image" ? (
                        <Image
                          src={post.mediaUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 
                      group-hover:scale-110"
                          width={120}
                          height={120}
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

                    {/* Topic Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="px-3 py-1 bg-purple-500/10 text-purple-300 
                        rounded-full text-sm font-medium border border-purple-500/20"
                        >
                          {post.tags[0] || ""}
                        </span>
                        {i + 1 && (
                          <span className="flex items-center gap-1 text-green-400 text-sm">
                            <BsGraphUp />
                            {i + 1}
                          </span>
                        )}
                      </div>

                      <h3
                        className="text-xl font-semibold text-white mb-3 
                      group-hover:text-purple-300 transition-colors duration-200"
                      >
                        {post.title}
                      </h3>

                      {/* Stats Row */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        {[
                          {
                            icon: BsEye,
                            text: `${post.views.length} views`,
                          },
                          {
                            icon: BsChat,
                            text: `${post.comments.length} comments`,
                          },
                          {
                            icon: BsPeople,
                            text: `${
                              post.upVotes.length + post.comments.length
                            } participants`,
                          },
                          {
                            icon: FaUser,
                            text: `Author ${post.createdBy?.nickName}`,
                          },
                          {
                            icon: BsClock,
                            text: `Posted ${post.createdAt.split("T").at(0)}`,
                          },
                        ].map((stat, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <stat.icon className="text-purple-400" />
                            <span className="hover:text-purple-300 transition-colors">
                              {stat.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-2 rounded-xl hover:bg-purple-500/10 text-slate-400 
                        hover:text-purple-300 transition-colors duration-200"
                      >
                        <BsBookmark className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => router.push(`/postfeed/${post._id}`)}
                        className="p-2 rounded-xl hover:bg-purple-500/10 text-slate-400 
                        hover:text-purple-300 transition-colors duration-200"
                      >
                        <BsArrowRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
