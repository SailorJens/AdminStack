// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../auth/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:7777/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({} as any));
        setError((data as any).detail || "Login failed");
        return;
      }

      const data = await response.json();
      const token: string | undefined = data.access_token;

      if (!token) {
        setError("Login succeeded but no access_token was returned.");
        return;
      }

      // ✅ local persistence
      saveToken(token);

      // ✅ go to your protected page
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Network error");
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Login</h1>

        <label style={styles.label}>
          Email
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="you@example.com"
          />
        </label>

        <label style={styles.label}>
          Password
          <input
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </label>

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" style={styles.button}>
          Sign in
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 16,
  },
  card: {
    width: "min(420px, 100%)",
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 20,
    display: "grid",
    gap: 12,
  },
  title: {
    margin: 0,
    marginBottom: 4,
  },
  label: {
    display: "grid",
    gap: 6,
    fontSize: 14,
  },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  button: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #333",
    background: "#333",
    color: "white",
    fontSize: 14,
    cursor: "pointer",
  },
  error: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #f5c2c7",
    background: "#f8d7da",
    color: "#842029",
  },
};
