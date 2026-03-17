// src/components/ScenePanel.jsx
// Demonstrates: SceneView, WebScene, 3D basemap, camera positioning

import React, { useEffect, useRef, useState } from "react";
import SceneView from "@arcgis/core/views/SceneView";
import Map from "@arcgis/core/Map";

const CITIES = [
  { label: "New York",   position: { longitude: -74.0, latitude: 40.7,  z: 2000  }, tilt: 70 },
  { label: "Grand Canyon", position: { longitude: -112.1, latitude: 36.1, z: 5000 }, tilt: 60 },
  { label: "Tokyo",      position: { longitude: 139.7, latitude: 35.7,  z: 3000  }, tilt: 65 },
  { label: "Dubai",      position: { longitude: 55.3,  latitude: 25.2,  z: 2500  }, tilt: 68 },
];

export default function ScenePanel() {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [activeCity, setActiveCity] = useState(null);

  useEffect(() => {
    if (!containerRef.current || viewRef.current) return;

    // SceneView renders in 3D using WebGL
    // Uses "satellite" imagery basemap for realistic terrain
    const map = new Map({ basemap: "satellite", ground: "world-elevation" });

    const view = new SceneView({
      container: containerRef.current,
      map,
      camera: {
        position: { longitude: -100, latitude: 40, z: 8000000 },
        tilt: 20,
      },
      environment: {
        atmosphere: { quality: "high" },
        lighting: { date: new Date(), directShadowsEnabled: true },
      },
    });
    viewRef.current = view;
    view.when(() => setReady(true));

    return () => { view.destroy(); viewRef.current = null; };
  }, []);

  const flyTo = (city) => {
    setActiveCity(city.label);
    viewRef.current?.goTo({
      position: { ...city.position, spatialReference: { wkid: 4326 } },
      tilt: city.tilt,
    }, { duration: 2000, easing: "in-out-expo" });
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.toolbar}>
        <span style={styles.label}>Fly to:</span>
        {CITIES.map((c) => (
          <button
            key={c.label}
            onClick={() => flyTo(c)}
            style={{
              ...styles.btn,
              background: activeCity === c.label ? "#7f77dd" : "#2a2a4a",
              color: activeCity === c.label ? "#fff" : "#aaa",
            }}
          >
            {c.label}
          </button>
        ))}
        {ready && <span style={styles.badge}>🌐 3D SceneView active</span>}
      </div>
      <div ref={containerRef} style={styles.scene} />
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", height: "100%" },
  toolbar: { display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "#111", borderBottom: "1px solid #333", flexWrap: "wrap" },
  label: { color: "#888", fontSize: 12 },
  btn: { padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, transition: "all 0.2s" },
  badge: { marginLeft: "auto", color: "#a8dadc", fontSize: 11 },
  scene: { flex: 1 },
};
