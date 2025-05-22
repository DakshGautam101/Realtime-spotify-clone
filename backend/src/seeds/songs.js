import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songs = [
	{
		title: "Aizen's Theme",
		artist: "Shiru SAGISU",
		imageUrl: "/cover-images/13.png",
		audioUrl: "/songs/1.mp3",
		duration: 202,
	},
	{
		title: "Akaza's Theme",
		artist: "Ashif N",
		imageUrl: "/cover-images/12.jpg",
		audioUrl: "/songs/2.mp3",
		duration: 180,
	},
	{
		title: "Kyoka Suigetsu",
		artist: "DXXWTHWXSH",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/3.mp3",
		duration: 143,
	},
	{
		title: "Blue Bird(from 'Naruto Shippuden'",
		artist: "Akano",
		imageUrl: "/cover-images/10.jpg",
		audioUrl: "/songs/4.mp3",
		duration: 100,
	},
	{
		title: "Dark Aria from Solo Levelling",
		artist: "XAI",
		imageUrl: "/cover-images/9.jpg",
		audioUrl: "/songs/5.mp3",
		duration: 142,
	},
	{
		title: "Tanjiro Theme",
		artist: "Akano",
		imageUrl: "/cover-images/14.jpg",
		audioUrl: "/songs/6.mp3",
		duration: 147,
	},
	{
		title: "Theme of L",
		artist: "Guiteristta de atena",
		imageUrl: "/cover-images/31.jpg",
		audioUrl: "/songs/7.mp3",
		duration: 180,
	},
	{
		title: "L's Theme",
		artist: "Animelmack",
		imageUrl: "/cover-images/15.jpg",
		audioUrl: "/songs/8.mp3",
		duration: 179,
	},
	{
		title: "Number One",
		artist: "Shiro SAGISU",
		imageUrl: "/cover-images/23.png",
		audioUrl: "/songs/9.mp3",
		duration: 286,
	},
	{
		title: "On the Precipiece of defeat",
		artist: "Shiro SAGISU",
		imageUrl: "/cover-images/30.jpeg",
		audioUrl: "/songs/10.mp3",
		duration: 177,
	},
	{
		title: "SL-Ending theme",
		artist: "TK",
		imageUrl: "/cover-images/26.png",
		audioUrl: "/songs/11.mp3",
		duration: 262,
	},
	{
		title: "SL-Opening",
		artist: "LiSa",
		imageUrl: "/cover-images/22.png",
		audioUrl: "/songs/12.mp3",
		duration: 183,
	},
	{
		title: "Babam Bam",
		artist: "Paradox",
		imageUrl: "/cover-images/17.jpg",
		audioUrl: "/songs/13.mp3",
		duration: 146,
	},
	{
		title: "Bam Lahiri",
		artist: "Kailash Kher",
		imageUrl: "/cover-images/21.png",
		audioUrl: "/songs/14.mp3",
		duration: 317,
	},
	{
		title: "Shiv Tandav Strotram",
		artist: "Shankar Mahadevan",
		imageUrl: "/cover-images/20.png",
		audioUrl: "/songs/16.mp3",
		duration: 563,
	},
	{
		title: "Softly",
		artist: "Karan Aujla",
		imageUrl: "/cover-images/3.jpg",
		audioUrl: "/songs/17.mp3",
		duration: 154,
	},
	{
		title: "Wavy",
		artist: "Karan Aujla",
		imageUrl: "/cover-images/18.png",
		audioUrl: "/songs/18.mp3",
		duration: 160,
	},
	{
		title: "Winning Speech",
		artist: "Karan Aujla",
		imageUrl: "/cover-images/19.png",
		audioUrl: "/songs/19.mp3",
		duration: 225,
	},
	{
		title: "Bekhayali",
		artist: "Arijit Singh(version)",
		imageUrl: "/cover-images/24.png",
		audioUrl: "/songs/20.mp3",
		duration: 180,
	},
	{
		title: "Isq Risk",
		artist: "Sohail Sen",
		imageUrl: "/cover-images/27.jpg",
		audioUrl: "/songs/21.mp3",
		duration: 294,
	},
	{
		title: "Pal",
		artist: "Arijit Singh",
		imageUrl: "/cover-images/4.jpg",
		audioUrl: "/songs/22.mp3",
		duration: 247,
	},
	{
		title: "Pal Pal Dil k Paas",
		artist: "Arijit Singh",
		imageUrl: "/cover-images/28.jpg",
		audioUrl: "/songs/23.mp3",
		duration: 254,
	},
	{
		title: "Bol Na Halke Halke",
		artist: "Shankar",
		imageUrl: "/cover-images/8.jpg",
		audioUrl: "/songs/24.mp3",
		duration: 303,
	},
];

const seedSongs = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		// Clear existing songs
		await Song.deleteMany({});

		// Insert new songs
		await Song.insertMany(songs);

		console.log("Songs seeded successfully!");
	} catch (error) {
		console.error("Error seeding songs:", error);
	} finally {
		mongoose.connection.close();
	}
};

seedSongs();
