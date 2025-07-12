// frontend/src/lib/socket.ts
import { io } from "socket.io-client";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://realtime-spotify-clone-w2xn.onrender.com";

export const socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
});
