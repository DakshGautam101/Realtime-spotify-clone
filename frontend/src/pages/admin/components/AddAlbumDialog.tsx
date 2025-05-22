import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const AddAlbumDialog = () => {
	const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [newAlbum, setNewAlbum] = useState({
		title: "",
		artist: "",
		releaseYear: new Date().getFullYear(),
	});

	const [imageFile, setImageFile] = useState<File | null>(null);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
		}
	};

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!imageFile) {
				return toast.error("Please upload an image");
			}

			const formData = new FormData();
			formData.append("title", newAlbum.title);
			formData.append("artist", newAlbum.artist);
			formData.append("releaseYear", newAlbum.releaseYear.toString());
			formData.append("imageFile", imageFile);

			await axiosInstance.post("/admin/albums", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setNewAlbum({
				title: "",
				artist: "",
				releaseYear: new Date().getFullYear(),
			});
			setImageFile(null);
			setAlbumDialogOpen(false);
			toast.success("Album created successfully");
		} catch (error: any) {
			toast.error("Failed to create album: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
			<DialogTrigger asChild>
				<Button className='bg-violet-500 hover:bg-violet-600 text-white'>
					<Plus className='mr-2 h-4 w-4' />
					Add Album
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-[#121212] border border-[#1DB954] rounded-lg shadow-lg">
				<DialogHeader>
					<DialogTitle className="text-white text-xl font-bold">Add New Album</DialogTitle>
					<DialogDescription className="text-[#b3b3b3] mt-1">
						Add a new album to your collection
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleImageSelect}
						accept="image/*"
						className="hidden"
					/>
					<div
						className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#1DB954] rounded-lg cursor-pointer hover:bg-[#1DB95422] transition-colors duration-300"
						onClick={() => fileInputRef.current?.click()}
					>
						<div className="p-3 bg-[#1DB954] rounded-full inline-block mb-2">
							<Upload className="h-6 w-6 text-black" />
						</div>
						<div className="text-sm text-[#b3b3b3] mb-2 truncate max-w-xs text-center">
							{imageFile ? imageFile.name : "Upload album artwork"}
						</div>
						<Button variant="outline" size="sm" className="text-xs border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954] hover:text-black transition-colors duration-300">
							Choose File
						</Button>
					</div>

					{/* Inputs */}
					{["title", "artist", "releaseYear"].map((field) => {
						const label = field === "releaseYear" ? "Release Year" : field === "title" ? "Album Title" : "Artist";
						return (
							<div className="space-y-1" key={field}>
								<label className="text-sm font-semibold text-white">{label}</label>
								<Input
									type={field === "releaseYear" ? "number" : "text"}
									value={newAlbum[field as keyof typeof newAlbum]}
									onChange={(e) =>
										setNewAlbum({
											...newAlbum,
											[field]:
												field === "releaseYear"
													? parseInt(e.target.value)
													: e.target.value,
										})
									}
									placeholder={`Enter ${label.toLowerCase()}`}
									min={field === "releaseYear" ? 1900 : undefined}
									max={field === "releaseYear" ? new Date().getFullYear() : undefined}
									className="bg-[#181818] border border-[#1DB954] text-white placeholder-[#b3b3b3] focus:border-[#1DB954] focus:ring-[#1DB954]"
								/>
							</div>
						);
					})}
				</div>

				<DialogFooter className="flex justify-end space-x-3 pt-4">
					<Button
						variant="outline"
						onClick={() => setAlbumDialogOpen(false)}
						disabled={isLoading}
						className="border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954] hover:text-black transition-colors duration-300"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isLoading || !imageFile || !newAlbum.title || !newAlbum.artist}
						className="bg-[#1DB954] hover:bg-[#17a94a] text-black font-semibold transition-colors duration-300"
					>
						{isLoading ? "Creating..." : "Add Album"}
					</Button>
				</DialogFooter>
			</DialogContent>

		</Dialog>
	);
};
export default AddAlbumDialog;