// src/components/SceneInfoPanel.jsx
// Beginner JS guide for SceneView 3D

import React, { useState } from "react";

const CONCEPTS = [
  {
    term: "SceneView vs MapView",
    color: "#8be9fd",
    def: "MapView renders a flat 2D map. SceneView renders a 3D globe using WebGL. Both take a Map object — the difference is the view. SceneView adds camera, tilt, altitude, and atmosphere.",
  },
  {
    term: "Camera object",
    color: "#bd93f9",
    def: "Controls where you're looking in 3D space. Has position (longitude, latitude, z=altitude in meters), tilt (0=top-down, 90=horizon), and heading (compass direction). Change it to fly anywhere.",
  },
  {
    term: "ground: 'world-elevation'",
    color: "#50fa7b",
    def: "Adds real-world terrain height data to the scene. Mountains, valleys and canyons appear as actual 3D shapes. Requires an API key. Without it the globe is flat.",
  },
  {
    term: "view.goTo()",
    color: "#ff79c6",
    def: "Animates the camera to a new position. Works in both MapView and SceneView. Pass a geometry, extent, or camera object. Add { duration: 2000 } for a smooth 2-second fly animation.",
  },
  {
    term: "environment",
    color: "#ffb86c",
    def: "SceneView-only property. Controls atmosphere quality (none/low/high), lighting direction based on real date/time, and star rendering. Makes the globe look photorealistic.",
  },
  {
    term: "WebScene vs Map",
    color: "#f1fa8c",
    def: "A regular Map works fine in SceneView for basic use. WebScene is a special 3D-aware map saved in ArcGIS Online — it stores layer ordering, camera position, and lighting as part of the saved item.",
  },
  {
    term: "Z values (altitude)",
    color: "#6be5fd",
    def: "In 3D, coordinates have a Z value = height in meters above sea level. A camera at z=500 is 500m up. A feature at z=0 is on the ground. Use z=5000000 to see the whole country from above.",
  },
  {
    term: "spatialReference: 4326",
    color: "#ff5555",
    def: "WGS84 — the GPS coordinate system. Longitude/latitude in degrees. ArcGIS SceneView uses this internally for globe rendering. Always specify { wkid: 4326 } when setting camera positions manually.",
  },
];

const CODE_EXAMPLES = [
  {
    label: "Basic SceneView setup",
    code: `import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";

const map = new Map({
  basemap: "satellite",        // imagery tiles
  ground: "world-elevation",   // 3D terrain (needs API key)
});

const view = new SceneView({
  container: "viewDiv",
  map: map,
  camera: {
    position: {
      longitude: -100,
      latitude: 40,
      z: 8000000,  // 8000km up — see whole USA
    },
    tilt: 20,      // slight tilt from top-down
  },
});`,
  },
  {
    label: "Fly to a location",
    code: `// Animate camera to New York City
await view.goTo({
  position: {
    longitude: -74.0,
    latitude:  40.7,
    z: 2000,       // 2km altitude
    spatialReference: { wkid: 4326 }
  },
  tilt: 70,        // near-horizontal view
}, {
  duration: 2000,            // 2 second animation
  easing: "in-out-expo",     // smooth ease in/out
});`,
  },
  {
    label: "Add atmosphere + lighting",
    code: `const view = new SceneView({
  container: "viewDiv",
  map: map,
  environment: {
    atmosphere: {
      quality: "high"  // realistic blue haze
    },
    lighting: {
      date: new Date(),           // real sun position
      directShadowsEnabled: true, // cast shadows
    },
    starsEnabled: true,  // show stars in space
  },
});`,
  },
];

export default function SceneInfoPanel() {
  const [activeCode, setActiveCode] = useState(0);

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>🌐 SceneView 3D — Beginner Guide</h3>
      <p style={styles.desc}>
        SceneView renders a full 3D globe in the browser using WebGL.
        If you know MapView, you already know 80% of SceneView —
        the main difference is the <code>camera</code> instead of <code>center/zoom</code>.
      </p>

      <div style={styles.section}>
        <p style={styles.sectionLabel}>Key concepts:</p>
        {CONCEPTS.map((c) => (
          <div key={c.term} style={styles.conceptCard}>
            <div style={{ ...styles.dot, background: c.color }} />
            <div>
              <div style={{ ...styles.term, color: c.color }}>{c.term}</div>
              <div style={styles.def}>{c.def}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <p style={styles.sectionLabel}>Code examples:</p>
        <div style={styles.codeTabs}>
          {CODE_EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => setActiveCode(i)} style={{
              ...styles.codeTab,
              background: activeCode === i ? "#8be9fd22" : "transparent",
              border: `1px solid ${activeCode === i ? "#8be9fd" : "#2d1b4e"}`,
              color: activeCode === i ? "#8be9fd" : "#6272a4",
            }}>{ex.label}</button>
          ))}
        </div>
        <div style={styles.codeBlock}>
          <pre style={styles.code}>{CODE_EXAMPLES[activeCode].code}</pre>
        </div>
      </div>

      <div style={styles.tipBox}>
        <p style={styles.tipTitle}>💡 No API key? No problem</p>
        <p style={styles.tipText}>
          Without an API key the globe still renders — you just get a dark/flat surface
          instead of satellite imagery and terrain. Add your key to <code>.env</code> as{" "}
          <code>REACT_APP_ARCGIS_API_KEY</code> to unlock full 3D with mountains and cities.
        </p>
      </div>
    </div>
  );
}

const styles = {
  panel: { padding: 16 },
  heading: { color: "#8be9fd", margin: "0 0 8px", fontSize: 15 },
  desc: { color: "#999", fontSize: 12, lineHeight: 1.6, marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionLabel: { color: "#aaa", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 700 },
  conceptCard: { display: "flex", gap: 10, background: "#1e1e3a", borderRadius: 8, padding: "10px 12px", marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5 },
  term: { fontSize: 13, fontWeight: 700, marginBottom: 4, fontFamily: "monospace" },
  def: { color: "#888", fontSize: 12, lineHeight: 1.6 },
  codeTabs: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 },
  codeTab: { padding: "8px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, textAlign: "left", transition: "all 0.2s" },
  codeBlock: { background: "#0d0d1a", borderRadius: 8, border: "1px solid #2d1b4e" },
  code: { margin: 0, padding: 14, fontSize: 11, lineHeight: 1.7, color: "#c9d1d9", whiteSpace: "pre-wrap", overflowX: "auto" },
  tipBox: { background: "#1a1a0a", borderRadius: 8, padding: 14, border: "1px solid #3a3a1a" },
  tipTitle: { color: "#f1fa8c", fontSize: 12, fontWeight: 700, marginBottom: 6 },
  tipText: { color: "#888", fontSize: 12, lineHeight: 1.7 },
};
