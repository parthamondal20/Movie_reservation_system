import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If we get a 401/403 and haven't already retried, attempt a token refresh
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 404) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // Call the refresh token endpoint — cookies are sent automatically
                const res = await api.post("/auth/refresh_token");
                console.log(res);

                // Retry the original request with the new tokens (set via cookies)
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh also failed — redirect to login
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;