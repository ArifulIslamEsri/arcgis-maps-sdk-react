// src/App.jsx
import React, { useState, useRef } from "react";
import { useArcGISAuth } from "./hooks/useArcGISAuth";
import AuthBar from "./components/AuthBar";
import MapPanel from "./components/MapPanel";
import Sidebar from "./components/Sidebar";
import MarkersPanel from "./components/MarkersPanel";
import LayersPanel from "./components/LayersPanel";
import QueryPanel from "./components/QueryPanel";
import ScenePanel from "./components/ScenePanel";
import SceneInfoPanel from "./components/SceneInfoPanel";
import VectorTilePanel from "./components/VectorTilePanel";
import WidgetsPanel from "./components/WidgetsPanel";
import OfflinePanel from "./components/OfflinePanel";
import RestApiPanel from "./components/RestApiPanel";
import "./index.css";

const SCENE_TAB = "scene";
// These tabs show full content on the right — no middle panel needed
const NO_MIDDLE_PANEL_TABS = ["offline", "restapi"];
// These tabs don't use the 2D map
const NO_MAP_TABS = ["offline", "restapi"];

export default function App() {
  const { user, authReady, signIn, signOut } = useArcGISAuth();
  const [activeTab, setActiveTab] = useState("markers");
  const [panelWidth, setPanelWidth] = useState(340);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const dragging = useRef(false);
  const viewRef = useRef(null);

  const handleViewReady = (view) => { viewRef.current = view; };
  const isScene = activeTab === SCENE_TAB;
  const noMap = NO_MAP_TABS.includes(activeTab);
  const noMiddle = NO_MIDDLE_PANEL_TABS.includes(activeTab);

  const startDrag = (e) => {
    dragging.current = true;
    const startX = e.clientX;
    const startW = panelWidth;
    const onMove = (ev) => {
      if (!dragging.current) return;
      setPanelWidth(Math.min(600, Math.max(240, startW + ev.clientX - startX)));
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Middle panel content per tab
  const MIDDLE_CONTENT = {
    markers:    <MarkersPanel    view={viewRef.current} />,
    layers:     <LayersPanel     view={viewRef.current} />,
    query:      <QueryPanel      view={viewRef.current} />,
    scene:      <SceneInfoPanel />,
    vectortile: <VectorTilePanel view={viewRef.current} />,
    widgets:    <WidgetsPanel    view={viewRef.current} />,
  };

  const showMiddle = isPanelOpen && !noMiddle;

  return (
    <div style={styles.app}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.titleGroup}>
          <span style={styles.titleEmoji}>🗺️</span>
          <span style={styles.titleText}>ArcGIS Maps SDK</span>
          <span style={styles.titleSub}>React Sample</span>
          <span style={styles.phase}>Phase 1 + 2</span>
        </div>
        <AuthBar user={user} authReady={authReady} signIn={signIn} signOut={signOut} />
      </div>

      {/* Body */}
      <div style={styles.body}>

        {/* Left nav */}
        <div style={styles.navSidebar}>
          <Sidebar activeTab={activeTab} onTabChange={(tab) => {
            setActiveTab(tab);
            if (!NO_MIDDLE_PANEL_TABS.includes(tab)) setIsPanelOpen(true);
          }} />
        </div>

        {/* Middle panel — hidden for offline + restapi */}
        {showMiddle && (
          <>
            <div style={{ ...styles.middlePanel, width: panelWidth }}>
              <div style={styles.panelHeader}>
                <span style={styles.panelTitle}>{activeTab}</span>
                <button style={styles.closeBtn} onClick={() => setIsPanelOpen(false)}>✕</button>
              </div>
              <div style={styles.panelContent}>
                {MIDDLE_CONTENT[activeTab]}
              </div>
            </div>
            <div style={styles.dragHandle} onMouseDown={startDrag}>
              <div style={styles.dragDots}>⋮</div>
            </div>
          </>
        )}

        {/* Collapsed toggle */}
        {!isPanelOpen && !noMiddle && (
          <button style={styles.openBtn} onClick={() => setIsPanelOpen(true)}>▶</button>
        )}

        {/* Right: map or full-page content */}
        <div style={styles.mapArea}>
          {/* Offline + REST — full width right panel */}
          {noMap && (
            <div style={styles.fullPanel}>
              {activeTab === "offline" && <OfflinePanel />}
              {activeTab === "restapi" && <RestApiPanel />}
            </div>
          )}
          {/* SceneView 3D */}
          {isScene && <ScenePanel />}
          {/* 2D map — always mounted so layers persist */}
          <div style={{ ...styles.mapSlot, display: (isScene || noMap) ? "none" : "flex" }}>
            <MapPanel onViewReady={handleViewReady} />
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  app: { display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden", background: "#0a0118", color: "#f8f8f2", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(90deg, #1a0533 0%, #0d0221 50%, #001a33 100%)", borderBottom: "1px solid #44007a", padding: "0 20px", height: 54, flexShrink: 0 },
  titleGroup: { display: "flex", alignItems: "center", gap: 10 },
  titleEmoji: { fontSize: 24 },
  titleText: { fontWeight: 700, fontSize: 16, color: "#f8f8f2" },
  titleSub: { fontWeight: 400, fontSize: 14, color: "#6272a4" },
  phase: { background: "linear-gradient(135deg, #bd93f9, #ff79c6)", color: "#0a0118", fontSize: 11, padding: "3px 10px", borderRadius: 12, fontWeight: 700 },
  body: { display: "flex", flex: 1, overflow: "hidden", minHeight: 0 },
  navSidebar: { width: 200, minWidth: 200, flexShrink: 0, background: "#0d0221", borderRight: "1px solid #2d1b4e", overflowY: "auto" },
  middlePanel: { flexShrink: 0, background: "#110228", borderRight: "1px solid #2d1b4e", display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 240, maxWidth: 600 },
  panelHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "#1a0533", borderBottom: "1px solid #2d1b4e", flexShrink: 0 },
  panelTitle: { color: "#bd93f9", fontSize: 13, fontWeight: 700, textTransform: "capitalize" },
  closeBtn: { background: "transparent", border: "none", color: "#6272a4", cursor: "pointer", fontSize: 14, padding: "2px 6px", borderRadius: 4 },
  panelContent: { flex: 1, overflowY: "auto", overflowX: "hidden" },
  dragHandle: { width: 6, flexShrink: 0, background: "#1a0533", borderRight: "1px solid #2d1b4e", cursor: "col-resize", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none" },
  dragDots: { color: "#44475a", fontSize: 14 },
  openBtn: { width: 20, flexShrink: 0, background: "#1a0533", border: "none", borderRight: "1px solid #2d1b4e", color: "#bd93f9", cursor: "pointer", fontSize: 10, padding: 0 },
  mapArea: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 },
  mapSlot: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  fullPanel: { flex: 1, overflowY: "auto", background: "#0a0118" },
};
