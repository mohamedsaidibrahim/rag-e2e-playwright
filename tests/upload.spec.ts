import { test, expect } from "@playwright/test";
import { selectors } from "../utils/selectors";
import { waitForUploadToComplete, waitForBackendAPIResponse, assertTheResponse } from "../utils/helpers";
import path from "path";
import { defaultFileName, UPLOAD_STATUS_PATH, manyFilesVariety, sameFilesDifferentFormats, DELETE_API_PATH, PROCESS_API_PATH } from "../utils/constants";

const defaultFilePath = path.resolve(__dirname, "../resources/" + defaultFileName);

test.describe("File Upload Suite", () => {
  // test.beforeEach(async ({ page }) => {
  //   await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60000 });
  //   await expect(page.locator(selectors.uploadInput)).toBeVisible();
  // });
  test.only("1. VERIFY Uploading single file (UI + API verification)", async ({ page }) => {
    // Navigate to the app
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60000 });

    // Ensure uploader input is visible
    const fileInput = page.locator("input[type='file']");
    await expect(fileInput).toBeVisible();

    // Record current row count
    const rowSelectorCount = await page.locator(selectors.rowSelector).count();

    // Upload file directly (no need for filechooser)
    await fileInput.setInputFiles(defaultFilePath);

    // Click the first submit button right after selecting the file
    const submitButton = page.locator("button.inline-flex.items-center.justify-center").first();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Verify new row is added in UI
    await expect(page.locator(selectors.rowSelector)).toHaveCount(rowSelectorCount + 1);

    // Wait for upload to complete in the UI
    await waitForUploadToComplete(page, defaultFileName);

    // Verify backend received it (API response check)
    const responsePromise = await waitForBackendAPIResponse(page, UPLOAD_STATUS_PATH, "GET");
    assertTheResponse(responsePromise);
  });


  // test.only("1. VERIFY Uploading single file (UI + API verification)", async ({ page }) => {
  //   await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60000 });
  //   await expect(page.locator(selectors.uploadInput)).toBeVisible();
  //   const rowSelectorCount = await page.locator(selectors.rowSelector).count();
  //   // Ensure uploader visible
  //   await expect(page.locator(selectors.uploadInput)).toBeVisible();

  //   // Upload single file
  //   const [fileChooser] = await Promise.all([
  //     page.waitForEvent("filechooser"),
  //     page.click(selectors.uploadInput),
  //   ]);
  //   await fileChooser.setFiles(defaultFilePath);

  //   // UI shows progress/completion
  //   await waitForUploadToComplete(page, defaultFileName);
  //   const responsePromise = await waitForBackendAPIResponse(page, UPLOAD_STATUS_PATH, "GET");
  //   assertTheResponse(responsePromise);
  //   await expect(page.locator(selectors.rowSelector)).toHaveCount(rowSelectorCount + 1);
  // });

  test("2. Verify the Uplaoded file has the Unposted Status By Default", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator(selectors.uploadInput)).toBeVisible();
    // Upload the file first
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click(selectors.uploadInput),
    ]);
    await fileChooser.setFiles(defaultFilePath);

    // Wait for upload to complete in UI
    await waitForUploadToComplete(page, defaultFileName);

    // Verify the status is unprocessed
    const row = page.locator(`${selectors.rowSelector}:has-text(${defaultFileName})`);
    await expect(row).toContainText("Unprocessed");
  });

  test("3. VERIFY Uploading multiple files", async ({ page }) => {
    const files = manyFilesVariety.map(f => path.resolve(__dirname, `../resources/${f}`));
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60000 });
    const rowSelectorCount = await page.locator(selectors.rowSelector).count();
    const input = page.locator(selectors.uploadInput);


    await expect(input).toBeVisible();
    await input.setInputFiles(files);

    for (const f of manyFilesVariety) {
      await waitForUploadToComplete(page, f);
    }
    await expect(page.locator(selectors.rowSelector)).toHaveCount(rowSelectorCount + files.length);
  });

  test("4. VERIFY Uplaading many files seperatly One by One", async ({ page }) => {
    const files = manyFilesVariety.map(f => path.resolve(__dirname, `../resources/${f}`));
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60000 });
    const rowSelectorCount = await page.locator(selectors.rowSelector).count();

    for (const filePath of files) {
      const fileName = path.basename(filePath);
      const [fileChooser] = await Promise.all([
        page.waitForEvent("filechooser"),
        page.click(selectors.uploadInput),
      ]);
      await fileChooser.setFiles(filePath);

      // Wait for upload to complete in UI
      await waitForUploadToComplete(page, fileName);
      await expect(page.locator(selectors.rowSelector)).toHaveCount(rowSelectorCount + files.length);
    }
  });

  test("5. VERIFY Uploading many files each has different file format", async ({ page }) => {
    const files = sameFilesDifferentFormats.map(f => path.resolve(__dirname, `../resources/${f}`));
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60000 });
    const rowSelectorCount = await page.locator(selectors.rowSelector).count();
    const input = page.locator(selectors.uploadInput);

    await expect(input).toBeVisible();
    await input.setInputFiles(files);

    for (const f of sameFilesDifferentFormats) {
      await waitForUploadToComplete(page, f);
    }
    await expect(page.locator(selectors.rowSelector)).toHaveCount(rowSelectorCount + files.length);
  });

  test("6. VERIFY Deleting uploaded file", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60000 });
    const rowSelectorCount = await page.locator(selectors.rowSelector).count();

    // Upload the file first
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click(selectors.uploadInput),
    ]);
    await fileChooser.setFiles(defaultFilePath);
    await waitForUploadToComplete(page, defaultFileName);

    // Now delete it
    await page.click(`${selectors.rowSelector}:has-text(${defaultFileName}) ${selectors.deleteButton}`);

    // Verify deletion
    const responsePromise = await waitForBackendAPIResponse(page, DELETE_API_PATH, "Delete");
    assertTheResponse(responsePromise);
    await expect(page.locator(selectors.rowSelector)).toHaveCount(rowSelectorCount - 1);
  });

  test("7. VERIFY Processing uploaded file", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60000 });
    // Upload the file first
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click(selectors.uploadInput),
    ]);
    await fileChooser.setFiles(defaultFilePath);
    await waitForUploadToComplete(page, defaultFileName);

    // Now process it
    await page.click(`${selectors.rowSelector}:has-text(${defaultFileName}) ${selectors.processFileButton}`);

    // Verify processing is Complete
    const responsePromise = await waitForBackendAPIResponse(page, PROCESS_API_PATH, "POST");
    assertTheResponse(responsePromise);
  });
});
