'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Global error page for Next.js App Router
 * Catches errors in the app and displays a user-friendly message
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global error:', error);

        // In production, send to error tracking service
        // Example: Sentry.captureException(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="text-center max-w-lg">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>

                <h1 className="text-3xl font-bold mb-2">Oops! Something went wrong</h1>
                <p className="text-gray-600 mb-6">
                    We apologize for the inconvenience. An unexpected error has occurred.
                </p>

                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm font-mono text-red-600 break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-gray-500 mt-2">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={reset} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                </div>

                <p className="text-sm text-gray-500 mt-8">
                    If this problem persists, please contact{' '}
                    <a href="mailto:support@edulearn.com" className="text-primary hover:underline">
                        support@edulearn.com
                    </a>
                </p>
            </div>
        </div>
    );
}
