import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";

const UsersList = () => {
	const { users, selectedUser, isLoading, setSelectedUser, onlineUsers, unreadCounts } = useChatStore();

	return (
		<div className='border-r border-zinc-800'>
			<div className='flex flex-col h-full'>
				<ScrollArea className='h-[calc(100vh-280px)]'>
					<div className='space-y-2 p-4'>
						{isLoading ? (
							<UsersListSkeleton />
						) : (
							users.map((user) => {
								const unreadCount = unreadCounts.get(user._id) || 0;
								const isSelected = selectedUser?._id === user._id;
								
								return (
									<div
										key={user._id}
										onClick={() => setSelectedUser(user)}
										tabIndex={0}
										onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSelectedUser(user)}
										className={`flex items-center justify-center lg:justify-start gap-3 p-3 
											rounded-lg cursor-pointer transition-all outline-none ring-0 relative
											${isSelected ? "bg-zinc-800 ring-2 ring-green-500" : "hover:bg-zinc-800/50 focus:bg-zinc-800/50"}`}
									>
										<div className='relative'>
											<Avatar className='size-8 md:size-12'>
												<AvatarImage src={user.imageUrl} />
												<AvatarFallback className='bg-green-700 text-white font-bold'>
													{user.fullName[0]}
												</AvatarFallback>
											</Avatar>
											{/* online indicator */}
											<div
												className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900 border-2 border-white
													${onlineUsers.has(user._id) ? "bg-green-500" : "bg-zinc-500"}`}
											/>
										</div>
										
										<div className='flex-1 min-w-0 lg:block hidden'>
											<div className='flex items-center justify-between'>
												<span className='font-medium truncate'>{user.fullName}</span>
												{unreadCount > 0 && (
													<span className='bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center'>
														{unreadCount > 99 ? '99+' : unreadCount}
													</span>
												)}
											</div>
										</div>
										
										{/* Unread indicator for mobile */}
										{unreadCount > 0 && (
											<div className='lg:hidden absolute top-2 right-2'>
												<span className='bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px] text-center'>
													{unreadCount > 9 ? '9+' : unreadCount}
												</span>
											</div>
										)}
									</div>
								);
							})
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default UsersList;