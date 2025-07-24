import { useState } from "react";

export default function StaticryptPage() {
  const [fileContent, setFileContent] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div style={{ maxWidth: 500, margin: "2rem auto", textAlign: "center" }}>
      <h1>Encrypt HTML</h1>
      <input type="file" accept=".html" onChange={handleFileChange} />
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ marginTop: "1rem", width: "100%" }}
        />
      </div>
      <button
        onClick={handleEncrypt}
        disabled={loading || !fileContent || !password}
        style={{ marginTop: "1rem" }}
      >
        {loading ? "Encrypting..." : "Encrypt"}
      </button>
    </div>
  );
}
