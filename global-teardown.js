async function globalTeardown() {
  console.log("Global Teardown: Starting cleanup...");
  // Clear all cookies
  await page.context().clearCookies();

  // Clear local and session storage
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  console.log("Global Teardown: Cleanup complete.");
}

export default globalTeardown;
