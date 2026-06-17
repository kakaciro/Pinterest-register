#!/bin/bash
EMAIL=$1
if [ -z "$EMAIL" ]; then
  echo "Usage: register-pinterest <email>"
  exit 1
fi

echo "Checking Chrome CDP on 127.0.0.1:9333..."
if ! curl -s http://127.0.0.1:9333/json/version > /dev/null; then
  echo "CDP not detected. Launching Windows Chrome bridge..."
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\MAC Chrome\bridging\reddit-automation\connect-playwright-chrome.ps1" -ShortcutPath 'C:\MAC Chrome\Chrome 1.lnk' -SessionName 'pinterest_reg' -Url 'https://www.pinterest.com'
  sleep 3
fi

SKILL_DIR="$HOME/.hermes/skills/pinterest-account-creator"
WIN_TEMP_JS="/mnt/c/Users/123/Desktop/pinterest_reg_temp.js"

cp "$SKILL_DIR/scripts/run_windows.js" "$WIN_TEMP_JS"

echo "Executing Playwright via Windows Node..."
powershell.exe -NoProfile -Command "\$env:NODE_PATH = 'C:\Users\123\AppData\Roaming\npm\node_modules\@playwright\cli\node_modules'; node C:\Users\123\Desktop\pinterest_reg_temp.js $EMAIL"

rm -f "$WIN_TEMP_JS"
echo "Done."