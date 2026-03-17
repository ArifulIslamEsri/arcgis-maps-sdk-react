// src/components/MapPanel.jsx
// CARTO tiles — no API key, no referrer blocks

import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import Basemap from "@arcgis/core/Basemap";
import "@arcgis/core/assets/esri/themes/dark/main.css";

const BASEMAPS = [
  { id: "dark",    label: "Dark",    tileUrl: "https://{subDomain}.basemaps.cartocdn.com/dark_all/{level}/{col}/{row}.png",              subDomains: ["a","b","c","d"], copyright: "© CARTO © OpenStreetMap contributors" },
  { id: "light",   label: "Light",   tileUrl: "https://{subDomain}.basemaps.cartocdn.com/light_all/{level}/{col}/{row}.png",             subDomains: ["a","b","c","d"], copyright: "© CARTO © OpenStreetMap contributors" },
  { id: "streets", label: "Streets", tileUrl: "https://{subDomain}.basemaps.cartocdn.com/rastertiles/voyager/{level}/{col}/{row}.png",   subDomains: ["a","b","c","d"], copyright: "© CARTO © OpenStreetMap contributors" },
  { id: "toner",   label: "Toner",   tileUrl: "https://{subDomain}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{level}/{col}/{row}.png", subDomains: ["a","b","c","d"], copyright: "© CARTO © OpenStreetMap contributors" },
];

function buildBasemap(bm) {
  return new Basemap({
    baseLayers: [ new WebTileLayer({ urlTemplate: bm.tileUrl, subDomains: bm.subDomains, copyright: bm.copyright }) ],
    title: bm.label,
  });
}

export default function MapPanel({ onViewReady }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [activeBasemap, setActiveBasemap] = useState("dark");

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new Map({ basemap: buildBasemap(BASEMAPS[0]) });
    mapRef.current = map;
    const view = new MapView({ container: containerRef.current, map, center: [-96, 38], zoom: 4 });
    view.when(() => { if (onViewReady) onViewReady(view, map); });
    return () => { view.destroy(); };
  }, []); // eslint-disable-line

  const switchBasemap = (bm) => {
    setActiveBasemap(bm.id);
    if (mapRef.current) mapRef.current.basemap = buildBasemap(bm);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.toolbar}>
        <span style={styles.label}>Basemap:</span>
        {BASEMAPS.map((bm) => (
          <button key={bm.id} onClick={() => switchBasemap(bm)} style={{
            ...styles.bmBtn,
            background: activeBasemap === bm.id ? "#bd93f9" : "#1a0533",
            color: activeBasemap === bm.id ? "#0a0118" : "#6272a4",
            fontWeight: activeBasemap === bm.id ? 700 : 400,
          }}>{bm.label}</button>
        ))}
        <span style={styles.freeTag}>✅ No API key</span>
      </div>
      <div ref={containerRef} style={styles.map} />
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", height: "100%", width: "100%" },
  toolbar: { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#0d0221", borderBottom: "1px solid #2d1b4e", flexWrap: "wrap", flexShrink: 0 },
  label: { color: "#6272a4", fontSize: 12, marginRight: 4 },
  bmBtn: { padding: "5px 14px", borderRadius: 20, border: "1px solid #2d1b4e", cursor: "pointer", fontSize: 12, transition: "all 0.2s" },
  freeTag: { marginLeft: "auto", color: "#50fa7b", fontSize: 11 },
  map: { flex: 1, width: "100%" },
};
