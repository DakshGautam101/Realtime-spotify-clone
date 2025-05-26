import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore.ts";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	return (
		<motion.div
			initial={{ x: -50, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className='h-full flex flex-col gap-2'
		>
			{/* Navigation */}
			<div className='rounded-lg bg-zinc-900 p-4'>
				<div className='space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className:
									"w-full justify-start text-white hover:bg-zinc-800 transition-all duration-200",
							})
						)}
					>
						<HomeIcon className='mr-2 size-5' />
						<span className='hidden md:inline'>Home</span>
					</Link>

					<SignedIn>
						<Link
							to={"/chat"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className:
										"w-full justify-start text-white hover:bg-zinc-800 transition-all duration-200",
								})
							)}
						>
							<MessageCircle className='mr-2 size-5' />
							<span className='hidden md:inline'>Messages</span>
						</Link>
					</SignedIn>
				</div>
			</div>

			{/* Playlist Library */}
			<div className='flex-1 rounded-lg bg-zinc-900 p-4'>
				<div className='flex items-center mb-4 text-white px-2'>
					<Library className='size-5 mr-2' />
					<span className='hidden md:inline font-bold'>Playlists</span>
				</div>

				<ScrollArea className='h-[calc(100vh-300px)]'>
					<div className='space-y-2'>
						{isLoading ? (
							<PlaylistSkeleton />
						) : (
							albums.map((album) => (
								<motion.div
									key={album._id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2, delay: 0.05 }}
								>
									<Link
										to={`/albums/${album._id}`}
										className='p-2 hover:bg-zinc-800 transition-colors duration-200 rounded-md flex items-center gap-3 group cursor-pointer'
									>
										<img
											src={album.imageUrl}
											alt='Playlist'
											className='size-12 rounded-md flex-shrink-0 object-cover'
										/>
										<div className='flex-1 min-w-0 hidden md:block'>
											<p className='font-medium truncate'>{album.title}</p>
											<p className='text-sm text-zinc-400 truncate'>
												Album • {album.artist}
											</p>
										</div>
									</Link>
								</motion.div>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</motion.div>
	);
};

export default LeftSidebar;
