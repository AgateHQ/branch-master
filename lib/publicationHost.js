/**
 * Extract the publisher subdomain from an incoming host header.
 *
 * @param {string|string[]|undefined} hostHeader Incoming forwarded or direct host.
 * @returns {string} Lowercase publisher subdomain, without a port.
 */
export function publisherFromHost(hostHeader) {
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader || "";
  return host.split(",")[0].trim().split(":")[0].split(".")[0].toLowerCase();
}

/**
 * Determine whether a request belongs to the CWH Branch Master fixture.
 *
 * @param {import("http").IncomingMessage} request Next.js server request.
 * @returns {boolean} True only for the CWH publisher subdomain.
 */
export function isCwhRequest(request) {
  const forwardedHost = request?.headers?.["x-forwarded-host"];
  return publisherFromHost(forwardedHost || request?.headers?.host) === "cwh";
}
