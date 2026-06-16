
# Pinterest Account Creator Skill

A reusable Codex Skill for automating the creation of Pinterest accounts using the in-app browser via Playwright.

## Features

- **Automated Registration flow:** Handles email and password inputs natively.
- **Robust DOB Handling:** Uses human-like delayed typing (`.type({ delay: 50 })`) to bypass strict React state validation on date inputs.
- **Language-Agnostic Selectors:** Uses element attributes (`type`, `id`, `name`, `aria-label`) instead of relying on visible, translated text, allowing it to work regardless of the browser locale.
- **Handles Modals & Interstitials:** Can gracefully handle post-registration settings, such as demographic questions (e.g., configuring Gender and Birthdate inside Account Settings).

## Installation

Clone this repository directly into your Codex skills directory:

```bash
git clone https://github.com/kakaciro/Pinterest-register.git ~/.codex/skills/pinterest-account-creator
```

## Usage

In your Codex interface, simply mention the skill by its name:

> "Use `pinterest-account-creator` to register a new account with email: example@gettempmail.net"

Codex will automatically load the script and execute the registration process.

### Manual Usage (via Node REPL)

You can also run the underlying Playwright script manually in Codex using the `node_repl` context:

```js
const moduleUrl = "file:///C:/Users/123/.codex/skills/pinterest-account-creator/scripts/register.mjs";
const registerScript = (await import(moduleUrl)).default;

await registerScript({
  tab: globalThis.tab, // Ensure the in-app browser is set up
  email: "example@gettempmail.net",
  password: "MySecurePassword123!",
  dobYear: 1993,
  dobMonth: 12,
  dobDay: 5,
  genderValue: "female" // "female", "male", or "custom"
});
```

