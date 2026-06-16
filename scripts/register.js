
module.exports = async function registerPinterest({ tab, email, password, dobYear, dobMonth, dobDay, gender }) {
  await tab.goto("https://www.pinterest.com/");
  await tab.playwright.waitForLoadState({ state: "domcontentloaded" });

  const regBtn = tab.playwright.getByRole("button", { name: "??", exact: true });
  await regBtn.click();
  await tab.playwright.waitForTimeout(1000);

  const emailInput = tab.playwright.getByPlaceholder("????");
  const pwdInput = tab.playwright.getByPlaceholder("????");
  const dobInputRole = tab.playwright.getByRole("textbox", { name: "????" });

  await emailInput.fill(email);
  await pwdInput.fill(password);
  
  // Format YYYY-MM-DD
  const dobStr = `${dobYear}-${dobMonth.toString().padStart(2, "0")}-${dobDay.toString().padStart(2, "0")}`;
  await dobInputRole.fill(dobStr);

  const continueBtnText = tab.playwright.getByRole("button", { name: "?????? Pinterest ??" });
  if (await continueBtnText.count() === 1) {
    await continueBtnText.click();
  } else {
    const continueBtn = tab.playwright.getByRole("button", { name: "??", exact: true });
    await continueBtn.click();
  }
  
  await tab.playwright.waitForTimeout(3000);
  
  // Go to settings to set gender
  await tab.goto("https://www.pinterest.com/settings/account-settings/");
  await tab.playwright.waitForLoadState({ state: "domcontentloaded" });
  await tab.playwright.waitForTimeout(2000);

  if (gender) {
    const genderRadio = tab.playwright.getByRole("radio", { name: gender });
    if (await genderRadio.count() > 0) {
      await genderRadio.click();
    }
  }

  const saveBtn = tab.playwright.getByRole("button", { name: "??" });
  if (await saveBtn.isEnabled()) {
    await saveBtn.click();
    await tab.playwright.waitForTimeout(1000);
  }
};

