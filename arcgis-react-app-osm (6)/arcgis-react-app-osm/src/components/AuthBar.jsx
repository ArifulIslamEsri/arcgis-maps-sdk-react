// src/components/AuthBar.jsx
import React from "react";

export default function AuthBar({ user, authReady, signIn, signOut }) {
  if (!authReady) return <div style={styles.bar}><span style={styles.hint}>Initialising…</span></div>;
  return (
    <div style={styles.bar}>
      <span style={styles.badge}>🗺️ CARTO tiles — No API key required</span>
      {user ? (
        <div style={styles.row}>
          <span style={styles.user}>✅ {user.userId}</span>
          <button style={styles.btn} onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div style={styles.row}>
          <span style={styles.hint}>Optional: sign in for private layers</span>
          <button style={{ ...styles.btn, background: "#6272a4" }} onClick={signIn}>Sign In</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  bar: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  badge: { background: "#1a0533", color: "#50fa7b", padding: "4px 10px", borderRadius: 6, fontSize: 12, border: "1px solid #2d1b4e" },
  row: { display: "flex", alignItems: "center", gap: 10 },
  user: { color: "#50fa7b", fontSize: 13 },
  hint: { color: "#6272a4", fontSize: 13 },
  btn: { padding: "5px 14px", borderRadius: 6, border: "none", background: "#44475a", color: "#f8f8f2", cursor: "pointer", fontSize: 12 },
};
