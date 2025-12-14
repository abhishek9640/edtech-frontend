'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

/**
 * Hero section buttons - client component for auth state detection
 */
export function HeroButtons() {
    const { status } = useSession();
    const isAuthenticated = status === 'authenticated';

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
                <Button size="lg" asChild className="text-lg">
                    <Link href="/register">Start Learning Free</Link>
                </Button>
            )}
            <Button size="lg" variant="outline" asChild className="text-lg">
                <Link href="/courses">Explore Courses</Link>
            </Button>
        </div>
    );
}

/**
 * CTA Section - client component for auth state detection
 */
export function CTASection() {
    const { status } = useSession();
    const isAuthenticated = status === 'authenticated';

    if (isAuthenticated) return null;

    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
                <p className="text-xl mb-8 opacity-90">
                    Join thousands of students already learning on EduLearn
                </p>
                <Button size="lg" variant="secondary" asChild className="text-lg">
                    <Link href="/register">Create Free Account</Link>
                </Button>
            </div>
        </section>
    );
}
