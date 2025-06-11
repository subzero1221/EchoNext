"use client";
import Image from "next/image";
import Link from "next/link";
import { TbFriendsOff } from "react-icons/tb";
import { getFriends } from "../_utils/friendActions";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";

export default function RenderFriends() {
  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: () => getFriends(),
  });

  return (
    <div className="lg:w-80">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-6 sticky top-8 border border-purple-500/10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          Friends
        </h2>
        <hr className="w-full h-[1px] bg-purple-300 border-none mb-2"></hr>
        <div className="space-y-4">
          <div className="space-y-3">
            {isLoadingFriends ? (
              <div className="ml-28 mt-12 h-24 w-24">
                <LoadingSpinner />
              </div>
            ) : friends.length > 0 ? (
              friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 "
                >
                  <div className="relative w-10 h-10">
                    <Image
                      src={friend.avatarUrl || "/userDefault.jpg"}
                      alt={friend.nickName}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`user/${friend._id}`}
                      className="font-medium text-white"
                    >
                      {friend.nickName}
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-24 items-center justify-center text-purple-400 space-x-3">
                <span className="text-lg">No friends yet...</span>
                <span className="flex items-center justify-center mb-1 text-2xl">
                  <TbFriendsOff />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
