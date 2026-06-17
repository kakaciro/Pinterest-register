export default async function registerPinterest({ tab, email }) {
  const randomStr = Math.random().toString(36).substring(2, 10);
  const password = "P!" + randomStr + "9x";

  const age = Math.floor(Math.random() * (35 - 18 + 1)) + 18;
  const currentYear = new Date().getFullYear();
  const dobYear = currentYear - age;
  const dobMonth = Math.floor(Math.random() * 12) + 1;
  const dobDay = Math.floor(Math.random() * 28) + 1;
  const dobStr = dobYear + "-" + dobMonth.toString().padStart(2, "0") + "-" + dobDay.toString().padStart(2, "0");

  const firstNames = ["Emma", "Olivia", "Ava", "Sophia", "Mia", "Harper", "Evelyn", "Abigail", "Emily", "Elizabeth"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
  const name = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];

  const page = tab.playwright || tab;

  const safeType = async (locator, text) => {
    if(await locator.count() > 0) {
      await locator.click({force: true});
      await locator.press("Control+a");
      await locator.press("Backspace");
      await locator.type(text, { delay: 50 });
    }
  };

  // Unicode patterns for Next/Continue/Done in Chinese to avoid literal Chinese characters causing encoding issues
  // \u7ee7\u7eed = Continue, \u5b8c\u6210 = Done, \u4e0b\u4e00\u6b65 = Next step
  const nextRegex = /Next|Continue|Done|\u7ee7\u7eed|\u5b8c\u6210|\u4e0b\u4e00\u6b65/i;

  const clickNext = async () => {
    let btn = page.locator('button[type="submit"]').first();
    if (await btn.count() > 0 && await btn.isVisible()) {
      await btn.click();
      return true;
    }
    btn = page.locator('button').filter({ hasText: nextRegex }).last();
    if (await btn.count() > 0 && await btn.isVisible()) {
      await btn.click();
      return true;
    }
    return false;
  };

  await page.goto("https://www.pinterest.com/logout/");
  await page.waitForTimeout(1000);
  
  await page.goto("https://www.pinterest.com/");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(2000);

  const regBtn = page.locator('button[data-test-id="join-pinterest-button-homepage-redesign-top-module"], button[data-test-id="login-signup-toggle"], [data-test-id="simple-signup-button"]').first();
  if (await regBtn.count() > 0 && await regBtn.isVisible()) {
    await regBtn.click();
    await page.waitForTimeout(2000);
  } else {
    const toggle = page.locator('[data-test-id="login-signup-toggle"]').first();
    if (await toggle.count() > 0) {
        await toggle.click();
        await page.waitForTimeout(2000);
    }
  }

  const emailInput = page.locator('input[type="email"], [data-test-id="emailInputField"]').first();
  for(let i=0; i<10; i++) {
    if (await emailInput.count() > 0 && await emailInput.isVisible()) break;
    await page.waitForTimeout(500);
  }
  await safeType(emailInput, email);
  
  const pwdInput = page.locator('input[type="password"], [data-test-id="passwordInputField"]').first();
  await safeType(pwdInput, password);

  const dobLocator = page.locator('input[type="date"], [data-test-id="ageInputField"]').first();
  if (await dobLocator.count() > 0) {
      await dobLocator.fill(dobStr).catch(async () => {
          await safeType(dobLocator, dobStr);
      });
  }

  await page.waitForTimeout(500);
  await clickNext();
  
  await page.waitForTimeout(2000);
  await clickNext(); // Double check
  await page.waitForTimeout(5000);

  // Name step
  // Using [role="dialog"] to ensure we target the popup's text input and not the background search bar
  const nameInput = page.locator('[role="dialog"] input[type="text"]').last();
  if (await nameInput.count() > 0 && await nameInput.isVisible()) {
      await safeType(nameInput, name);
  }
  await clickNext();
  await page.waitForTimeout(3000);

  // Gender step
  const femaleBtn = page.locator('[data-test-id="nux-gender-female-label"], [data-test-id="female-button"], button:has-text("女"), button:has-text("Female")').first();
  if (await femaleBtn.count() > 0 && await femaleBtn.isVisible()) {
      await femaleBtn.click();
      await page.waitForTimeout(2000);
  }

  // Locale step
  const selects = await page.locator('select').all();
  if (selects.length >= 2) {
      await selects[0].selectOption({ label: "United States" }).catch(()=>{});
      await selects[1].selectOption({ value: "en-US" }).catch(()=>{});
  } else if (selects.length === 1) {
      await selects[0].selectOption({ label: "United States" }).catch(()=>{});
  }
  await clickNext();
  await page.waitForTimeout(3000);

  // Interests step
  const interestOptions = await page.locator('[data-test-id^="use-case-tap-area"]').all();
  if (interestOptions.length >= 3) {
      const shuffled = [...interestOptions].sort(() => 0.5 - Math.random());
      for(let i=0; i<3; i++) {
          await shuffled[i].click();
          await page.waitForTimeout(1000);
      }
  }

  const skipOrContinue = page.locator('[data-test-id="skip-or-continue-button"]').first();
  if (await skipOrContinue.count() > 0 && await skipOrContinue.isVisible()) {
      await skipOrContinue.click();
  } else {
      await clickNext();
  }
  await page.waitForTimeout(3000);
  
  return { email, password, dob: dobStr, name, gender: "Female", country: "US", language: "en-US" };
};