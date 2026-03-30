import fs from "node:fs/promises";
import path from "node:path";

const playwrightModule = process.env.PLAYWRIGHT_MODULE || "playwright";
const { chromium, devices } = await import(playwrightModule);

const baseUrl = process.env.QA_BASE_URL || "http://localhost:8081";
const outputDir = process.env.QA_OUTPUT_DIR || "/tmp/colorscustom-qa";
const sitemapPath = process.env.QA_SITEMAP_PATH || "src/main/resources/static/sitemap.xml";

const xml = await fs.readFile(sitemapPath, "utf8");
const routes = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

const targets = [
  {
    name: "desktop",
    viewport: { width: 1440, height: 2200 },
    userAgent: undefined,
    isMobile: false,
  },
  {
    name: "mobile",
    ...devices["iPhone 14"],
  },
];

const browser = await chromium.launch({ headless: true });
const report = [];

for (const target of targets) {
  const dir = path.join(outputDir, "screenshots", target.name);
  await fs.mkdir(dir, { recursive: true });
  const context = await browser.newContext(
    target.viewport
      ? {
          viewport: target.viewport,
          userAgent: target.userAgent,
          isMobile: target.isMobile,
          hasTouch: target.isMobile,
        }
      : target
  );
  const page = await context.newPage();

  for (const route of routes) {
    const url = new URL(route, baseUrl).toString();
    const safeName = route === "/" ? "home" : route.replaceAll("/", "__").replace(/^__/, "");
    const errors = [];

    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(`console:${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => {
      errors.push(`pageerror:${err.message}`);
    });

    const response = await page.goto(url, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(dir, `${safeName}.png`),
      fullPage: true,
    });

    report.push({
      target: target.name,
      route,
      status: response?.status() ?? 0,
      errors,
      screenshot: path.join(dir, `${safeName}.png`),
    });
  }

  await context.close();
}

await browser.close();
await fs.mkdir(path.join(outputDir, "reports"), { recursive: true });
await fs.writeFile(
  path.join(outputDir, "reports", "visual-qa-report.json"),
  JSON.stringify(report, null, 2)
);
