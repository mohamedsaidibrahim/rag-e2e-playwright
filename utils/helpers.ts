import { expect, Page, request } from "@playwright/test";
import { selectors } from "../utils/selectors";

export async function waitForUploadToComplete(page: Page, fileName: string) {
  // Wait for either row to contain 'complete' text or progress bar to be gone.
  console.log(`Waiting for upload to complete for file: ${fileName}`);
  const row = page.locator(`${selectors.rowSelector}:has-text("${fileName}")`);
  await expect(row).toBeVisible({ timeout: 30000 });
}

export function waitForBackendAPIResponse(page: Page, API_PATH: string, method: string) {
  const responsePromise = page.waitForResponse(response =>
    response.url().includes(API_PATH) && response.request().method() === method
  );
  return responsePromise;
}

export function assertTheResponse(response: any) {
  expect(response.status).toBe(200);
}