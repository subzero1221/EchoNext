export default function GlobalSpinner() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="h-10 w-10 border-4 border-purple-400 border-t-transparent animate-spin rounded-full" />
    </div>
  );
}
