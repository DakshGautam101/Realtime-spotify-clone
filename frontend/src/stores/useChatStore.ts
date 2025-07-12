import { axiosInstance } from "@/lib/axios";
import type { Message, User } from "@/types";
import { create } from "zustand";
import { socket } from "@/lib/socket";
import toast from "react-hot-toast";

interface ChatStore {
	users: User[];
	isLoading: boolean;
	error: string | null;
	socket: any;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;
	typingUsers: Set<string>;
	unreadCounts: Map<string, number>;

	fetchUsers: () => Promise<void>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string) => Promise<void>;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
	addMessage: (message: Message) => void;
	startTyping: (receiverId: string, senderId: string) => void;
	stopTyping: (receiverId: string, senderId: string) => void;
	markMessageAsRead: (messageId: string, readerId: string) => void;
	markConversationAsRead: (userId: string) => void;
}

const baseURL = import.meta.env.MODE === "development"
  ? "http://localhost:5000"
  : "https://realtime-spotify-clone-w2xn.onrender.com";

export const useChatStore = create<ChatStore>((set, get) => ({
	users: [],
	isLoading: false,
	error: null,
	socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,
	typingUsers: new Set(),
	unreadCounts: new Map(),

	setSelectedUser: (user) => {
		set({ selectedUser: user });
		if (user) {
			get().markConversationAsRead(user._id);
		}
	},

	fetchUsers: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/users");
			set({ users: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to fetch users" });
			toast.error("Failed to fetch users");
		} finally {
			set({ isLoading: false });
		}
	},

	initSocket: (userId) => {
		if (!get().isConnected) {
			socket.auth = { userId };
			socket.connect();

			socket.emit("user_connected", userId);

			socket.on("users_online", (users: string[]) => {
				set({ onlineUsers: new Set(users) });
			});

			socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

			socket.on("receive_message", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
				
				// Show notification if chat is not focused or different user
				const { selectedUser } = get();
				if (!selectedUser || selectedUser._id !== message.senderId) {
					const sender = get().users.find(u => u._id === message.senderId);
					if (sender) {
						toast.success(`New message from ${sender.fullName}`, {
							duration: 4000,
							icon: '💬',
						});
					}
					
					// Update unread count
					set((state) => {
						const newUnreadCounts = new Map(state.unreadCounts);
						const currentCount = newUnreadCounts.get(message.senderId) || 0;
						newUnreadCounts.set(message.senderId, currentCount + 1);
						return { unreadCounts: newUnreadCounts };
					});
				}
			});

			socket.on("message_sent", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("message_error", (error: string) => {
				toast.error(error);
			});

			socket.on("typing", ({ senderId }) => {
				set((state) => ({
					typingUsers: new Set([...state.typingUsers, senderId]),
				}));
			});

			socket.on("stop_typing", ({ senderId }) => {
				set((state) => {
					const newTypingUsers = new Set(state.typingUsers);
					newTypingUsers.delete(senderId);
					return { typingUsers: newTypingUsers };
				});
			});

			socket.on("message_read", ({ messageId, readerId }) => {
				set((state) => ({
					messages: state.messages.map(msg => 
						msg._id === messageId ? { ...msg, read: true } : msg
					),
				}));
			});

			socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			set({ isConnected: true });
		}
	},

	disconnectSocket: () => {
		if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

	sendMessage: async (receiverId: string, senderId: string, content: string) => {
		try {
			socket.emit("send_message", { senderId, receiverId, content });
		} catch (error) {
			console.error('Error sending message:', error);
			toast.error("Failed to send message");
			throw error;
		}
	},

	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/users/messages/${userId}`);
			set({ messages: response.data, isLoading: false });
			
			// Mark messages as read when fetched
			get().markConversationAsRead(userId);
		} catch (error: any) {
			set({ error: error.response?.data?.message || 'Failed to fetch messages', isLoading: false });
			toast.error("Failed to fetch messages");
		}
	},

	addMessage: (message) => {
		set((state) => ({
			messages: [...state.messages, message]
		}));
	},

	startTyping: (receiverId: string, senderId: string) => {
		socket.emit("typing", { senderId, receiverId });
	},

	stopTyping: (receiverId: string, senderId: string) => {
		socket.emit("stop_typing", { senderId, receiverId });
	},

	markMessageAsRead: (messageId: string, readerId: string) => {
		socket.emit("message_read", { messageId, readerId });
	},

	markConversationAsRead: (userId: string) => {
		// Mark all unread messages from this user as read
		set((state) => {
			const updatedMessages = state.messages.map(msg => 
				msg.senderId === userId && !msg.read ? { ...msg, read: true } : msg
			);
			
			// Clear unread count for this user
			const newUnreadCounts = new Map(state.unreadCounts);
			newUnreadCounts.delete(userId);
			
			return { 
				messages: updatedMessages,
				unreadCounts: newUnreadCounts
			};
		});
	},
}));