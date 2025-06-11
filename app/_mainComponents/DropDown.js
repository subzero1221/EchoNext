"use client";

export default function DropDown({ community, user, setShowDropdown }) {
  const copyPostUrl = () => {
    const baseUrl = window.location.origin;
    navigator.clipboard.writeText(`${baseUrl}/communities/${community._id}`);
    setShowDropdown(false);
  };

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-50 border border-purple-100 overflow-hidden transform origin-top-right transition-all duration-200 ease-out mt-32">
      <div className="py-1">
        <button
          onClick={copyPostUrl}
          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150 flex items-center space-x-2"
        >
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
              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
            />
          </svg>
          <span>Copy Community URL</span>
        </button>
      </div>
    </div>
  );
}
