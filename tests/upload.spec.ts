import { test, expect } from "@playwright/test";
import { selectors } from "../utils/selectors";
import { waitForUploadToComplete, waitForBackendAPIResponse, assertTheResponse } from "../utils/helpers";
import path from "path";
import { defaultFileName, UPLOAD_STATUS_PATH, manyFilesVariety, sameFilesDifferentFormats, DELETE_API_PATH, PROCESS_API_PATH } from "../utils/constants";

const defaultFilePath = path.resolve(__dirname, "../resources/" + defaultFileName);

test.describe("File Upload Suite", () => {
  test("1. VERIFY Uploading single file (UI + API verification)", async ({ page }) => {
    await page.goto("/");
    const uploadedFileRowCount = await page.locator(selectors.uploadedFileRow).count();
    const responsePromise = await waitForBackendAPIResponse(page, UPLOAD_STATUS_PATH, "GET");
    // Ensure uploader visible
    await expect(page.locator(selectors.uploadInput)).toBeVisible();

    // Upload single file
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click(selectors.uploadInput),
    ]);
    await fileChooser.setFiles(defaultFilePath);

    // UI shows progress/completion
    await waitForUploadToComplete(page, defaultFileName);
    assertTheResponse(responsePromise);
    await expect(page.locator(selectors.uploadedFileRow)).toHaveCount(uploadedFileRowCount + 1);
  });

  test("2. Verify the Uplaoded file has the Unposted Status By Default", async ({ page }) => {
    await page.goto("/");

    // Upload the file first
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click(selectors.uploadInput),
    ]);
    await fileChooser.setFiles(defaultFilePath);

    // Wait for upload to complete in UI
    await waitForUploadToComplete(page, defaultFileName);

    // Verify the status is unprocessed
    const row = page.locator(`${selectors.uploadedFileRow}:has-text(${defaultFileName})`);
    await expect(row).toContainText("Unprocessed");
  });

  test("3. VERIFY Uploading multiple files", async ({ page }) => {
    await page.goto("/");
    const files = manyFilesVariety.map(f => path.resolve(__dirname, `../resources/${f}`));
    const uploadedFileRowCount = await page.locator(selectors.uploadedFileRow).count();

    const input = page.locator(selectors.uploadInput);
    await expect(input).toBeVisible();
    await input.setInputFiles(files);

    for (const f of manyFilesVariety) {
      await waitForUploadToComplete(page, f);
    }
    await expect(page.locator(selectors.uploadedFileRow)).toHaveCount(uploadedFileRowCount + files.length);
  });

  test("4. VERIFY Uplaading many files seperatly One by One", async ({ page }) => {
    await page.goto("/");
    const files = manyFilesVariety.map(f => path.resolve(__dirname, `../resources/${f}`));
    const uploadedFileRowCount = await page.locator(selectors.uploadedFileRow).count();

    for (const filePath of files) {
      const fileName = path.basename(filePath);
      const [fileChooser] = await Promise.all([
        page.waitForEvent("filechooser"),
        page.click(selectors.uploadInput),
      ]);
      await fileChooser.setFiles(filePath);

      // Wait for upload to complete in UI
      await waitForUploadToComplete(page, fileName);
      await expect(page.locator(selectors.uploadedFileRow)).toHaveCount(uploadedFileRowCount + files.length);
    }
  });

  test("5. VERIFY Uploading many files each has different file format", async ({ page }) => {
    await page.goto("/");
    const files = sameFilesDifferentFormats.map(f => path.resolve(__dirname, `../resources/${f}`));
    const uploadedFileRowCount = await page.locator(selectors.uploadedFileRow).count();

    const input = page.locator(selectors.uploadInput);
    await expect(input).toBeVisible();
    await input.setInputFiles(files);

    for (const f of sameFilesDifferentFormats) {
      await waitForUploadToComplete(page, f);
    }
    await expect(page.locator(selectors.uploadedFileRow)).toHaveCount(uploadedFileRowCount + files.length);
  });

  test("6. VERIFY Deleting uploaded file", async ({ page }) => {
    await page.goto("/");
    const responsePromise = await waitForBackendAPIResponse(page, DELETE_API_PATH, "Delete");
    const uploadedFileRowCount = await page.locator(selectors.uploadedFileRow).count();

    // Upload the file first
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click(selectors.uploadInput),
    ]);
    await fileChooser.setFiles(defaultFilePath);
    await waitForUploadToComplete(page, defaultFileName);

    // Now delete it
    await page.click(`${selectors.uploadedFileRow}:has-text(${defaultFileName}) ${selectors.deleteButton}`);

    // Verify deletion
    assertTheResponse(responsePromise);
    await expect(page.locator(selectors.uploadedFileRow)).toHaveCount(uploadedFileRowCount - 1);
  });

  test("7. VERIFY Processing uploaded file", async ({ page }) => {
    await page.goto("/");
    const responsePromise = await waitForBackendAPIResponse(page, PROCESS_API_PATH, "POST");

    // Upload the file first
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click(selectors.uploadInput),
    ]);
    await fileChooser.setFiles(defaultFilePath);
    await waitForUploadToComplete(page, defaultFileName);

    // Now process it
    await page.click(`${selectors.uploadedFileRow}:has-text(${defaultFileName}) ${selectors.processFileButton}`);

    // Verify processing is Complete
    assertTheResponse(responsePromise);
  });
});
