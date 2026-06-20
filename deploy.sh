#!/usr/bin/env bash
# Deploy the Juhsone site to the VPS (root@72.60.180.77 -> /var/www/juhsone.com)
set -euo pipefail
cd "$(dirname "$0")"
rsync -az --delete index.html styles.css script.js favicon.svg enquire.php assets \
  root@72.60.180.77:/var/www/juhsone.com/
echo "✓ deployed to https://juhsone.com"
