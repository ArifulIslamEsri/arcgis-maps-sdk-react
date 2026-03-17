// src/hooks/useMapView.js
// ─────────────────────────────────────────────────────────────
// Custom hook that initialises a MapView bound to a DOM element.
// Returns the view instance so other components can add layers
// and widgets to it.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

export function useMapView({ basemap = "streets-vector", center = [-118.24, 34.05], zoom = 10 } = {}) {
  const containerRef = useRef(null); // attach to a <div ref={containerRef} />
  const viewRef = useRef(null);      // hold the live MapView instance
  const [viewReady, setViewReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // ── Map: the data model ───────────────────────────────────
    // Holds the basemap and all layers. Invisible on its own.
    const map = new Map({ basemap });

    // ── MapView: the visual renderer ─────────────────────────
    // Binds the Map to a DOM element. Handles pan/zoom/click.
    const view = new MapView({
      container: containerRef.current,
      map,
      center, // [longitude, latitude]
      zoom,
    });

    viewRef.current = view;

    view.when(() => setViewReady(true));

    // Cleanup: destroy view when component unmounts
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
        setViewReady(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { containerRef, view: viewRef.current, viewReady };
}
