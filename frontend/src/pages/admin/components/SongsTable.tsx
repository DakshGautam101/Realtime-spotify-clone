import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore.ts";
import { Calendar, Trash2 } from "lucide-react";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useState } from "react";

const SongsTable = () => {
	const { songs, isLoading, error, deleteSong } = useMusicStore();
	const [confirmId, setConfirmId] = useState<string | null>(null);

	const handleDelete = async (id: string) => {
		try {
			await deleteSong(id);
			toast.success("Song deleted");
		} catch {
			toast.error("Failed to delete song");
		} finally {
			setConfirmId(null);
		}
	};

	if (isLoading) {
		return <TableSkeleton rows={5} cols={5} />;
	}

	if (error) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-red-400'>{error}</div>
			</div>
		);
	}

	return (
		<div className="max-h-[400px] overflow-auto w-full">
			<Table>
				<TableHeader>
					<TableRow className='hover:bg-zinc-800/50'>
						<TableHead className='w-[50px]'></TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Artist</TableHead>
						<TableHead>Release Date</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{songs.map((song) => (
						<TableRow key={song._id} className='hover:bg-zinc-800/50'>
							<TableCell>
								<img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover' />
							</TableCell>
							<TableCell className='font-medium'>{song.title}</TableCell>
							<TableCell>{song.artist}</TableCell>
							<TableCell>
								<span className='inline-flex items-center gap-1 text-zinc-400'>
									<Calendar className='h-4 w-4' />
									{song.createdAt.split("T")[0]}
								</span>
							</TableCell>

							<TableCell className='text-right'>
								<div className='flex gap-2 justify-end'>
									<Button
										variant={"ghost"}
										size={"sm"}
										className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
										onClick={() => setConfirmId(song._id)}
									>
										<Trash2 className='size-4' />
									</Button>
								</div>
								<Dialog open={confirmId === song._id} onOpenChange={() => setConfirmId(null)}>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Delete Song</DialogTitle>
										</DialogHeader>
										<p>Are you sure you want to delete this song?</p>
										<DialogFooter>
											<Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
											<Button variant="destructive" onClick={() => handleDelete(song._id)}>Delete</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
export default SongsTable;