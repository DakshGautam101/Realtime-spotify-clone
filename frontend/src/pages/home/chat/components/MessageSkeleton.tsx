import React from "react";

const MessageSkeleton = () => {
	return (
		<div className="space-y-4">
			{Array.from({ length: 5 }).map((_, i) => (
				<div key={i} className="flex items-end gap-2 animate-pulse">
					<div className="size-8 rounded-full bg-zinc-800" />
					<div className="rounded-2xl px-4 py-3 max-w-[70%] bg-zinc-800 w-40 h-5" />
				</div>
			))}
		</div>
	);
};

export default MessageSkeleton; 