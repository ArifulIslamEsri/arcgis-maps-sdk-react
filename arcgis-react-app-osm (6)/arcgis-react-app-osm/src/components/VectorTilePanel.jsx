// src/components/VectorTilePanel.jsx
// Demonstrates: VectorTileLayer — crisp WebGL tiles, no API key needed

import React, { useState, useRef } from "react";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";

// Free CARTO vector tile styles — no API key needed
const STYLES = [
  {
    id: "voyager",
    label: "Voyager (Streets)",
    url: "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
    color: "#4cc9f0",
    desc: "Standard street map with roads, labels, and points of interest",
  },
  {
    id: "dark",
    label: "Dark Matter",
    url: "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
    color: "#a8dadc",
    desc: "Dark background map — great for data visualisation overlays",
  },
  {
    id: "light",
    label: "Positron (Light)",
    url: "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
    color: "#00b4d8",
    desc: "Minimal light basemap — keeps focus on your data layers",
  },
];

const CONCEPTS = [
  {
    term: "VectorTileLayer",
    color: "#4cc9f0",
    def: "A layer type that loads map tiles as vector data (lines, polygons, points) rather than pre-rendered images. The SDK renders them using WebGL at draw time.",
  },
  {
    term: "Why vector over raster?",
    color: "#06d6a0",
    def: "Vector tiles stay crisp at any zoom level and screen resolution. Raster tiles blur when zoomed. Vector files are also smaller — typically 5-10x less data to download.",
  },
  {
    term: "urlTemplate",
    color: "#f77f00",
    def: "The URL pattern for requesting tiles. Uses {level}/{col}/{row} placeholders that the SDK replaces with actual tile coordinates based on the current map extent and zoom.",
  },
  {
    term: "subDomains",
    color: "#ff6b6b",
    def: "Tile servers spread load across multiple subdomains (a, b, c, d). The SDK rotates through them automatically to parallelise tile requests and speed up loading.",
  },
  {
    term: "Layer ordering",
    color: "#c77dff",
    def: "Layers render bottom-up. A VectorTileLayer added first sits behind a FeatureLayer added later. Use map.reorder(layer, index) to change the stacking order.",
  },
  {
    term: "Opacity & visibility",
    color: "#90be6d",
    def: "Every layer has .opacity (0–1) and .visible (true/false). You can fade a VectorTileLayer behind your data layers by setting opacity: 0.6 to let the data stand out.",
  },
];

export default function VectorTilePanel({ view }) {
  const [activeStyle, setActiveStyle] = useState(null);
  const [opacity, setOpacity] = useState(85);
  const layerRef = useRef(null);

  const applyStyle = (style) => {
    if (!view) return;
    if (layerRef.current) view.map.remove(layerRef.current);

    const vtl = new VectorTileLayer({
      url: style.url,
      opacity: opacity / 100,
    });
    layerRef.current = vtl;
    view.map.add(vtl);
    setActiveStyle(style.id);
  };

  const removeLayer = () => {
    if (layerRef.current && view) {
      view.map.remove(layerRef.current);
      layerRef.current = null;
      setActiveStyle(null);
    }
  };

  const updateOpacity = (val) => {
    setOpacity(val);
    if (layerRef.current) layerRef.current.opacity = val / 100;
  };

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>🗂️ Vector Tile Layers</h3>
      <p style={styles.desc}>
        <code>VectorTileLayer</code> renders crisp, styleable map tiles using WebGL.
        Unlike raster tiles, vector tiles stay sharp at any zoom level and can be
        restyled client-side without re-downloading data.
      </p>

      {/* Apply a style */}
      <div style={styles.section}>
        <p style={styles.sectionLabel}>Apply a vector tile overlay to the map:</p>
        <div style={styles.styleList}>
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => applyStyle(s)}
              style={{
                ...styles.styleBtn,
                background: activeStyle === s.id ? s.color + "22" : "#1e1e3a",
                border: `1px solid ${activeStyle === s.id ? s.color : "#333"}`,
              }}
            >
              <span style={{ color: activeStyle === s.id ? s.color : "#ccc", fontSize: 13, fontWeight: 700 }}>{s.label}</span>
              <span style={{ color: "#666", fontSize: 11, marginTop: 2 }}>{s.desc}</span>
            </button>
          ))}
        </div>

        {activeStyle && (
          <div style={styles.controls}>
            <label style={styles.controlLabel}>
              Opacity: <strong style={{ color: "#4cc9f0" }}>{opacity}%</strong>
            </label>
            <input
              type="range" min={10} max={100} value={opacity}
              onChange={(e) => updateOpacity(Number(e.target.value))}
              style={{ width: "100%", marginBottom: 8 }}
            />
            <button onClick={removeLayer} style={styles.removeBtn}>Remove Layer</button>
          </div>
        )}
      </div>

      {/* Concepts */}
      <div style={styles.section}>
        <p style={styles.sectionLabel}>Key concepts:</p>
        <div style={styles.conceptList}>
          {CONCEPTS.map((c) => (
            <div key={c.term} style={styles.conceptCard}>
              <div style={{ ...styles.conceptDot, background: c.color }} />
              <div>
                <div style={{ ...styles.conceptTerm, color: c.color }}>{c.term}</div>
                <div style={styles.conceptDef}>{c.def}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code example */}
      <div style={styles.section}>
        <p style={styles.sectionLabel}>Code example:</p>
        <div style={styles.codeBlock}>
          <pre style={styles.code}>{`import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";

// Create a VectorTileLayer from a tile server URL
const vtl = new VectorTileLayer({
  url: "https://basemaps.arcgis.com/.../VectorTileServer",
  opacity: 0.85,  // 0 = invisible, 1 = fully opaque
});

// Add to the map (renders on top of existing layers)
map.add(vtl);

// Change opacity later
vtl.opacity = 0.5;

// Toggle visibility without removing
vtl.visible = false;

// Remove from map entirely
map.remove(vtl);`}</pre>
        </div>
      </div>
    </div>
  );
}

const styles = {
  panel: { padding: 16 },
  heading: { color: "#4cc9f0", margin: "0 0 8px", fontSize: 15 },
  desc: { color: "#999", fontSize: 12, lineHeight: 1.6, marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionLabel: { color: "#aaa", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 700 },
  styleList: { display: "flex", flexDirection: "column", gap: 8 },
  styleBtn: { display: "flex", flexDirection: "column", padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.2s" },
  controls: { marginTop: 12, background: "#1e1e3a", borderRadius: 8, padding: 12 },
  controlLabel: { color: "#aaa", fontSize: 12, display: "block", marginBottom: 6 },
  removeBtn: { padding: "6px 14px", borderRadius: 6, border: "none", background: "#c0392b", color: "#fff", cursor: "pointer", fontSize: 12 },
  conceptList: { display: "flex", flexDirection: "column", gap: 10 },
  conceptCard: { display: "flex", gap: 10, background: "#1e1e3a", borderRadius: 8, padding: "10px 12px" },
  conceptDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5 },
  conceptTerm: { fontSize: 13, fontWeight: 700, marginBottom: 4, fontFamily: "monospace" },
  conceptDef: { color: "#888", fontSize: 12, lineHeight: 1.6 },
  codeBlock: { background: "#0d0d1a", borderRadius: 8, border: "1px solid #333", overflow: "hidden" },
  code: { margin: 0, padding: 14, fontSize: 11, lineHeight: 1.7, color: "#c9d1d9", overflowX: "auto", whiteSpace: "pre-wrap" },
};
