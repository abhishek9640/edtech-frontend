import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/(auth)/login/page';

// Mock next-auth signIn
const mockSignIn = vi.fn();
const mockGetSession = vi.fn();

vi.mock('next-auth/react', () => ({
    signIn: (...args: unknown[]) => mockSignIn(...args),
    getSession: () => mockGetSession(),
    useSession: () => ({ data: null, status: 'unauthenticated' }),
}));

// Mock router
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        refresh: mockRefresh,
    }),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('Login Page Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form', () => {
        render(<LoginPage />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('allows user to type in form fields', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('submits form with correct credentials', async () => {
        const user = userEvent.setup();
        mockSignIn.mockResolvedValueOnce({ error: null });
        mockGetSession.mockResolvedValueOnce({
            user: { accessToken: 'test-token' },
        });

        render(<LoginPage />);

        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('credentials', {
                email: 'test@example.com',
                password: 'password123',
                redirect: false,
            });
        });
    });

    it('shows loading state during submission', async () => {
        const user = userEvent.setup();
        mockSignIn.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(<LoginPage />);

        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/signing in/i)).toBeInTheDocument();
        });
    });

    it('has link to register page', () => {
        render(<LoginPage />);

        const registerLink = screen.getByRole('link', { name: /sign up/i });
        expect(registerLink).toHaveAttribute('href', '/register');
    });
});
