import { expect, test } from "@playwright/test";

async function mockAxateWallet(page) {
  await page.route("https://wallet*.axate.io/bundle.js", async (route) => {
    await route.fulfill({
      contentType: "application/javascript",
      body: "window.__axateWalletLoaded = true;",
    });
  });
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
  await expect(page.getByRole("status")).toContainText("ready");
  expect(hydrationErrors).toEqual([]);
});

test("persists a live environment selection", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Axate environment").selectOption("live");

  await expect(page.getByLabel("Axate environment")).toHaveValue("live");
  await expect(page.getByRole("status")).toContainText("ready");
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
