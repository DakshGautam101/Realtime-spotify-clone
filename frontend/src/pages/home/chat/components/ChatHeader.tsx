import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";

const ChatHeader = () => {
	const { selectedUser, onlineUsers } = useChatStore();

	if (!selectedUser) return null;

	return (
		<div className='p-4 border-b border-zinc-800 shadow-sm bg-zinc-900/80'>
			<div className='flex items-center gap-3'>
				<Avatar>
					<AvatarImage src={selectedUser.imageUrl} />
					<AvatarFallback className='bg-green-700 text-white font-bold'>
						{selectedUser.fullName[0]}
					</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium'>{selectedUser.fullName}</h2>
					<p className='text-sm flex items-center gap-2'>
						<span className={`inline-block h-2 w-2 rounded-full ${onlineUsers.has(selectedUser._id) ? "bg-green-500" : "bg-zinc-500"}`}></span>
						<span className='text-zinc-400'>
							{onlineUsers.has(selectedUser._id) ? "Online" : "Offline"}
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};
export default ChatHeader;