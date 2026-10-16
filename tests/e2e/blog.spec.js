import { createHash } from "node:crypto";
import { expect, test } from "@playwright/test";

const walletBody = "window.__axateWalletLoaded = true;";
const integrity = `sha384-${createHash("sha384").update(walletBody).digest("base64")}`;
const manifest = {
  schemaVersion: 1,
  recommendedVersion: "1.0.19",
  releases: ["1.0.17", "1.0.19"].map((version) => ({
    version,
    url: `https://wallet-staging.axate.io/${version}/bundle.js`,
    integrity,
  })),
};

async function mockAxateWallet(page) {
  await page.route("**/api/axate-versions", (route) =>
    route.fulfill({ json: manifest }),
  );
  await page.route(
    /^https:\/\/wallet(?:-staging)?\.axate\.io\/(?:1\.0\.\d+\/)?bundle\.js$/,
    async (route) => {
      await route.fulfill({
        contentType: "application/javascript",
        body: walletBody,
      });
    },
  );
}

test.beforeEach(async ({ page }) => {
  await mockAxateWallet(page);
});

test("loads staging by default without hydration errors", async ({ page }) => {
  const hydrationErrors = [];
  page.on("console", (message) => {
    if (/hydration|did not match/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Branch Master News" }),
  ).toBeVisible();
  await expect(page.getByLabel("Axate environment")).toHaveValue("staging");
  const walletScript = page.locator("#axate-wallet-staging");
  await expect(walletScript).toHaveAttribute(
    "src",
    "https://wallet-staging.axate.io/1.0.19/bundle.js",
  );
  await expect(walletScript).toHaveAttribute("integrity", integrity);
  await expect(walletScript).toHaveAttribute("crossorigin", "anonymous");
  expect(hydrationErrors).toEqual([]);

  // The article route is server-rendered, so confirm its hydrated output does
  // not diverge from the server HTML (the stored environment drives the
  // registration link, which is attached after hydration).
  await page.goto("/articles/2");
  await expect(
    page.getByRole("heading", { name: "Paywall Implementation Playbook #2" }),
  ).toBeVisible();
  expect(hydrationErrors).toEqual([]);
});

test("loads the unversioned staging wallet by default on KWR", async ({
  page,
}) => {
  await page.goto("http://kwr.localhost:3000/");

  const walletScript = page.locator("#axate-wallet-staging");
  await expect(walletScript).toHaveAttribute(
    "src",
    "https://wallet-staging.axate.io/bundle.js",
  );
  await expect(walletScript).not.toHaveAttribute("integrity", /.+/);
  await expect(page.getByLabel("Axate staging version")).toHaveValue(
    "development",
  );
});

test("emits the KWR edition tag in the initial article HTML", async ({
  request,
}) => {
  for (const articleId of [2, 4, 8, 12, 18]) {
    const response = await request.get(`/articles/${articleId}`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(
      '<meta property="article:tag" content="christmas-2026"',
    );
  }

  const ordinaryArticle = await request.get("/articles/6");
  expect(ordinaryArticle.status()).toBe(200);
  expect(await ordinaryArticle.text()).not.toContain('property="article:tag"');
});

test("lists only Christmas articles from the Christmas menu item", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Christmas edition" }).click();

  await expect(page).toHaveURL(/\/christmas$/);
  await expect(
    page.getByRole("heading", { name: "Christmas 2026 edition" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 3 })).toHaveCount(5);
  await expect(page.getByRole("heading", { name: "Article #2" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Article #4" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Article #8" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Article #12" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Article #18" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Article #3" })).toHaveCount(
    0,
  );
});

test("marks the free control article as accessible for free", async ({
  request,
}) => {
  const freeControl = await (await request.get("/articles/6")).text();
  expect(freeControl).toContain('"isAccessibleForFree":true');
  expect(freeControl).not.toContain("data-premium-height");
  expect(freeControl).not.toContain('class="axate-notice"');

  const premium = await (await request.get("/articles/2")).text();
  expect(premium).toContain('"isAccessibleForFree":false');
  expect(premium).toContain('"cssSelector":".premium"');
  expect(premium).toContain("data-premium-height");
  expect(premium).toContain('class="axate-notice"');
});

test("persists a live environment selection", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Axate environment").selectOption("live");

  await expect(page.getByLabel("Axate environment")).toHaveValue("live");
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("selectedEnvironment")),
    )
    .toBe("live");
});

test("migrates the legacy selectedEnviroment key", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("selectedEnviroment", "live");
  });
  await page.goto("/");

  await expect(page.getByLabel("Axate environment")).toHaveValue("live");
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("selectedEnvironment")),
    )
    .toBe("live");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("selectedEnviroment")))
    .toBeNull();
});

test("uses the live registration origin when live is selected", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Axate environment").selectOption("live");
  await page.goto("/articles/2");

  await expect(
    page.getByRole("link", { name: "Go to new registration" }),
  ).toHaveAttribute("href", /^https:\/\/register\.axate\.io\//);
});

test("uses the publisher subdomain in registration links", async ({ page }) => {
  await page.goto("http://rad.localhost:3000/articles/2");

  await expect(
    page.getByRole("link", { name: "Go to new registration" }),
  ).toHaveAttribute("href", /[?&]pub=rad(?:&|$)/);
});

test("omits the registration link on the free control article", async ({
  page,
}) => {
  await page.goto("/articles/6");
  await expect(
    page.getByRole("link", { name: "Go to new registration" }),
  ).toHaveCount(0);

  await page.goto("/articles/2");
  await expect(
    page.getByRole("link", { name: "Go to new registration" }),
  ).toHaveCount(1);
});

test("alternates Axate button mode by article id", async ({ page }) => {
  await page.goto("/articles/1");
  await expect(page.locator("#axate-wallet")).toHaveAttribute(
    "data-selector-button-mode",
    "true",
  );
  await expect(page.locator(".premium")).toHaveCount(1);
  await expect(page.locator(".axate-notice")).toHaveCount(1);

  await page.goto("/articles/2");
  await expect(page.locator("#axate-wallet")).toHaveAttribute(
    "data-selector-button-mode",
    "false",
  );
});

test("shows comment actions for comments without replies", async ({ page }) => {
  await page.goto("/articles/2");

  await expect(
    page.getByRole("heading", { name: "Comments (4)", level: 2 }),
  ).toBeVisible();

  const commentWithoutReplies = page
    .locator("article")
    .filter({ hasText: "Michael Park" });
  await expect(
    commentWithoutReplies.getByRole("button", {
      name: "Reply to Michael Park",
    }),
  ).toBeVisible();

  const likeButton = commentWithoutReplies.getByRole("button", {
    name: "Like",
  });
  await expect(likeButton).toBeVisible();
  await expect(likeButton).toHaveAttribute("aria-pressed", "false");
  await likeButton.click();
  await expect(likeButton).toHaveAttribute("aria-pressed", "true");

  await expect(
    commentWithoutReplies.getByRole("button", {
      name: "Report comment by Michael Park",
    }),
  ).toBeVisible();
});

test("keeps the comment controls at their documented size", async ({
  page,
}) => {
  await page.goto("/articles/2");

  const field = page.locator('input[aria-label="Name"]');
  const action = page.getByRole("button", { name: "Like" }).first();

  const fieldBox = await field.boundingBox();
  const actionBox = await action.boundingBox();

  // The comment block is deliberately slimmer than the site-wide 44px touch
  // target documented in README, but must still clear the 24x24px WCAG 2.5.8
  // target-size minimum on both axes ("Like" is the narrowest action).
  expect(fieldBox.height).toBeGreaterThanOrEqual(24);
  expect(fieldBox.height).toBeLessThanOrEqual(36);
  expect(actionBox.width).toBeGreaterThanOrEqual(24);
  expect(actionBox.height).toBeGreaterThanOrEqual(24);
  expect(actionBox.height).toBeLessThanOrEqual(32);
});

test("validates and encrypts uploaded HTML", async ({ request }) => {
  const invalidResponse = await request.post("/api/encrypt", {
    data: { html: "", password: "" },
  });
  expect(invalidResponse.status()).toBe(400);

  const encryptedResponse = await request.post("/api/encrypt", {
    data: {
      html: "<!doctype html><html><body><h1>Protected</h1></body></html>",
      password: "test-password",
    },
  });
  expect(encryptedResponse.status()).toBe(200);
  expect(encryptedResponse.headers()["content-disposition"]).toContain(
    'filename="encrypted.html"',
  );
  expect(await encryptedResponse.text()).toContain("Protected Page");
});

test("masks and toggles the Staticrypt password", async ({ page }) => {
  await page.goto("/staticrypt");
  const password = page.getByLabel("Password", { exact: true });

  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Hide password" }).click();
  await expect(password).toHaveAttribute("type", "password");
});

test("shows an inline error when encryption fails", async ({ page }) => {
  await page.route("**/api/encrypt", (route) =>
    route.fulfill({ status: 500, json: {} }),
  );

  await page.goto("/staticrypt");
  await page.getByLabel("HTML file").setInputFiles({
    name: "page.html",
    mimeType: "text/html",
    buffer: Buffer.from("<!doctype html><html><body>Hi</body></html>"),
  });
  await page.getByLabel("Password", { exact: true }).fill("secret");
  await page.getByRole("button", { name: "Encrypt", exact: true }).click();

  await expect(
    page.getByRole("alert").filter({ hasText: "Encryption failed" }),
  ).toBeVisible();
});

for (const width of [320, 390, 768, 1280]) {
  test(`pages fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const route of [
      "/",
      "/articles/1",
      "/articles/2",
      "/articles/6",
      "/staticrypt",
    ]) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}

test("mobile navigation and keyboard skip link work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForFunction(() => window.next?.router?.isReady);
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("link", { name: "Latest stories", exact: true }).click();
  await expect(page.locator("#latest-heading")).toBeInViewport();
  const select = await page.getByLabel("Axate environment").boundingBox();
  expect(select.height).toBeGreaterThanOrEqual(44);
  await page.getByRole("link", { name: "Encrypt HTML", exact: true }).click();
  await expect(page.getByLabel("HTML file")).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
});

test("story links and random navigation load fresh documents", async ({
  page,
}) => {
  await page.goto("/");

  async function expectDocumentNavigation(control, url) {
    await page.evaluate(() => {
      window.__previousDocument = true;
    });
    await Promise.all([
      page.waitForEvent(
        "request",
        (request) =>
          request.isNavigationRequest() && request.frame() === page.mainFrame(),
      ),
      control.click(),
    ]);
    await page.waitForURL(url);
    await expect
      .poll(() => page.evaluate(() => window.__previousDocument))
      .toBeUndefined();
    await expect(page.locator("#axate-wallet-staging")).toHaveCount(1);
  }

  await expectDocumentNavigation(
    page
      .locator('a[href^="/articles/"]')
      .filter({ hasText: "Read story" })
      .first(),
    /\/articles\/\d+$/,
  );
  await expectDocumentNavigation(
    page.getByRole("link", { name: "All stories" }),
    /\/$/,
  );
  await expectDocumentNavigation(
    page.locator('a[href="/articles/2"]').first(),
    /\/articles\/2$/,
  );
  await expect(page.locator("#axate-wallet")).toHaveAttribute(
    "data-selector-button-mode",
    "false",
  );
  await page.evaluate(() => {
    window.crypto.getRandomValues = (values) => {
      values[0] = 3;
      return values;
    };
  });
  await expectDocumentNavigation(
    page.getByRole("button", { name: "Go to a Random Article" }),
    /\/articles\/3$/,
  );
  await expect(page.locator("#axate-wallet")).toHaveAttribute(
    "data-selector-button-mode",
    "true",
  );
});

test("pins staging versions and returns to latest", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Axate staging version").selectOption("1.0.17");
  await expect(page.locator("#axate-wallet-staging")).toHaveAttribute(
    "src",
    manifest.releases[0].url,
  );
  await expect(page.locator("#axate-wallet-staging")).toHaveAttribute(
    "integrity",
    integrity,
  );
  await expect
    .poll(() => page.evaluate(() => window.__axateWalletLoaded))
    .toBe(true);
  await page.getByLabel("Axate staging version").selectOption("latest");
  await expect(page.locator("#axate-wallet-staging")).toHaveAttribute(
    "src",
    manifest.releases[1].url,
  );
});

test("persists a pinned staging version on KWR", async ({ page }) => {
  await page.goto("http://kwr.localhost:3000/");
  await expect(page.getByLabel("Axate staging version")).toHaveValue(
    "development",
  );

  await page.getByLabel("Axate staging version").selectOption("1.0.17");
  await expect(page.locator("#axate-wallet-staging")).toHaveAttribute(
    "src",
    manifest.releases[0].url,
  );
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("selectedStagingVersion")),
    )
    .toBe("1.0.17");
  await expect(page.getByLabel("Axate staging version")).toHaveValue("1.0.17");
});

test("does not load a staging bundle when the manifest fails", async ({
  page,
}) => {
  await page.route("**/api/axate-versions", (route) =>
    route.fulfill({ status: 502, json: {} }),
  );
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText(
    "staging version unavailable",
  );
  await expect(page.locator("#axate-wallet-staging")).toHaveCount(0);
  await page.getByLabel("Axate environment").selectOption("live");
  await expect(page.locator("#axate-wallet-live")).toHaveAttribute(
    "src",
    "https://wallet.axate.io/bundle.js",
  );
});
