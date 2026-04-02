interface SkeletonCardProps {
  count?: number;
}

export default function SkeletonCard({ count = 8 }: SkeletonCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-5 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="skeleton w-20 h-6 rounded-full" />
            <div className="skeleton w-8 h-8 rounded-lg" />
          </div>
          <div className="skeleton h-6 w-3/4 mb-3" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-2/3 mb-4" />
          <div className="flex gap-2 mb-4">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-16 rounded-full" />
          </div>
          <div className="skeleton h-4 w-full mb-2" />
          <div className="flex gap-2 pt-3 border-t border-[var(--glass-border)]">
            <div className="skeleton h-8 flex-1 rounded-lg" />
            <div className="skeleton h-8 flex-1 rounded-lg" />
            <div className="skeleton h-8 flex-1 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
