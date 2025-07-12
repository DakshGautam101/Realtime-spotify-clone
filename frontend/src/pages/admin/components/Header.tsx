import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
	const { user, logout } = useAuthStore();

	const handleLogout = () => {
		logout();
	};

	return (
		<div className='flex items-center justify-between'>
			<div className='flex items-center gap-3 mb-8'>
				<Link to='/' className='rounded-lg'>
					<img src='/spotify.png' className='size-10 text-black' />
				</Link>
				<div>
					<h1 className='text-3xl font-bold'>Music Manager</h1>
					<p className='text-zinc-400 mt-1'>Manage your music catalog</p>
				</div>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="flex items-center gap-2 p-2 rounded-full hover:bg-zinc-800 transition-colors">
						<Avatar className="size-8">
							<AvatarImage src={user?.imageUrl} alt={user?.fullName} />
							<AvatarFallback>
								<User className="size-4" />
							</AvatarFallback>
						</Avatar>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
					<DropdownMenuItem className="text-zinc-300">
						<div className="flex flex-col">
							<span className="font-medium">{user?.fullName}</span>
							<span className="text-sm text-zinc-400">{user?.email}</span>
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleLogout} className="text-red-400">
						<LogOut className="mr-2 size-4" />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
export default Header;