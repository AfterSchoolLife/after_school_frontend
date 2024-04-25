import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://after-school-backend.onrender.com',
  });

const getAuthToken = () => {
    return localStorage.getItem('after_school_t');
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
 export default axiosInstance



