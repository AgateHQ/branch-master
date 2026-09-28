import { expect, test } from "@playwright/test";

async function mockAxateWallet(page) {
  await page.route(
    /^https:\/\/wallet(?:-staging)?\.axate\.io\/(?:1\.0\.17\/)?bundle\.js$/,
    async (route) => {
      await route.fulfill({
        contentType: "application/javascript",
        body: "window.__axateWalletLoaded = true;",
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
    "https://wallet-staging.axate.io/1.0.17/bundle.js",
  );
  await expect(walletScript).toHaveAttribute(
    "integrity",
    "sha384-z2efofXY+Hbf60NzUF6AZDlrBEcRLYQLSjcmXJyP4k7YxS0BHEewI7aUypXJ9nSe",
  );
  await expect(walletScript).toHaveAttribute("crossorigin", "anonymous");
  expect(hydrationErrors).toEqual([]);
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

test("uses the publisher subdomain in registration links", async ({ page }) => {
  await page.goto("http://rad.localhost:3000/articles/2");

  await expect(
    page.getByRole("link", { name: "Go to new registration" }),
  ).toHaveAttribute("href", /[?&]pub=rad(?:&|$)/);
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

for (const width of [320, 390, 768, 1280]) {
  test(`pages fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const route of [
      "/",
      "/articles/1",
      "/articles/2",
      "/articles/axate-integration",
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
