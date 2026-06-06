export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#181d24]/80 relative overflow-hidden ${className || ""}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

// Add this to globals.css later or here:
// @keyframes shimmer {
//   100% {
//     transform: translateX(100%);
//   }
// }
