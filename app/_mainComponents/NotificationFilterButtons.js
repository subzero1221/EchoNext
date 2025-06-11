"use client";

export default function NotificationFilterButtons({
  activeFilter,
  setActiveFilter,
}) {
  const filters = [
    { type: "all", label: "All" },
    { type: "friend_request", label: "Friend Requests" },
    { type: "comment", label: "Comments" },
    { type: "reply", label: "Replies" },
    { type: "react", label: "Reactions" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.type}
          onClick={() => setActiveFilter(filter.type)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            activeFilter === filter.type
              ? "bg-purple-500/20 text-purple-400"
              : "bg-slate-800/50 text-slate-300 hover:bg-slate-800"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
