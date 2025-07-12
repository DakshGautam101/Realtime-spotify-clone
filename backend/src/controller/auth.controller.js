import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res, next) => {
	try {
		const { email, password, fullName, imageUrl } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		const user = await User.create({
			email,
			password: hashedPassword,
			fullName,
			imageUrl: imageUrl || "",
		});

		// Generate token
		const token = generateToken(user._id);

		// Remove password from response
		const userResponse = {
			_id: user._id,
			email: user.email,
			fullName: user.fullName,
			imageUrl: user.imageUrl,
			isAdmin: user.isAdmin,
		};

		res.status(201).json({
			success: true,
			token,
			user: userResponse,
		});
	} catch (error) {
		console.log("Error in register", error);
		next(error);
	}
};

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Check password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Generate token
		const token = generateToken(user._id);

		// Remove password from response
		const userResponse = {
			_id: user._id,
			email: user.email,
			fullName: user.fullName,
			imageUrl: user.imageUrl,
			isAdmin: user.isAdmin,
		};

		res.status(200).json({
			success: true,
			token,
			user: userResponse,
		});
	} catch (error) {
		console.log("Error in login", error);
		next(error);
	}
};

export const getMe = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in getMe", error);
		next(error);
	}
};