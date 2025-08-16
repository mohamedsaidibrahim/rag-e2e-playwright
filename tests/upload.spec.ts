import { test, expect } from "@playwright/test";
import { selectors } from "../utils/selectors";
import { waitForUploadToComplete, navigateToTheHomeScreen, inputFiles, clickSubmitButton } from "../utils/helpers";
import path from "path";
import { defaultFileName, manyFilesVariety, sameFilesDifferentFormats, DELETE_API_PATH, PROCESS_API_PATH } from "../utils/constants";

const defaultFilePath = path.resolve(__dirname, "../resources/" + defaultFileName);

test.describe("File Upload Suite", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToTheHomeScreen(page);
  });

  test("1. VERIFY Uploading single file (UI + API verification)", async ({ page }) => {
    const rowSelectorCount = await page.locator(selectors.rowSelector).count();
    await inputFiles(page, [defaultFilePath]);
    await clickSubmitButton(page);
    await expect(page.locator(selectors.rowSelector)).toHaveCount(rowSelectorCount + 1);
    await waitForUploadToComplete(page, defaultFileName);
  });

  test("2. Verify the Uplaoded file has the Unprocessed Status By Default", async ({ page }) => {
    await inputFiles(page, [defaultFilePath]);
    await clickSubmitButton(page);
    // Wait for upload to complete in UI
    await waitForUploadToComplete(page, defaultFileName);
    // Verify the status is unprocessed
    const row = page.locator(`${selectors.rowSelector}:has-text(${defaultFileName})`).last();
    await expect(row).toContainText("Unprocessed");
  });

  test("3. VERIFY Uploading multiple files", async ({ page }) => {
    const files = manyFilesVariety.map(f => path.resolve(__dirname, `../resources/${f}`));
    const rowSelectorCount = await page.locator(selectors.rowSelector).count();
    await inputFiles(page, files);
    await clickSubmitButton(page);
    for (const f of manyFilesVariety) { await waitForUploadToComplete(page, f); }
    await expect(page.locator(selectors.rowSelector)).toHaveCount(rowSelectorCount + files.length);
  });

  test("4. VERIFY Uplaading many files seperatly One by One", async ({ page }) => {
    const files = manyFilesVariety.map(f => path.resolve(__dirname, `../resources/${f}`));
    const rowSelectorCount = await page.locator(selectors.rowSelector).count();
    for (const filePath of files) {
      const fileName = path.basename(filePath);
      await inputFiles(page, [filePath]);
      await clickSubmitButton(page);
      await waitForUploadToComplete(page, fileName);
    }
    await expect(page.locator(selectors.rowSelector)).toHaveCount(rowSelectorCount + files.length);
  });

  test("5. VERIFY Uploading many files each has different file format", async ({ page }) => {
    const files = sameFilesDifferentFormats.map(f => path.resolve(__dirname, `../resources/${f}`));
    const rowSelectorCount = await page.locator(selectors.rowSelector).count();
    for (const filePath of files) {
      const fileName = path.basename(filePath);
      await inputFiles(page, [filePath]);
      await clickSubmitButton(page);
      await waitForUploadToComplete(page, fileName);
    }
    await expect(page.locator(selectors.rowSelector)).toHaveCount(rowSelectorCount + files.length);
  });

  test("6. VERIFY Deleting uploaded file", async ({ page }) => {
    const rowSelectorCount = await page.locator(selectors.rowSelector).count();
    await inputFiles(page, [defaultFileName]);
    await clickSubmitButton(page);
    await waitForUploadToComplete(page, defaultFileName);
    // Now delete it
    await page.locator(`${selectors.rowSelector}:has-text(${defaultFileName}) ${selectors.deleteButton}`).last().click();
    // Verify deletion
    await expect(page.locator(selectors.rowSelector)).toHaveCount(rowSelectorCount - 1);
  });

  test("7. VERIFY Processing uploaded file", async ({ page }) => {
    await inputFiles(page, [defaultFilePath]);
    await clickSubmitButton(page);
    await waitForUploadToComplete(page, defaultFileName);
    // Now process it
    await page.locator(`${selectors.rowSelector}:has-text(${defaultFileName}) ${selectors.processFileButton}`).last().click();
    // Verify the status is Processed
    const row = page.locator(`${selectors.rowSelector}:has-text(${defaultFileName})`).last();
    await expect(row).toContainText("Processed");
  });
});