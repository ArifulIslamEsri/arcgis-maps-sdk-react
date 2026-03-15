// src/components/MarkersPanel.jsx
// ─────────────────────────────────────────────────────────────
// Demonstrates: GraphicsLayer, Graphic, SimpleMarkerSymbol,
// PopupTemplate
//
// Users can click "Add Sample Markers" to drop pins for several
// US cities, each with a popup showing name + description.
// ─────────────────────────────────────────────────────────────

import React, { useState, useRef } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { createMarker } from "../utils/mapUtils";

const SAMPLE_CITIES = [
  {
    longitude: -118.24, latitude: 34.05,
    title: "Los Angeles, CA",
    description: "City of Angels — population ~3.9M",
    color: [226, 119, 40],
  },
  {
    longitude: -87.63, latitude: 41.88,
    title: "Chicago, IL",
    description: "The Windy City — population ~2.7M",
    color: [0, 180, 216],
  },
  {
    longitude: -73.94, latitude: 40.67,
    title: "New York, NY",
    description: "The Big Apple — population ~8.3M",
    color: [67, 170, 139],
  },
  {
    longitude: -95.37, latitude: 29.76,
    title: "Houston, TX",
    description: "Space City — population ~2.3M",
    color: [248, 150, 30],
  },
  {
    longitude: -122.33, latitude: 47.61,
    title: "Seattle, WA",
    description: "Emerald City — population ~750K",
    color: [144, 190, 109],
  },
];

export default function MarkersPanel({ view }) {
  const [added, setAdded] = useState(false);
  const layerRef = useRef(null);

  const addMarkers = () => {
    if (!view) return;

    // Create a GraphicsLayer to hold the markers
    // GraphicsLayer = client-side, no server round-trip
    const layer = new GraphicsLayer({ title: "City Markers" });
    layerRef.current = layer;

    const graphics = SAMPLE_CITIES.map(createMarker);
    layer.addMany(graphics);
    view.map.add(layer);

    setAdded(true);
  };

  const clearMarkers = () => {
    if (layerRef.current) {
      view.map.remove(layerRef.current);
      layerRef.current = null;
    }
    setAdded(false);
  };

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>📍 Markers &amp; Popups</h3>
      <p style={styles.desc}>
        Each marker is a <code>Graphic</code> with a <code>SimpleMarkerSymbol</code> and a{" "}
        <code>PopupTemplate</code>. They live in a client-side <code>GraphicsLayer</code>.
        Click any marker on the map to see its popup.
      </p>

      <div style={styles.row}>
        <button
          style={{ ...styles.btn, background: added ? "#444" : "#007ac2" }}
          onClick={addMarkers}
          disabled={added}
        >
          Add Sample Markers
        </button>
        <button
          style={{ ...styles.btn, background: added ? "#c0392b" : "#333" }}
          onClick={clearMarkers}
          disabled={!added}
        >
          Clear Markers
        </button>
      </div>

      {added && (
        <ul style={styles.list}>
          {SAMPLE_CITIES.map((c) => (
            <li key={c.title} style={styles.listItem}>
              <span
                style={{
                  ...styles.dot,
                  background: `rgb(${c.color.join(",")})`,
                }}
              />
              {c.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  panel: { padding: 16 },
  heading: { color: "#00b4d8", margin: "0 0 8px", fontSize: 15 },
  desc: { color: "#999", fontSize: 12, lineHeight: 1.6, marginBottom: 14 },
  row: { display: "flex", gap: 8, marginBottom: 12 },
  btn: {
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
    opacity: 1,
    transition: "opacity 0.2s",
  },
  list: { margin: 0, padding: 0, listStyle: "none" },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#ccc",
    fontSize: 13,
    padding: "4px 0",
  },
  dot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
};
