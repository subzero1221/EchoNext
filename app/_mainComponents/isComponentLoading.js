export default function () {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Cover Photo Loading */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-slate-800/50 to-slate-700/50 animate-pulse"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Community Info Loading */}
        <div className="relative flex items-center">
          <div className="absolute -top-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-slate-800/50 to-slate-700/50 animate-pulse border-4 border-slate-900"></div>
          </div>

          <div className="ml-24 flex items-center justify-between w-full py-3">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-24 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-full animate-pulse"></div>
              <div className="h-9 w-9 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Posts Loading */}
        <div className="mt-8 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-6 border border-slate-800 rounded-xl animate-pulse bg-slate-900/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-800/50 to-slate-700/50"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded w-1/3"></div>
                  <div className="h-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded w-1/4"></div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded w-full"></div>
                <div className="h-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded w-5/6"></div>
                <div className="h-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded w-3/4"></div>
              </div>

              <div className="mt-6 flex items-center gap-6">
                <div className="h-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded w-20"></div>
                <div className="h-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded w-20"></div>
                <div className="h-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
