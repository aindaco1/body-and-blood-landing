#!/usr/bin/env bash
set -euo pipefail
exec bundle exec ruby -run -e httpd _site -p 4187 -b 127.0.0.1
