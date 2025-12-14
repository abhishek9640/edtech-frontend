import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display login page', async ({ page }) => {
        await page.goto('/login');

        await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByLabel(/password/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    });

    test('should display register page', async ({ page }) => {
        await page.goto('/register');

        await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible();
        await expect(page.getByLabel(/full name/i)).toBeVisible();
        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('should navigate from login to register', async ({ page }) => {
        await page.goto('/login');

        await page.getByRole('link', { name: /sign up/i }).click();

        await expect(page).toHaveURL('/register');
    });

    test('should navigate from register to login', async ({ page }) => {
        await page.goto('/register');

        await page.getByRole('link', { name: /sign in/i }).click();

        await expect(page).toHaveURL('/login');
    });

    test('should show validation on empty form submission', async ({ page }) => {
        await page.goto('/login');

        // Try to submit empty form
        await page.getByRole('button', { name: /sign in/i }).click();

        // Browser validation should prevent submission
        const emailInput = page.getByLabel(/email/i);
        await expect(emailInput).toBeFocused();
    });

    test('should redirect to login when accessing protected route', async ({ page }) => {
        await page.goto('/dashboard');

        // Should redirect to login
        await expect(page).toHaveURL(/login/);
    });

    test('should redirect to login when accessing instructor route', async ({ page }) => {
        await page.goto('/instructor');

        // Should redirect to login
        await expect(page).toHaveURL(/login/);
    });
});

test.describe('Home Page', () => {
    test('should display hero section', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('heading', { name: /learn without limits/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /explore courses/i })).toBeVisible();
    });

    test('should have working navigation', async ({ page }) => {
        await page.goto('/');

        // Check navbar exists
        await expect(page.getByRole('navigation')).toBeVisible();

        // Check courses link
        await page.getByRole('link', { name: /courses/i }).first().click();
        await expect(page).toHaveURL('/courses');
    });
});
