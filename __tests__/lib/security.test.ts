import { describe, it, expect, vi, beforeEach } from 'vitest';
import { escapeHtml, sanitizeString, sanitizeUrl, isValidEmail, isStrongPassword, createRateLimiter } from '@/lib/security';

describe('Security Utilities', () => {
    describe('escapeHtml', () => {
        it('should escape HTML special characters', () => {
            expect(escapeHtml('<script>alert("xss")</script>')).toBe(
                '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
            );
        });

        it('should escape ampersands', () => {
            expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
        });

        it('should handle empty string', () => {
            expect(escapeHtml('')).toBe('');
        });
    });

    describe('sanitizeString', () => {
        it('should remove script tags', () => {
            expect(sanitizeString('<script>alert("xss")</script>test')).toBe('test');
        });

        it('should remove event handlers', () => {
            expect(sanitizeString('<div onclick="alert(1)">test</div>')).toBe('<div>test</div>');
        });

        it('should remove javascript: URLs', () => {
            expect(sanitizeString('javascript:alert(1)')).toBe('alert(1)');
        });

        it('should trim whitespace', () => {
            expect(sanitizeString('  hello world  ')).toBe('hello world');
        });
    });

    describe('sanitizeUrl', () => {
        it('should accept valid HTTPS URLs', () => {
            expect(sanitizeUrl('https://example.com/path')).toBe('https://example.com/path');
        });

        it('should accept valid HTTP URLs', () => {
            expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
        });

        it('should reject javascript: URLs', () => {
            expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
        });

        it('should reject data: URLs', () => {
            expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
        });

        it('should reject invalid URLs', () => {
            expect(sanitizeUrl('not a url')).toBeNull();
        });
    });

    describe('isValidEmail', () => {
        it('should accept valid email addresses', () => {
            expect(isValidEmail('user@example.com')).toBe(true);
            expect(isValidEmail('user.name@domain.org')).toBe(true);
        });

        it('should reject invalid email addresses', () => {
            expect(isValidEmail('invalid')).toBe(false);
            expect(isValidEmail('user@')).toBe(false);
            expect(isValidEmail('@domain.com')).toBe(false);
        });
    });

    describe('isStrongPassword', () => {
        it('should accept strong passwords', () => {
            const result = isStrongPassword('SecurePass123');
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject short passwords', () => {
            const result = isStrongPassword('Short1');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Password must be at least 8 characters');
        });

        it('should require uppercase letters', () => {
            const result = isStrongPassword('lowercase123');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Password must contain at least one uppercase letter');
        });

        it('should require numbers', () => {
            const result = isStrongPassword('NoNumbers');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Password must contain at least one number');
        });
    });

    describe('createRateLimiter', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        it('should allow requests within limit', () => {
            const limiter = createRateLimiter(3, 1000);
            expect(limiter()).toBe(true);
            expect(limiter()).toBe(true);
            expect(limiter()).toBe(true);
        });

        it('should block requests over limit', () => {
            const limiter = createRateLimiter(2, 1000);
            limiter();
            limiter();
            expect(limiter()).toBe(false);
        });

        it('should reset after window expires', () => {
            const limiter = createRateLimiter(1, 1000);
            limiter();
            expect(limiter()).toBe(false);

            vi.advanceTimersByTime(1001);
            expect(limiter()).toBe(true);
        });
    });
});
