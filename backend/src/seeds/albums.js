import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";

config();

config();

const seedDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		// Clear existing data
		await Album.deleteMany({});
		await Song.deleteMany({});

		// First, create all songs
		const createdSongs = await Song.insertMany([
			{
				title: "Aizen's Theme",
				artist: "Shiru SAGISU",
				imageUrl: "/cover-images/13.png",
				audioUrl: "/songs/1.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 202,
			},
			{
				title: "Akaza's Theme",
				artist: "Ashif N",
				imageUrl: "/cover-images/12.jpg",
				audioUrl: "/songs/2.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 180,
			},
			{
				title: "Kyoka Suigetsu",
				artist: "DXXWTHWXSH",
				imageUrl: "/cover-images/11.jpg",
				audioUrl: "/songs/3.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 143,
			},
			{
				title: "Blue Bird(from 'Naruto Shippuden'",
				artist: "Akano",
				imageUrl: "/cover-images/10.jpg",
				audioUrl: "/songs/4.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 100,
			},
			{
				title: "Dark Aria from Solo Levelling",
				artist: "XAI",
				imageUrl: "/cover-images/9.jpg",
				audioUrl: "/songs/5.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 142,
			},
			{
				title: "Tanjiro Theme",
				artist: "Akano",
				imageUrl: "/cover-images/14.jpg",
				audioUrl: "/songs/6.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 147,
			},
			{
				title: "Theme of L",
				artist: "Guiteristta de atena",
				imageUrl: "/cover-images/31.jpg",
				audioUrl: "/songs/7.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 180,
			},
			{
				title: "L's Theme",
				artist: "Animelmack",
				imageUrl: "/cover-images/15.jpg",
				audioUrl: "/songs/8.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 179,
			},
			{
				title: "Number One",
				artist: "Shiro SAGISU",
				imageUrl: "/cover-images/23.png",
				audioUrl: "/songs/9.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 286,
			},
			{
				title: "On the Precipiece of defeat",
				artist: "Shiro SAGISU",
				imageUrl: "/cover-images/30.jpg",
				audioUrl: "/songs/10.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 177,
			},
			{
				title: "SL-Ending theme",
				artist: "TK",
				imageUrl: "/cover-images/26.png",
				audioUrl: "/songs/11.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 262,
			},
			{
				title: "SL-Opening",
				artist: "LiSa",
				imageUrl: "/cover-images/22.png",
				audioUrl: "/songs/12.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 183,
			},
			{
				title: "Babam Bam",
				artist: "Paradox",
				imageUrl: "/cover-images/17.jpeg",
				audioUrl: "/songs/13.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 146,
			},
			{
				title: "Bam Lahiri",
				artist: "Kailash Kher",
				imageUrl: "/cover-images/21.png",
				audioUrl: "/songs/14.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 317,
			},
			{
				title: "Shiv Tandav Strotram",
				artist: "Shankar Mahadevan",
				imageUrl: "/cover-images/20.png",
				audioUrl: "/songs/16.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 563,
			},
			{
				title: "Softly",
				artist: "Karan Aujla",
				imageUrl: "/cover-images/3.jpg",
				audioUrl: "/songs/17.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 154,
			},
			{
				title: "Wavy",
				artist: "Karan Aujla",
				imageUrl: "/cover-images/18.png",
				audioUrl: "/songs/18.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 160,
			},
			{
				title: "Winning Speech",
				artist: "Karan Aujla",
				imageUrl: "/cover-images/19.png",
				audioUrl: "/songs/19.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 225,
			},
			{
				title: "Bekhayali",
				artist: "Arijit Singh(version)",
				imageUrl: "/cover-images/24.png",
				audioUrl: "/songs/20.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 180,
			},
			{
				title: "Isq Risk",
				artist: "Sohail Sen",
				imageUrl: "/cover-images/27.jpg",
				audioUrl: "/songs/21.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 294,
			},
			{
				title: "Pal",
				artist: "Arijit Singh",
				imageUrl: "/cover-images/4.jpg",
				audioUrl: "/songs/22.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 247,
			},
			{
				title: "Pal Pal Dil k Paas",
				artist: "Arijit Singh",
				imageUrl: "/cover-images/28.jpg",
				audioUrl: "/songs/23.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 254,
			},
			{
				title: "Bol Na Halke Halke",
				artist: "Shankar",
				imageUrl: "/cover-images/8.jpg",
				audioUrl: "/songs/24.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 303,
			},
		]);

		const albums = [
			{
				title: "Latest Phonks",
				artist: "Various Artists",
				imageUrl: "/albums/1.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(0, 12).map((song) => song._id),
			},
			{
				title: "Bhakti Songs",
				artist: "Hariharan and more",
				imageUrl: "/albums/2.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(12, 15).map((song) => song._id),
			},
			{
				title: "Karan Aujla for you",
				artist: "Karan Aujla",
				imageUrl: "/albums/3.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(15, 18).map((song) => song._id),
			},
			{
				title: "Love(mood)",
				artist: "Arijit Singh and more",
				imageUrl: "/albums/4.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(18, 23).map((song) => song._id),
			},
		];

		// Insert all albums
		const createdAlbums = await Album.insertMany(albums);

		// Update songs with their album references
		for (let i = 0; i < createdAlbums.length; i++) {
			const album = createdAlbums[i];
			const albumSongs = albums[i].songs;

			await Song.updateMany({ _id: { $in: albumSongs } }, { albumId: album._id });
		}

		console.log("Database seeded successfully!");
	} catch (error) {
		console.error("Error seeding database:", error);
	} finally {
		mongoose.connection.close();
	}
};

seedDatabase();