import { test, expect } from "@playwright/test";
import { selectors } from "../utils/selectors";
import { navigateToTheHomeScreen } from "../utils/helpers";

test.describe("WebSocket stream verification (bonus)", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToTheHomeScreen(page);
  });

  test("captures streaming tokens/events", async ({ page }) => {
    const textarea = page.locator(selectors.chatTextarea);
    await textarea.fill("Provide a short summary of the uploaded document.");
    const askBtn = page.locator(selectors.askButton);
    await askBtn.click();

    const messages: { url: string; frames: string[] }[] = [];

    page.on("websocket", ws => {
      const entry = { url: ws.url(), frames: [] as string[] };
      messages.push(entry);
      ws.on("framereceived", data => entry.frames.push(typeof data === "string" ? data : ""));
    });

    // Wait for bot message as completion signal
    const botMsg = page.locator(selectors.chatBotBubble).last();
    await expect(botMsg).toBeVisible({ timeout: 60000 });

    // Basic assertion: at least one WS with frames received
    const hasFrames = messages.some(m => m.frames.length > 0);
    expect(hasFrames, "Expected to receive WebSocket frames during chat response").toBeTruthy();
  });
});
