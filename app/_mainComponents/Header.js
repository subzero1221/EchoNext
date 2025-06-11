"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../_contextComponents/AuthProvider";
import { useRouter } from "next/navigation";
import CreatePostButton from "./CreatePostButton";
import { useState } from "react";
import { BsSearch, BsX } from "react-icons/bs";
import { IoIosNotifications } from "react-icons/io";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { getNotificationsLength } from "../_utils/notificationActions";
import useSocket from "../_customhooks/useSocket";
import { useChat } from "../_contextComponents/ChatProvider";
import RecentChats from "./RecentChats";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isChatOpen, toggleChat } = useChat();

  const { data: initialNotifications, isLoading } = useQuery({
    queryKey: ["notificationsLength"],
    queryFn: getNotificationsLength,
    enabled: !!user,
  });

  const hasInitial = Array.isArray(initialNotifications);

  const { notifications: socketNotifications } = useSocket(user);

  const allNotifications = [
    ...(hasInitial ? initialNotifications : []),
    ...socketNotifications,
  ];

  const notReadNotifications = allNotifications.filter((n) => !n.isRead);

  const handleLogout = () => {
    router.push("/");
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center group transition-transform hover:scale-105"
              >
                <Image
                  src="/icon.jpg"
                  width={50}
                  height={50}
                  alt="logo"
                  className="rounded-xl shadow-lg ring-2 ring-purple-500/20"
                />
                <p className="ml-3 text-white font-semibold text-xl tracking-wide group-hover:text-purple-400 transition-colors hidden sm:block">
                  Echo
                </p>
              </Link>
            </div>

            {/* Search Bar - Hidden on mobile unless focused */}
            <div
              className={`flex-grow mx-4 lg:mx-8 max-w-2xl ${
                isSearchFocused
                  ? "absolute top-0 left-0 right-0 p-4 bg-slate-900 md:relative md:bg-transparent md:p-0"
                  : "hidden md:block"
              }`}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-slate-800 
                           transition-all duration-300"
                />
                <BsSearch className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                {isSearchFocused && (
                  <button
                    onClick={() => setIsSearchFocused(false)}
                    className="absolute right-0 top-0 p-3 text-gray-400 md:hidden"
                  >
                    <BsX className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchFocused(true)}
              className="p-2 text-gray-400 md:hidden"
            >
              <BsSearch className="h-5 w-5" />
            </button>

            {/* User Actions */}
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-400 lg:hidden"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {/* Desktop Navigation */}
                <div
                  className={`${
                    isMobileMenuOpen
                      ? "absolute top-full right-0 w-64 bg-slate-900 shadow-lg rounded-b-xl py-2"
                      : "hidden lg:flex items-center space-x-4"
                  }`}
                >
                  <div className="hidden lg:block">
                    <CreatePostButton />
                  </div>

                  <button
                    onClick={toggleChat}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <IoChatbubbleEllipsesSharp className="h-5 w-5" />
                    <span>Chat</span>
                  </button>

                  <Link
                    href="/notifications"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors relative"
                  >
                    <IoIosNotifications className="h-6 w-6" />
                    {notReadNotifications?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {notReadNotifications.length}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative group">
                    <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer">
                      <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-purple-500/50 relative">
                        <Image
                          src={
                            user?.avatar !== "userDefault.jpg"
                              ? user?.avatarUrl
                              : `/userDefault.jpg`
                          }
                          alt="avatar"
                          fill
                          sizes="40px"
                          className="object-cover"
                          priority
                        />
                      </div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {user.nickName}
                      </span>
                    </div>

                    <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-xl border border-purple-500/10 py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                      <Link
                        href="/me"
                        className="block px-4 py-2.5 text-slate-300 hover:text-white hover:bg-purple-500/10 transition-colors duration-150"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/mywall"
                        className="block px-4 py-2.5 text-slate-300 hover:text-white hover:bg-purple-500/10 transition-colors duration-150"
                      >
                        My Wall
                      </Link>
                      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:inline-block px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      {isChatOpen && <RecentChats />}
    </>
  );
}
