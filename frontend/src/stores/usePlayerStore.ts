import { create } from "zustand";
import type { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	isShuffled: boolean;
	isRepeating: 'off' | 'all' | 'one';
	originalQueue: Song[];
	shuffledIndices: number[];

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
	toggleShuffle: () => void;
	toggleRepeat: () => void;
	playFromQueue: (index: number) => void;
	addToQueue: (song: Song) => void;
	removeFromQueue: (index: number) => void;
	clearQueue: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	isShuffled: false,
	isRepeating: 'off',
	originalQueue: [],
	shuffledIndices: [],

	initializeQueue: (songs: Song[]) => {
		if (songs.length === 0) return;
		
		const currentState = get();
		// Only initialize if we don't have a current song or the queue is empty
		if (!currentState.currentSong || currentState.queue.length === 0) {
			set({
				queue: songs,
				originalQueue: songs,
				currentSong: songs[0],
				currentIndex: 0,
			});
		}
	},

	playAlbum: (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;

		const song = songs[startIndex];
		// const currentState = get();
		// console.log(currentState);

		// Update activity
		const socket = useChatStore.getState().socket;
		if (socket?.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}

		// Reset shuffle state when playing a new album
		set({
			queue: songs,
			originalQueue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
			isShuffled: false,
			shuffledIndices: [],
		});
	},

	setCurrentSong: (song: Song | null) => {
		if (!song) return;

		const currentState = get();
		const { queue } = currentState;

		// Update activity
		const socket = useChatStore.getState().socket;
		if (socket?.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}

		// Find the song in the current queue
		const songIndex = queue.findIndex((s) => s._id === song._id);
		
		if (songIndex !== -1) {
			// Song is in current queue
			set({
				currentSong: song,
				isPlaying: true,
				currentIndex: songIndex,
			});
		} else {
			// Song is not in current queue, create new queue with this song
			set({
				queue: [song],
				originalQueue: [song],
				currentSong: song,
				isPlaying: true,
				currentIndex: 0,
				isShuffled: false,
				shuffledIndices: [],
			});
		}
	},

	togglePlay: () => {
		const currentState = get();
		const willStartPlaying = !currentState.isPlaying;

		// Update activity
		const socket = useChatStore.getState().socket;
		if (socket?.auth) {
			const currentSong = currentState.currentSong;
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: willStartPlaying && currentSong 
					? `Playing ${currentSong.title} by ${currentSong.artist}` 
					: "Idle",
			});
		}

		set({ isPlaying: willStartPlaying });
	},

	playNext: () => {
		const { currentIndex, queue, isRepeating, isShuffled, shuffledIndices } = get();
		
		if (queue.length === 0) return;

		let nextIndex: number;

		if (isRepeating === 'one') {
			// Repeat current song
			nextIndex = currentIndex;
		} else if (isShuffled) {
			// Shuffle mode
			if (shuffledIndices.length === 0) {
				// Generate shuffled indices
				const indices = Array.from({ length: queue.length }, (_, i) => i);
				const shuffled = indices.sort(() => Math.random() - 0.5);
				set({ shuffledIndices: shuffled });
				nextIndex = shuffled[0];
			} else {
				const currentShuffleIndex = shuffledIndices.indexOf(currentIndex);
				if (currentShuffleIndex < shuffledIndices.length - 1) {
					nextIndex = shuffledIndices[currentShuffleIndex + 1];
				} else if (isRepeating === 'all') {
					nextIndex = shuffledIndices[0];
				} else {
					// End of shuffled queue
					set({ isPlaying: false });
					const socket = useChatStore.getState().socket;
					if (socket?.auth) {
						socket.emit("update_activity", {
							userId: socket.auth.userId,
							activity: "Idle",
						});
					}
					return;
				}
			}
		} else {
			// Normal mode
			if (currentIndex < queue.length - 1) {
				nextIndex = currentIndex + 1;
			} else if (isRepeating === 'all') {
				nextIndex = 0;
			} else {
				// End of queue
				set({ isPlaying: false });
				const socket = useChatStore.getState().socket;
				if (socket?.auth) {
					socket.emit("update_activity", {
						userId: socket.auth.userId,
						activity: "Idle",
					});
				}
				return;
			}
		}

		const nextSong = queue[nextIndex];
		if (nextSong) {
			const socket = useChatStore.getState().socket;
			if (socket?.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
				});
			}

			set({
				currentSong: nextSong,
				currentIndex: nextIndex,
				isPlaying: true,
			});
		}
	},

	playPrevious: () => {
		const { currentIndex, queue, isShuffled, shuffledIndices } = get();
		
		if (queue.length === 0) return;

		let prevIndex: number;

		if (isShuffled) {
			// Shuffle mode
			const currentShuffleIndex = shuffledIndices.indexOf(currentIndex);
			if (currentShuffleIndex > 0) {
				prevIndex = shuffledIndices[currentShuffleIndex - 1];
			} else {
				prevIndex = shuffledIndices[shuffledIndices.length - 1];
			}
		} else {
			// Normal mode
			if (currentIndex > 0) {
				prevIndex = currentIndex - 1;
			} else {
				prevIndex = queue.length - 1;
			}
		}

		const prevSong = queue[prevIndex];
		if (prevSong) {
			const socket = useChatStore.getState().socket;
			if (socket?.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
				});
			}

			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});
		}
	},

	toggleShuffle: () => {
		const currentState = get();
		const newShuffled = !currentState.isShuffled;
		
		if (newShuffled) {
			// Enable shuffle - generate shuffled indices
			const indices = Array.from({ length: currentState.queue.length }, (_, i) => i);
			const shuffled = indices.sort(() => Math.random() - 0.5);
			set({ 
				isShuffled: true, 
				shuffledIndices: shuffled 
			});
		} else {
			// Disable shuffle
			set({ 
				isShuffled: false, 
				shuffledIndices: [] 
			});
		}
	},

	toggleRepeat: () => {
		const currentState = get();
		let newRepeatMode: 'off' | 'all' | 'one';
		
		switch (currentState.isRepeating) {
			case 'off':
				newRepeatMode = 'all';
				break;
			case 'all':
				newRepeatMode = 'one';
				break;
			case 'one':
				newRepeatMode = 'off';
				break;
			default:
				newRepeatMode = 'off';
		}
		
		set({ isRepeating: newRepeatMode });
	},

	playFromQueue: (index: number) => {
		const { queue } = get();
		if (index >= 0 && index < queue.length) {
			const song = queue[index];
			
			const socket = useChatStore.getState().socket;
			if (socket?.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${song.title} by ${song.artist}`,
				});
			}

			set({
				currentSong: song,
				currentIndex: index,
				isPlaying: true,
			});
		}
	},

	addToQueue: (song: Song) => {
		const currentState = get();
		set({
			queue: [...currentState.queue, song],
			originalQueue: [...currentState.originalQueue, song],
		});
	},

	removeFromQueue: (index: number) => {
		const currentState = get();
		const newQueue = currentState.queue.filter((_, i) => i !== index);
		const newOriginalQueue = currentState.originalQueue.filter((_, i) => i !== index);
		
		let newCurrentIndex = currentState.currentIndex;
		if (index < currentState.currentIndex) {
			newCurrentIndex = currentState.currentIndex - 1;
		} else if (index === currentState.currentIndex) {
			// If we're removing the current song, play the next one
			if (newQueue.length > 0) {
				const nextIndex = Math.min(currentState.currentIndex, newQueue.length - 1);
				set({
					queue: newQueue,
					originalQueue: newOriginalQueue,
					currentSong: newQueue[nextIndex],
					currentIndex: nextIndex,
				});
				return;
			} else {
				// No songs left
				set({
					queue: [],
					originalQueue: [],
					currentSong: null,
					currentIndex: -1,
					isPlaying: false,
				});
				return;
			}
		}
		
		set({
			queue: newQueue,
			originalQueue: newOriginalQueue,
			currentIndex: newCurrentIndex,
		});
	},

	clearQueue: () => {
		const socket = useChatStore.getState().socket;
		if (socket?.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: "Idle",
			});
		}

		set({
			queue: [],
			originalQueue: [],
			currentSong: null,
			currentIndex: -1,
			isPlaying: false,
			isShuffled: false,
			isRepeating: 'off',
			shuffledIndices: [],
		});
	},
}));