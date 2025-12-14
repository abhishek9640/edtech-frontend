import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, Search } from 'lucide-react';

/**
 * Custom 404 Not Found page
 * Displayed when a page is not found
 */
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="text-center max-w-lg">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileQuestion className="h-10 w-10 text-blue-600" />
                </div>

                <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/courses">
                            <Search className="h-4 w-4" />
                            Browse Courses
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
