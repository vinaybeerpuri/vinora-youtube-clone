const { chromium } = require('playwright-chromium');

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER ERROR] ${err.stack}`);
  });

  try {
    console.log("Navigating to video page...");
    await page.goto('http://localhost:3000/video/6a3a305d07488e793aa98a71', { timeout: 30000 });
    
    console.log("Waiting 5 seconds for page load...");
    await page.waitForTimeout(5000);

    const touchLayer = await page.$('.vp-touch-layer');
    if (!touchLayer) {
      console.error("Could not find .vp-touch-layer");
      return;
    }
    const box = await touchLayer.boundingBox();
    console.log(`Touch layer bounding box: x=${box.x}, y=${box.y}, width=${box.width}, height=${box.height}`);

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const leftX = box.x + box.width / 6;
    const rightX = box.x + (box.width * 5) / 6;

    // --- TEST SINGLE TAP CENTER ---
    console.log("\n--- TEST 1: SINGLE TAP CENTER (PLAY/PAUSE) ---");
    await page.mouse.click(centerX, centerY);
    console.log("Clicked center (single tap). Waiting 4 seconds...");
    await page.waitForTimeout(4000);

    // --- TEST DOUBLE TAP RIGHT ---
    console.log("\n--- TEST 2: DOUBLE TAP RIGHT (SEEK +10S) ---");
    await page.mouse.click(rightX, centerY);
    await page.waitForTimeout(100);
    await page.mouse.click(rightX, centerY);
    console.log("Double clicked right. Waiting 4 seconds...");
    await page.waitForTimeout(4000);

    // --- TEST DOUBLE TAP LEFT ---
    console.log("\n--- TEST 3: DOUBLE TAP LEFT (SEEK -10S) ---");
    await page.mouse.click(leftX, centerY);
    await page.waitForTimeout(100);
    await page.mouse.click(leftX, centerY);
    console.log("Double clicked left. Waiting 4 seconds...");
    await page.waitForTimeout(4000);

    // --- TEST TRIPLE TAP LEFT ---
    console.log("\n--- TEST 4: TRIPLE TAP LEFT (COMMENTS) ---");
    await page.mouse.click(leftX, centerY);
    await page.waitForTimeout(100);
    await page.mouse.click(leftX, centerY);
    await page.waitForTimeout(100);
    await page.mouse.click(leftX, centerY);
    console.log("Triple clicked left. Waiting 4 seconds...");
    await page.waitForTimeout(4000);

  } catch (err) {
    console.error("Test encountered an error:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
})();
