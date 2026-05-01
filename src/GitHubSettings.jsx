import { useState, useEffect } from "react";
import { Github, Save, CheckCircle, AlertCircle } from "lucide-react";

export default function GitHubSettings() {
  const [username, setUsername] = useState("");
  const [pat, setPat] = useState("");
  const [hasPat, setHasPat] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/users/github", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setUsername(data.github?.github_username || "");
        setHasPat(data.github?.has_pat || false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch("/api/users/github", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          github_username: username,
          github_pat: pat,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setStatus("success");
      setMessage("GitHub settings saved. Your next generation will auto-push to GitHub.");
      setHasPat(pat.length > 0 || hasPat);
      setPat("");
    } catch {
      setStatus("error");
      setMessage("Failed to save GitHub settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        .gh-page {
          min-height: 100vh;
          background: #0a0a0a;
          color: #eaeaea;
          font-family: "Fira Code", monospace;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 3rem 1rem;
        }
        .gh-card {
          width: 100%;
          max-width: 560px;
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 2rem;
        }
        .gh-card:hover {
          border-color: #00ffe7;
          box-shadow: 0 0 15px rgba(0,255,231,0.15);
          transition: all 0.3s ease;
        }
        .gh-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .gh-header h1 {
          font-size: 1.4rem;
          color: #00ffe7;
          text-shadow: 0 0 8px rgba(0,255,231,0.4);
        }
        .gh-subtitle {
          font-size: 0.85rem;
          color: #777;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .gh-form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1.5rem;
        }
        .gh-label {
          font-size: 0.85rem;
          color: #00ffe7;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .gh-hint {
          font-size: 0.75rem;
          color: #555;
          margin-top: 0.4rem;
        }
        .gh-input {
          background: #0d0d0d;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 0.75rem;
          color: #eaeaea;
          font-family: "Fira Code", monospace;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .gh-input:focus {
          outline: none;
          border-color: #00ffe7;
          box-shadow: 0 0 8px rgba(0,255,231,0.3);
        }
        .gh-pat-status {
          margin-top: 0.4rem;
          font-size: 0.75rem;
          color: #52c41a;
        }
        .gh-save-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.75rem;
          background: #00ffe7;
          color: #0a0a0a;
          border: none;
          border-radius: 6px;
          font-family: "Fira Code", monospace;
          font-size: 0.95rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .gh-save-btn:hover:not(:disabled) {
          background: #00ccb5;
          transform: translateY(-2px);
          box-shadow: 0 0 12px rgba(0,255,231,0.5);
        }
        .gh-save-btn:disabled {
          background: #333;
          color: #777;
          cursor: not-allowed;
        }
        .gh-alert {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          padding: 0.85rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        .gh-alert.success {
          background: rgba(82,196,26,0.1);
          border: 1px solid rgba(82,196,26,0.3);
          color: #73d13d;
        }
        .gh-alert.error {
          background: rgba(255,77,79,0.1);
          border: 1px solid rgba(255,77,79,0.3);
          color: #ff4d4f;
        }
        .gh-divider {
          border: none;
          border-top: 1px solid #222;
          margin: 1.75rem 0;
        }
        .gh-info-box {
          background: #0d0d0d;
          border: 1px solid #222;
          border-radius: 6px;
          padding: 1rem;
          font-size: 0.8rem;
          color: #666;
          line-height: 1.7;
        }
        .gh-info-box strong {
          color: #aaa;
        }
      `}</style>

      <div className="gh-page">
        <div className="gh-card">
          <div className="gh-header">
            <Github size={24} color="#00ffe7" />
            <h1>GitHub Settings</h1>
          </div>
          <p className="gh-subtitle">
            Configure once. Every project you generate will be automatically
            pushed to a new private GitHub repository.
          </p>

          {status && (
            <div className={`gh-alert ${status}`}>
              {status === "success" ? (
                <CheckCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              ) : (
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              )}
              {message}
            </div>
          )}

          {loading ? (
            <p style={{ color: "#555", textAlign: "center", padding: "2rem 0" }}>
              Loading...
            </p>
          ) : (
            <form onSubmit={handleSave}>
              <div className="gh-form-group">
                <label className="gh-label">GitHub Username</label>
                <input
                  type="text"
                  className="gh-input"
                  placeholder="your-github-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="gh-form-group">
                <label className="gh-label">Personal Access Token (PAT)</label>
                <input
                  type="password"
                  className="gh-input"
                  placeholder={hasPat ? "••••••••  (saved — enter new to replace)" : "ghp_xxxxxxxxxxxx"}
                  value={pat}
                  onChange={(e) => setPat(e.target.value)}
                />
                {hasPat && !pat && (
                  <span className="gh-pat-status">✓ Token is configured</span>
                )}
                <span className="gh-hint">
                  Requires <strong>repo</strong> scope. Generate at
                  github.com → Settings → Developer settings → Personal access tokens.
                </span>
              </div>

              <button
                type="submit"
                className="gh-save-btn"
                disabled={saving || !username}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </form>
          )}

          <hr className="gh-divider" />

          <div className="gh-info-box">
            <strong>How it works</strong><br />
            After code generation completes, a new private repository named after
            your project is created in your GitHub account and all generated files
            are pushed in a single initial commit. The GitHub repo link will appear
            alongside the download button.
          </div>
        </div>
      </div>
    </>
  );
}
