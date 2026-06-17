const { chromium } = require('playwright');

(async () => {
  const email = process.argv[2];
  if (!email) {
    console.error("No email provided.");
    process.exit(1);
  }

  console.log(`Connecting to attached Chrome on Windows (CDP port 9333) for ${email}...`);
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const context = browser.contexts()[0] || await browser.newContext();
  const page = context.pages()[0] || await context.newPage();

  try {
    const randomStr = Math.random().toString(36).substring(2, 10);
    const password = "P!" + randomStr + "9x";
    const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18;
    const currentYear = new Date().getFullYear();
    const dobStr = `${currentYear - age}-10-15`;
    const name = "Harper Martinez";

    const safeType = async (loc, text) => {
      if (await loc.count() > 0) {
        await loc.click({force: true});
        await loc.press("Control+a");
        await loc.press("Backspace");
        await loc.type(text, { delay: 50 });
      }
    };

    const clickNext = async () => {
      const nextRegex = /Next|Continue|Done|继续|完成|下一步/i;
      let btn = page.locator('button[type="submit"]').first();
      if (await btn.count() > 0 && await btn.isVisible()) { await btn.click(); return true; }
      btn = page.locator('button').filter({ hasText: nextRegex }).last();
      if (await btn.count() > 0 && await btn.isVisible()) { await btn.click(); return true; }
      return false;
    };

    await page.goto("https://www.pinterest.com/logout/");
    await page.waitForTimeout(1000);
    await page.goto("https://www.pinterest.com/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    const regBtn = page.locator('[data-test-id="login-signup-toggle"], [data-test-id="simple-signup-button"]').first();
    if (await regBtn.count() > 0) {
      await regBtn.click();
      await page.waitForTimeout(2000);
    }

    const emailInput = page.locator('input[type="email"], [data-test-id="emailInputField"]').first();
    await safeType(emailInput, email);
    const pwdInput = page.locator('input[type="password"], [data-test-id="passwordInputField"]').first();
    await safeType(pwdInput, password);
    const dobLocator = page.locator('input[type="date"], [data-test-id="ageInputField"]').first();
    if (await dobLocator.count() > 0) {
      await dobLocator.fill(dobStr).catch(async () => await safeType(dobLocator, dobStr));
    }

    await page.waitForTimeout(500);
    await clickNext();
    await page.waitForTimeout(2000);
    await clickNext();
    await page.waitForTimeout(5000);

    const nameInput = page.locator('[role="dialog"] input[type="text"]').last();
    if (await nameInput.count() > 0 && await nameInput.isVisible()) {
      await safeType(nameInput, name);
    }
    await clickNext();
    await page.waitForTimeout(3000);

    const femaleBtn = page.locator('[data-test-id="nux-gender-female-label"]').first();
    if (await femaleBtn.count() > 0 && await femaleBtn.isVisible()) {
      await femaleBtn.click();
    } else {
      await clickNext();
    }
    await page.waitForTimeout(3000);

    await clickNext(); // Accept locale default
    await page.waitForTimeout(3000);

    const interestOptions = await page.locator('[data-test-id^="use-case-tap-area"]').all();
    if (interestOptions.length >= 3) {
      for(let i=0; i<3; i++) {
        await interestOptions[i].click();
        await page.waitForTimeout(500);
      }
    }

    const skipOrContinue = page.locator('[data-test-id="skip-or-continue-button"]').first();
    if (await skipOrContinue.count() > 0 && await skipOrContinue.isVisible()) {
      await skipOrContinue.click();
    } else {
      await clickNext();
    }

    await page.waitForTimeout(3000);

    console.log("\\n--- REGISTRATION SUCCESS ---");
    console.log(JSON.stringify({ email, password, dob: dobStr, name }, null, 2));

  } catch (e) {
    console.error("--- ERROR ---");
    console.error(e);
  } finally {
    await browser.close();
  }
})();