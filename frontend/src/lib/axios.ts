import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:5000/api" // your local backend during dev
    : "https://realtime-spotify-clone-w2xn.onrender.com/api", // your live backend
});
