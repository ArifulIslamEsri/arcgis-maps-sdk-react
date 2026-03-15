// src/App.jsx
// ─────────────────────────────────────────────────────────────
// Root component. Wires together:
//   - useArcGISAuth  → API Key + OAuth initialisation
//   - AuthBar        → sign-in / sign-out UI
//   - MapPanel       → ArcGIS MapView + basemap switcher
//   - Sidebar        → tab navigation
//   - MarkersPanel   → GraphicsLayer + Graphic + PopupTemplate
//   - LayersPanel    → FeatureLayer + UniqueValueRenderer
//   - QueryPanel     → queryFeatures() with SQL where clause
// ─────────────────────────────────────────────────────────────

import React, { useState, useRef } from "react";
import { useArcGISAuth } from "./hooks/useArcGISAuth";
import AuthBar from "./components/AuthBar";
import MapPanel from "./components/MapPanel";
import Sidebar from "./components/Sidebar";
import MarkersPanel from "./components/MarkersPanel";
import LayersPanel from "./components/LayersPanel";
import QueryPanel from "./components/QueryPanel";
import "./index.css";

export default function App() {
  const { user, authReady, signIn, signOut } = useArcGISAuth();
  const [activeTab, setActiveTab] = useState("markers");
  const viewRef = useRef(null); // shared MapView instance

  // MapPanel calls this once the view is ready
  const handleViewReady = (view) => {
    viewRef.current = view;
  };

  return (
    <div style={styles.app}>
      {/* ── Top bar: title + auth ── */}
      <div style={styles.topBar}>
        <div style={styles.title}>
          <span style={styles.titleEmoji}>🗺️</span>
          <span>ArcGIS Maps SDK — React Sample</span>
        </div>
        <AuthBar user={user} authReady={authReady} signIn={signIn} signOut={signOut} />
      </div>

      {/* ── Main layout: sidebar + map ── */}
      <div style={styles.body}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === "markers" && <MarkersPanel view={viewRef.current} />}
          {activeTab === "layers"  && <LayersPanel  view={viewRef.current} />}
          {activeTab === "query"   && <QueryPanel   view={viewRef.current} />}
        </Sidebar>

        <div style={styles.mapArea}>
          <MapPanel onViewReady={handleViewReady} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#0d0d1a",
    color: "#eee",
    fontFamily: "system-ui, sans-serif",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#0a0a18",
    borderBottom: "1px solid #222",
    padding: "0 20px",
    height: 52,
    flexShrink: 0,
  },
  title: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 700,
    fontSize: 16,
    color: "#fff",
  },
  titleEmoji: { fontSize: 22 },
  body: { display: "flex", flex: 1, overflow: "hidden" },
  mapArea: { flex: 1, display: "flex", flexDirection: "column" },
};
