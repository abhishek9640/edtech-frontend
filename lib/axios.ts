import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Maximum number of retry attempts for failed requests
 */
const MAX_RETRIES = 3;

/**
 * Status codes that should trigger a retry
 */
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

/**
 * Calculate exponential backoff delay
 */
function getRetryDelay(retryCount: number): number {
    return Math.min(1000 * Math.pow(2, retryCount), 10000);
}

/**
 * Check if error is a network error
 */
function isNetworkError(error: AxiosError): boolean {
    return !error.response && error.code !== 'ECONNABORTED';
}

/**
 * Check if request should be retried
 */
function shouldRetry(error: AxiosError, retryCount: number): boolean {
    if (retryCount >= MAX_RETRIES) return false;

    // Retry on network errors
    if (isNetworkError(error)) return true;

    // Retry on specific status codes
    if (error.response && RETRY_STATUS_CODES.includes(error.response.status)) {
        return true;
    }

    return false;
}

// Extend the config type to include retry count
interface RetryConfig extends InternalAxiosRequestConfig {
    __retryCount?: number;
}

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 second timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // Development logging
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor with retry logic
axiosInstance.interceptors.response.use(
    (response) => {
        // Development logging
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API] Response ${response.status} from ${response.config.url}`);
        }
        return response;
    },
    async (error: AxiosError) => {
        const config = error.config as RetryConfig | undefined;

        if (!config) {
            return Promise.reject(error);
        }

        // Initialize retry count
        config.__retryCount = config.__retryCount ?? 0;

        // Check if we should retry
        if (shouldRetry(error, config.__retryCount)) {
            config.__retryCount += 1;

            const delay = getRetryDelay(config.__retryCount);

            if (process.env.NODE_ENV === 'development') {
                console.log(`[API] Retrying request (${config.__retryCount}/${MAX_RETRIES}) after ${delay}ms`);
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));

            return axiosInstance(config);
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                const hadToken = localStorage.getItem('accessToken');
                localStorage.removeItem('accessToken');

                // Only redirect if we had a token (session expired)
                if (hadToken) {
                    window.location.href = '/login';
                }
            }
        }

        // Log errors in development
        if (process.env.NODE_ENV === 'development') {
            console.error('[API] Request failed:', {
                url: config.url,
                status: error.response?.status,
                message: error.message,
            });
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;

/**
 * Type-safe error message extractor
 */
export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        // API error response
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === 'string') {
            return apiMessage;
        }

        // Network error
        if (isNetworkError(error)) {
            return 'Network error. Please check your connection.';
        }

        // Timeout
        if (error.code === 'ECONNABORTED') {
            return 'Request timed out. Please try again.';
        }

        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred.';
}
