import { usePlayerStore } from "@/stores/usePlayerStore.ts";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const { currentSong, isPlaying } = usePlayerStore();

	// handle play/pause logic
	useEffect(() => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.play().catch(console.error);
			} else {
				audioRef.current.pause();
			}
		}
	}, [isPlaying]);

	// handle song changes
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;

		// check if this is actually a new song
		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
		if (isSongChange) {
			audio.src = currentSong?.audioUrl;
			// reset the playback position
			audio.currentTime = 0;

			prevSongRef.current = currentSong?.audioUrl;

			if (isPlaying) {
				audio.play().catch(console.error);
			}
		}
	}, [currentSong, isPlaying]);

	// Set initial volume
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = 0.75; // 75% volume by default
		}
	}, []);

	return <audio ref={audioRef} preload="metadata" />;
};
export default AudioPlayer;