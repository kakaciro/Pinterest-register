---
name: pinterest-account-creator
description: One-command Pinterest registration via attached Windows Chrome. Skips WSL CDP proxy issues by executing directly in Windows PowerShell.
---

# Pinterest Account Creator (Windows Chrome Bridge)

This skill provides a fully automated, one-command Pinterest registration workflow tailored for the Windows Chrome + WSL environment. It bypasses WSL network isolation issues by generating and running the Playwright script directly on the Windows side.

## What was learned & fixed
1. **WSL to Windows CDP Networking**: Connecting to `127.0.0.1:9333` from WSL Playwright often throws `ECONNREFUSED`. Executing the Node script on the Windows side via PowerShell solves this.
2. **Playwright Module Resolution**: `NODE_PATH` must point to the Windows global npm `@playwright/cli` tree.
3. **Pinterest NUX Flow**: The onboarding popup has updated components. `select` elements are now custom comboboxes. We bypass them efficiently by accepting default local settings via "Next/Continue", then selecting 3 specific interest checkboxes (`[data-test-id^="use-case-tap-area"]`) and clicking `[data-test-id="skip-or-continue-button"]`.
4. **Disconnection Error**: Using `browser.disconnect()` threw exceptions in this version. Use `browser.close()` for proper cleanup on CDP.

## Usage

A global command has been mapped. Simply run:

```bash
register-pinterest <email>
```

Example:
```bash
register-pinterest boldlion4996@codelearnfast.com
```

This will:
1. Ensure the Windows Chrome bridge is running on port 9333.
2. Bridge the execution to Windows Node.js.
3. Return the generated password, dob, and name.