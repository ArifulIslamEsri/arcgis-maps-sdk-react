// src/components/MapPanel.jsx
// ─────────────────────────────────────────────────────────────
// Renders the ArcGIS MapView and exposes it via onViewReady so
// sibling components (markers, layers, query) can attach to it.
//
// Concept covered: Map + MapView, Basemap switching
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Search from "@arcgis/core/widgets/Search";
import "@arcgis/core/assets/esri/themes/dark/main.css";

const BASEMAPS = [
  { id: "streets-vector", label: "Streets" },
  { id: "satellite",      label: "Satellite" },
  { id: "topo-vector",    label: "Topo" },
  { id: "dark-gray-vector", label: "Dark Gray" },
  { id: "oceans",         label: "Oceans" },
];

export default function MapPanel({ onViewReady }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const viewRef = useRef(null);
  const [activeBasemap, setActiveBasemap] = useState("streets-vector");

  // ── Initialise Map + MapView once on mount ────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new Map({ basemap: activeBasemap });
    mapRef.current = map;

    const view = new MapView({
      container: containerRef.current,
      map,
      center: [-96, 38], // centre of continental US
      zoom: 4,
    });
    viewRef.current = view;

    // Add Search widget (geocoder)
    const search = new Search({ view });
    view.ui.add(search, "top-right");

    // Notify parent that the view is ready
    view.when(() => {
      if (onViewReady) onViewReady(view, map);
    });

    return () => {
      view.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Basemap switcher ─────────────────────────────────────
  // The Map object's basemap property can be changed at any time.
  const switchBasemap = (basemapId) => {
    setActiveBasemap(basemapId);
    if (mapRef.current) {
      mapRef.current.basemap = basemapId;
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Basemap toolbar */}
      <div style={styles.toolbar}>
        <span style={styles.label}>Basemap:</span>
        {BASEMAPS.map((bm) => (
          <button
            key={bm.id}
            onClick={() => switchBasemap(bm.id)}
            style={{
              ...styles.bmBtn,
              background: activeBasemap === bm.id ? "#007ac2" : "#2a2a4a",
              color: activeBasemap === bm.id ? "#fff" : "#aaa",
            }}
          >
            {bm.label}
          </button>
        ))}
      </div>

      {/* Map container — ArcGIS binds to this div */}
      <div ref={containerRef} style={styles.map} />
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", height: "100%" },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    background: "#111",
    borderBottom: "1px solid #333",
    flexWrap: "wrap",
  },
  label: { color: "#888", fontSize: 12, marginRight: 4 },
  bmBtn: {
    padding: "5px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    transition: "all 0.2s",
  },
  map: { flex: 1 },
};
