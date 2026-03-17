// src/components/DigitalTwinPanel.jsx — Phase 3: Digital Twins

import React, { useState } from "react";

const CONCEPTS = [
  { term: "What is a Digital Twin?", color: "#50fa7b", def: "A real-time 3D virtual replica of a physical place — a city, building, infrastructure network, or campus. It combines live sensor data, BIM models, GIS layers, and IoT feeds into one interactive 3D scene." },
  { term: "SceneLayer (I3S)", color: "#8be9fd", def: "Indexed 3D Scene Layer — Esri's format for streaming 3D city models, buildings, and point clouds. A single SceneLayer can hold millions of 3D objects (every building in a city) and streams them efficiently based on camera distance." },
  { term: "BuildingSceneLayer", color: "#ff79c6", def: "A specialised SceneLayer for BIM (Building Information Modelling) data. Each floor, wall, room, pipe, and duct is a separate 3D object with attributes. You can filter by discipline (structural, mechanical, electrical)." },
  { term: "IntegratedMeshLayer", color: "#ffb86c", def: "Renders photogrammetry data — 3D meshes captured from drone or aerial photography. Creates ultra-realistic textured 3D environments of real-world places. The mesh is one continuous surface, not separate objects." },
  { term: "PointCloudLayer", color: "#bd93f9", def: "Renders LiDAR scan data as millions of coloured points in 3D space. Used for surveying, engineering, forestry, and autonomous vehicle mapping. ArcGIS streams point clouds efficiently using LAS/LAZ format." },
  { term: "Real-time data", color: "#f1fa8c", def: "Digital twins stay live by connecting to IoT sensors, traffic feeds, weather APIs, and building management systems. The StreamLayer in ArcGIS handles real-time feature updates via WebSocket connections." },
  { term: "StreamLayer", color: "#6be5fd", def: "A layer type for real-time data that updates continuously via a WebSocket connection. Features appear, move, and disappear as live data arrives — perfect for vehicle tracking, sensor networks, or live weather." },
  { term: "Slice widget", color: "#ff5555", def: "A SceneView widget that cuts through 3D objects to reveal their interior. Essential for exploring buildings, underground infrastructure, or geological layers in a digital twin. Like a virtual saw cutting your 3D model." },
  { term: "Feature filter", color: "#50fa7b", def: "Filter 3D scene objects by attribute without removing them from the layer. In a building model: show only electrical systems, or only floors 1-5. Uses featureFilter on the LayerView." },
];

const CODE_EXAMPLES = [
  {
    label: "3D city buildings",
    code: `import SceneLayer from "@arcgis/core/layers/SceneLayer";
import SceneView from "@arcgis/core/views/SceneView";
import Map from "@arcgis/core/Map";

const map = new Map({
  basemap: "satellite",
  ground: "world-elevation",
});

// Add a 3D city buildings SceneLayer
const buildingsLayer = new SceneLayer({
  url: "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Buildings_NewYork_17/SceneServer",

  popupTemplate: {
    title: "{NAME}",
    content: "Height: {HEIGHTROOF}m · Built: {CNSTRCT_YR}",
  },
});

map.add(buildingsLayer);

const view = new SceneView({
  container: "viewDiv",
  map,
  camera: {
    position: { longitude: -74.0, latitude: 40.7, z: 800 },
    tilt: 75,
  },
});`,
  },
  {
    label: "Real-time StreamLayer",
    code: `import StreamLayer from "@arcgis/core/layers/StreamLayer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

// Connect to a real-time WebSocket feed
const streamLayer = new StreamLayer({
  url: "https://realtimegis.com/.../StreamServer",

  // Style moving features (e.g. vehicles)
  renderer: new SimpleRenderer({
    symbol: new SimpleMarkerSymbol({
      color: "#50fa7b",
      size: 10,
      outline: { color: "#0a0118", width: 1 },
    }),
  }),

  // Show popup on click with live attributes
  popupTemplate: {
    title: "Vehicle {VEHICLE_ID}",
    content: "Speed: {SPEED} km/h · Updated: {TIMESTAMP}",
  },

  // Only keep last 5 minutes of data
  purgeOptions: { age: 5, displayCount: 2000 },
});

map.add(streamLayer);`,
  },
  {
    label: "Filter building floors",
    code: `import SceneLayer from "@arcgis/core/layers/SceneLayer";

const buildingLayer = new SceneLayer({
  url: "https://...BuildingSceneServer",
});
map.add(buildingLayer);

// Wait for the LayerView to be ready
const layerView = await view.whenLayerView(buildingLayer);

// Show only floors 1-10 using a feature filter
layerView.filter = {
  where: "FLOOR_NUM <= 10",
};

// Remove filter to show all floors
layerView.filter = null;

// Highlight a specific floor
const highlight = layerView.highlight({
  where: "FLOOR_NUM = 5",
});

// Remove highlight later
highlight.remove();`,
  },
  {
    label: "Slice widget",
    code: `import Slice from "@arcgis/core/widgets/Slice";
import SlicePlane from "@arcgis/core/analysis/SlicePlane";

// Add the Slice widget to cut through buildings
const slice = new Slice({ view });
view.ui.add(slice, "top-right");

// Or set a slice plane programmatically
// to reveal the interior of a building
const slicePlane = new SlicePlane({
  position: {
    longitude: -74.006,
    latitude: 40.712,
    z: 50,  // cut at 50m height
  },
  tilt: 90,  // horizontal cut
  width: 200,
  height: 200,
});

slice.viewModel.shape = slicePlane;`,
  },
];

export default function DigitalTwinPanel() {
  const [activeCode, setActiveCode] = useState(0);

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>🏙️ Digital Twins — Beginner Guide</h3>
      <p style={styles.desc}>
        A digital twin is a live 3D replica of a real place — a city, building, or
        infrastructure network. ArcGIS combines 3D building models, real-time IoT data,
        and GIS layers into one interactive SceneView. Used in smart cities, construction,
        utilities, and emergency response.
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
              background: activeCode === i ? "#50fa7b22" : "transparent",
              border: `1px solid ${activeCode === i ? "#50fa7b" : "#2d1b4e"}`,
              color: activeCode === i ? "#50fa7b" : "#6272a4",
            }}>{ex.label}</button>
          ))}
        </div>
        <div style={styles.codeBlock}>
          <pre style={styles.code}>{CODE_EXAMPLES[activeCode].code}</pre>
        </div>
      </div>

      <div style={styles.tipBox}>
        <p style={styles.tipTitle}>💡 Real-world use cases</p>
        <p style={styles.tipText}>
          <strong style={{ color: "#50fa7b" }}>Smart cities</strong> — traffic, utilities, emergency services ·{" "}
          <strong style={{ color: "#8be9fd" }}>Construction</strong> — BIM + GIS for site planning ·{" "}
          <strong style={{ color: "#ff79c6" }}>Utilities</strong> — underground pipe and cable networks ·{" "}
          <strong style={{ color: "#ffb86c" }}>Aviation</strong> — airport digital twins for operations
        </p>
      </div>
    </div>
  );
}

export function DigitalTwinMapPanel() {
  return (
    <div style={styles.mapInfo}>
      <div style={styles.mapInfoInner}>
        <div style={styles.bigEmoji}>🏙️</div>
        <h2 style={styles.mapInfoTitle}>Digital Twin viewer</h2>
        <p style={styles.mapInfoDesc}>
          A full digital twin demo requires a 3D city SceneLayer hosted on ArcGIS Online
          and an API key to access it. Add your <code>REACT_APP_ARCGIS_API_KEY</code> to
          unlock a live New York City 3D buildings demo.
        </p>
        <div style={styles.steps}>
          {["Get free API key at developers.arcgis.com", "Add to .env as REACT_APP_ARCGIS_API_KEY", "Restart npm start — 3D buildings load automatically"].map((s, i) => (
            <div key={i} style={styles.step}>
              <span style={styles.stepNum}>{i + 1}</span>
              <span style={styles.stepText}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  panel: { padding: 16 },
  heading: { color: "#50fa7b", margin: "0 0 8px", fontSize: 15 },
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
  tipText: { color: "#888", fontSize: 12, lineHeight: 1.8 },
  mapInfo: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0118" },
  mapInfoInner: { maxWidth: 420, padding: 32, textAlign: "center" },
  bigEmoji: { fontSize: 56, marginBottom: 16 },
  mapInfoTitle: { color: "#50fa7b", fontSize: 20, fontWeight: 700, marginBottom: 12 },
  mapInfoDesc: { color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 24 },
  steps: { display: "flex", flexDirection: "column", gap: 10, textAlign: "left" },
  step: { display: "flex", alignItems: "center", gap: 12, background: "#1e1e3a", borderRadius: 8, padding: "10px 14px" },
  stepNum: { width: 24, height: 24, borderRadius: "50%", background: "#50fa7b22", color: "#50fa7b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  stepText: { color: "#ccc", fontSize: 12 },
};
