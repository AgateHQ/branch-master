import { expect, test } from "@playwright/test";

test("does not advertise the server framework", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(response.headers()["x-powered-by"]).toBeUndefined();
});

test("robots.txt disallows all crawlers", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("User-agent: *");
  expect(body).toContain("Disallow: /");
});

test("share links include the article id", async ({ request }) => {
  // The share title is built from the article headline, so the encoded id must
  // appear in the server-rendered tweet URL.
  const html = await (await request.get("/articles/2")).text();
  expect(html).toContain("Paywall%20Implementation%20Playbook%20%232");
});
