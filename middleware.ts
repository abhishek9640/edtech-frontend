import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/**
 * Security headers for production
 */
const securityHeaders = {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Enable XSS filter
    'X-XSS-Protection': '1; mode=block',
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Permissions policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    // Protected routes
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/instructor');

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Instructor only routes
    if (pathname.startsWith('/instructor') && isLoggedIn) {
        const userRole = req.auth?.user?.role;
        if (userRole !== 'instructor' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    // Create response with security headers
    const response = NextResponse.next();

    // Apply security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
