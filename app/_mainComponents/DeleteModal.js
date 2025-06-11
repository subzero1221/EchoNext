"use client";

export default function DeleteModal({ closeModal, handleDelete, keyWord }) {
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
          Delete {keyWord}?
        </h2>
        <p className="text-slate-400 text-center mb-6">
          {`This action cannot be undone. Your ${keyWord} will be permanently
        deleted.`}
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
            onClick={handleDelete}
            className="px-5 py-2 bg-red-500/20 text-red-400 rounded-lg 
          hover:bg-red-500/30 transition-all duration-200 border 
          border-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
