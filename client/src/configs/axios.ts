import axios from "axios";
import { store } from "../app/store/store";
import { logoutUser } from "../app/features/authSlice";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
});

// Separate instance for refresh calls — bypasses the interceptor to avoid infinite loops
const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown | null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If we get a 401/403 and haven't already retried, attempt a token refresh
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403) &&
            !originalRequest._retry
        ) {
            // If a refresh is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Use refreshApi (no interceptor) to avoid infinite loop
                await refreshApi.post("/auth/refresh_token");

                processQueue(null);

                // Retry the original request with the new tokens (set via cookies)
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);

                // Refresh failed — clear auth state and redirect to login
                store.dispatch(logoutUser());
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;