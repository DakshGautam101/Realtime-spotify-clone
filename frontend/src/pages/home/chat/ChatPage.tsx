import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useRef } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import MessageSkeleton from "./components/MessageSkeleton";
import { Check, CheckCheck } from "lucide-react";

const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

const ChatPage = () => {
	const { user } = useAuthStore();
	const { messages, selectedUser, fetchUsers, fetchMessages, isLoading, error, typingUsers } = useChatStore();
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser._id);
	}, [selectedUser, fetchMessages]);

	// Scroll to bottom when messages change
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const isTyping = selectedUser && typingUsers.has(selectedUser._id);

	return (
		<main className='h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden'>
			<Topbar />

			<div className='grid grid-cols-[60px_1fr] sm:grid-cols-[80px_1fr] lg:grid-cols-[300px_1fr] h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)]'>
				<UsersList />

				{/* chat message */}
				<div className='flex flex-col h-full'>
					{selectedUser ? (
						<>
							<ChatHeader />

							{/* Messages */}
							<ScrollArea className='h-[calc(100vh-280px)] sm:h-[calc(100vh-340px)]'>
								<div className='p-2 sm:p-4 space-y-2 sm:space-y-4'>
									{isLoading ? (
										<MessageSkeleton />
									) : error ? (
										<div className="text-red-400 text-center py-4">{error}</div>
									) : messages.length === 0 ? (
										<div className="text-zinc-400 text-center py-4">No messages yet. Say hi!</div>
									) : (
										messages.map((message) => {
											const isMe = message.senderId === user?._id;
											return (
												<div
													key={message._id}
													className={`flex items-end gap-1 sm:gap-2 ${isMe ? "flex-row-reverse" : ""}`}
												>
													<Avatar className='size-6 sm:size-8 border-2 border-zinc-700'>
														<AvatarImage
															src={isMe ? user.imageUrl : selectedUser.imageUrl}
														/>
													</Avatar>
													<div
														className={`rounded-2xl px-3 sm:px-4 py-2 max-w-[80%] sm:max-w-[70%] shadow-md text-xs sm:text-sm break-words
															${isMe ? "bg-green-500 text-white ml-2" : "bg-zinc-800 text-zinc-100 mr-2"}`}
													>
														{message.content}
														<div className='flex items-center justify-end gap-1 mt-1'>
															<span className='text-xs opacity-80 text-[10px] sm:text-xs'>
																{formatTime(message.createdAt)}
															</span>
															{isMe && (
																<span className='text-xs text-[10px] sm:text-xs'>
																	{message.read ? (
																		<CheckCheck className='size-2 sm:size-3 text-blue-300' />
																	) : (
																		<Check className='size-2 sm:size-3 opacity-60' />
																	)}
																</span>
															)}
														</div>
													</div>
												</div>
											);
										})
									)}
									
									{/* Typing indicator */}
									{isTyping && (
										<div className="flex items-end gap-1 sm:gap-2">
											<Avatar className='size-6 sm:size-8 border-2 border-zinc-700'>
												<AvatarImage src={selectedUser.imageUrl} />
											</Avatar>
											<div className="bg-zinc-800 rounded-2xl px-3 sm:px-4 py-2 mr-2">
												<div className="flex space-x-1">
													<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-zinc-400 rounded-full animate-bounce"></div>
													<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
													<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
												</div>
											</div>
										</div>
									)}
									
									{/* Invisible anchor to scroll into view */}
									<div ref={messagesEndRef} />
								</div>
							</ScrollArea>

							<MessageInput />
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</main>
	);
};
export default ChatPage;

const NoConversationPlaceholder = () => (
	<div className='flex flex-col items-center justify-center h-full space-y-6'>
		<img src='/spotify.png' alt='Spotify' className='size-12 sm:size-16 animate-bounce' />
		<div className='text-center'>
			<h3 className='text-zinc-300 text-base sm:text-lg font-medium mb-1'>No conversation selected</h3>
			<p className='text-zinc-500 text-xs sm:text-sm'>Choose a friend to start chatting</p>
		</div>
	</div>
);
