// src/components/LayersPanel.jsx
// ─────────────────────────────────────────────────────────────
// Demonstrates: FeatureLayer, UniqueValueRenderer,
// SimpleFillSymbol, layer visibility, layer ordering
//
// Loads a public US States feature service and applies a
// UniqueValueRenderer to colour states by region.
// ─────────────────────────────────────────────────────────────

import React, { useState, useRef } from "react";
import { createStatesFeatureLayer } from "../utils/mapUtils";

export default function LayersPanel({ view }) {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(true);
  const layerRef = useRef(null);

  const loadLayer = () => {
    if (!view || loaded) return;

    // FeatureLayer pulls data from a hosted ArcGIS feature service.
    // The renderer (UniqueValueRenderer) is defined in mapUtils.js.
    const layer = createStatesFeatureLayer();
    layerRef.current = layer;

    // Add below any graphics layers (layers render bottom-up)
    view.map.add(layer, 0);

    layer.when(() => setLoaded(true));
  };

  const toggleVisibility = () => {
    if (!layerRef.current) return;
    // Layer visibility can be toggled without removing/re-adding
    layerRef.current.visible = !visible;
    setVisible(!visible);
  };

  const removeLayer = () => {
    if (layerRef.current) {
      view.map.remove(layerRef.current);
      layerRef.current = null;
    }
    setLoaded(false);
    setVisible(true);
  };

  const REGION_COLORS = [
    { label: "Pacific", color: "#00b4d8" },
    { label: "Mountain", color: "#a8dadc" },
    { label: "West North Central", color: "#90be6d" },
    { label: "East North Central", color: "#43aa8b" },
    { label: "New England", color: "#577590" },
    { label: "Middle Atlantic", color: "#277da1" },
    { label: "South Atlantic", color: "#f9844a" },
    { label: "East South Central", color: "#f8961e" },
    { label: "West South Central", color: "#f3722c" },
  ];

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>📦 Layers &amp; Renderers</h3>
      <p style={styles.desc}>
        Loads a <code>FeatureLayer</code> from an ArcGIS feature service. A{" "}
        <code>UniqueValueRenderer</code> colours each state by its US Census region.
        Click any state to see its popup.
      </p>

      <div style={styles.row}>
        <button
          style={{ ...styles.btn, background: loaded ? "#444" : "#007ac2" }}
          onClick={loadLayer}
          disabled={loaded}
        >
          {loaded ? "Layer Loaded ✓" : "Load States Layer"}
        </button>

        {loaded && (
          <>
            <button style={{ ...styles.btn, background: "#2a5f8f" }} onClick={toggleVisibility}>
              {visible ? "Hide Layer" : "Show Layer"}
            </button>
            <button style={{ ...styles.btn, background: "#c0392b" }} onClick={removeLayer}>
              Remove
            </button>
          </>
        )}
      </div>

      {loaded && (
        <div>
          <p style={styles.legend}>Legend — Coloured by Region:</p>
          <div style={styles.legendGrid}>
            {REGION_COLORS.map((r) => (
              <div key={r.label} style={styles.legendItem}>
                <span style={{ ...styles.swatch, background: r.color }} />
                <span style={styles.legendLabel}>{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  panel: { padding: 16 },
  heading: { color: "#f77f00", margin: "0 0 8px", fontSize: 15 },
  desc: { color: "#999", fontSize: 12, lineHeight: 1.6, marginBottom: 14 },
  row: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  btn: {
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
  },
  legend: { color: "#aaa", fontSize: 12, margin: "0 0 8px" },
  legendGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 },
  legendItem: { display: "flex", alignItems: "center", gap: 6 },
  swatch: { width: 14, height: 14, borderRadius: 3, flexShrink: 0 },
  legendLabel: { color: "#ccc", fontSize: 11 },
};
