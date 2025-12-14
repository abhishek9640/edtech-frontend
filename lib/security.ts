/**
 * Security utilities for input sanitization and XSS prevention
 */

/**
 * HTML entities to escape for XSS prevention
 */
const HTML_ENTITIES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
};

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
    return str.replace(/[&<>"'/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Sanitize a string by removing potentially dangerous content
 */
export function sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';

    // Remove any script tags
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove on* event handlers
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: URLs
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove data: URLs (can be used for XSS)
    sanitized = sanitized.replace(/data:/gi, '');

    return sanitized.trim();
}

/**
 * Validate and sanitize a URL
 */
export function sanitizeUrl(url: string): string | null {
    if (typeof url !== 'string') return null;

    try {
        const parsed = new URL(url);

        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return null;
        }

        return parsed.href;
    } catch {
        return null;
    }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check if password meets minimum security requirements
 */
export function isStrongPassword(password: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Rate limiting helper for client-side
 */
export function createRateLimiter(maxRequests: number, windowMs: number) {
    const requests: number[] = [];

    return function isAllowed(): boolean {
        const now = Date.now();
        const windowStart = now - windowMs;

        // Remove old requests outside the window
        while (requests.length > 0 && requests[0] < windowStart) {
            requests.shift();
        }

        if (requests.length >= maxRequests) {
            return false;
        }

        requests.push(now);
        return true;
    };
}

/**
 * Generate a random nonce for CSP
 */
export function generateNonce(): string {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Fallback for environments without crypto
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
