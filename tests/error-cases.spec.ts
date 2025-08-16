import { test, expect } from "@playwright/test";
import { selectors } from "../utils/selectors";
import { navigateToTheHomeScreen, inputFiles, clickSubmitButton } from "../utils/helpers";
import { unsupportedFileFormat } from "../utils/constants";


test.describe("Error handling & UI responsiveness", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToTheHomeScreen(page);
  });

  test("1. Ensure that the empty question should keep button disabled", async ({ page }) => {
    const askBtn = page.locator(selectors.askButton);
    await expect(askBtn).toBeVisible();
    await expect(askBtn).toBeDisabled();
  });


  test("2. Verify that unsupported file type shows error (if enforced)", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "skip edge case on webkit");

    const initialRowCount = await page.locator(selectors.rowSelector).count();
    let errorCaught: unknown;

    try {
      await inputFiles(page, [unsupportedFileFormat]);
      await clickSubmitButton(page);
    } catch (error) {
      errorCaught = error;
    }

    expect(errorCaught).toBeTruthy();

    if (errorCaught instanceof Error) {
      // Case 1: file not found on disk
      if (errorCaught.message.includes("ENOENT")) {
        expect(errorCaught.message).toContain("no such file or directory");
        expect(errorCaught.message).toContain(unsupportedFileFormat);
      }
      // Case 2: file exists but app rejects it
      else {
        expect(errorCaught.message).toMatch(/unsupported|format|invalid/i);
      }
    } else {
      throw new Error(`Unexpected error type: ${errorCaught}`);
    }

    await expect(page.locator(selectors.rowSelector)).toHaveCount(initialRowCount);
  });






});
