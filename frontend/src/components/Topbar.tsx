import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
	const { isAdmin } = useAuthStore();

	return (
		<header className="sticky top-0 z-10 bg-zinc-900/75 backdrop-blur-md px-6 py-4 shadow-sm">
			<div className="flex items-center justify-between">
				{/* Logo and Title */}
				<div className="flex items-center gap-2 text-white text-lg font-semibold">
					<img src="/spotify.png" alt="Spotify logo" className="size-8" />
					<span>Spotify</span>
				</div>

				{/* Right Side Controls */}
				<div className="flex items-center gap-4">
					{isAdmin && (
						<Link
							to="/admin"
							className={cn(
								buttonVariants({ variant: "default" }),
								"flex items-center gap-2"
							)}
						>
							<LayoutDashboardIcon className="size-4" />
							<span>Admin Dashboard</span>
						</Link>
					)}

					<SignedOut>
						<SignInOAuthButtons />
					</SignedOut>

					<UserButton />
				</div>
			</div>
		</header>
	);
};

export default Topbar;
