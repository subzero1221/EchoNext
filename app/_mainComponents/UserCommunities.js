import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getUserCommunities } from "../_utils/userActions";

export default function UserCommunities({ setIsModalOpen, userId }) {
  const { data: communities = [], isLoading } = useQuery({
    queryKey: ["communities"],
    queryFn: () => getUserCommunities(),
    enabled: !!userId,
  });

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsModalOpen(true)}
        className="ml-12 mb-5 max-h-8 relative overflow-hidden h-12 px-8 rounded-full bg-[#3d3a4e] text-white border-none cursor-pointer group"
      >
        <span className="relative z-10"> + Create</span>
        <span className="absolute inset-0 scale-x-0 origin-left bg-gradient-to-r from-purple-500 to-indigo-500 transition-transform duration-500 group-hover:scale-x-100 rounded-full"></span>
      </button>

      {isLoading ? (
        <p className="ml-6">Loading...</p>
      ) : communities.length > 0 ? (
        communities.map((community) => (
          <Link href={`/communities/${community._id}`} key={community._id}>
            <div className="flex items-center p-3 hover:bg-slate-700/50 rounded-lg transition-all group cursor-pointer">
              <img
                src={
                  community.photo !== "communityDefault.jpg"
                    ? community.photoUrl
                    : "/communityDefault.jpg"
                }
                alt={community.name}
                className="w-8 h-8 rounded-full object-cover mr-3"
              />
              <span className="group-hover:text-blue-400 transition-colors">
                {community.name}
              </span>
            </div>
          </Link>
        ))
      ) : (
        <p className="ml-8">No communities found.</p>
      )}
    </div>
  );
}
