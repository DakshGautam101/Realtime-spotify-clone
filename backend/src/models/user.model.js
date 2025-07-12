import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			default: "",
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		banned: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true } //  createdAt, updatedAt
);

export const User = mongoose.model("User", userSchema);
