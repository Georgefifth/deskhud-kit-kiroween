import { chromium, firefox } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "https://kiro-hackathon-lake.vercel.app";
const OUT = process.env.QA_OUT ?? "evidence/stage-3-qa";
const BROWSER = process.env.BROWSER === "chromium" ? "chromium" : "firefox";
const HEADED = process.env.HEADED === "1";

const SHOTS = path.join(OUT, "screens");
fs.mkdirSync(SHOTS, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  { name: "mobile", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 },
];

const scenarios = [
  {
    id: "p0-landing-and-momen-sync",
    title: "Landing page renders without overflow and syncs with Momen PostgreSQL",
    async run(page, ctx) {
      await page.goto("/", { waitUntil: "networkidle" });
      await ctx.expectVisible("header");
      await ctx.expectText(/DESKHUD_OS/);
      await ctx.expectText(/MOMEN_PG:/);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      ctx.assert(overflow <= 1, `horizontal overflow: ${overflow}px`);

      await ctx.shot("landing");
    },
  },
  {
    id: "p0-pulse-hud-heal-and-persist",
    title: "App 1 (PulseHUD) executes Kiro Hook Auto-Heal and persists to Momen PostgreSQL across reload",
    async run(page, ctx) {
      await page.goto("/", { waitUntil: "networkidle" });
      await ctx.expectText(/CYCLES: 3/);
      await ctx.shot("before-heal");

      await page.getByTestId("pulse-heal-btn").click();
      await ctx.expectText(/CYCLES: 0/, 10000);
      await ctx.expectText(/CLEAN · 100\/100/, 10000);
      await ctx.shot("after-heal");

      // Reload page (F5) and verify Momen PostgreSQL audit log persists
      await page.reload({ waitUntil: "networkidle" });
      const pgText = await page.locator("header").innerText();
      ctx.assert(/MOMEN_PG:\s*[1-9]\d*/.test(pgText), `Expected MOMEN_PG > 0 after reload, got: ${pgText}`);
    },
  },
  {
    id: "p0-scale-hud-3d-and-packfit",
    title: "App 2 (ScaleHUD 3D) extrudes custom dimensions, packs 3D container, and inspects exploded CAD rig",
    async run(page, ctx) {
      await page.goto("/", { waitUntil: "networkidle" });
      await page.getByTestId("nav-scale-hud").click();
      await ctx.expectText(/01 \/\/ SELECT E-COMMERCE SKU TWIN/);

      const input = page.getByTestId("metric-spec-input");
      await input.fill("24 x 15 x 9 cm");
      await page.getByTestId("metric-parse-btn").click();
      await ctx.shot("scale-custom-extrude");

      await page.getByTestId("scale-submode-packfit").click();
      await ctx.expectText(/VOLUME UTILIZATION:/);
      await ctx.shot("packfit-3d");

      await page.getByTestId("scale-submode-rig").click();
      await ctx.expectText(/ISOMETRIC CAD RIG/);
      await ctx.expectText(/SUPPLIER QUOTE DRIFT CAUGHT/);
      await ctx.shot("exploded-rig");
    },
  },
  {
    id: "p1-invalid-input-recovery",
    title: "ScaleHUD rejects negative/malformed dimensions with inline error and recovers cleanly",
    async run(page, ctx) {
      await page.goto("/", { waitUntil: "networkidle" });
      await page.getByTestId("nav-scale-hud").click();

      const input = page.getByTestId("metric-spec-input");
      await input.fill("-15 x 10 x 5 cm");
      await page.getByTestId("metric-parse-btn").click();

      await ctx.expectVisible('[data-testid="metric-parse-error"]');
      await ctx.expectText(/NEGATIVE_DIMENSION/);
      await ctx.shot("invalid-input-error");

      await input.fill("20 x 12 x 8 cm");
      await page.getByTestId("metric-parse-btn").click();
      const errCount = await page.locator('[data-testid="metric-parse-error"]').count();
      ctx.assert(errCount === 0, "Expected error banner to clear after valid input");
    },
  },
  {
    id: "p1-camera-rig-and-handy-bot",
    title: "Camera Rig visual director pans/zooms and Handy Bot dispatches commands",
    async run(page, ctx) {
      await page.goto("/", { waitUntil: "networkidle" });
      await page.getByTestId("nav-story-rig").click();
      await ctx.expectText(/CAMERA SHOT LIST/);

      await page.getByTestId("story-play-btn").click();
      await ctx.shot("camera-rig-playing");

      const botInput = page.getByTestId("handy-bot-input");
      await botInput.fill("heal fallow");
      await botInput.press("Enter");
      await ctx.expectText(/HANDY_BOT \/\//);
      await ctx.shot("handy-bot-dispatched");
    },
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function expectVisible(page, selector, timeout = 10000) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: "visible", timeout });
  return locator;
}

async function expectText(page, text, timeout = 10000) {
  const locator = page.getByText(text).first();
  await locator.waitFor({ state: "visible", timeout });
  return locator;
}

function collectIssues(page) {
  const issues = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") issues.push({ kind: "console", text: msg.text() });
  });
  page.on("pageerror", (err) => {
    issues.push({ kind: "pageerror", text: err.message });
  });
  page.on("requestfailed", (req) => {
    const reason = req.failure()?.errorText ?? "request failed";
    if (!reason.includes("ERR_ABORTED") && !reason.includes("NS_BINDING_ABORTED")) {
      issues.push({ kind: "requestfailed", text: `${reason} ${req.url()}` });
    }
  });
  page.on("response", (res) => {
    const status = res.status();
    if (status >= 500) issues.push({ kind: "http", text: `${status} ${res.url()}` });
    else if (status >= 400 && !res.url().includes("favicon.ico")) {
      issues.push({ kind: "http", level: "warn", text: `${status} ${res.url()}` });
    }
  });
  return issues;
}

async function main() {
  const launchOpts = { headless: !HEADED };
  if (BROWSER === "chromium") {
    launchOpts.executablePath = "/home/yap/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome";
  } else {
    launchOpts.executablePath = "/home/yap/.cache/ms-playwright/firefox-1572/firefox/firefox";
  }

  const browserType = BROWSER === "chromium" ? chromium : firefox;
  const browser = await browserType.launch(launchOpts);
  const startedAt = new Date().toISOString();
  const results = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      baseURL: BASE,
      viewport: vp.viewport,
      deviceScaleFactor: vp.deviceScaleFactor,
    });

    for (const scenario of scenarios) {
      const page = await context.newPage();
      const issues = collectIssues(page);
      const screenshots = [];
      const started = Date.now();
      let status = "pass";
      let error = null;

      const ctx = {
        assert,
        expectVisible: (selector, timeout) => expectVisible(page, selector, timeout),
        expectText: (text, timeout) => expectText(page, text, timeout),
        shot: async (name, opts = {}) => {
          const file = path.join(SHOTS, `${scenario.id}-${name}-${vp.name}.png`);
          await page.screenshot({ path: file, fullPage: opts.fullPage ?? true });
          screenshots.push(file);
          return file;
        },
      };

      try {
        await scenario.run(page, ctx);
      } catch (err) {
        status = "fail";
        error = err.message;
      } finally {
        await page.close().catch(() => {});
      }

      const errors = issues.filter((i) => (i.level ?? "error") === "error");
      const warnings = issues.filter((i) => i.level === "warn");
      if (status === "pass" && errors.length > 0) {
        status = "fail";
        error = errors.map((i) => `${i.kind}: ${i.text}`).join(" | ");
      }

      results.push({
        viewport: vp.name,
        id: scenario.id,
        title: scenario.title,
        status,
        ms: Date.now() - started,
        error,
        errors,
        warnings,
        screenshots,
      });

      console.log(
        `${status === "pass" ? "✓" : "✗"} [${vp.name}] ${scenario.id}` +
          (error ? ` — ${error}` : "")
      );
    }

    await context.close();
  }

  await browser.close();

  const summary = {
    total: results.length,
    pass: results.filter((r) => r.status === "pass").length,
    fail: results.filter((r) => r.status === "fail").length,
  };
  const finishedAt = new Date().toISOString();
  const report = {
    base: BASE,
    browser: BROWSER,
    headed: HEADED,
    startedAt,
    finishedAt,
    summary,
    results,
  };

  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(report, null, 2));

  const warnings = results.flatMap((r) =>
    r.warnings.map((w) => `- [${r.viewport}] ${r.id}: ${w.kind} — ${w.text}`)
  );
  const md = [
    `# Stage 3 QA Report — ${finishedAt}`,
    "",
    `- Base URL: ${BASE}`,
    `- Browser: ${BROWSER} (${HEADED ? "headed" : "headless"})`,
    `- Scenarios: ${summary.total} — ${summary.pass} pass, ${summary.fail} fail`,
    "",
    "| Viewport | Scenario | Status | ms | Detail |",
    "|---|---|---|---|---|",
    ...results.map(
      (r) =>
        `| ${r.viewport} | ${r.id} | ${r.status} | ${r.ms} | ${(r.error ?? "").replace(/\|/g, "\\|")} |`
    ),
    "",
    ...(warnings.length ? ["## Warnings", "", ...warnings, ""] : []),
    "## Screenshots",
    "",
    ...results.flatMap((r) => r.screenshots.map((s) => `- ${s}`)),
    "",
  ];
  fs.writeFileSync(path.join(OUT, "report.md"), md.join("\n"));

  console.log(`\n${summary.pass}/${summary.total} passed — see ${OUT}/`);
  process.exit(summary.fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
