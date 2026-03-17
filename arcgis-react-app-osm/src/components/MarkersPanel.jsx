// src/components/MarkersPanel.jsx
import React, { useState, useRef } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { createMarker } from "../utils/mapUtils";

const SAMPLE_CITIES = [
  { longitude: -118.24, latitude: 34.05, title: "Los Angeles, CA", description: "City of Angels — population ~3.9M", color: [226, 119, 40] },
  { longitude: -87.63,  latitude: 41.88, title: "Chicago, IL",     description: "The Windy City — population ~2.7M", color: [0, 180, 216] },
  { longitude: -73.94,  latitude: 40.67, title: "New York, NY",    description: "The Big Apple — population ~8.3M",  color: [67, 170, 139] },
  { longitude: -95.37,  latitude: 29.76, title: "Houston, TX",     description: "Space City — population ~2.3M",     color: [248, 150, 30] },
  { longitude: -122.33, latitude: 47.61, title: "Seattle, WA",     description: "Emerald City — population ~750K",   color: [144, 190, 109] },
];

const CONCEPTS = [
  { term: "Graphic", color: "#00b4d8", def: "The fundamental unit of client-side map data. A Graphic combines geometry (where) + symbol (how it looks) + attributes (what data it holds) + popupTemplate (what shows on click)." },
  { term: "GraphicsLayer", color: "#06d6a0", def: "A client-side layer that holds Graphic objects. Data lives only in the browser — nothing is sent to a server. Perfect for temporary highlights, search results, or user-drawn features." },
  { term: "SimpleMarkerSymbol", color: "#f77f00", def: "Styles a point Graphic as a circle/square/diamond with a fill color, outline, and size. Other point symbols include PictureMarkerSymbol (custom image) and TextSymbol (label)." },
  { term: "PopupTemplate", color: "#ff6b6b", def: "A template attached to a Graphic or Layer that defines what shows in the popup when clicked. Has a title (string or expression) and content (fields, text, charts, or custom HTML)." },
  { term: "geometry", color: "#c77dff", def: "The spatial location of a Graphic. For points: new Point({ longitude, latitude }). For lines: Polyline. For areas: Polygon. All geometries have a spatialReference." },
];

export default function MarkersPanel({ view }) {
  const [added, setAdded] = useState(false);
  const layerRef = useRef(null);

  const addMarkers = () => {
    if (!view || added) return;
    const layer = new GraphicsLayer({ title: "City Markers" });
    layerRef.current = layer;
    layer.addMany(SAMPLE_CITIES.map(createMarker));
    view.map.add(layer);
    setAdded(true);
  };

  const clearMarkers = () => {
    if (layerRef.current) { view.map.remove(layerRef.current); layerRef.current = null; }
    setAdded(false);
  };

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>📍 Markers & Popups</h3>
      <p style={styles.desc}>
        A <code>Graphic</code> is the fundamental unit of client-side map data.
        Each marker is a <code>Graphic</code> with a point geometry, a symbol, and a
        popup template. They all live in a <code>GraphicsLayer</code>. Click any marker on the map to see its popup.
      </p>

      <div style={styles.btnRow}>
        <button style={{ ...styles.btn, background: added ? "#444" : "#007ac2" }} onClick={addMarkers} disabled={added}>Add Markers</button>
        <button style={{ ...styles.btn, background: added ? "#c0392b" : "#333" }} onClick={clearMarkers} disabled={!added}>Clear</button>
      </div>

      {added && (
        <div style={styles.cityList}>
          {SAMPLE_CITIES.map((c) => (
            <div key={c.title} style={styles.cityRow}>
              <span style={{ ...styles.dot, background: `rgb(${c.color.join(",")})` }} />
              <div>
                <div style={styles.cityName}>{c.title}</div>
                <div style={styles.cityDesc}>{c.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={styles.section}>
        <p style={styles.sectionLabel}>Key concepts:</p>
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

      <div style={styles.section}>
        <p style={styles.sectionLabel}>Code example:</p>
        <div style={styles.codeBlock}><pre style={styles.code}>{`import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

// 1. Create a point geometry
const point = new Point({ longitude: -118.24, latitude: 34.05 });

// 2. Create a symbol
const symbol = new SimpleMarkerSymbol({
  color: [226, 119, 40],
  outline: { color: [255,255,255], width: 2 },
  size: 12,
});

// 3. Create the Graphic with a popup template
const graphic = new Graphic({
  geometry: point,
  symbol,
  attributes: { title: "Los Angeles", pop: "3.9M" },
  popupTemplate: {
    title: "{title}",
    content: "Population: {pop}",
  },
});

// 4. Add to a GraphicsLayer on the map
const layer = new GraphicsLayer();
layer.add(graphic);
map.add(layer);`}</pre></div>
      </div>
    </div>
  );
}

const styles = {
  panel: { padding: 16 },
  heading: { color: "#00b4d8", margin: "0 0 8px", fontSize: 15 },
  desc: { color: "#999", fontSize: 12, lineHeight: 1.6, marginBottom: 14 },
  btnRow: { display: "flex", gap: 8, marginBottom: 14 },
  btn: { padding: "8px 14px", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontSize: 13 },
  cityList: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
  cityRow: { display: "flex", alignItems: "center", gap: 10, background: "#1e1e3a", borderRadius: 6, padding: "8px 10px" },
  dot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  cityName: { color: "#eee", fontSize: 12, fontWeight: 700 },
  cityDesc: { color: "#666", fontSize: 11 },
  section: { marginBottom: 20 },
  sectionLabel: { color: "#aaa", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 700 },
  conceptCard: { display: "flex", gap: 10, background: "#1e1e3a", borderRadius: 8, padding: "10px 12px", marginBottom: 8 },
  conceptDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5 },
  conceptTerm: { fontSize: 13, fontWeight: 700, marginBottom: 4, fontFamily: "monospace" },
  conceptDef: { color: "#888", fontSize: 12, lineHeight: 1.6 },
  codeBlock: { background: "#0d0d1a", borderRadius: 8, border: "1px solid #333" },
  code: { margin: 0, padding: 14, fontSize: 11, lineHeight: 1.7, color: "#c9d1d9", whiteSpace: "pre-wrap" },
};
