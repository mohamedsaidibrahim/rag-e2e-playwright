import { expect, Page, request } from "@playwright/test";
import { selectors } from "../utils/selectors";


export async function navigateToTheHomeScreen(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60000 });
}

export async function waitForUploadToComplete(page: Page, fileName: string) {
  // Wait for either row to contain 'complete' text or progress bar to be gone.
  console.log(`Waiting for upload to complete for file: ${fileName}`);
  const row = page.locator(`${selectors.rowSelector}:has-text("${fileName}")`).last();
  await expect(row).toBeVisible({ timeout: 9000 });
}

export async function inputFiles(page: Page, files: string[]) {
  // Ensure uploader input is visible
  const fileInput = page.locator("input[type='file']");
  await expect(fileInput).toBeVisible();

  // Upload file directly (no need for filechooser)
  await fileInput.setInputFiles(files);
}

export async function clickSubmitButton(page: Page) {
  const submitButton = page.locator("button.inline-flex.items-center.justify-center").first();
  await expect(submitButton).toBeEnabled();

  await submitButton.click();
}

// export function waitForBackendAPIResponse(page: Page, API_PATH: string, method: string) {
//   const responsePromise = page.waitForResponse(response =>
//     response.url().includes(API_PATH) && response.request().method() === method
//   );
//   return responsePromise;
// }

// export function assertTheResponse(response: any) {
//   expect(response.status).toBe(200);
// }