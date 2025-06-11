"use client";
import { useState } from "react";
import { FaLock, FaGlobe, FaUserFriends } from "react-icons/fa";
import { createCommunity } from "../_utils/communityActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getUserCommunities } from "../_utils/userActions";
import { useQuery } from "@tanstack/react-query";

const communityTypes = [
  {
    id: "Public",
    icon: <FaGlobe className="w-5 h-5 text-green-500" />,
    title: "Public",
    description: "Anyone can view, post, and comment to this community",
  },
  {
    id: "Restricted",
    icon: <FaUserFriends className="w-5 h-5 text-blue-500" />,
    title: "Restricted",
    description: "Anyone can view, but only approved users can post",
  },
  {
    id: "Private",
    icon: <FaLock className="w-5 h-5 text-purple-500" />,
    title: "Private",
    description: "Only approved users can view and post",
  },
];

export default function CreateCommunityModal({ isOpen, onClose }) {
  const { data: communities, refetch } = useQuery({
    queryKey: ["communities"],
    queryFn: getUserCommunities,
  });

  const [communityName, setCommunityName] = useState("");
  const [communityType, setCommunityType] = useState("Public");
  const [description, setDescription] = useState("");
  const router = useRouter();
  if (!isOpen) return null;

  async function handleCreateCommunity() {
    let res;
    try {
      res = await createCommunity(communityName, description, communityType);
      if (res.success) toast.success("You created new Community");
      refetch();
    } catch (err) {
    } finally {
      onClose();
      setCommunityName("");
      setCommunityType("");
      setDescription("");
      router.push(`/communities/${res.community._id}`);
    }
  }

  function handleCancel() {
    onClose();
    setCommunityName("");
    setCommunityType("");
    setDescription("");
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl w-[95%] max-w-md 
                   shadow-2xl border border-slate-700/50"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <h2
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 
                         bg-clip-text text-transparent"
          >
            Create a Community
          </h2>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Community Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-200">
              Community name
            </label>
            <div className="relative group">
              <span className="absolute left-3 top-2.5 text-slate-400">r/</span>
              <input
                type="text"
                className="pl-8 w-full rounded-xl bg-slate-700/50 border-2 border-slate-600 
                         text-white p-2 focus:outline-none focus:border-blue-500 transition-all
                         hover:border-slate-500"
                placeholder="community_name"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                maxLength={21}
              />
              <div className="absolute right-3 top-2.5 text-xs text-slate-400">
                {21 - communityName.length}
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Cannot be changed after creation
            </p>
          </div>

          {/* Community Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-200">
              Description <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              className="w-full rounded-xl bg-slate-700/50 border-2 border-slate-600 
                       text-white p-3 focus:outline-none focus:border-blue-500 transition-all
                       hover:border-slate-500 resize-none"
              rows="3"
              placeholder="What's your community about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Community Type */}
          <div>
            <label className="block text-sm font-medium mb-3 text-slate-200">
              Community type
            </label>
            <div className="space-y-3">
              {communityTypes.map((type) => (
                <label
                  key={type.id}
                  className={`flex items-start p-3 rounded-xl cursor-pointer transition-all
                           ${
                             communityType === type.id
                               ? "bg-blue-500/20 border-2 border-blue-500"
                               : "border-2 border-slate-700 hover:border-slate-600"
                           }`}
                >
                  <input
                    type="radio"
                    name="communityType"
                    value={type.id}
                    checked={communityType === type.id}
                    onChange={(e) => setCommunityType(e.target.value)}
                    className="hidden"
                  />
                  <div className="flex-shrink-0 mt-1">{type.icon}</div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-slate-200">
                      {type.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {type.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 flex justify-end space-x-3 bg-slate-800/50 rounded-b-2xl">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 text-sm font-medium text-slate-300 
                     hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateCommunity}
            className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl 
                     transition-all transform hover:scale-105
                     ${
                       communityName.trim()
                         ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                         : "bg-slate-600 cursor-not-allowed"
                     }`}
            disabled={!communityName.trim()}
          >
            Create Community
          </button>
        </div>
      </div>
    </div>
  );
}
