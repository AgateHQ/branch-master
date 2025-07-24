import fs from "fs";
import path from "path";
import cryptoEngine from "staticrypt/lib/cryptoEngine.js";
import codecModule from "staticrypt/lib/codec.js";
import { renderTemplate } from "staticrypt/lib/formater.js";
import { buildStaticryptJS } from "staticrypt/cli/helpers.js";

const { encode } = codecModule.init(cryptoEngine);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { html, password } = req.body || {};
  if (!html || !password) {
    res.status(400).json({ message: "Missing html or password" });
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
      isRememberEnabled: false,
      rememberDurationInDays: 0,
      staticryptSaltUniqueVariableName: salt,
    };

    const templateData = {
      is_remember_enabled: JSON.stringify(false),
      js_staticrypt: buildStaticryptJS(),
      template_button: "DECRYPT",
      template_color_primary: "#4CAF50",
      template_color_secondary: "#76B852",
      template_error: "Bad password!",
      template_instructions: "",
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
