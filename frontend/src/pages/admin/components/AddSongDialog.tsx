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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore.ts";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface NewSong {
	title: string;
	artist: string;
	album: string;
	duration: string;
}

const AddSongDialog = () => {
	const { albums } = useMusicStore();
	const [songDialogOpen, setSongDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [newSong, setNewSong] = useState<NewSong>({
		title: "",
		artist: "",
		album: "",
		duration: "0",
	});

	const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
		audio: null,
		image: null,
	});

	const audioInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!files.audio || !files.image) {
				return toast.error("Please upload both audio and image files");
			}

			const formData = new FormData();

			formData.append("title", newSong.title);
			formData.append("artist", newSong.artist);
			formData.append("duration", newSong.duration);
			if (newSong.album && newSong.album !== "none") {
				formData.append("albumId", newSong.album);
			}

			formData.append("audioFile", files.audio);
			formData.append("imageFile", files.image);

			await axiosInstance.post("/admin/songs", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setNewSong({
				title: "",
				artist: "",
				album: "",
				duration: "0",
			});

			setFiles({
				audio: null,
				image: null,
			});
			toast.success("Song added successfully");
		} catch (error: any) {
			toast.error("Failed to add song: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
			<DialogTrigger asChild>
				<Button className='bg-emerald-500 hover:bg-emerald-600 text-black'>
					<Plus className='mr-2 h-4 w-4' />
					Add Song
				</Button>
			</DialogTrigger>

			<DialogContent className="bg-[#121212] border border-[#1DB954] rounded-lg shadow-lg max-h-[80vh] overflow-auto scrollbar-thin scrollbar-thumb-[#1DB954] scrollbar-track-[#181818]">
				<DialogHeader>
					<DialogTitle className="text-white text-xl font-bold">Add New Song</DialogTitle>
					<DialogDescription className="text-[#b3b3b3] mt-1">
						Add a new song to your music library
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					<input
						type="file"
						accept="audio/*"
						ref={audioInputRef}
						hidden
						onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))}
					/>

					<input
						type="file"
						ref={imageInputRef}
						className="hidden"
						accept="image/*"
						onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
					/>

					{/* Image Upload */}
					<div
						className="flex items-center justify-center p-6 border-2 border-dashed border-[#1DB954] rounded-lg cursor-pointer hover:bg-[#1DB95422] transition-colors duration-300"
						onClick={() => imageInputRef.current?.click()}
					>
						<div className="text-center">
							{files.image ? (
								<div className="space-y-2">
									<div className="text-sm text-[#1DB954]">Image selected:</div>
									<div className="text-xs text-[#b3b3b3] truncate max-w-xs">{files.image.name}</div>
								</div>
							) : (
								<>
									<div className="p-3 bg-[#181818] rounded-full inline-block mb-2">
										<Upload className="h-6 w-6 text-[#b3b3b3]" />
									</div>
									<div className="text-sm text-[#b3b3b3] mb-2">Upload artwork</div>
									<Button
										variant="outline"
										size="sm"
										className="text-xs border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954] hover:text-black transition-colors duration-300"
									>
										Choose File
									</Button>
								</>
							)}
						</div>
					</div>

					{/* Audio Upload */}
					<div className="space-y-2">
						<label className="text-sm font-semibold text-white">Audio File</label>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								onClick={() => audioInputRef.current?.click()}
								className="w-full border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954] hover:text-black transition-colors duration-300"
							>
								{files.audio ? files.audio.name : "Choose Audio File"}
							</Button>
						</div>
					</div>

					{/* Other fields */}
					{[
						{ label: "Title", key: "title", type: "text" },
						{ label: "Artist", key: "artist", type: "text" },
						{ label: "Duration (seconds)", key: "duration", type: "number", min: 0 },
					].map(({ label, key, type, min }) => (
						<div className="space-y-1" key={key}>
							<label className="text-sm font-semibold text-white">{label}</label>
							<Input
								type={type}
								min={min}
								value={newSong[key as keyof NewSong]}
								onChange={(e) =>
									setNewSong({
										...newSong,
										[key]: type === "number" ? e.target.value : e.target.value,
									})
								}
								placeholder={`Enter ${label.toLowerCase()}`}
								className="bg-[#181818] border border-[#1DB954] text-white placeholder-[#b3b3b3] focus:border-[#1DB954] focus:ring-[#1DB954]"
							/>
						</div>
					))}

					{/* Album Select */}
					<div className="space-y-2">
						<label className="text-sm font-semibold text-white">Album (Optional)</label>
						<Select
							value={newSong.album}
							onValueChange={(value) => setNewSong({ ...newSong, album: value })}
						>
							<SelectTrigger className="bg-[#181818] border border-[#1DB954] text-white">
								<SelectValue placeholder="Select album" />
							</SelectTrigger>
							<SelectContent className="bg-[#181818] border border-[#1DB954] text-white">
								<SelectItem value="none" className="text-white">
									No Album (Single)
								</SelectItem>
								{albums.map((album) => (
									<SelectItem key={album._id} value={album._id} className="text-white">
										{album.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter className="flex justify-end space-x-3 pt-4">
					<Button
						variant="outline"
						onClick={() => setSongDialogOpen(false)}
						disabled={isLoading}
						className="border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954] hover:text-black transition-colors duration-300"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isLoading}
						className="bg-[#1DB954] hover:bg-[#17a94a] text-black font-semibold transition-colors duration-300"
					>
						{isLoading ? "Uploading..." : "Add Song"}
					</Button>
				</DialogFooter>
			</DialogContent>

		</Dialog>
	);
};
export default AddSongDialog;