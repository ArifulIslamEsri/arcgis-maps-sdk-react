// src/components/LayersInfoPanel.jsx
import React, { useState } from "react";

const CONCEPTS = [
  { term: "FeatureLayer", color: "#ffb86c", def: "The most common layer type. Connects to a hosted ArcGIS feature service and displays vector data (points, lines, polygons). Supports server-side querying, filtering, popups, and renderers." },
  { term: "GraphicsLayer", color: "#50fa7b", def: "A client-side layer for temporary graphics. Data lives only in the browser — nothing is stored on a server. Perfect for search results, highlights, or shapes drawn by the user." },
  { term: "VectorTileLayer", color: "#8be9fd", def: "Renders crisp map tiles using WebGL. Stays sharp at any zoom level. Cannot be queried — purely visual. Great for basemaps and background styling." },
  { term: "TileLayer", color: "#bd93f9", def: "Displays pre-rendered raster image tiles from a server. Fast to load but blurry when zoomed in. Used for satellite imagery, scanned maps, and cached map services." },
  { term: "CSVLayer / GeoJSONLayer", color: "#ff79c6", def: "Load data directly from a CSV or GeoJSON URL with no feature service needed. Great for quick prototyping with public datasets." },
  { term: "map.add() / map.addMany()", color: "#f1fa8c", def: "Adds one or multiple layers to the map. Layers render bottom-up — the first layer added sits at the bottom. Use map.reorder(layer, index) to change stacking order." },
  { term: "layer.when()", color: "#ff5555", def: "A Promise that resolves when the layer has fully loaded its metadata. Use it to safely access layer fields, extent, or renderer after the layer is ready." },
  { term: "UniqueValueRenderer", color: "#ffb86c", def: "Assigns a different symbol to each unique value of a field. Example: colour US states by region — Pacific=blue, Mountain=green, South=orange. Best for categorical data." },
  { term: "ClassBreaksRenderer", color: "#6be5fd", def: "Assigns symbols based on numeric ranges. Example: choropleth map where dark = high population, light = low. Best for continuous numeric data like income or temperature." },
  { term: "SimpleRenderer", color: "#50fa7b", def: "All features get the same symbol. The simplest renderer — use it when the data doesn't need to be visually differentiated, e.g. all cities shown as a blue dot." },
];

const CODE_EXAMPLES = [
  {
    label: "FeatureLayer basics",
    code: `import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const layer = new FeatureLayer({
  // URL to a hosted ArcGIS feature service
  url: "https://services.arcgis.com/.../FeatureServer/0",

  outFields: ["*"],       // load all attribute fields
  popupEnabled: true,     // show popup on click

  popupTemplate: {
    title: "{STATE_NAME}",
    content: "Population: {POPULATION}"
  }
});

map.add(layer);

// Wait for layer to load, then read its fields
layer.when(() => {
  console.log(layer.fields); // array of field objects
});`,
  },
  {
    label: "UniqueValueRenderer",
    code: `import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";

const renderer = new UniqueValueRenderer({
  field: "SUB_REGION",  // field to match values on

  defaultSymbol: new SimpleFillSymbol({
    color: [200, 200, 200, 0.4]  // grey fallback
  }),

  uniqueValueInfos: [
    {
      value: "Pacific",
      symbol: new SimpleFillSymbol({ color: [0, 180, 216, 0.6] })
    },
    {
      value: "Mountain",
      symbol: new SimpleFillSymbol({ color: [144, 190, 109, 0.6] })
    },
    // add more values...
  ]
});

featureLayer.renderer = renderer;`,
  },
  {
    label: "Layer visibility & opacity",
    code: `// Toggle visibility (layer stays in map, just hidden)
layer.visible = false;
layer.visible = true;

// Fade the layer (0 = invisible, 1 = fully opaque)
layer.opacity = 0.5;

// Remove from map entirely
map.remove(layer);

// Check if a layer is already on the map
const exists = map.layers.includes(layer);

// Reorder layers (0 = bottom, last = top)
map.reorder(layer, 0);  // send to bottom

// Add multiple layers at once
map.addMany([layer1, layer2, layer3]);`,
  },
  {
    label: "ClassBreaksRenderer",
    code: `import ClassBreaksRenderer from "@arcgis/core/renderers/ClassBreaksRenderer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";

const renderer = new ClassBreaksRenderer({
  field: "POPULATION",  // numeric field

  classBreakInfos: [
    {
      minValue: 0,
      maxValue: 1000000,
      symbol: new SimpleFillSymbol({ color: [255, 255, 204, 0.8] })
    },
    {
      minValue: 1000000,
      maxValue: 5000000,
      symbol: new SimpleFillSymbol({ color: [253, 141, 60, 0.8] })
    },
    {
      minValue: 5000000,
      maxValue: 999999999,
      symbol: new SimpleFillSymbol({ color: [189, 0, 38, 0.8] })
    }
  ]
});

featureLayer.renderer = renderer;`,
  },
];

export default function LayersInfoPanel() {
  const [activeCode, setActiveCode] = useState(0);

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>📦 Layers & Renderers — Beginner Guide</h3>
      <p style={styles.desc}>
        Layers are how you put data on a map. A renderer controls how that data
        looks — colours, sizes, symbols. Every layer has exactly one renderer.
        The map renders layers bottom-up like transparent sheets stacked on top of each other.
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
              background: activeCode === i ? "#ffb86c22" : "transparent",
              border: `1px solid ${activeCode === i ? "#ffb86c" : "#2d1b4e"}`,
              color: activeCode === i ? "#ffb86c" : "#6272a4",
            }}>{ex.label}</button>
          ))}
        </div>
        <div style={styles.codeBlock}>
          <pre style={styles.code}>{CODE_EXAMPLES[activeCode].code}</pre>
        </div>
      </div>

      <div style={styles.tipBox}>
        <p style={styles.tipTitle}>💡 Layer type quick guide</p>
        <p style={styles.tipText}>
          <strong style={{ color: "#ffb86c" }}>FeatureLayer</strong> — live data from a service, queryable ·{" "}
          <strong style={{ color: "#50fa7b" }}>GraphicsLayer</strong> — temporary client-side shapes ·{" "}
          <strong style={{ color: "#8be9fd" }}>VectorTileLayer</strong> — fast visual tiles, not queryable ·{" "}
          <strong style={{ color: "#ff79c6" }}>GeoJSONLayer</strong> — load from a URL, no service needed
        </p>
      </div>
    </div>
  );
}

const styles = {
  panel: { padding: 16 },
  heading: { color: "#ffb86c", margin: "0 0 8px", fontSize: 15 },
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
};
