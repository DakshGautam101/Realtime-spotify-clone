import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore.ts";
import { Calendar, Music, Trash2 } from "lucide-react";
import { useEffect } from "react";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useState } from "react";

const AlbumsTable = () => {
	const { albums, deleteAlbum, fetchAlbums, isLoading, error } = useMusicStore();
	const [confirmId, setConfirmId] = useState<string | null>(null);

	const handleDelete = async (id: string) => {
		try {
			await deleteAlbum(id);
			toast.success("Album deleted");
		} catch {
			console.error(error);
			toast.error("Failed to delete album");
		} finally {
			setConfirmId(null);
		}
	};

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	if (isLoading) {
		return <TableSkeleton rows={5} cols={6} />;
	}

	return (
		<div className="max-h-[400px] overflow-auto w-full">
			<Table>
				<TableHeader>
					<TableRow className='hover:bg-zinc-800/50'>
						<TableHead className='w-[50px]'></TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Artist</TableHead>
						<TableHead>Release Year</TableHead>
						<TableHead>Songs</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{albums.map((album) => (
						<TableRow key={album._id} className='hover:bg-zinc-800/50'>
							<TableCell>
								<img src={album.imageUrl} alt={album.title} className='w-10 h-10 rounded object-cover' />
							</TableCell>
							<TableCell className='font-medium'>{album.title}</TableCell>
							<TableCell>{album.artist}</TableCell>
							<TableCell>
								<span className='inline-flex items-center gap-1 text-zinc-400'>
									<Calendar className='h-4 w-4' />
									{album.releaseYear}
								</span>
							</TableCell>
							<TableCell>
								<span className='inline-flex items-center gap-1 text-zinc-400'>
									<Music className='h-4 w-4' />
									{album.songs.length} songs
								</span>
							</TableCell>
							<TableCell className='text-right'>
								<div className='flex gap-2 justify-end'>
									<Button
										variant='ghost'
										size='sm'
										onClick={() => setConfirmId(album._id)}
										className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								</div>
								<Dialog open={confirmId === album._id} onOpenChange={() => setConfirmId(null)}>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Delete Album</DialogTitle>
										</DialogHeader>
										<p>Are you sure you want to delete this album?</p>
										<DialogFooter>
											<Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
											<Button variant="destructive" onClick={() => handleDelete(album._id)}>Delete</Button>
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
export default AlbumsTable;