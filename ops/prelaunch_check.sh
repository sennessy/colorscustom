#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8090}"
LOG_FILE="${LOG_FILE:-/tmp/colorscustom-prelaunch.log}"

cd "$ROOT_DIR"

echo "[1/4] Tests..."
./mvnw -q test

echo "[2/4] Build package..."
./mvnw -q -DskipTests package

echo "[3/4] Start app on port ${PORT}..."
./mvnw -q -DskipTests spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=${PORT} -Dspring.main.banner-mode=off" >"$LOG_FILE" 2>&1 &
APP_PID=$!

cleanup() {
  kill "$APP_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in $(seq 1 60); do
  if curl -sSf "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "[4/4] HTTP checks..."
for path in / /services /entreprise /boutique /contact /mentions-legales /robots.txt /sitemap.xml /llms.txt; do
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORT}${path}")"
  printf "  %-20s %s\n" "$path" "$code"
done

headers_count="$(curl -sI "http://127.0.0.1:${PORT}/" | rg -i 'content-security-policy|x-frame-options|x-content-type-options|referrer-policy|permissions-policy' | wc -l | tr -d ' ')"
echo "  security headers found: ${headers_count}/5"

map_links_total="$(rg -n "google.com/maps\\?q=" src/main/resources/templates | wc -l | tr -d ' ')"
echo "  maps links using google.com/maps?q=: ${map_links_total}"

echo "Prelaunch check complete."
