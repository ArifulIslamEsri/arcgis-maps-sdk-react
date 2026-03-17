// src/components/WidgetsPanel.jsx
import React, { useState, useRef } from "react";
import Sketch from "@arcgis/core/widgets/Sketch";
import Legend from "@arcgis/core/widgets/Legend";
import LayerList from "@arcgis/core/widgets/LayerList";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

const WIDGETS_DEF = [
  { id: "sketch",    label: "Sketch",      emoji: "✏️", color: "#f77f00", position: "top-left",    desc: "Draw points, lines, and polygons directly on the map. Returns geometry you can use for spatial queries." },
  { id: "legend",    label: "Legend",      emoji: "📋", color: "#06d6a0", position: "bottom-left",  desc: "Auto-generates a legend for all visible layers that have a renderer. Updates dynamically when layers change." },
  { id: "layerlist", label: "Layer List",  emoji: "📑", color: "#4cc9f0", position: "top-right",   desc: "Shows a table of contents for all layers. Users can toggle visibility. Can add action buttons per layer." },
  { id: "scalebar",  label: "Scale Bar",   emoji: "📏", color: "#a8dadc", position: "bottom-right", desc: "Shows the real-world distance that corresponds to a length on screen. Updates automatically when you zoom." },
];

const CONCEPTS = [
  { term: "view.ui.add(widget, position)", color: "#f77f00", def: "The universal method for placing any widget on the map. Position options: 'top-left', 'top-right', 'bottom-left', 'bottom-right', or a custom HTML element." },
  { term: "Widget lifecycle", color: "#06d6a0", def: "Widgets are created, added to the view, and destroyed. Always call widget.destroy() before creating a new instance of the same type to avoid memory leaks." },
  { term: "Sketch events", color: "#4cc9f0", def: "The Sketch widget fires events: 'create', 'update', 'delete'. Listen to these to get the drawn geometry and trigger spatial queries or other logic." },
  { term: "view.ui.remove(widget)", color: "#a8dadc", def: "Removes a widget from the map UI without destroying it. Use destroy() to fully clean up. Removing a widget doesn't affect the data it may have created." },
];

export default function WidgetsPanel({ view }) {
  const [active, setActive] = useState({});
  const widgetRefs = useRef({});

  const toggle = (id) => {
    if (!view) return;
    if (active[id]) {
      const w = widgetRefs.current[id];
      if (w) { view.ui.remove(w); w.destroy(); delete widgetRefs.current[id]; }
      setActive((p) => ({ ...p, [id]: false }));
      return;
    }
    let widget;
    if (id === "sketch") {
      const gl = new GraphicsLayer({ title: "Sketch Layer" });
      view.map.add(gl);
      widget = new Sketch({ view, layer: gl, creationMode: "update" });
      view.ui.add(widget, "top-left");
    }
    if (id === "legend")    { widget = new Legend({ view });              view.ui.add(widget, "bottom-left"); }
    if (id === "layerlist") { widget = new LayerList({ view });           view.ui.add(widget, "top-right"); }
    if (id === "scalebar")  { widget = new ScaleBar({ view, unit:"dual"}); view.ui.add(widget, "bottom-right"); }
    widgetRefs.current[id] = widget;
    setActive((p) => ({ ...p, [id]: true }));
  };

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>🧩 Widgets</h3>
      <p style={styles.desc}>
        ArcGIS widgets are pre-built UI components. Add them to the map with one line:
        <code> view.ui.add(widget, position)</code>. Toggle each widget on/off below
        and watch it appear on the map.
      </p>

      <div style={styles.section}>
        <p style={styles.sectionLabel}>Toggle widgets on the map:</p>
        {WIDGETS_DEF.map((w) => (
          <div key={w.id} style={styles.widgetRow}>
            <div style={styles.widgetInfo}>
              <span style={styles.emoji}>{w.emoji}</span>
              <div>
                <div style={{ color: active[w.id] ? w.color : "#eee", fontSize: 13, fontWeight: 700 }}>{w.label}</div>
                <div style={styles.widgetDesc}>{w.desc}</div>
                <div style={{ color: "#555", fontSize: 10, marginTop: 2 }}>Position: <code style={{ color: "#888" }}>{w.position}</code></div>
              </div>
            </div>
            <button onClick={() => toggle(w.id)} style={{ ...styles.toggleBtn, background: active[w.id] ? w.color : "#2a2a4a", color: active[w.id] ? "#fff" : "#888" }}>
              {active[w.id] ? "Remove" : "Add"}
            </button>
          </div>
        ))}
      </div>

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
        <div style={styles.codeBlock}><pre style={styles.code}>{`import Sketch from "@arcgis/core/widgets/Sketch";
import Legend from "@arcgis/core/widgets/Legend";
import LayerList from "@arcgis/core/widgets/LayerList";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";

// Add a search widget to the top-right
const sketch = new Sketch({ view, layer: graphicsLayer });
view.ui.add(sketch, "top-left");

// Listen for completed drawings
sketch.on("create", (event) => {
  if (event.state === "complete") {
    const drawnGeometry = event.graphic.geometry;
    // Use geometry for a spatial query
  }
});

// Add a legend (auto-populates from layer renderers)
const legend = new Legend({ view });
view.ui.add(legend, "bottom-left");

// Remove a widget
view.ui.remove(legend);
legend.destroy(); // always destroy to free memory`}</pre></div>
      </div>
    </div>
  );
}

const styles = {
  panel: { padding: 16 },
  heading: { color: "#a8dadc", margin: "0 0 8px", fontSize: 15 },
  desc: { color: "#999", fontSize: 12, lineHeight: 1.6, marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionLabel: { color: "#aaa", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 700 },
  widgetRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", background: "#1e1e3a", borderRadius: 8, padding: "10px 12px", marginBottom: 8, gap: 8 },
  widgetInfo: { display: "flex", gap: 10, flex: 1 },
  emoji: { fontSize: 18, flexShrink: 0, marginTop: 2 },
  widgetDesc: { color: "#666", fontSize: 11, lineHeight: 1.5, marginTop: 3 },
  toggleBtn: { padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all 0.2s", flexShrink: 0 },
  conceptCard: { display: "flex", gap: 10, background: "#1e1e3a", borderRadius: 8, padding: "10px 12px", marginBottom: 8 },
  conceptDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5 },
  conceptTerm: { fontSize: 12, fontWeight: 700, marginBottom: 4, fontFamily: "monospace" },
  conceptDef: { color: "#888", fontSize: 12, lineHeight: 1.6 },
  codeBlock: { background: "#0d0d1a", borderRadius: 8, border: "1px solid #333" },
  code: { margin: 0, padding: 14, fontSize: 11, lineHeight: 1.7, color: "#c9d1d9", whiteSpace: "pre-wrap" },
};
