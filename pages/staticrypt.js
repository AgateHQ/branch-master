import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Article.module.css";

// Mirrors MAX_HTML_CHARACTERS in pages/api/encrypt.js so oversized files are
// rejected before an upload round-trip.
const MAX_HTML_CHARACTERS = 1_500_000;

function generateSecurePassword(length = 16) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (x) => charset[x % charset.length]).join("");
}

export default function StaticryptPage() {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGeneratePassword = () => {
    setPassword(generateSecurePassword());
    setShowPassword(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    // Clear the input so the same file can be selected again later.
    e.target.value = "";
    setError("");
    if (!file) {
      setFileContent("");
      setFileName("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result.toString();
      if (content.length > MAX_HTML_CHARACTERS) {
        setFileContent("");
        setFileName("");
        setError(
          `That file is too large (limit ${MAX_HTML_CHARACTERS.toLocaleString()} characters).`,
        );
        return;
      }
      setFileContent(content);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleEncrypt = async () => {
    if (!fileContent || !password) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: fileContent, password }),
      });
      if (!res.ok) {
        setError("Encryption failed. Please try again.");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "encrypted.html";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Encryption failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" tabIndex={-1} className={styles.main}>
      <Head>
        <title>Encrypt HTML | Branch Master News</title>
      </Head>
      <a href="/" className={styles.backButton}>
        ← All stories
      </a>
      <div className={styles.article}>
        <h1 className={styles.title}>Encrypt HTML</h1>
        <p style={{ marginTop: "0.5rem" }}>
          Upload an HTML file and choose a password to generate a
          password-protected version. The encrypted file will ask for the
          password when opened and includes a "Remember me" option to store it
          for 30 days.
        </p>
        <label htmlFor="html-file">HTML file</label>
        <input
          id="html-file"
          type="file"
          accept=".html"
          onChange={handleFileChange}
        />
        {fileName && (
          <p style={{ marginTop: "0.25rem" }} aria-live="polite">
            Selected: {fileName}
          </p>
        )}
        <div>
          <label htmlFor="password">Password</label>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginTop: "1rem",
              alignItems: "stretch",
            }}
          >
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ flex: 1, padding: "0.5rem" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button
          onClick={handleGeneratePassword}
          style={{ marginTop: "0.75rem" }}
        >
          Generate secure password
        </button>
        <button
          onClick={handleEncrypt}
          disabled={loading || !fileContent || !password}
          style={{ marginTop: "1rem" }}
        >
          {loading ? "Encrypting..." : "Encrypt"}
        </button>
        {error && (
          <p role="alert" style={{ marginTop: "1rem", color: "#b00020" }}>
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
