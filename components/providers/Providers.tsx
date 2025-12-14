'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Application providers wrapper
 * Configures React Query with optimized caching settings
 */
export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data considered fresh for 5 minutes
                        staleTime: 5 * 60 * 1000,
                        // Cache data kept for 30 minutes
                        gcTime: 30 * 60 * 1000,
                        // Don't refetch on window focus by default
                        refetchOnWindowFocus: false,
                        // Retry failed requests up to 2 times
                        retry: 2,
                        // Delay between retries
                        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                    },
                    mutations: {
                        // Retry mutations once on failure
                        retry: 1,
                    },
                },
            })
    );

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </SessionProvider>
    );
}
