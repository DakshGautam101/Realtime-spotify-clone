import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header.tsx";
import DashboardStats from "./components/DashboardStats.tsx";
import { Album, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent.tsx";
import AlbumsTabContent from "./components/AlbumsTabContent.tsx";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore.ts";
import UsersTabContent from "./components/UsersTabContent";
import { Users2 } from "lucide-react";

const AdminPage = () => {
	const { user, isLoading } = useAuthStore();
	const isAdmin = user?.isAdmin;

	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
		fetchStats();
	}, [fetchAlbums, fetchSongs, fetchStats]);

	if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

	return (
		<div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 flex items-center justify-center p-2 sm:p-4 lg:p-8">
			<div className="w-full max-w-7xl bg-zinc-900/80 rounded-2xl shadow-2xl p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 border border-zinc-800">
				<Header />

				<DashboardStats />

				<Tabs defaultValue='songs' className='space-y-6'>
					<TabsList className='p-1 bg-zinc-800/70 rounded-lg flex gap-1 sm:gap-2 shadow-inner w-full sm:w-auto'>
						<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-2 sm:px-4 py-2 transition-colors hover:bg-zinc-700/60 flex-1 sm:flex-none'>
							<Music className='mr-1 sm:mr-2 size-3 sm:size-4' />
							<span className="text-xs sm:text-sm">Songs</span>
						</TabsTrigger>
						<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-2 sm:px-4 py-2 transition-colors hover:bg-zinc-700/60 flex-1 sm:flex-none'>
							<Album className='mr-1 sm:mr-2 size-3 sm:size-4' />
							<span className="text-xs sm:text-sm">Albums</span>
						</TabsTrigger>
						<TabsTrigger value='users' className='data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-2 sm:px-4 py-2 transition-colors hover:bg-zinc-700/60 flex-1 sm:flex-none'>
							<Users2 className='mr-1 sm:mr-2 size-3 sm:size-4' />
							<span className="text-xs sm:text-sm">Users</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value='songs'>
						<SongsTabContent />
					</TabsContent>
					<TabsContent value='albums'>
						<AlbumsTabContent />
					</TabsContent>
					<TabsContent value='users'>
						<UsersTabContent />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};
export default AdminPage;