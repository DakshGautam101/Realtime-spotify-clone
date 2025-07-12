import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-hot-toast";
import axios from "axios";

const SignInForm = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const { login, register, isLoading } = useAuthStore();

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		setUploadProgress(0);

		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", "ml_default");

			const res = await axios.post(
				"https://api.cloudinary.com/v1_1/dlpzs4eyw/image/upload",
				formData,
				{
					onUploadProgress: (progressEvent) => {
						const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
						setUploadProgress(percent);
					},
				}
			);
			setImageUrl(res.data.secure_url);
			toast.success("Image uploaded!");
		} catch (error) {
			toast.error("Image upload failed");
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (isLogin) {
				await login(email, password);
				toast.success("Logged in successfully!");
			} else {
				await register(email, password, fullName, imageUrl);
				toast.success("Registered successfully!");
			}
		} catch (error: any) {
			toast.error(error.message || "Authentication failed");
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto bg-zinc-900 border border-zinc-800 shadow-xl rounded-2xl">
			<CardHeader>
				<CardTitle className="text-center text-zinc-100 text-2xl font-semibold tracking-tight">
					{isLogin ? "Welcome Back 👋" : "Create Your Account"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-5">
					{!isLogin && (
						<Input
							type="text"
							placeholder="Full Name"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							required
							className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 transition"
						/>
					)}
					<Input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 transition"
					/>
					<Input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 transition"
					/>
					{!isLogin && (
						<div>
							<label className="block text-sm text-zinc-400 mb-1">Profile Photo</label>
							<Input
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="bg-zinc-800 border-zinc-700 text-zinc-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 transition"
							/>
							{uploading && (
								<p className="text-xs text-emerald-400 mt-2">Uploading: {uploadProgress}%</p>
							)}
							{imageUrl && (
								<div className="flex items-center gap-3 mt-3">
									<img
										src={imageUrl}
										alt="Preview"
										className="w-12 h-12 rounded-full object-cover border border-zinc-700"
									/>
									<p className="text-sm text-zinc-300">Preview</p>
								</div>
							)}
						</div>
					)}
					<Button
						type="submit"
						disabled={isLoading || uploading}
						className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition"
					>
						{isLoading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
					</Button>
				</form>
				<div className="mt-5 text-center">
					<button
						type="button"
						onClick={() => setIsLogin(!isLogin)}
						className="text-sm text-zinc-400 hover:text-zinc-200 transition"
					>
						{isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
					</button>
				</div>
			</CardContent>
		</Card>
	);
};

export default SignInForm;
