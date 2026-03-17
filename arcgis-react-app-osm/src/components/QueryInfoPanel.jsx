// src/components/QueryInfoPanel.jsx
import React, { useState } from "react";

const CONCEPTS = [
  { term: "Query object", color: "#ff5555", def: "Defines what you're asking the feature service. Key properties: where (SQL filter), outFields (which columns to return), returnGeometry (include coordinates), geometry (spatial filter), and num/start (pagination)." },
  { term: "where clause", color: "#ff79c6", def: "A SQL-style string sent to the server. '1=1' returns all features. 'POPULATION > 5000000' filters by value. Combine with AND/OR: 'STATE = \\'CA\\' AND POP > 100000'. The server evaluates this — not JavaScript." },
  { term: "queryFeatures()", color: "#ffb86c", def: "Sends the query to the server and returns a Promise<FeatureSet>. The FeatureSet has a .features array of Graphic objects, each with .attributes (the data) and .geometry (the location)." },
  { term: "queryFeatureCount()", color: "#50fa7b", def: "Returns just a number — how many features match your where clause. Much faster than queryFeatures() when you don't need the actual features. Great for validation before a big query." },
  { term: "outFields", color: "#8be9fd", def: "Array of field names to include in the response. Use ['*'] for all fields, or ['STATE_NAME','POPULATION'] to limit what comes back. Fewer fields = smaller response = faster query." },
  { term: "returnGeometry", color: "#bd93f9", def: "Boolean. Set to true when you need to highlight results on the map or zoom to them. Set to false when you only need the attribute data — saves bandwidth." },
  { term: "Spatial query", color: "#f1fa8c", def: "Filter features by location. Set geometry to a Point, Polygon, or Extent, then set spatialRelationship to 'intersects', 'contains', or 'within'. Find all parks inside a drawn polygon, for example." },
  { term: "FeatureSet", color: "#6be5fd", def: "The object returned by queryFeatures(). Contains .features (array of Graphics), .fields (column metadata), .geometryType ('point', 'polygon' etc), and .spatialReference." },
  { term: "view.goTo(features)", color: "#ff5555", def: "Zooms and pans the map to fit all the queried features in view. Pass an array of geometries or graphics. Add { duration: 1000 } for a smooth animated zoom." },
  { term: "Server-side vs client-side", color: "#ffb86c", def: "queryFeatures() runs on the server — fast for large datasets. For data already loaded in the browser, use FeatureLayerView.queryFeatures() which filters the already-downloaded features without a network request." },
];

const CODE_EXAMPLES = [
  {
    label: "Basic attribute query",
    code: `import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const layer = new FeatureLayer({ url: "...FeatureServer/0" });

// Query object — defines what to ask
const query = {
  where: "POPULATION > 5000000", // SQL filter
  outFields: ["STATE_NAME", "POPULATION"],
  returnGeometry: true,  // include coordinates
};

// Send query — returns a Promise
const featureSet = await layer.queryFeatures(query);

// featureSet.features = array of Graphic objects
featureSet.features.forEach(feature => {
  console.log(
    feature.attributes.STATE_NAME,  // data
    feature.geometry                 // location
  );
});`,
  },
  {
    label: "Count before querying",
    code: `// Check count first — avoid loading too much data
const count = await layer.queryFeatureCount({
  where: "POPULATION > 1000000"
});

console.log(\`\${count} states match\`);

// Only run full query if count is reasonable
if (count > 0 && count < 100) {
  const results = await layer.queryFeatures({
    where: "POPULATION > 1000000",
    outFields: ["STATE_NAME", "POPULATION"],
    returnGeometry: true,
  });
}`,
  },
  {
    label: "Spatial query",
    code: `// Query features that intersect the current map extent
const spatialQuery = {
  geometry: view.extent,           // current map view
  spatialRelationship: "intersects",
  outFields: ["STATE_NAME"],
  returnGeometry: true,
};

const results = await layer.queryFeatures(spatialQuery);

// Zoom to results
await view.goTo(
  results.features.map(f => f.geometry),
  { duration: 1000 }
);`,
  },
  {
    label: "Highlight results on map",
    code: `import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";

// Query the layer
const results = await layer.queryFeatures({
  where: "SUB_REGION = 'Pacific'",
  returnGeometry: true,
  outFields: ["STATE_NAME"],
});

// Create a highlight layer
const highlightLayer = new GraphicsLayer();
const yellowFill = new SimpleFillSymbol({
  color: [255, 214, 0, 0.4],
  outline: { color: [255, 165, 0], width: 2 }
});

// Add each result as a highlighted graphic
results.features.forEach(f => {
  highlightLayer.add(
    new Graphic({ geometry: f.geometry, symbol: yellowFill })
  );
});

map.add(highlightLayer);
view.goTo(results.features);`,
  },
];

export default function QueryInfoPanel() {
  const [activeCode, setActiveCode] = useState(0);

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>🔍 Query Features — Beginner Guide</h3>
      <p style={styles.desc}>
        Querying is how you ask a feature service questions about its data.
        Think of it like SQL for your map — you send a <code>where</code> clause
        to the server and get back matching features with their geometry and attributes.
        The server does the filtering, not your browser.
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
              background: activeCode === i ? "#ff555522" : "transparent",
              border: `1px solid ${activeCode === i ? "#ff5555" : "#2d1b4e"}`,
              color: activeCode === i ? "#ff5555" : "#6272a4",
            }}>{ex.label}</button>
          ))}
        </div>
        <div style={styles.codeBlock}>
          <pre style={styles.code}>{CODE_EXAMPLES[activeCode].code}</pre>
        </div>
      </div>

      <div style={styles.tipBox}>
        <p style={styles.tipTitle}>💡 Query tips for beginners</p>
        <p style={styles.tipText}>
          Always use <strong style={{ color: "#50fa7b" }}>queryFeatureCount()</strong> first to check
          how many results you'll get before loading full geometry. Use{" "}
          <strong style={{ color: "#8be9fd" }}>returnGeometry: false</strong> when you only need
          attribute data — it makes queries significantly faster. String values in the{" "}
          <strong style={{ color: "#ffb86c" }}>where</strong> clause need single quotes:{" "}
          <code>STATE = 'California'</code>.
        </p>
      </div>
    </div>
  );
}

const styles = {
  panel: { padding: 16 },
  heading: { color: "#ff5555", margin: "0 0 8px", fontSize: 15 },
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
