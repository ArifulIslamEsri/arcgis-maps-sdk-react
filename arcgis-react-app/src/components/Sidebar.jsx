// src/components/Sidebar.jsx
// Navigation sidebar — switches between the 4 concept panels

import React from "react";

const TABS = [
  { id: "markers", label: "Markers & Popups", emoji: "📍", color: "#00b4d8" },
  { id: "layers",  label: "Layers & Renderers", emoji: "📦", color: "#f77f00" },
  { id: "query",   label: "Query Features",    emoji: "🔍", color: "#ff6b6b" },
];

export default function Sidebar({ activeTab, onTabChange, children }) {
  return (
    <div style={styles.sidebar}>
      <div style={styles.tabRow}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            style={{
              ...styles.tabBtn,
              borderBottom: activeTab === t.id ? `2px solid ${t.color}` : "2px solid transparent",
              color: activeTab === t.id ? t.color : "#666",
            }}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>
      <div style={styles.content}>{children}</div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: 320,
    minWidth: 280,
    background: "#12121e",
    borderRight: "1px solid #222",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  tabRow: {
    display: "flex",
    flexDirection: "column",
    borderBottom: "1px solid #222",
    padding: "8px 0",
  },
  tabBtn: {
    background: "transparent",
    border: "none",
    padding: "9px 16px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.2,
    transition: "color 0.15s",
  },
  content: { flex: 1, overflowY: "auto" },
};
