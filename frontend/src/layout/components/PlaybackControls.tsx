import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore.ts";
import {
	Laptop2,
	ListMusic,
	Mic2,
	Pause,
	Play,
	Repeat,
	Shuffle,
	SkipBack,
	SkipForward,
	Volume1,
	VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
	const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();

	const [volume, setVolume] = useState(75);
	const [isMuted, setIsMuted] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		const audio = document.querySelector("audio") as HTMLAudioElement | null;
		audioRef.current = audio;

		if (audio) {
			// Sync initial volume state
			const initialVolume = audio.volume * 100;
			setVolume(initialVolume);
			setIsMuted(audio.muted);

			const updateTime = () => setCurrentTime(audio.currentTime);
			const updateDuration = () => setDuration(audio.duration);
			const updateVolume = () => {
				setVolume(audio.volume * 100);
				setIsMuted(audio.muted);
			};

			const handleEnded = () => {
				usePlayerStore.setState({ isPlaying: false });
			};

			audio.addEventListener("timeupdate", updateTime);
			audio.addEventListener("loadedmetadata", updateDuration);
			audio.addEventListener("volumechange", updateVolume);
			audio.addEventListener("ended", handleEnded);

			return () => {
				audio.removeEventListener("timeupdate", updateTime);
				audio.removeEventListener("loadedmetadata", updateDuration);
				audio.removeEventListener("volumechange", updateVolume);
				audio.removeEventListener("ended", handleEnded);
			};
		}
	}, [currentSong]);

	const handleSeek = (value: number[]) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value[0];
		}
	};

	const toggleMute = () => {
		if (audioRef.current) {
			audioRef.current.muted = !audioRef.current.muted;
			setIsMuted(audioRef.current.muted);
		}
	};

	return (
		<footer className="h-20 sm:h-24 bg-[#121212] border-t border-[#282828] px-4">
			<div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
				{/* currently playing song */}
				<div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
					{currentSong && (
						<>
							<img
								src={currentSong.imageUrl}
								alt={currentSong.title}
								className="w-14 h-14 object-cover rounded-md"
							/>
							<div className="flex-1 min-w-0">
								<div className="font-medium truncate text-white hover:underline cursor-pointer">
									{currentSong.title}
								</div>
								<div className="text-sm text-[#b3b3b3] truncate hover:underline cursor-pointer">
									{currentSong.artist}
								</div>
							</div>
						</>
					)}
				</div>

				{/* player controls */}
				<div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
					<div className="flex items-center gap-4 sm:gap-6">
						<Button
							size="icon"
							variant="ghost"
							className="hidden sm:inline-flex text-[#b3b3b3] hover:text-white cursor-pointer"
						>
							<Shuffle className="h-4 w-4" />
						</Button>

						<Button
							size="icon"
							variant="ghost"
							className="text-[#b3b3b3] hover:text-white cursor-pointer"
							onClick={playPrevious}
							disabled={!currentSong}
						>
							<SkipBack className="h-4 w-4" />
						</Button>

						<Button
							size="icon"
							className="bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-8 w-8 cursor-pointer"
							onClick={togglePlay}
							disabled={!currentSong}
						>
							{isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
						</Button>

						<Button
							size="icon"
							variant="ghost"
							className="text-[#b3b3b3] hover:text-white cursor-pointer"
							onClick={playNext}
							disabled={!currentSong}
						>
							<SkipForward className="h-4 w-4" />
						</Button>

						<Button
							size="icon"
							variant="ghost"
							className="hidden sm:inline-flex text-[#b3b3b3] hover:text-white cursor-pointer"
						>
							<Repeat className="h-4 w-4" />
						</Button>
					</div>

					<div className="hidden sm:flex items-center gap-2 w-full">
						<div className="text-xs text-[#b3b3b3]">{formatTime(currentTime)}</div>
						<Slider
							value={[currentTime]}
							max={duration || 100}
							step={1}
							onValueChange={handleSeek}
							className="w-full rounded-md hover:cursor-grab active:cursor-grabbing"
							style={{
								background: `linear-gradient(to right, #1db954 ${((currentTime / duration) * 100) || 0}%, #535353 ${((currentTime / duration) * 100) || 0}%)`,
							}}
						/>
						<div className="text-xs text-[#b3b3b3]">{formatTime(duration)}</div>
					</div>
				</div>

				{/* volume controls */}
				<div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
					<Button size="icon" variant="ghost" className="text-[#b3b3b3] hover:text-white cursor-pointer">
						<Mic2 className="h-4 w-4" />
					</Button>
					<Button size="icon" variant="ghost" className="text-[#b3b3b3] hover:text-white cursor-pointer">
						<ListMusic className="h-4 w-4" />
					</Button>
					<Button size="icon" variant="ghost" className="text-[#b3b3b3] hover:text-white cursor-pointer">
						<Laptop2 className="h-4 w-4" />
					</Button>

					<div className="flex items-center gap-2">
						<Button
							size="icon"
							variant="ghost"
							className="text-[#b3b3b3] hover:text-white cursor-pointer "
							onClick={toggleMute}
						>
							{isMuted ? <VolumeX className="h-4 w-4" /> : <Volume1 className="h-4 w-4" />}
						</Button>

						<Slider
							value={[volume]}
							max={100}
							step={1}
							className="w-24 hover:cursor-grab rounded-b-md active:cursor-grabbing"
							onValueChange={(value) => {
								const newVolume = value[0];
								if (audioRef.current && newVolume !== volume) {
									audioRef.current.volume = newVolume / 100;
								}
								setVolume(newVolume);
							}}
							style={{
								background: `linear-gradient(to right, #1db954 ${volume}%, #535353 ${volume}%)`,
							}}
						/>

					</div>
				</div>
			</div>
		</footer>
	);
};
