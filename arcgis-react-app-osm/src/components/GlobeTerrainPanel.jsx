// src/components/GlobeTerrainPanel.jsx — Phase 3: Globe & Terrain

import React, { useEffect, useRef, useState } from "react";
import SceneView from "@arcgis/core/views/SceneView";
import Map from "@arcgis/core/Map";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer";

const LOCATIONS = [
  { label: "Grand Canyon",  position: { longitude: -112.1, latitude: 36.1,  z: 3000  }, tilt: 65 },
  { label: "Mount Everest", position: { longitude: 86.9,   latitude: 27.98, z: 5000  }, tilt: 60 },
  { label: "Mariana Trench",position: { longitude: 142.2,  latitude: 11.3,  z: 8000  }, tilt: 55 },
  { label: "Alps",          position: { longitude: 8.0,    latitude: 46.5,  z: 4000  }, tilt: 65 },
];

const CONCEPTS = [
  { term: "ElevationLayer", color: "#ff79c6", def: "A special layer type that provides terrain height data. Added to map.ground.layers, not map.layers. The world-elevation service gives real-world mountain and valley heights." },
  { term: "map.ground", color: "#8be9fd", def: "The ground surface of the 3D scene. Set to 'world-elevation' for real terrain. You can also add custom ElevationLayers to map.ground.layers for higher resolution local terrain." },
  { term: "atmosphere", color: "#50fa7b", def: "SceneView's atmosphere property renders a realistic blue haze at the horizon. Quality options: 'none', 'low', 'high'. High quality simulates light scattering through the atmosphere." },
  { term: "Exaggeration", color: "#ffb86c", def: "The ground.navigationConstraint and ground.surfaceColor properties control how terrain appears. You can exaggerate elevation to make terrain features more dramatic on flat landscapes." },
  { term: "Tilt angle", color: "#bd93f9", def: "Camera tilt in degrees. 0 = looking straight down (top view). 90 = looking at the horizon. 65-75 degrees gives a dramatic oblique view that shows terrain depth well." },
  { term: "Z altitude (metres)", color: "#f1fa8c", def: "The camera's height above sea level in metres. z=500 = low altitude flyover. z=5000 = mountain peak height. z=8000000 = see entire continent. Combine with tilt for the best view." },
];

const CODE = `import SceneView from "@arcgis/core/views/SceneView";
import Map from "@arcgis/core/Map";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer";

// Map with satellite imagery + real terrain
const map = new Map({
  basemap: "satellite",
  ground: "world-elevation", // real terrain heights
});

// Add higher-resolution elevation for a specific area
const detailElevation = new ElevationLayer({
  url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
});
map.ground.layers.add(detailElevation);

const view = new SceneView({
  container: "viewDiv",
  map,
  camera: {
    position: {
      longitude: -112.1,  // Grand Canyon
      latitude: 36.1,
      z: 3000,            // 3km altitude
    },
    tilt: 65,             // dramatic oblique angle
  },
  environment: {
    atmosphere: { quality: "high" },
    lighting: {
      date: new Date("2024-06-21T12:00:00"), // noon, summer
      directShadowsEnabled: true,
    },
  },
});`;

export default function GlobeTerrainPanel() {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [activeLocation, setActiveLocation] = useState(null);

  useEffect(() => {
    if (!containerRef.current || viewRef.current) return;
    const map = new Map({ basemap: "satellite", ground: "world-elevation" });
    const view = new SceneView({
      container: containerRef.current,
      map,
      camera: { position: { longitude: -100, latitude: 40, z: 8000000 }, tilt: 20 },
      environment: {
        atmosphere: { quality: "high" },
        lighting: { date: new Date(), directShadowsEnabled: true },
      },
    });
    viewRef.current = view;
    view.when(() => setReady(true));
    return () => { view.destroy(); viewRef.current = null; };
  }, []);

  const flyTo = (loc) => {
    setActiveLocation(loc.label);
    viewRef.current?.goTo(
      { position: { ...loc.position, spatialReference: { wkid: 4326 } }, tilt: loc.tilt },
      { duration: 2500, easing: "in-out-expo" }
    );
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.toolbar}>
        <span style={styles.label}>Fly to terrain:</span>
        {LOCATIONS.map((l) => (
          <button key={l.label} onClick={() => flyTo(l)} style={{
            ...styles.btn,
            background: activeLocation === l.label ? "#ff79c6" : "#1a0533",
            color: activeLocation === l.label ? "#0a0118" : "#aaa",
            fontWeight: activeLocation === l.label ? 700 : 400,
          }}>{l.label}</button>
        ))}
        {ready && <span style={styles.badge}>🏔️ Terrain active</span>}
      </div>
      <div ref={containerRef} style={styles.scene} />
    </div>
  );
}

export function GlobeTerrainInfoPanel() {
  const [showCode, setShowCode] = useState(false);
  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>🏔️ Globe & Terrain — Beginner Guide</h3>
      <p style={styles.desc}>
        ArcGIS SceneView renders a real 3D globe with elevation data from Esri's
        world terrain service. Mountains, canyons, and ocean trenches appear as
        actual 3D geometry. The camera tilt and altitude control how dramatic the view looks.
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
        <button onClick={() => setShowCode(!showCode)} style={styles.codeToggle}>
          {showCode ? "▼ Hide" : "▶ Show"} Code Example
        </button>
        {showCode && (
          <div style={styles.codeBlock}>
            <pre style={styles.code}>{CODE}</pre>
          </div>
        )}
      </div>
      <div style={styles.tipBox}>
        <p style={styles.tipTitle}>💡 Needs API key</p>
        <p style={styles.tipText}>Satellite imagery and world-elevation terrain both require an ArcGIS API key. Without one the globe renders as a dark flat surface. Add <code>REACT_APP_ARCGIS_API_KEY</code> to your .env file to unlock full terrain.</p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", height: "100%", width: "100%" },
  toolbar: { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#0d0221", borderBottom: "1px solid #2d1b4e", flexWrap: "wrap", flexShrink: 0 },
  label: { color: "#6272a4", fontSize: 12 },
  btn: { padding: "5px 12px", borderRadius: 20, border: "1px solid #2d1b4e", cursor: "pointer", fontSize: 12, transition: "all 0.2s" },
  badge: { marginLeft: "auto", color: "#ff79c6", fontSize: 11 },
  scene: { flex: 1 },
  panel: { padding: 16 },
  heading: { color: "#ff79c6", margin: "0 0 8px", fontSize: 15 },
  desc: { color: "#999", fontSize: 12, lineHeight: 1.6, marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionLabel: { color: "#aaa", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 700 },
  conceptCard: { display: "flex", gap: 10, background: "#1e1e3a", borderRadius: 8, padding: "10px 12px", marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5 },
  term: { fontSize: 13, fontWeight: 700, marginBottom: 4, fontFamily: "monospace" },
  def: { color: "#888", fontSize: 12, lineHeight: 1.6 },
  codeToggle: { padding: "8px 14px", borderRadius: 6, border: "1px solid #2d1b4e", background: "transparent", color: "#ff79c6", cursor: "pointer", fontSize: 12, marginBottom: 10 },
  codeBlock: { background: "#0d0d1a", borderRadius: 8, border: "1px solid #2d1b4e" },
  code: { margin: 0, padding: 14, fontSize: 11, lineHeight: 1.7, color: "#c9d1d9", whiteSpace: "pre-wrap", overflowX: "auto" },
  tipBox: { background: "#1a1a0a", borderRadius: 8, padding: 14, border: "1px solid #3a3a1a" },
  tipTitle: { color: "#f1fa8c", fontSize: 12, fontWeight: 700, marginBottom: 6 },
  tipText: { color: "#888", fontSize: 12, lineHeight: 1.7 },
};
