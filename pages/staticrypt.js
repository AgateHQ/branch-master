import { useEffect, useState } from "react";
import styles from "../styles/Article.module.css";

function generateSecurePassword(length = 16) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (x) => charset[x % charset.length]).join("");
}

export default function StaticryptPage() {
  const [fileContent, setFileContent] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPassword(generateSecurePassword());
  }, []);

  const handleGeneratePassword = () => {
    setPassword(generateSecurePassword());
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileContent("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFileContent(reader.result.toString());
    };
    reader.readAsText(file);
  };

  const handleEncrypt = async () => {
    if (!fileContent || !password) return;
    setLoading(true);
    try {
      const res = await fetch("/api/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: fileContent, password }),
      });
      if (!res.ok) {
        alert("Encryption failed");
        setLoading(false);
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
      alert("Encryption failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div
        className={styles.article}
        style={{ padding: "2rem", textAlign: "center" }}
      >
        <h1 className={styles.title}>Encrypt HTML</h1>
        <p style={{ marginTop: "0.5rem" }}>
          Upload an HTML file and choose a password to generate a
          password-protected version. The encrypted file will ask for the
          password when opened and includes a "Remember me" option to store it
          for 30 days.
        </p>
        <input type="file" accept=".html" onChange={handleFileChange} />
        <div>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ marginTop: "1rem", width: "100%", padding: "0.5rem" }}
          />
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
      </div>
    </main>
  );
}
