const FeedLoadingSkeleton = () => {
  return (
    <div role="status" aria-label="Loading feed">
      <span className="sr-only">Loading posts…</span>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          aria-hidden="true"
          className="flex gap-3 border-b border-secondary px-5 py-6 motion-safe:animate-pulse sm:px-7"
        >
          <div className="h-10 w-10 shrink-0 rounded-xl bg-secondary" />
          <div className="flex-1 space-y-3">
            <div className="h-3 w-2/5 rounded bg-secondary" />
            <div className="h-3 w-full rounded bg-secondary" />
            <div className="h-3 w-4/5 rounded bg-secondary" />
            <div className="h-3 w-1/4 rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedLoadingSkeleton;
