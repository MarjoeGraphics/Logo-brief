const { test, expect } = require('@playwright/test');
const path = require('path');

test('Step 9 summary shows price', async ({ page }) => {
  const filePath = 'file://' + path.resolve('index.html');
  await page.goto(filePath);

  // Fill Step 1
  await page.fill('#full_name', 'Test User');
  await page.fill('#email', 'test@example.com');
  await page.fill('#timeline', '2023-12-31');
  await page.click('#next-btn');

  // Skip steps 2-5 (they are not mandatory for navigation)
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(500);
    await page.click('#next-btn');
  }

  // Step 6: Logo Style (Mandatory)
  await page.click('input[name="Logo_Style_Preference"][value="wordmark"]');
  await page.click('#next-btn');

  // Step 7: Colors (Mandatory, 2-4)
  await page.check('input[value="Red"]');
  await page.check('input[value="Blue"]');
  await page.click('#next-btn');

  // Step 8: Pricing (Mandatory)
  await page.click('input[name="Selected_Investment_Strategy"][value="Essential Start"]');
  await page.click('#next-btn');

  // Step 9: Review
  await page.waitForSelector('#review-summary');

  // Check for Total Investment
  const totalInvestment = await page.textContent('#review-summary');
  expect(totalInvestment).toContain('Total Investment');
  expect(totalInvestment).toContain('₱');

  await page.screenshot({ path: 'verification/step9_with_price.png', fullPage: true });
});
