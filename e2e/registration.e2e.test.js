const { test, expect } = require('@playwright/test')

test.describe('Registration Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/register')
  })

  test('successful registration flow', async ({ page }) => {
    await page.fill('[data-testid="first-name"]', 'John')
    await page.fill('[data-testid="last-name"]', 'Doe')
    await page.fill('[data-testid="email"]', `test${Date.now()}@example.com`)
    await page.selectOption('[data-testid="country"]', 'United States')
    await page.fill('[data-testid="phone"]', '+1234567890')
    await page.fill('[data-testid="referral-code"]', 'TEST123')
    await page.fill('[data-testid="password"]', 'StrongPass123')
    await page.fill('[data-testid="confirm-password"]', 'StrongPass123')
    
    await page.click('[data-testid="submit-button"]')
    
    await expect(page.locator('text=Registration successful')).toBeVisible({ timeout: 10000 })
    
    await page.waitForURL('**/dashboard**', { timeout: 10000 })
    
    await expect(page.locator('text=Welcome to Ajmal Investments')).toBeVisible()
    await expect(page.locator('text=Your account is created and pending KYC verification')).toBeVisible()
    
    const investButton = page.locator('button:has-text("New Investment")')
    await expect(investButton).toBeDisabled()
  })

  test('duplicate email error', async ({ page }) => {
    const email = 'duplicate@example.com'
    
    await page.fill('[data-testid="first-name"]', 'John')
    await page.fill('[data-testid="last-name"]', 'Doe')
    await page.fill('[data-testid="email"]', email)
    await page.selectOption('[data-testid="country"]', 'United States')
    await page.fill('[data-testid="password"]', 'StrongPass123')
    await page.fill('[data-testid="confirm-password"]', 'StrongPass123')
    await page.click('[data-testid="submit-button"]')
    
    await page.waitForURL('**/dashboard**', { timeout: 10000 })
    await page.click('button:has-text("Logout")')
    
    await page.goto('http://localhost:5173/register')
    
    await page.fill('[data-testid="first-name"]', 'Jane')
    await page.fill('[data-testid="last-name"]', 'Smith')
    await page.fill('[data-testid="email"]', email)
    await page.selectOption('[data-testid="country"]', 'Canada')
    await page.fill('[data-testid="password"]', 'AnotherPass123')
    await page.fill('[data-testid="confirm-password"]', 'AnotherPass123')
    await page.click('[data-testid="submit-button"]')
    
    await expect(page.locator('text=That email is already registered')).toBeVisible()
  })

  test('weak password error', async ({ page }) => {
    await page.fill('[data-testid="first-name"]', 'John')
    await page.fill('[data-testid="last-name"]', 'Doe')
    await page.fill('[data-testid="email"]', 'test@example.com')
    await page.selectOption('[data-testid="country"]', 'United States')
    await page.fill('[data-testid="password"]', 'weak')
    await page.fill('[data-testid="confirm-password"]', 'weak')
    await page.click('[data-testid="submit-button"]')
    
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible()
  })

  test('invalid referral code error', async ({ page }) => {
    await page.fill('[data-testid="first-name"]', 'John')
    await page.fill('[data-testid="last-name"]', 'Doe')
    await page.fill('[data-testid="email"]', 'test@example.com')
    await page.selectOption('[data-testid="country"]', 'United States')
    await page.fill('[data-testid="referral-code"]', 'AB') // Too short
    await page.fill('[data-testid="password"]', 'StrongPass123')
    await page.fill('[data-testid="confirm-password"]', 'StrongPass123')
    await page.click('[data-testid="submit-button"]')
    
    await expect(page.locator('text=Invalid referral code')).toBeVisible()
  })
})
