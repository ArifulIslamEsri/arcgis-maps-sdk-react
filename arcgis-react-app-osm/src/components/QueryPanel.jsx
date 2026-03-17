// src/components/QueryPanel.jsx
// Uses a 100% public ArcGIS feature service — no login needed

import React, { useState, useRef } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";

// 100% public — no API key or login needed
const SERVICE_URL =
  "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/US_States_Basic/FeatureServer/0";

const HIGHLIGHT_SYMBOL = new SimpleFillSymbol({
  color: [255, 214, 0, 0.4],
  outline: new SimpleLineSymbol({ color: [255, 165, 0], width: 2 }),
});

export default function QueryPanel({ view }) {
  const [minPop, setMinPop] = useState("5000000");
  const [region, setRegion] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const highlightLayerRef = useRef(null);

  const runQuery = async () => {
    if (!view) return;
    setLoading(true);
    setError("");
    clearHighlights();

    try {
      const conditions = [];
      if (minPop) conditions.push(`POPULATION >= ${parseInt(minPop, 10)}`);
      if (region) conditions.push(`SUB_REGION = '${region}'`);
      const whereClause = conditions.length ? conditions.join(" AND ") : "1=1";

      const layer = new FeatureLayer({
        url: SERVICE_URL,
        // Disable authentication attempts entirely
        refreshInterval: 0,
      });

      const query = {
        where: whereClause,
        outFields: ["STATE_NAME", "POPULATION", "SUB_REGION"],
        returnGeometry: true,
      };

      const featureSet = await layer.queryFeatures(query);
      const features = featureSet.features;

      setResults(
        features.map((f) => ({
          name: f.attributes.STATE_NAME || f.attributes.NAME,
          population: f.attributes.POPULATION?.toLocaleString() || "N/A",
          region: f.attributes.SUB_REGION || "—",
        }))
      );

      if (features.length > 0) {
        const highlightLayer = new GraphicsLayer({ title: "Query Results" });
        features.forEach((f) => {
          highlightLayer.add(
            new Graphic({ geometry: f.geometry, symbol: HIGHLIGHT_SYMBOL })
          );
        });
        highlightLayerRef.current = highlightLayer;
        view.map.add(highlightLayer);
        await view.goTo(features.map((f) => f.geometry));
      }
    } catch (err) {
      setError("Query failed — try a different filter or check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHighlights = () => {
    if (highlightLayerRef.current) {
      view.map.remove(highlightLayerRef.current);
      highlightLayerRef.current = null;
    }
    setResults([]);
  };

  const REGIONS = [
    "", "Pacific", "Mountain", "West North Central", "East North Central",
    "New England", "Middle Atlantic", "South Atlantic",
    "East South Central", "West South Central",
  ];

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>🔍 Query Features</h3>
      <p style={styles.desc}>
        Sends a SQL <code>where</code> clause to a public feature service via{" "}
        <code>queryFeatures()</code>. No login required.
      </p>

      <div style={styles.fields}>
        <label style={styles.fieldLabel}>Min. Population</label>
        <input
          type="number"
          value={minPop}
          onChange={(e) => setMinPop(e.target.value)}
          style={styles.input}
          placeholder="e.g. 5000000"
        />
        <label style={styles.fieldLabel}>Region (optional)</label>
        <select value={region} onChange={(e) => setRegion(e.target.value)} style={styles.input}>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r || "— Any —"}</option>
          ))}
        </select>
      </div>

      <div style={styles.row}>
        <button
          style={{ ...styles.btn, background: "#007ac2" }}
          onClick={runQuery}
          disabled={loading}
        >
          {loading ? "Querying…" : "Run Query"}
        </button>
        {results.length > 0 && (
          <button style={{ ...styles.btn, background: "#555" }} onClick={clearHighlights}>
            Clear
          </button>
        )}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {results.length > 0 && (
        <div>
          <p style={styles.resultCount}>{results.length} state(s) matched:</p>
          <div style={styles.resultList}>
            {results.map((r) => (
              <div key={r.name} style={styles.resultRow}>
                <span style={styles.stateName}>{r.name}</span>
                <span style={styles.pop}>{r.population}</span>
                <span style={styles.regionTag}>{r.region}</span>
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
  heading: { color: "#ff6b6b", margin: "0 0 8px", fontSize: 15 },
  desc: { color: "#999", fontSize: 12, lineHeight: 1.6, marginBottom: 14 },
  fields: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 },
  fieldLabel: { color: "#aaa", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 },
  input: { background: "#1e1e3a", border: "1px solid #444", borderRadius: 6, color: "#eee", padding: "7px 10px", fontSize: 13, width: "100%", boxSizing: "border-box" },
  row: { display: "flex", gap: 8, marginBottom: 12 },
  btn: { padding: "8px 16px", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontSize: 13 },
  error: { color: "#ff6b6b", fontSize: 12 },
  resultCount: { color: "#aaa", fontSize: 12, margin: "0 0 6px" },
  resultList: { display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflowY: "auto" },
  resultRow: { display: "flex", alignItems: "center", gap: 8, background: "#1e1e3a", borderRadius: 6, padding: "6px 10px" },
  stateName: { color: "#eee", fontSize: 12, flex: 1 },
  pop: { color: "#90be6d", fontSize: 11, fontFamily: "monospace" },
  regionTag: { background: "#2a2a4a", color: "#a0c4ff", borderRadius: 4, padding: "2px 6px", fontSize: 10 },
};
