"use client";

export default function SaveShareModal({ closeModal, handler, keyWord }) {
  const save = keyWord === "Save";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 
    backdrop-blur-sm z-50"
      onClick={closeModal}
    >
      <div
        className="bg-slate-900 text-white p-6 rounded-xl shadow-xl w-96 
      border border-purple-500/20 transform transition-all scale-100 
      opacity-100 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center mb-4 text-purple-300">
          {keyWord} Post?
        </h2>
        <p className="text-slate-400 text-center mb-6">
          {`You're about to ${keyWord} this post to you profile, are you sure? You can un${keyWord} it later if needed.`}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={closeModal}
            className="px-5 py-2 border border-purple-500/20 rounded-lg 
          text-purple-300 hover:bg-purple-500/10 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handler}
            className={
              save
                ? `px-5 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all duration-200 border 
          border-green-500/20 rounded-lg`
                : `px-5 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 border 
          border-blue-500/20 rounded-lg`
            }
          >
            {keyWord}
          </button>
        </div>
      </div>
    </div>
  );
}
