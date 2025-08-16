import { test, expect } from "@playwright/test";
import { generateLargeFile, inputFiles, clickSubmitButton, waitForUploadToComplete, navigateToTheHomeScreen } from "../utils/helpers";
import { selectors } from "../utils/selectors";
import { UPLOAD_STATUS_PATH } from "../utils/constants";


test.describe("File Upload - Large Files", () => {
    const largeFileName = "large_test_file_60mb.txt";
    let largeFilePath: string;

    test.beforeAll(() => {
        // Create a ~60MB file
        largeFilePath = generateLargeFile(largeFileName, 60);
    });

    test.beforeEach(async ({ page }) => {
        await navigateToTheHomeScreen(page);
    });

    test("VERIFY Uploading a large file (>50MB)", async ({ page }) => {
        // Count existing rows
        const initialRowCount = await page.locator(selectors.rowSelector).count();

        // Attach the large file
        await inputFiles(page, [largeFilePath]);

        // Click submit
        await clickSubmitButton(page);

        // Expect a new row to appear
        await expect(page.locator(selectors.rowSelector)).toHaveCount(initialRowCount + 1);

        // Verify that upload progress indicator appears (optional if your app shows progress)
        const progressBar = page.locator(selectors.uploadProgressBar);
        if (await progressBar.count()) {
            await expect(progressBar).toHaveCount(0, { timeout: 360000 }); // waits for progress to disappear
        }

        // Wait for upload completion in the UI
        await waitForUploadToComplete(page, largeFileName);
    });
});
