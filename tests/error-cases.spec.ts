import { test, expect } from "@playwright/test";
import { selectors } from "../utils/selectors";

test.describe("Error handling & UI responsiveness", () => {
  test("empty question should keep button disabled", async ({ page }) => {
    await page.goto("/");
    const askBtn = page.locator(selectors.askButton);
    await expect(askBtn).toBeVisible();
    await expect(askBtn).toBeDisabled();
  });

  test("unsupported file type shows error (if enforced)", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "skip edge case on webkit");
    await page.goto("/");

    const fakeFile = {
      name: "malicious.exe",
      mimeType: "application/octet-stream",
      buffer: Buffer.from("MZ...")
    };

    const [chooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click(selectors.uploadInput)
    ]);
    await chooser.setFiles({
      name: fakeFile.name,
      mimeType: fakeFile.mimeType,
      buffer: fakeFile.buffer
    });

    // Expect some error toast or message
    const possibleError = page.locator('[role="alert"], .toast-error, [data-testid="upload-error"]');
    await expect(possibleError).toBeVisible({ timeout: 30_000 });
  });
});
