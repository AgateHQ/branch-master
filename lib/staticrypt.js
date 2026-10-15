// Thin wrapper around Staticrypt's internals.
//
// Staticrypt does not expose a supported programmatic API, so `pages/api/encrypt.js`
// depends on deep imports from the package (`lib/*`, `cli/helpers.js`). Keeping
// them here means a Staticrypt upgrade only has to be reconciled in one place.
import fs from "fs";
import path from "path";
import cryptoEngine from "staticrypt/lib/cryptoEngine.js";
import codecModule from "staticrypt/lib/codec.js";
import { renderTemplate } from "staticrypt/lib/formater.js";
import { buildStaticryptJS } from "staticrypt/cli/helpers.js";

const { encode } = codecModule.init(cryptoEngine);

const TEMPLATE_PATH = path.join(process.cwd(), "lib", "password_template.html");

/**
 * Encrypt an HTML document with a password and return a self-contained
 * password-protected page (Staticrypt's "remember me" template).
 */
export async function encryptHtmlToStaticryptPage(html, password) {
  const salt = cryptoEngine.generateRandomSalt();
  const encryptedMsg = await encode(html, password, salt);
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");

  return renderTemplate(template, {
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
    staticrypt_config: {
      staticryptEncryptedMsgUniqueVariableName: encryptedMsg,
      isRememberEnabled: true,
      rememberDurationInDays: 30,
      staticryptSaltUniqueVariableName: salt,
    },
  });
}
