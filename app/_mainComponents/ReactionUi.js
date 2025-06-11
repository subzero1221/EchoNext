"use client";

import { motion } from "framer-motion";
import { SiZcool } from "react-icons/si";
import { FaRegSadCry, FaHeart, FaLaugh, FaAngry } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getReactions, addReaction } from "../_utils/postActions";
import { useAuth } from "../_contextComponents/AuthProvider";
import { toast } from "react-toastify";

const reactionOptions = [
  {
    type: "cool",
    icon: SiZcool,
    color: "text-blue-400",
    activeColor: "text-blue-300",
    glow: "shadow-blue-500/20",
    bgHover: "hover:bg-blue-500/10",
    bgActive: "bg-blue-500/20",
  },
  {
    type: "love",
    icon: FaHeart,
    color: "text-pink-400",
    activeColor: "text-pink-300",
    glow: "shadow-pink-500/20",
    bgHover: "hover:bg-pink-500/10",
    bgActive: "bg-pink-500/20",
  },
  {
    type: "haha",
    icon: FaLaugh,
    color: "text-yellow-400",
    activeColor: "text-yellow-300",
    glow: "shadow-yellow-500/20",
    bgHover: "hover:bg-yellow-500/10",
    bgActive: "bg-yellow-500/20",
  },
  {
    type: "sad",
    icon: FaRegSadCry,
    color: "text-purple-400",
    activeColor: "text-purple-300",
    glow: "shadow-purple-500/20",
    bgHover: "hover:bg-purple-500/10",
    bgActive: "bg-purple-500/20",
  },
  {
    type: "angry",
    icon: FaAngry,
    color: "text-red-400",
    activeColor: "text-red-300",
    glow: "shadow-red-500/20",
    bgHover: "hover:bg-red-500/10",
    bgActive: "bg-red-500/20",
  },
];

export function ReactionUI({ postId }) {
  const { user } = useAuth();
  const userId = user?._id;
  const { data: reactions = [], refetch } = useQuery({
    queryKey: ["reactions", postId],
    queryFn: () => getReactions(postId),
    enabled: !!postId,
  });

  const reactWithCount = reactionOptions.map((reaction) => {
    const found = reactions.find((r) => r.type === reaction.type);
    return { ...reaction, count: found ? found.count : 0 };
  });

  const myReaction = reactions.find((react) =>
    react.users.some((u) => u._id === userId)
  )?.type;

  async function handleReaction(type) {
    if (!user) {
      toast.info("Login to get access", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      return;
    }
    await addReaction(postId, type);
    refetch();
  }

  return (
    <div className="flex flex-wrap items-center mb-3 gap-2 z-40">
      {reactWithCount.map(
        ({
          type,
          count,
          icon: Icon,
          color,
          activeColor,
          glow,
          bgHover,
          bgActive,
        }) => (
          <motion.button
            key={type}
            onClick={() => handleReaction(type)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl
          border transition-all duration-200
          ${
            myReaction === type
              ? `${bgActive} ${glow} border-purple-500/20`
              : `border-purple-500/10 ${bgHover}`
          }`}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon
                className={`text-xl sm:text-2xl transition-colors duration-200
              ${myReaction === type ? activeColor : color}`}
              />
            </motion.div>

            <motion.span
              key={count}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`text-sm font-medium transition-colors duration-200
            ${myReaction === type ? "text-slate-300" : "text-slate-400"}`}
            >
              {count}
            </motion.span>

            {/* Glow effect when active */}
            {myReaction === type && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute inset-0 rounded-xl ${glow} blur-sm -z-10`}
              />
            )}
          </motion.button>
        )
      )}
    </div>
  );
}
