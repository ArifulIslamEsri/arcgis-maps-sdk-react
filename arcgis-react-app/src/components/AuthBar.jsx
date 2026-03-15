// src/components/AuthBar.jsx
// ─────────────────────────────────────────────────────────────
// Displays sign-in / sign-out controls and current user info.
// Connects to useArcGISAuth which handles API Key + OAuth setup.
// ─────────────────────────────────────────────────────────────

import React from "react";

export default function AuthBar({ user, authReady, signIn, signOut }) {
  if (!authReady) {
    return (
      <div style={styles.bar}>
        <span style={styles.loading}>Initialising auth…</span>
      </div>
    );
  }

  return (
    <div style={styles.bar}>
      {/* API Key status — always active via esriConfig.apiKey */}
      <span style={styles.badge}>🔑 API Key active</span>

      {/* OAuth section */}
      {user ? (
        <div style={styles.userRow}>
          <span style={styles.userLabel}>
            ✅ Signed in as <strong>{user.userId}</strong>
          </span>
          <button style={styles.btn} onClick={signOut}>
            Sign Out
          </button>
        </div>
      ) : (
        <div style={styles.userRow}>
          <span style={styles.hint}>Sign in with ArcGIS to access private layers</span>
          <button style={{ ...styles.btn, background: "#007ac2" }} onClick={signIn}>
            Sign In (OAuth)
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "10px 20px",
    background: "#1a1a2e",
    borderBottom: "1px solid #333",
    flexWrap: "wrap",
  },
  badge: {
    background: "#2a2a4a",
    color: "#a0c4ff",
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 13,
  },
  userRow: { display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" },
  userLabel: { color: "#ccc", fontSize: 13 },
  hint: { color: "#888", fontSize: 13 },
  btn: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "none",
    background: "#444",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
  },
  loading: { color: "#888", fontSize: 13 },
};
