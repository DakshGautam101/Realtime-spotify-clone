import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Send, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [error, setError] = useState("");
	const { user } = useAuthStore();
	const { selectedUser, sendMessage, startTyping, stopTyping } = useChatStore();
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleSend = async () => {
		if (!selectedUser || !user || !newMessage.trim()) return;
		
		setIsSending(true);
		setError("");
		
		try {
			await sendMessage(selectedUser._id, user._id, newMessage.trim());
			setNewMessage("");
			// Stop typing indicator
			stopTyping(selectedUser._id, user._id);
		} catch (e) {
			setError("Failed to send message. Please try again.");
		} finally {
			setIsSending(false);
		}
	};

	const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewMessage(e.target.value);
		
		if (!selectedUser || !user) return;

		// Emit typing indicator
		startTyping(selectedUser._id, user._id);

		// Clear existing timeout
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// Set timeout to stop typing indicator
		typingTimeoutRef.current = setTimeout(() => {
			stopTyping(selectedUser._id, user._id);
		}, 1000);
	};

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, []);

	return (
		<div className='p-4 mt-auto border-t border-zinc-800'>
			<div className='flex gap-2'>
				<Input
					placeholder='Type a message'
					value={newMessage}
					onChange={handleTyping}
					className='bg-zinc-800 border-none'
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
					disabled={isSending}
				/>

				<Button size={"icon"} onClick={handleSend} disabled={!newMessage.trim() || isSending}>
					{isSending ? <Loader2 className='size-4 animate-spin' /> : <Send className='size-4' />}
				</Button>
			</div>
			{error && <div className='text-red-400 text-xs mt-2'>{error}</div>}
		</div>
	);
};
export default MessageInput;