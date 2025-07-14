import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore.ts";
import {
	Laptop2,
	ListMusic,
	Mic2,
	Pause,
	Play,
	Repeat,
	Repeat1,
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
	const { 
		currentSong, 
		isPlaying, 
		togglePlay, 
		playNext, 
		playPrevious,
		isShuffled,
		isRepeating,
		toggleShuffle,
		toggleRepeat
	} = usePlayerStore();

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
				// Let the player store handle what happens when song ends
				playNext();
			};

			const handleLoadStart = () => {
				setCurrentTime(0);
			};

			audio.addEventListener("timeupdate", updateTime);
			audio.addEventListener("loadedmetadata", updateDuration);
			audio.addEventListener("volumechange", updateVolume);
			audio.addEventListener("ended", handleEnded);
			audio.addEventListener("loadstart", handleLoadStart);

			return () => {
				audio.removeEventListener("timeupdate", updateTime);
				audio.removeEventListener("loadedmetadata", updateDuration);
				audio.removeEventListener("volumechange", updateVolume);
				audio.removeEventListener("ended", handleEnded);
				audio.removeEventListener("loadstart", handleLoadStart);
			};
		}
	}, [currentSong, playNext]);

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

	const handleVolumeChange = (value: number[]) => {
		const newVolume = value[0];
		if (audioRef.current && newVolume !== volume) {
			audioRef.current.volume = newVolume / 100;
			setVolume(newVolume);
			// Unmute if volume is changed while muted
			if (isMuted && newVolume > 0) {
				audioRef.current.muted = false;
				setIsMuted(false);
			}
		}
	};

	const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

	return (
		<footer className="h-16 sm:h-20 lg:h-24 bg-[#121212] border-t border-[#282828] px-2 sm:px-4">
			<div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
				{/* currently playing song */}
				<div className="flex items-center gap-2 sm:gap-4 min-w-[120px] sm:min-w-[180px] w-[25%] sm:w-[30%]">
					{currentSong && (
						<>
							<img
								src={currentSong.imageUrl}
								alt={currentSong.title}
								className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-cover rounded-md"
							/>
							<div className="flex-1 min-w-0 hidden xs:block">
								<div className="font-medium truncate text-white hover:underline cursor-pointer text-xs sm:text-sm">
									{currentSong.title}
								</div>
								<div className="text-xs sm:text-sm text-[#b3b3b3] truncate hover:underline cursor-pointer">
									{currentSong.artist}
								</div>
							</div>
						</>
					)}
				</div>

				{/* player controls */}
				<div className="flex flex-col items-center gap-1 sm:gap-2 flex-1 max-w-full sm:max-w-[45%]">
					<div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
						<Button
							size="icon"
							variant="ghost"
							className={`hidden md:inline-flex cursor-pointer transition-colors h-6 w-6 sm:h-8 sm:w-8 ${
								isShuffled ? 'text-[#1db954] hover:text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
							}`}
							onClick={toggleShuffle}
						>
							<Shuffle className="h-3 w-3 sm:h-4 sm:w-4" />
						</Button>

						<Button
							size="icon"
							variant="ghost"
							className="text-[#b3b3b3] hover:text-white cursor-pointer h-6 w-6 sm:h-8 sm:w-8"
							onClick={playPrevious}
							disabled={!currentSong}
						>
							<SkipBack className="h-3 w-3 sm:h-4 sm:w-4" />
						</Button>

						<Button
							size="icon"
							className="bg-[#1db954] hover:bg-[#1ed760] text-black rounded-full h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
							onClick={togglePlay}
							disabled={!currentSong}
						>
							{isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
						</Button>

						<Button
							size="icon"
							variant="ghost"
							className="text-[#b3b3b3] hover:text-white cursor-pointer h-6 w-6 sm:h-8 sm:w-8"
							onClick={playNext}
							disabled={!currentSong}
						>
							<SkipForward className="h-3 w-3 sm:h-4 sm:w-4" />
						</Button>

						<Button
							size="icon"
							variant="ghost"
							className={`hidden md:inline-flex cursor-pointer transition-colors h-6 w-6 sm:h-8 sm:w-8 ${
								isRepeating !== 'off' ? 'text-[#1db954] hover:text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
							}`}
							onClick={toggleRepeat}
						>
							{isRepeating === 'one' ? (
								<Repeat1 className="h-3 w-3 sm:h-4 sm:w-4" />
							) : (
								<Repeat className="h-3 w-3 sm:h-4 sm:w-4" />
							)}
						</Button>
					</div>

					{/* Progress bar - visible on all screen sizes */}
					<div className="flex items-center gap-1 sm:gap-2 w-full">
						<div className="text-xs text-[#b3b3b3] min-w-[30px] sm:min-w-[40px] text-right">
							{formatTime(currentTime)}
						</div>
						
						{/* Custom progress bar */}
						<div className="flex-1 relative group">
							<div className="w-full h-1 bg-[#535353] rounded-full overflow-hidden">
								<div 
									className="h-full bg-[#1db954] transition-all duration-150 ease-out"
									style={{ width: `${progressPercentage}%` }}
								/>
							</div>
							{/* Interactive overlay */}
							<input
								type="range"
								min={0}
								max={duration || 100}
								value={currentTime}
								onChange={(e) => handleSeek([parseFloat(e.target.value)])}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
							/>
							{/* Hover effect */}
							<div className="absolute inset-0 w-full h-1 bg-transparent group-hover:bg-[#1db954]/20 rounded-full" />
						</div>
						
						<div className="text-xs text-[#b3b3b3] min-w-[30px] sm:min-w-[40px]">
							{formatTime(duration)}
						</div>
					</div>
				</div>

				{/* volume controls */}
				<div className="hidden lg:flex items-center gap-2 lg:gap-4 min-w-[120px] lg:min-w-[180px] w-[25%] lg:w-[30%] justify-end">
					<Button size="icon" variant="ghost" className="text-[#b3b3b3] hover:text-white cursor-pointer h-6 w-6 lg:h-8 lg:w-8">
						<Mic2 className="h-3 w-3 lg:h-4 lg:w-4" />
					</Button>
					<Button size="icon" variant="ghost" className="text-[#b3b3b3] hover:text-white cursor-pointer h-6 w-6 lg:h-8 lg:w-8">
						<ListMusic className="h-3 w-3 lg:h-4 lg:w-4" />
					</Button>
					<Button size="icon" variant="ghost" className="text-[#b3b3b3] hover:text-white cursor-pointer h-6 w-6 lg:h-8 lg:w-8">
						<Laptop2 className="h-3 w-3 lg:h-4 lg:w-4" />
					</Button>

					<div className="flex items-center gap-1 lg:gap-2">
						<Button
							size="icon"
							variant="ghost"
							className="text-[#b3b3b3] hover:text-white cursor-pointer h-6 w-6 lg:h-8 lg:w-8"
							onClick={toggleMute}
						>
							{isMuted || volume === 0 ? (
								<VolumeX className="h-3 w-3 lg:h-4 lg:w-4" />
							) : (
								<Volume1 className="h-3 w-3 lg:h-4 lg:w-4" />
							)}
						</Button>

						{/* Custom volume slider */}
						<div className="relative group w-16 lg:w-24">
							<div className="w-full h-1 bg-[#535353] rounded-full overflow-hidden">
								<div 
									className="h-full bg-[#1db954] transition-all duration-150 ease-out"
									style={{ width: `${volume}%` }}
								/>
							</div>
							{/* Interactive overlay */}
							<input
								type="range"
								min={0}
								max={100}
								value={volume}
								onChange={(e) => handleVolumeChange([parseFloat(e.target.value)])}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
							/>
							{/* Hover effect */}
							<div className="absolute inset-0 w-full h-1 bg-transparent group-hover:bg-[#1db954]/20 rounded-full" />
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};