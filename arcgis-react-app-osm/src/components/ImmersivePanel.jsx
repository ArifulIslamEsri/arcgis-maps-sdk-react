// src/components/ImmersivePanel.jsx — Phase 3: Immersive / XR

import React, { useState } from "react";

const CONCEPTS = [
  { term: "What is XR?", color: "#bd93f9", def: "Extended Reality — umbrella term covering AR (Augmented Reality), VR (Virtual Reality), and MR (Mixed Reality). ArcGIS supports XR through the Maps SDK for Unity and Unreal Engine integrations." },
  { term: "ArcGIS Maps SDK for Unity", color: "#ff79c6", def: "Brings ArcGIS data — basemaps, 3D buildings, elevation, feature layers — into Unity 3D. Used to build AR/VR training simulations, immersive city walkthroughs, and location-aware games." },
  { term: "ArcGIS Maps SDK for Unreal", color: "#8be9fd", def: "Same concept as Unity but for Unreal Engine. Photorealistic rendering of real-world locations. Used for architecture visualisation, urban planning walkthroughs, and cinematic GIS experiences." },
  { term: "Augmented Reality (AR)", color: "#50fa7b", def: "Overlays digital GIS data on the real physical world through a phone or headset camera. Point your device at a street and see underground pipes, property boundaries, or navigation arrows overlaid on reality." },
  { term: "Indoor positioning", color: "#ffb86c", def: "ArcGIS Indoors extends GIS into buildings. Floor-aware maps, indoor routing, occupancy data, and asset tracking — all connected to the same ArcGIS platform as outdoor maps." },
  { term: "Fly-through animation", color: "#f1fa8c", def: "Animated camera paths through a 3D scene. Define waypoints with position + tilt + heading, then animate between them. Used for presentation, site review, and virtual tours of 3D environments." },
  { term: "SceneView.popup in 3D", color: "#6be5fd", def: "Popups work in SceneView just like MapView but appear anchored to 3D geometry. A popup on a building hovers above it in 3D space. Use view.popup.open() with a location to trigger them programmatically." },
  { term: "WebXR (experimental)", color: "#ff5555", def: "Browser-native AR/VR API. ArcGIS is exploring WebXR integration to allow SceneView content to be experienced in VR headsets directly from the browser — no app install required." },
];

const CODE_EXAMPLES = [
  {
    label: "Fly-through animation",
    code: `// Define a series of camera waypoints
const waypoints = [
  {
    position: { longitude: -74.0, latitude: 40.7, z: 2000 },
    tilt: 45, heading: 0,
  },
  {
    position: { longitude: -74.01, latitude: 40.71, z: 800 },
    tilt: 70, heading: 45,
  },
  {
    position: { longitude: -74.005, latitude: 40.705, z: 400 },
    tilt: 80, heading: 90,
  },
];

// Fly through each waypoint in sequence
async function flyThrough() {
  for (const wp of waypoints) {
    await view.goTo(wp, {
      duration: 3000,
      easing: "in-out-cubic",
    });
  }
}

flyThrough();`,
  },
  {
    label: "Camera path recording",
    code: `// Record current camera position
const positions = [];

// Add button to record a waypoint
document.getElementById("record").addEventListener("click", () => {
  const { position, tilt, heading } = view.camera;
  positions.push({ position, tilt, heading });
  console.log(\`Recorded \${positions.length} waypoints\`);
});

// Replay all recorded positions
document.getElementById("play").addEventListener("click", async () => {
  for (const pos of positions) {
    await view.goTo(pos, { duration: 2000 });
  }
});

// Export as JSON to save the flight path
const json = JSON.stringify(positions, null, 2);
console.log(json);`,
  },
  {
    label: "3D popup anchoring",
    code: `import Point from "@arcgis/core/geometry/Point";

// Open a popup anchored to a 3D location
view.popup.open({
  title: "Building A — Floor 12",
  content: \`
    <b>Occupancy:</b> 145 / 200 people<br>
    <b>Temperature:</b> 22°C<br>
    <b>Status:</b> <span style="color:green">Normal</span>
  \`,
  location: new Point({
    longitude: -74.006,
    latitude: 40.712,
    z: 120,  // 120m = roughly floor 12
    spatialReference: { wkid: 4326 },
  }),
});

// Close programmatically
view.popup.close();`,
  },
  {
    label: "Unity SDK setup (C#)",
    code: `// ArcGIS Maps SDK for Unity — C# example
// Attach to an ArcGISMapComponent in your scene

using Esri.ArcGISMapsSDK.Components;
using Esri.GameEngine.Map;
using UnityEngine;

public class CityTwinSetup : MonoBehaviour
{
    void Start()
    {
        // Get the ArcGIS map component
        var mapComponent = GetComponent<ArcGISMapComponent>();

        // Set your API key
        mapComponent.APIKey = "YOUR_API_KEY";

        // Set origin to New York City
        mapComponent.OriginPosition =
          new ArcGISPoint(-74.0, 40.7, 0,
            ArcGISSpatialReference.WGS84());

        // Add a 3D buildings layer
        mapComponent.Map.Layers.Add(
          new ArcGIS3DObjectSceneLayer(
            "https://...BuildingSceneServer",
            "NYC Buildings",
            1.0f, true, null
          )
        );
    }
}`,
  },
];

export default function ImmersivePanel() {
  const [activeCode, setActiveCode] = useState(0);

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>🥽 Immersive / XR — Beginner Guide</h3>
      <p style={styles.desc}>
        ArcGIS extends beyond the browser into immersive experiences — AR overlays on
        the real world, VR walkthroughs of 3D cities, and Unity/Unreal Engine integrations
        for game-quality GIS visualisations. The same data and services power all of them.
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
              background: activeCode === i ? "#bd93f922" : "transparent",
              border: `1px solid ${activeCode === i ? "#bd93f9" : "#2d1b4e"}`,
              color: activeCode === i ? "#bd93f9" : "#6272a4",
            }}>{ex.label}</button>
          ))}
        </div>
        <div style={styles.codeBlock}>
          <pre style={styles.code}>{CODE_EXAMPLES[activeCode].code}</pre>
        </div>
      </div>

      <div style={styles.tipBox}>
        <p style={styles.tipTitle}>💡 XR learning path</p>
        <p style={styles.tipText}>
          Start with <strong style={{ color: "#8be9fd" }}>fly-through animations</strong> in the browser SceneView —
          that's the easiest immersive experience. Then explore{" "}
          <strong style={{ color: "#ff79c6" }}>ArcGIS Maps SDK for Unity</strong> if you want
          full VR/AR. The JS SDK concepts (layers, camera, popups) all carry over directly.
        </p>
      </div>
    </div>
  );
}

export function ImmersiveMapPanel() {
  return (
    <div style={styles.mapInfo}>
      <div style={styles.mapInfoInner}>
        <div style={styles.bigEmoji}>🥽</div>
        <h2 style={styles.mapInfoTitle}>Immersive / XR experiences</h2>
        <p style={styles.mapInfoDesc}>
          Full XR experiences run in Unity or Unreal Engine, not the browser.
          In the browser, you can experience immersive-style 3D by switching to the
          <strong style={{ color: "#8be9fd" }}> SceneView 3D</strong> tab and using
          the fly-to animations with a tilted camera.
        </p>
        <div style={styles.links}>
          {[
            { label: "ArcGIS Maps SDK for Unity", color: "#ff79c6" },
            { label: "ArcGIS Maps SDK for Unreal", color: "#8be9fd" },
            { label: "ArcGIS Indoors (indoor maps)", color: "#50fa7b" },
          ].map((l) => (
            <div key={l.label} style={{ ...styles.linkItem, borderColor: l.color + "44", color: l.color }}>
              {l.label} →
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  panel: { padding: 16 },
  heading: { color: "#bd93f9", margin: "0 0 8px", fontSize: 15 },
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
  mapInfoTitle: { color: "#bd93f9", fontSize: 20, fontWeight: 700, marginBottom: 12 },
  mapInfoDesc: { color: "#888", fontSize: 13, lineHeight: 1.7, marginBottom: 24 },
  links: { display: "flex", flexDirection: "column", gap: 8 },
  linkItem: { padding: "10px 14px", borderRadius: 8, border: "1px solid", fontSize: 13, fontWeight: 600 },
};
