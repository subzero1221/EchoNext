"use client";

import { FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function UnauthorizedAccess({ message, redirectPath }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaLock className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-slate-400 mb-8">{message}</p>
        <button
          onClick={() => router.push(redirectPath)}
          className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
