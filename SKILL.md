---
name: pinterest-account-creator
description: Automates Pinterest account creation. Randomly generates password, age (18-35), and name. Selects Female, US, en-US, and 3 random interests.
---

# Pinterest Account Creator

This skill automates Pinterest account registration.

## Requirements
- Target email.
- Password, DOB, Name, Gender, Country, Language, and Interests are auto-selected.

## Usage
Import `scripts/register.mjs` and call it with the Playwright page object and the target email.
