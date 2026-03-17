// src/components/RestApiPanel.jsx
// Demonstrates: ArcGIS REST API direct calls using fetch()
// No SDK needed — raw HTTP requests to Esri feature services

import React, { useState } from "react";

const SERVICE_URL = "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/US_States_Basic/FeatureServer/0";

export default function RestApiPanel() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeExample, setActiveExample] = useState(null);

  const EXAMPLES = [
    {
      id: "all",
      label: "Get all states",
      desc: "where=1=1 returns everything",
      params: { where: "1=1", outFields: "STATE_NAME,POPULATION", returnGeometry: false, f: "json", resultRecordCount: 5 },
    },
    {
      id: "large",
      label: "States > 10M population",
      desc: "SQL where clause filter",
      params: { where: "POPULATION > 10000000", outFields: "STATE_NAME,POPULATION", returnGeometry: false, f: "json" },
    },
    {
      id: "count",
      label: "Count only",
      desc: "returnCountOnly=true — faster, no features",
      params: { where: "1=1", returnCountOnly: true, f: "json" },
    },
    {
      id: "geojson",
      label: "As GeoJSON",
      desc: "f=geojson — standard format for other tools",
      params: { where: "POPULATION > 15000000", outFields: "STATE_NAME", returnGeometry: true, f: "geojson" },
    },
  ];

  const runExample = async (example) => {
    setLoading(true);
    setError("");
    setResults(null);
    setActiveExample(example.id);

    try {
      // Build URL with query params — this is what the SDK does under the hood
      const params = new URLSearchParams(example.params);
      const url = `${SERVICE_URL}/query?${params}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("Request failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const builtUrl = activeExample
    ? `${SERVICE_URL}/query?${new URLSearchParams(EXAMPLES.find(e => e.id === activeExample)?.params || {})}`
    : null;

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>📡 REST API — Direct Calls</h3>
      <p style={styles.desc}>
        Every ArcGIS SDK call is a <code>fetch()</code> to a REST endpoint under the hood.
        Call the API directly — no SDK needed. Append <code>/query</code> to any feature
        service URL with params like <code>where</code>, <code>outFields</code>, and <code>f=json</code>.
      </p>

      <p style={styles.subLabel}>Try a request:</p>
      <div style={styles.exampleList}>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => runExample(ex)}
            style={{
              ...styles.exBtn,
              background: activeExample === ex.id ? "#1e1e4a" : "#12121e",
              border: `1px solid ${activeExample === ex.id ? "#4cc9f0" : "#333"}`,
            }}
          >
            <span style={{ color: activeExample === ex.id ? "#4cc9f0" : "#ccc", fontSize: 13, fontWeight: 700 }}>{ex.label}</span>
            <span style={{ color: "#666", fontSize: 11, marginTop: 2 }}>{ex.desc}</span>
          </button>
        ))}
      </div>

      {builtUrl && (
        <div style={styles.urlBox}>
          <p style={styles.urlLabel}>Request URL:</p>
          <p style={styles.url}>{builtUrl}</p>
        </div>
      )}

      {loading && <p style={styles.loading}>Fetching from ArcGIS REST API…</p>}
      {error && <p style={styles.error}>{error}</p>}

      {results && (
        <div>
          <p style={styles.resultLabel}>
            Response {results.count !== undefined ? `— count: ${results.count}` : results.features ? `— ${results.features.length} feature(s)` : ""}
          </p>
          <pre style={styles.json}>{JSON.stringify(results, null, 2).slice(0, 800)}{JSON.stringify(results).length > 800 ? "\n\n... (truncated)" : ""}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  panel: { padding: 16 },
  heading: { color: "#90be6d", margin: "0 0 8px", fontSize: 15 },
  desc: { color: "#999", fontSize: 12, lineHeight: 1.6, marginBottom: 14 },
  subLabel: { color: "#aaa", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  exampleList: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 },
  exBtn: { display: "flex", flexDirection: "column", padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.2s" },
  urlBox: { background: "#0d0d1a", borderRadius: 8, padding: 12, marginBottom: 12, border: "1px solid #333", wordBreak: "break-all" },
  urlLabel: { color: "#666", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  url: { color: "#90be6d", fontSize: 11, lineHeight: 1.5, fontFamily: "monospace" },
  loading: { color: "#888", fontSize: 12 },
  error: { color: "#ff6b6b", fontSize: 12 },
  resultLabel: { color: "#aaa", fontSize: 12, marginBottom: 6 },
  json: { background: "#0d0d1a", border: "1px solid #333", borderRadius: 8, padding: 12, fontSize: 10, color: "#c9d1d9", overflowX: "auto", whiteSpace: "pre-wrap", maxHeight: 240, overflowY: "auto" },
};
