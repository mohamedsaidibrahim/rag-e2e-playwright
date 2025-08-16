import { test, expect } from "@playwright/test";
import { selectors } from "../utils/selectors";
import { questions, expectedKeywords } from "../fixtures/test-data";
import { navigateToTheHomeScreen } from "../utils/helpers";

test.describe("Ask questions grounded in uploaded document", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToTheHomeScreen(page);
  });

  questions.forEach((q, idx) => {
    test(`Q${idx + 1}: ${q}`, async ({ page }) => {
      await page.locator(selectors.chatTextarea).fill(q);
      const askBtn = page.locator(selectors.askButton);
      await expect(askBtn).toBeEnabled();
      await askBtn.click();

      // Wait for new bot message
      const container = page.locator(selectors.chatMessageContainer);
      await expect(container).toBeVisible();

      // Assert relevance via soft keyword matching
      const bot = page.locator(selectors.chatBotBubble).last();
      await expect(bot).toBeVisible({ timeout: 60000 });
      const text = (await bot.innerText()).toLowerCase();

      const keywords = expectedKeywords[idx] || [];
      const matched = keywords.some(k => text.includes(k));
      expect(matched, `Expected one of ${keywords.join(", ")} in bot answer; got: ${text}`).toBeTruthy();
    });
  });
});
