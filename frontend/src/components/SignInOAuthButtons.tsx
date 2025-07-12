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
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const { login, register, isLoading } = useAuthStore();

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImageFile(file);
		setUploading(true);
		setUploadProgress(0);
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", 'ml_default'); // Replace with your preset

			const res = await axios.post(
				"https://api.cloudinary.com/v1_1/dlpzs4eyw/image/upload", // Replace with your cloud name
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
		<Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
			<CardHeader>
				<CardTitle className="text-zinc-100 text-center">
					{isLogin ? "Sign In" : "Create Account"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{!isLogin && (
						<Input
							type="text"
							placeholder="Full Name"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							required={!isLogin}
							className="bg-zinc-800 border-zinc-700 text-zinc-100"
						/>
					)}
					<Input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="bg-zinc-800 border-zinc-700 text-zinc-100"
					/>
					<Input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="bg-zinc-800 border-zinc-700 text-zinc-100"
					/>
					{!isLogin && (
						<div className="space-y-2">
							<label className="block text-zinc-400 text-sm">Profile Photo</label>
							<Input
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="bg-zinc-800 border-zinc-700 text-zinc-100"
							/>
							{uploading && (
								<div className="text-xs text-zinc-400">Uploading: {uploadProgress}%</div>
							)}
							{imageUrl && (
								<div className="flex items-center gap-2 mt-2">
									<img src={imageUrl} alt="Profile Preview" className="w-12 h-12 rounded-full object-cover border border-zinc-700" />
									<span className="text-xs text-zinc-400">Preview</span>
								</div>
							)}
						</div>
					)}
					<Button 
						type="submit" 
						className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
						disabled={isLoading || uploading}
					>
						{isLoading ? "Loading..." : (isLogin ? "Sign In" : "Sign Up")}
					</Button>
				</form>
				<div className="mt-4 text-center">
					<button
						onClick={() => setIsLogin(!isLogin)}
						className="text-zinc-400 hover:text-zinc-200 text-sm"
					>
						{isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
					</button>
				</div>
			</CardContent>
		</Card>
	);
};

export default SignInForm;