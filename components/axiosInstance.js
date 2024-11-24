import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

const getAuthToken = () => {
  // Check if window is defined (browser environment)
  if (typeof window !== "undefined") {
    return localStorage.getItem('after_school_t');
  }
  return null;
}

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAuthToken();

    // If token is present, add it to request's Authorization Header
    if (accessToken) {
      if (config.headers) config.headers.authorization = accessToken;
    }
    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Modify the response data here
    return response;
  },
  (error) => {
    // Handle response errors here
    return Promise.reject(error);
  }
);

export default axiosInstance;
