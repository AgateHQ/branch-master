import { encryptHtmlToStaticryptPage } from "../../lib/staticrypt";

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

// Drop any address whose newest request is already outside the window, so the
// map cannot grow without bound as clients come and go.
function pruneExpiredEntries(now) {
  for (const [address, timestamps] of requestLog) {
    const newest = timestamps[timestamps.length - 1];
    if (newest === undefined || now - newest >= RATE_LIMIT_WINDOW_MS) {
      requestLog.delete(address);
    }
  }
}

function isRateLimited(clientAddress) {
  const now = Date.now();
  pruneExpiredEntries(now);

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
    const output = await encryptHtmlToStaticryptPage(html, password);

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
