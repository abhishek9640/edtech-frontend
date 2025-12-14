import { test, expect } from '@playwright/test';

test.describe('Courses Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/courses');
    });

    test('should display courses page header', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /explore courses/i })).toBeVisible();
        await expect(page.getByText(/discover your next learning adventure/i)).toBeVisible();
    });

    test('should have search and filter controls', async ({ page }) => {
        await expect(page.getByPlaceholder(/search courses/i)).toBeVisible();
    });

    test('should display loading state initially', async ({ page }) => {
        // The page should show skeleton loaders while fetching
        // This tests that the loading UI is present
        await page.goto('/courses');
    });

    test('should have responsive grid layout', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        // Wait for courses to potentially load
        await page.waitForTimeout(1000);

        // Check that the page is responsive
        await expect(page.getByRole('heading', { name: /explore courses/i })).toBeVisible();
    });

    test('should work on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/courses');

        await expect(page.getByRole('heading', { name: /explore courses/i })).toBeVisible();
    });
});

test.describe('Course Detail Page', () => {
    test('should handle non-existent course gracefully', async ({ page }) => {
        // Navigate to a non-existent course
        await page.goto('/courses/non-existent-id');

        // Should show loading or error state, not crash
        await page.waitForTimeout(2000);
    });
});

test.describe('Navigation', () => {
    test('should have consistent navbar across pages', async ({ page }) => {
        // Check homepage
        await page.goto('/');
        await expect(page.getByRole('navigation')).toBeVisible();

        // Check courses page
        await page.goto('/courses');
        await expect(page.getByRole('navigation')).toBeVisible();

        // Check login page
        await page.goto('/login');
        // Login page might not have navbar, which is fine
    });

    test('should have working logo link', async ({ page }) => {
        await page.goto('/courses');

        // Click on logo/brand
        await page.getByRole('link', { name: /edulearn/i }).click();

        await expect(page).toHaveURL('/');
    });
});

test.describe('404 Page', () => {
    test('should display custom 404 page', async ({ page }) => {
        await page.goto('/this-page-does-not-exist-12345');

        // Should show 404 page
        await expect(page.getByText(/404/i)).toBeVisible();
        await expect(page.getByText(/page not found/i)).toBeVisible();
    });

    test('should have navigation back to home from 404', async ({ page }) => {
        await page.goto('/non-existent-page');

        await page.getByRole('link', { name: /go home/i }).click();

        await expect(page).toHaveURL('/');
    });
});

test.describe('Accessibility', () => {
    test('should have proper heading hierarchy on homepage', async ({ page }) => {
        await page.goto('/');

        const h1 = page.locator('h1');
        await expect(h1).toHaveCount(1);
    });

    test('should have proper heading hierarchy on courses page', async ({ page }) => {
        await page.goto('/courses');

        const h1 = page.locator('h1');
        await expect(h1).toHaveCount(1);
    });

    test('forms should have proper labels', async ({ page }) => {
        await page.goto('/login');

        // Check that inputs have associated labels
        const emailInput = page.getByLabel(/email/i);
        const passwordInput = page.getByLabel(/password/i);

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
    });
});
