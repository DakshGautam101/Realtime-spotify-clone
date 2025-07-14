import { LayoutDashboardIcon, LogOut, User } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import SignInForm from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useState } from "react";

const Topbar = () => {
	const { user, isAuthenticated,  logout } = useAuthStore();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const isAdmin = user?.isAdmin;

	const handleLogout = () => {
		logout();
	};

	if (!isAuthenticated) {
		return <Navigate to="/auth" replace />;
	}

	return (
		<header className="sticky top-0 z-10 bg-zinc-900/75 backdrop-blur-md px-3 sm:px-6 py-3 sm:py-4 shadow-sm">
			<div className="flex items-center justify-between w-full">
				{/* Logo and Title */}
				<div className="flex items-center gap-2 text-white text-base sm:text-lg font-semibold">
					<img src="/spotify.png" alt="Spotify logo" className="size-6 sm:size-8" />
					<span className="hidden xs:inline">Spotify</span>
				</div>

				{/* Right Side Controls */}
				<div className="flex items-center gap-2 sm:gap-4">
					{/* Mobile menu button */}
					<div className="sm:hidden">
						<DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="text-white">
									<Menu className="size-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
								{isAdmin && (
									<DropdownMenuItem asChild>
										<Link to="/admin" className="flex items-center gap-2">
											<LayoutDashboardIcon className="size-4" />
											<span>Admin Dashboard</span>
										</Link>
									</DropdownMenuItem>
								)}
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

					{/* Desktop controls */}
					{isAdmin && (
						<Link
							to="/admin"
							className={cn(
								buttonVariants({ variant: "default" }),
								"hidden sm:flex items-center gap-2 text-sm"
							)}
						>
							<LayoutDashboardIcon className="size-4" />
							<span className="hidden md:inline">Admin Dashboard</span>
							<span className="md:hidden">Admin</span>
						</Link>
					)}

					{!isAuthenticated ? (
						<SignInForm />
					) : (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="hidden sm:flex items-center gap-2 p-2 rounded-full hover:bg-zinc-800 transition-colors">
									<Avatar className="size-6 sm:size-8">
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
					)}
				</div>
			</div>
		</header>
	);
};

export default Topbar;
