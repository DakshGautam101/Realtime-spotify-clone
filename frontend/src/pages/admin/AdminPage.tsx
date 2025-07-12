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
		<div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 flex items-center justify-center p-4 sm:p-8">
			<div className="w-full bg-zinc-900/80 rounded-2xl shadow-2xl p-4 sm:p-8 space-y-8 border border-zinc-800">
				<Header />

				<DashboardStats />

				<Tabs defaultValue='songs' className='space-y-6'>
					<TabsList className='p-1 bg-zinc-800/70 rounded-lg flex gap-2 shadow-inner'>
						<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-4 py-2 transition-colors hover:bg-zinc-700/60'>
							<Music className='mr-2 size-4' />
							Songs
						</TabsTrigger>
						<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-4 py-2 transition-colors hover:bg-zinc-700/60'>
							<Album className='mr-2 size-4' />
							Albums
						</TabsTrigger>
						<TabsTrigger value='users' className='data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md px-4 py-2 transition-colors hover:bg-zinc-700/60'>
							<Users2 className='mr-2 size-4' />
							Users
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