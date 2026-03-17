// src/components/Sidebar.jsx — nav buttons only, no content panel
import React from "react";

const TABS = [
  { id: "markers",    label: "Markers & Popups",   emoji: "📍", color: "#ff79c6", phase: 1 },
  { id: "layers",     label: "Layers & Renderers", emoji: "📦", color: "#ffb86c", phase: 1 },
  { id: "query",      label: "Query Features",     emoji: "🔍", color: "#ff5555", phase: 1 },
  { id: "scene",      label: "SceneView 3D",       emoji: "🌐", color: "#8be9fd", phase: 2 },
  { id: "vectortile", label: "Vector Tiles",       emoji: "🗂️", color: "#50fa7b", phase: 2 },
  { id: "widgets",    label: "Widgets",            emoji: "🧩", color: "#bd93f9", phase: 2 },
  { id: "offline",    label: "Offline Maps",       emoji: "📶", color: "#f1fa8c", phase: 2 },
  { id: "restapi",    label: "REST API",           emoji: "📡", color: "#6be5fd", phase: 2 },
];

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <div style={styles.nav}>
      <div style={styles.phaseLabel}>Phase 1 — JS SDK</div>
      {TABS.filter(t => t.phase === 1).map(t => (
        <TabBtn key={t.id} tab={t} active={activeTab === t.id} onClick={() => onTabChange(t.id)} />
      ))}
      <div style={styles.phaseLabel}>Phase 2 — Advanced</div>
      {TABS.filter(t => t.phase === 2).map(t => (
        <TabBtn key={t.id} tab={t} active={activeTab === t.id} onClick={() => onTabChange(t.id)} />
      ))}
    </div>
  );
}

function TabBtn({ tab, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10,
      width: "100%", padding: "10px 16px",
      background: active ? tab.color + "18" : "transparent",
      borderLeft: `3px solid ${active ? tab.color : "transparent"}`,
      border: "none",
      borderLeft: `3px solid ${active ? tab.color : "transparent"}`,
      color: active ? tab.color : "#6272a4",
      cursor: "pointer", fontSize: 13,
      fontWeight: active ? 700 : 400,
      textAlign: "left", transition: "all 0.15s",
    }}>
      <span style={{ fontSize: 15 }}>{tab.emoji}</span>
      <span>{tab.label}</span>
    </button>
  );
}

const styles = {
  nav: { width: "100%", paddingBottom: 8 },
  phaseLabel: {
    color: "#44475a", fontSize: 10,
    textTransform: "uppercase", letterSpacing: 1.5,
    padding: "12px 16px 4px", fontWeight: 700,
  },
};
