// src/components/Sidebar.jsx
import React from "react";

const TABS = [
  { id: "markers",    label: "Markers & Popups",   emoji: "📍", color: "#ff79c6" },
  { id: "layers",     label: "Layers & Renderers", emoji: "📦", color: "#ffb86c" },
  { id: "query",      label: "Query Features",     emoji: "🔍", color: "#ff5555" },
  { id: "scene",      label: "SceneView 3D",       emoji: "🌐", color: "#8be9fd" },
  { id: "vectortile", label: "Vector Tiles",       emoji: "🗂️", color: "#50fa7b" },
  { id: "widgets",    label: "Widgets",            emoji: "🧩", color: "#bd93f9" },
  { id: "offline",    label: "Offline Maps",       emoji: "📶", color: "#f1fa8c" },
  { id: "restapi",    label: "REST API",           emoji: "📡", color: "#6be5fd" },
  { id: "globe3d",    label: "Globe & Terrain",    emoji: "🏔️", color: "#ff79c6" },
  { id: "digitaltwin",label: "Digital Twins",      emoji: "🏙️", color: "#50fa7b" },
  { id: "immersive",  label: "Immersive / XR",     emoji: "🥽", color: "#bd93f9" },
];

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <div style={styles.nav}>
      {TABS.map(t => (
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
  nav: { width: "100%", paddingTop: 8, paddingBottom: 8 },
};
