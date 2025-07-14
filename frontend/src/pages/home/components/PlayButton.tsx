import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore.ts";
import type { Song } from "@/types";
import { Pause, Play } from "lucide-react";

const PlayButton = ({ song }: { song: Song }) => {
	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
	const isCurrentSong = currentSong?._id === song._id;

	const handlePlay = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		
		if (isCurrentSong) {
			togglePlay();
		} else {
			setCurrentSong(song);
		}
	};

	return (
		<Button
			size={"icon"}
			onClick={handlePlay}
			className={`absolute bottom-1 sm:bottom-2 lg:bottom-3 right-1 sm:right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all w-8 h-8 sm:w-10 sm:h-10
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
					isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
				}`}
		>
			{isCurrentSong && isPlaying ? (
				<Pause className='size-3 sm:size-4 lg:size-5 text-black' />
			) : (
				<Play className='size-3 sm:size-4 lg:size-5 text-black' />
			)}
		</Button>
	);
};
export default PlayButton;