import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust this to your backend URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);