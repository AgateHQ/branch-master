import fs from "fs";
import path from "path";
import cryptoEngine from "staticrypt/lib/cryptoEngine.js";
import codecModule from "staticrypt/lib/codec.js";
import { renderTemplate } from "staticrypt/lib/formater.js";
import { buildStaticryptJS } from "staticrypt/cli/helpers.js";

const { encode } = codecModule.init(cryptoEngine);

const MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_HTML_CHARACTERS = 1_500_000;
const requestLog = new Map();

function getClientAddress(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function isRateLimited(clientAddress) {
  const now = Date.now();
  const recentRequests = (requestLog.get(clientAddress) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recentRequests.length >= MAX_REQUESTS) {
    requestLog.set(clientAddress, recentRequests);
    return true;
  }

  requestLog.set(clientAddress, [...recentRequests, now]);
  return false;
}

function looksLikeHtml(value) {
  return /<(?:!doctype\s+html|html|head|body)[\s>]/i.test(value);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (isRateLimited(getClientAddress(req))) {
    res.setHeader("Retry-After", "60");
    res.status(429).json({ message: "Too many encryption requests" });
    return;
  }

  const { html, password } = req.body || {};
  if (typeof html !== "string" || typeof password !== "string") {
    res.status(400).json({ message: "Missing html or password" });
    return;
  }

  if (!html || !password || password.length > 256) {
    res.status(400).json({ message: "Invalid html or password" });
    return;
  }

  if (html.length > MAX_HTML_CHARACTERS) {
    res.status(413).json({ message: "HTML file is too large" });
    return;
  }

  if (!looksLikeHtml(html)) {
    res
      .status(400)
      .json({ message: "Uploaded content must be an HTML document" });
    return;
  }

  try {
    const salt = cryptoEngine.generateRandomSalt();
    const encryptedMsg = await encode(html, password, salt);

    const templatePath = path.join(
      process.cwd(),
      "lib",
      "password_template.html",
    );
    const template = fs.readFileSync(templatePath, "utf8");

    const staticryptConfig = {
      staticryptEncryptedMsgUniqueVariableName: encryptedMsg,
      isRememberEnabled: true,
      rememberDurationInDays: 30,
      staticryptSaltUniqueVariableName: salt,
    };

    const templateData = {
      is_remember_enabled: JSON.stringify(true),
      js_staticrypt: buildStaticryptJS(),
      template_button: "DECRYPT",
      template_color_primary: "#4CAF50",
      template_color_secondary: "#76B852",
      template_error: "Bad password!",
      template_instructions:
        "Enter the password you chose to decrypt this page. You can also select 'Remember me' to skip the password for 30 days.",
      template_placeholder: "Password",
      template_remember: "Remember me",
      template_title: "Protected Page",
      template_toggle_show: "Show password",
      template_toggle_hide: "Hide password",
      staticrypt_config: staticryptConfig,
    };

    const output = renderTemplate(template, templateData);

    res.setHeader("Content-Type", "text/html");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="encrypted.html"',
    );
    res.status(200).send(output);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Encryption failed" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "2mb",
    },
  },
};
