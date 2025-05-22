import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore.ts";
import { usePlayerStore } from "@/stores/usePlayerStore.ts";
import { Clock, Pause, Play } from "lucide-react";
import { useParams } from "react-router-dom";

// Themes
import Waves from "./themes/waves";
import Lightning from "./themes/lighting";
import Particles from "./themes/Particles";


export const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
	const { albumId } = useParams();
	const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	const [selectedTheme, setSelectedTheme] = useState<ReactNode | null>(null);

	useEffect(() => {
		if (albumId) fetchAlbumById(albumId);

		const themes = [
			<Waves
				key="waves"
				lineColor="#fff"
				backgroundColor="rgba(255, 255, 255, 0.2)"
				waveSpeedX={0.02}
				waveSpeedY={0.01}
				waveAmpX={40}
				waveAmpY={20}
				friction={0.9}
				tension={0.01}
				maxCursorMove={120}
				xGap={12}
				yGap={36}
			/>,
			<Lightning key="lightning" hue={230} xOffset={0} speed={1} intensity={1} size={1} />,
			<Particles
				particleColors={['#ffffff', '#ffffff']}
				particleCount={200}
				particleSpread={10}
				speed={0.1}
				particleBaseSize={100}
				moveParticlesOnHover={true}
				alphaParticles={false}
				disableRotation={false}
			/>
		];

		const randomIndex = Math.floor(Math.random() * themes.length);
		setSelectedTheme(themes[randomIndex]);
	}, [albumId, fetchAlbumById]);

	if (isLoading) return null;

	const handlePlayAlbum = () => {
		if (!currentAlbum) return;
		const isCurrentAlbumPlaying = currentAlbum?.songs.some(song => song._id === currentSong?._id);
		if (isCurrentAlbumPlaying) togglePlay();
		else playAlbum(currentAlbum?.songs, 0);
	};

	const handlePlaySong = (index: number) => {
		if (!currentAlbum) return;
		playAlbum(currentAlbum?.songs, index);
	};

	return (
		<ScrollArea className="h-full rounded-md">
			<div className="relative h-full">
				<div className="absolute inset-0 z-0">{selectedTheme}</div>

				<div className="relative z-10">
					{/* Header */}
					<div className="flex p-6 gap-6 pb-8">
						<img
							src={currentAlbum?.imageUrl}
							alt={currentAlbum?.title}
							className="w-[240px] h-[240px] rounded shadow-2xl object-cover"
						/>
						<div className="flex flex-col justify-end">
							<p className="text-sm font-medium">Album</p>
							<h1 className="text-5xl md:text-7xl font-bold text-white my-4">
								{currentAlbum?.title}
							</h1>
							<div className="flex items-center gap-2 text-sm text-zinc-100">
								<span className="font-medium text-white">{currentAlbum?.artist}</span>
								<span>• {currentAlbum?.songs.length} songs</span>
								<span>• {currentAlbum?.releaseYear}</span>
							</div>
						</div>
					</div>

					{/* Play Button */}
					<div className="px-6 pb-6">
						<Button
							onClick={handlePlayAlbum}
							size="icon"
							className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all shadow-lg"
						>
							{isPlaying && currentAlbum?.songs.some(song => song._id === currentSong?._id) ? (
								<Pause className="h-7 w-7 text-black" />
							) : (
								<Play className="h-7 w-7 text-black" />
							)}
						</Button>
					</div>

					{/* Song Table */}
					<div className="bg-black/30 backdrop-blur-md border-t border-white/10">
						<div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
							<div>#</div>
							<div>Title</div>
							<div>Released</div>
							<div>
								<Clock className="h-4 w-4" />
							</div>
						</div>

						<div className="px-6 py-4 space-y-1">
							{currentAlbum?.songs.map((song, index) => {
								const isCurrentSong = currentSong?._id === song._id;
								return (
									<div
										key={song._id}
										onClick={() => handlePlaySong(index)}
										className={`group grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 rounded-md cursor-pointer transition-colors 
											${isCurrentSong ? 'bg-green-500/10' : 'hover:bg-white/5'}
										`}
									>
										<div className="flex items-center justify-center">
											{isCurrentSong && isPlaying ? (
												<div className="text-green-500">♫</div>
											) : (
												<>
													<span className="group-hover:hidden">{index + 1}</span>
													<Play className="h-4 w-4 hidden group-hover:block" />
												</>
											)}
										</div>

										<div className="flex items-center gap-3">
											<img src={song.imageUrl} alt={song.title} className="size-10 rounded-sm object-cover" />
											<div>
												<div className="font-medium text-white">{song.title}</div>
												<div className="text-xs">{song.artist}</div>
											</div>
										</div>

										<div className="flex items-center text-sm">{song.createdAt.split("T")[0]}</div>
										<div className="flex items-center text-sm">{formatDuration(song.duration)}</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</ScrollArea>
	);
};

export default AlbumPage;
