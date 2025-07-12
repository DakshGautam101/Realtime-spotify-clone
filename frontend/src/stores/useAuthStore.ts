import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface User {
	_id: string;
	email: string;
	fullName: string;
	imageUrl: string;
	isAdmin: boolean;
}

interface AuthStore {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	error: string | null;
	isAuthenticated: boolean;

	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, fullName: string, imageUrl?: string) => Promise<void>;
	logout: () => void;
	checkAuth: () => Promise<void>;
	reset: () => void;
}

const getStoredToken = () => {
	return localStorage.getItem("token");
};

const setStoredToken = (token: string | null) => {
	if (token) {
		localStorage.setItem("token", token);
	} else {
		localStorage.removeItem("token");
	}
};

const updateAxiosToken = (token: string | null) => {
	if (token) {
		axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		delete axiosInstance.defaults.headers.common["Authorization"];
	}
};

export const useAuthStore = create<AuthStore>((set, get) => ({
	user: null,
	token: getStoredToken(),
	isLoading: false,
	error: null,
	isAuthenticated: false,

	login: async (email: string, password: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.post("/auth/login", { email, password });
			const { token, user } = response.data;
			
			setStoredToken(token);
			updateAxiosToken(token);
			
			set({ 
				user, 
				token, 
				isAuthenticated: true, 
				isLoading: false 
			});
		} catch (error: any) {
			set({ 
				error: error.response?.data?.message || "Login failed", 
				isLoading: false 
			});
			throw error;
		}
	},

	register: async (email: string, password: string, fullName: string, imageUrl?: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.post("/auth/register", { 
				email, 
				password, 
				fullName, 
				imageUrl 
			});
			const { token, user } = response.data;
			
			setStoredToken(token);
			updateAxiosToken(token);
			
			set({ 
				user, 
				token, 
				isAuthenticated: true, 
				isLoading: false 
			});
		} catch (error: any) {
			set({ 
				error: error.response?.data?.message || "Registration failed", 
				isLoading: false 
			});
			throw error;
		}
	},

	logout: () => {
		setStoredToken(null);
		updateAxiosToken(null);
		set({ 
			user: null, 
			token: null, 
			isAuthenticated: false, 
			error: null 
		});
	},

	checkAuth: async () => {
		const token = get().token;
		if (!token) {
			set({ isAuthenticated: false });
			return;
		}

		try {
			// Check if token is expired
			const decoded = jwtDecode(token);
			const currentTime = Date.now() / 1000;
			
			if (decoded.exp && decoded.exp < currentTime) {
				get().logout();
				return;
			}

			updateAxiosToken(token);
			
			// Verify token with backend
			const response = await axiosInstance.get("/auth/me");
			set({ 
				user: response.data.user, 
				isAuthenticated: true 
			});
		} catch (error: any) {
			get().logout();
		}
	},

	reset: () => {
		set({ 
			user: null, 
			token: null, 
			isAuthenticated: false, 
			isLoading: false, 
			error: null 
		});
	},
}));