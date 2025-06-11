"use client";
import { useState, useRef } from "react";
import { FaReddit, FaCamera, FaUsers } from "react-icons/fa";

import { HiDotsHorizontal } from "react-icons/hi";
import {
  deleteCommunity,
  getCommunity,
  uploadCommunityCoverPhoto,
  uploadCommunityPhoto,
} from "../_utils/communityActions";
import { useAuth } from "../_contextComponents/AuthProvider";
import CreatePostButton from "./CreatePostButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DeleteModal from "./DeleteModal";
import CommunityPosts from "./CommunityPostsRenderer";
import IsComponentLoading from "./isComponentLoading";
import JoinLeaveCommunity from "./JoinLeaveCommunityButton";
import JoinRequestsManager from "./JoinRequestsManager";
import CommunityMembersModal from "./CommunityMembersModal";
import DropDown from "./DropDown";
import PendingPostsManager from "./PendingPostsManager";

export default function CommunityPage({ communityId }) {
  const {
    data: community,
    isLoading: isCommunityLoading,
    refetch: refetchCommunity,
  } = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => getCommunity(communityId),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const queryClient = useQueryClient();

  const { user } = useAuth();

  const [isCoverLoading, setIsCoverLoading] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  const isCreator = community?.creator?._id === user?._id;

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsCoverLoading(true);
      const formData = new FormData();
      formData.append("photo", file);

      const res = await uploadCommunityCoverPhoto(formData, community._id);
      if (res.success) {
        queryClient.invalidateQueries(["community", community._id]);
        queryClient.invalidateQueries({ queryKey: ["communities"] });
      }
      setIsCoverLoading(false);
    }
  };

  const handleCommunityPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsPhotoLoading(true);
      const formData = new FormData();
      formData.append("photo", file);

      const res = await uploadCommunityPhoto(formData, community._id);
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["communities"] });
        queryClient.invalidateQueries(["community", community._id]);
      }
      setIsPhotoLoading(false);
    }
  };

  async function handleDeleteCommunity() {
    const res = await deleteCommunity(community._id);
    if (res.success) {
      toast.success(`You deleted ${community.name} permanently`);
      setIsModalOpen(false);
    } else {
      toast.error(res.error);
    }
    refetchCommunity();
    queryClient.invalidateQueries({ queryKey: ["communities"] });
  }

  if (isCommunityLoading) {
    return <IsComponentLoading />;
  }

  if (!community) {
    return (
      <div className="text-2xl text-white flex justify-center align-center mt-64 mr-48">
        Community not found 🚫
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="relative">
        <div className="relative group">
          <div
            className={`h-32 bg-cover bg-center flex items-center justify-center ${
              !community.coverPhotoUrl &&
              "bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
            style={{
              backgroundImage: community.coverPhotoUrl
                ? `url(${community.coverPhotoUrl})`
                : undefined,
            }}
          >
            {isCoverLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          {isCreator ? (
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute inset-0 w-full h-full bg-black/50 opacity-0 group-hover:opacity-100 
                     transition-opacity flex items-center justify-center cursor-pointer"
            >
              <FaCamera className="w-8 h-8 text-white" />
              <span className="ml-2 text-white">Update cover photo</span>
            </button>
          ) : (
            ""
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            className="hidden"
          />
        </div>

        <div className="max-w-5xl mx-auto px-4">
          <div className="relative flex items-center">
            <div className="absolute -top-5 group">
              <div
                className="w-20 h-20 rounded-full bg-slate-800 border-4 border-slate-900 
                         flex items-center justify-center overflow-hidden relative"
              >
                {isPhotoLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : community?.photoUrl ? (
                  <img
                    src={community?.photoUrl}
                    alt="Community avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaReddit className="w-12 h-12 text-blue-500" />
                )}
                {isCreator ? (
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="rounded-full absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                           transition-opacity flex items-center justify-center"
                  >
                    <FaCamera className="w-5 h-5 text-white" />
                  </button>
                ) : (
                  ""
                )}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleCommunityPhotoUpload}
                className="hidden"
              />
            </div>

            <div className="ml-24 flex items-center justify-between w-full py-3">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  r/{community?.name}
                </h1>
                <p className="text-slate-400 text-sm">r/{community?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                {user && (
                  <CreatePostButton
                    isGroupPost={community?._id}
                    communityName={community?.name}
                  />
                )}

                <button
                  onClick={() => setIsMembersModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                >
                  <FaUsers className="w-5 h-5 text-blue-500" />
                  <span className="text-white font-medium">
                    {community?.members?.length || 0}
                  </span>
                </button>

                <JoinLeaveCommunity
                  user={user}
                  community={community}
                  setIsDeleteModalOpen={setIsModalOpen}
                />
                <JoinRequestsManager user={user} community={community} />
                <PendingPostsManager user={user} community={community} />

                <button
                  onClick={() => setShowDropdown((drop) => !drop)}
                  className="p-2 rounded-full hover:bg-slate-700"
                >
                  <HiDotsHorizontal className="w-5 h-5 text-white" />
                </button>
                {showDropdown && (
                  <DropDown
                    user={user}
                    community={community}
                    setShowDropdown={setShowDropdown}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isCommunityLoading && (
        <CommunityPosts community={community} user={user} />
      )}
      {isModalOpen && (
        <DeleteModal
          closeModal={() => setIsModalOpen(false)}
          handleDelete={handleDeleteCommunity}
          keyWord={community?.name}
        />
      )}

      {isMembersModalOpen && (
        <CommunityMembersModal
          isOpen={isMembersModalOpen}
          onClose={() => setIsMembersModalOpen(false)}
          community={community}
          user={user}
        />
      )}
    </div>
  );
}
