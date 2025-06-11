"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoCommentDiscussion } from "react-icons/go";
import {
  BsHouseDoor,
  BsGraphUp,
  BsPeople,
  BsQuestionCircle,
} from "react-icons/bs";
import { useAuth } from "../_contextComponents/AuthProvider";
import { useState } from "react";
import CreateCommunityModal from "./CreateCommunityModal";
import UserCommunities from "./UserCommunities";

export default function Sidebar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const excludedRoutes = ["/signup", "/signin"];
  const showSideBar = !excludedRoutes.includes(pathname);
  const { user } = useAuth();

  const menuItems = [
    { href: "/", icon: <BsHouseDoor className="w-5 h-5" />, label: "Home" },
    { href: "/top", icon: <BsGraphUp className="w-5 h-5" />, label: "Topics" },
    {
      href: "/discussions",
      icon: <GoCommentDiscussion className="w-5 h-5" />,
      label: "Discussions",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-200"
      >
        <svg
          className="w-6 h-6"
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

      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-72 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white 
        fixed left-0 top-20 bottom-0 z-40 transition-transform duration-300 ease-in-out
        overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-800`}
      >
        <div className="p-6 space-y-8">
          {/* Main Menu Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-3 text-purple-100">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></span>
              <span>Main Menu</span>
              <span className="h-px flex-1 bg-gradient-to-r from-purple-500 via-purple-500 to-transparent"></span>
            </h2>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center p-3 rounded-xl transition-all duration-200
                    ${
                      pathname === item.href
                        ? "bg-purple-600 text-white"
                        : "hover:bg-white/10 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Communities Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-3 text-purple-100">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></span>
              <span>Communities</span>
              <span className="h-px flex-1 bg-gradient-to-r from-purple-500 via-purple-500 to-transparent"></span>
            </h2>
            {user && (
              <UserCommunities
                setIsModalOpen={setIsModalOpen}
                userId={user._id}
              />
            )}
          </div>

          {/* Help Section */}
          <div className="mt-auto pt-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-3 text-purple-200">
                <BsQuestionCircle className="w-5 h-5" />
                <p className="text-sm">Need assistance?</p>
              </div>
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-lg 
                hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center
                shadow-lg hover:shadow-purple-500/20"
              >
                <span className="mr-2">Contact Support</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <CreateCommunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
