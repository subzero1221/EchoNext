export function IsPostsForFeedLoading() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 md:ml-96 sm:px-6 lg:px-8">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl shadow-xl border border-purple-500/10"
        >
          <div className="flex-1 p-4 sm:p-6">
            {/* Post Header Loading */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="w-20 h-4 bg-slate-700 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-slate-700 rounded animate-pulse hidden sm:block"></div>
              <div className="w-24 h-4 bg-slate-700 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-slate-700 rounded animate-pulse hidden sm:block"></div>
              <div className="w-20 h-4 bg-slate-700 rounded animate-pulse"></div>
            </div>

            {/* Post Title Loading */}
            <div className="h-6 w-3/4 bg-slate-700 rounded animate-pulse mb-3"></div>

            {/* Tags Loading */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="w-16 h-6 bg-slate-700 rounded-lg animate-pulse"></div>
              <div className="w-12 h-6 bg-slate-700 rounded-lg animate-pulse"></div>
              <div className="w-20 h-6 bg-slate-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Post Content Loading */}
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-slate-700 rounded animate-pulse"></div>
            </div>

            {/* Media Loading */}
            <div className="w-full h-64 bg-slate-700 rounded-xl animate-pulse mb-4"></div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent my-4"></div>

            {/* Action Buttons Loading */}
            <div className="flex gap-4">
              <div className="w-16 h-8 bg-slate-700 rounded-full animate-pulse"></div>
              <div className="w-16 h-8 bg-slate-700 rounded-full animate-pulse"></div>
              <div className="w-16 h-8 bg-slate-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
