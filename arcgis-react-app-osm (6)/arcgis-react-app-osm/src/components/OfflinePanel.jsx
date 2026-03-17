// src/components/OfflinePanel.jsx
// Demonstrates: Offline maps concepts, TileLayer, offline architecture

import React, { useState } from "react";

// This panel explains offline maps architecture and simulates
// what a real offline workflow looks like. Full offline support
// requires ArcGIS Runtime SDK (native apps) or specific web APIs.

const STEPS = [
  {
    id: 1,
    title: "Define the area",
    code: `// Define the geographic area to take offline
const offlineArea = view.extent; // or draw a polygon

// Create an OfflineMapTask
const task = new OfflineMapTask({
  onlineMap: webMap
});`,
    desc: "You define the bounding box or polygon of the area you want available offline.",
    color: "#00b4d8",
  },
  {
    id: 2,
    title: "Generate a tile package",
    code: `// Generate parameters for the offline job
const params = await task
  .createDefaultDownloadPreplannedOfflineMapParameters(area);

// Set min/max zoom levels
params.minScale = 1000000;
params.maxScale = 2000;`,
    desc: "The server pre-renders map tiles into a .tpkx (Tile Package) file for the requested area and zoom levels.",
    color: "#06d6a0",
  },
  {
    id: 3,
    title: "Download to device",
    code: `// Start the download job
const job = task.downloadPreplannedOfflineMap(
  params,
  downloadPath
);

// Monitor progress
job.on("progress", (e) => {
  console.log(\`\${e.progress}% downloaded\`);
});

const result = await job.start();`,
    desc: "The tile package and feature data are downloaded to the device. Progress can be monitored in real time.",
    color: "#f77f00",
  },
  {
    id: 4,
    title: "Use offline",
    code: `// Load the offline map from disk
const offlineMap = new MobileMapPackage(downloadPath);
await offlineMap.load();

// Open in a MapView — works with no internet
const view = new MapView({
  map: offlineMap.maps[0]
});`,
    desc: "The app loads the local tile package. The map works fully with no internet connection.",
    color: "#a8dadc",
  },
  {
    id: 5,
    title: "Sync edits back",
    code: `// When back online, sync edits
const syncTask = new GeodatabaseSyncTask({
  url: featureServiceUrl
});

const syncParams = await syncTask
  .createDefaultSyncGeodatabaseParameters(geodatabase);

const syncJob = syncTask.syncGeodatabase(
  syncParams, geodatabase
);
await syncJob.start();`,
    desc: "Any edits made offline (adding features, editing attributes) are synced back to the server when connectivity returns.",
    color: "#c77dff",
  },
];

export default function OfflinePanel() {
  const [activeStep, setActiveStep] = useState(1);
  const step = STEPS.find((s) => s.id === activeStep);

  return (
    <div style={styles.panel}>
      <h3 style={styles.heading}>📦 Offline Maps</h3>
      <p style={styles.desc}>
        Offline maps let users work in the field with no internet. The SDK downloads
        a <code>tile package (.tpkx)</code> + feature geodatabase to the device.
        Walk through each step of the offline workflow below.
      </p>

      <div style={styles.steps}>
        {STEPS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStep(s.id)}
            style={{
              ...styles.stepBtn,
              background: activeStep === s.id ? s.color + "22" : "transparent",
              border: `1px solid ${activeStep === s.id ? s.color : "#333"}`,
              color: activeStep === s.id ? s.color : "#666",
            }}
          >
            <span style={styles.stepNum}>{s.id}</span>
            {s.title}
          </button>
        ))}
      </div>

      {step && (
        <div style={styles.detail}>
          <p style={{ ...styles.stepDesc, borderLeft: `3px solid ${step.color}` }}>
            {step.desc}
          </p>
          <div style={styles.codeBlock}>
            <div style={styles.codeHeader}>
              <span style={styles.dot} /><span style={styles.dot} /><span style={styles.dot} />
              <span style={styles.codeLang}>JavaScript (ArcGIS SDK)</span>
            </div>
            <pre style={styles.code}><code>{step.code}</code></pre>
          </div>
        </div>
      )}

      <div style={styles.noteBox}>
        <p style={styles.noteTitle}>💡 Note on web vs native</p>
        <p style={styles.noteText}>
          Full offline map support (tile packages, geodatabase sync) works best with the
          <strong> ArcGIS Maps SDK for Native Apps</strong> (Swift, Kotlin, .NET).
          In the JS SDK, you can use <code>TileLayer</code> with cached tiles for limited offline use.
        </p>
      </div>
    </div>
  );
}

const styles = {
  panel: { padding: 16 },
  heading: { color: "#06d6a0", margin: "0 0 8px", fontSize: 15 },
  desc: { color: "#999", fontSize: 12, lineHeight: 1.6, marginBottom: 14 },
  steps: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 },
  stepBtn: { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, textAlign: "left", transition: "all 0.2s" },
  stepNum: { width: 20, height: 20, borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  detail: { marginBottom: 14 },
  stepDesc: { color: "#ccc", fontSize: 13, lineHeight: 1.6, paddingLeft: 12, marginBottom: 12 },
  codeBlock: { background: "#0d0d1a", borderRadius: 8, overflow: "hidden", border: "1px solid #333" },
  codeHeader: { background: "#161b22", padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #333" },
  dot: { width: 10, height: 10, borderRadius: "50%", background: "#333" },
  codeLang: { color: "#666", fontSize: 11, marginLeft: 6 },
  code: { margin: 0, padding: "14px 16px", fontSize: 11, lineHeight: 1.7, color: "#c9d1d9", overflowX: "auto", whiteSpace: "pre-wrap" },
  noteBox: { background: "#1e1e3a", borderRadius: 8, padding: 14, border: "1px solid #333" },
  noteTitle: { color: "#06d6a0", fontSize: 12, fontWeight: 700, marginBottom: 6 },
  noteText: { color: "#888", fontSize: 12, lineHeight: 1.7 },
};
