// import React from "react";

const TableSkeleton = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => {
  return (
    <div className="w-full animate-pulse">
      <div className="flex gap-2 mb-2">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 w-24 bg-zinc-800 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-2 mb-2">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-6 w-24 bg-zinc-800 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton; 