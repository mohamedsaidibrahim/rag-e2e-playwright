import { test, expect } from "@playwright/test";
import { selectors } from "../utils/selectors";
import { navigateToTheHomeScreen } from "../utils/helpers";

test.describe("Chat UI readiness", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToTheHomeScreen(page);
  });

  test("chat loads and ask button enables after typing", async ({ page }) => {
    // Navigate to chat if needed: try to find textarea
    const textarea = page.locator(selectors.chatTextarea);
    await expect(textarea).toBeVisible();

    const askBtn = page.locator(selectors.askButton);
    await expect(askBtn).toBeVisible();
    // Initially disabled
    await expect(askBtn).toBeDisabled();

    await textarea.fill("Hello, are you ready?");
    await expect(askBtn).toBeEnabled();

    await askBtn.click();

    // Expect a bot response to appear
    const botMsg = page.locator(selectors.chatBotBubble).first();
    await expect(botMsg).toBeVisible({ timeout: 60000 });
  });
});
