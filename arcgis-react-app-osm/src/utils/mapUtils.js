// src/utils/mapUtils.js
// ─────────────────────────────────────────────────────────────
// Reusable helpers used across map components.
// Each function is documented to explain the SDK concept it
// demonstrates.
// ─────────────────────────────────────────────────────────────

import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";

// ── Markers & Popups ─────────────────────────────────────────
// A Graphic combines geometry + symbol + attributes.
// A PopupTemplate defines what shows when the user clicks it.

export function createMarker({ longitude, latitude, title, description, color = [226, 119, 40] }) {
  const point = new Point({ longitude, latitude });

  const symbol = new SimpleMarkerSymbol({
    color,
    outline: { color: [255, 255, 255], width: 2 },
    size: 12,
  });

  return new Graphic({
    geometry: point,
    symbol,
    attributes: { title, description },
    popupTemplate: {
      title: "{title}",
      content: "{description}",
    },
  });
}

// ── GraphicsLayer ────────────────────────────────────────────
// Client-side layer for temporary/drawn graphics.
// Fast, but data lives only in the browser (not a service).

export function createGraphicsLayer(title = "Markers") {
  return new GraphicsLayer({ title });
}

// ── FeatureLayer ─────────────────────────────────────────────
// Connects to a hosted ArcGIS feature service.
// Supports server-side querying, popups, and renderers.
// Uses the US States public demo service here.

export function createStatesFeatureLayer() {
  return new FeatureLayer({
    url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0",
    title: "US States",
    outFields: ["STATE_NAME", "POPULATION", "SUB_REGION"],
    popupTemplate: {
      title: "{STATE_NAME}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "POPULATION",
              label: "Population",
              format: { digitSeparator: true },
            },
            { fieldName: "SUB_REGION", label: "Region" },
          ],
        },
      ],
    },
    // ── UniqueValueRenderer ───────────────────────────────────
    // Assign a different color to each US region.
    renderer: new UniqueValueRenderer({
      field: "SUB_REGION",
      defaultSymbol: new SimpleFillSymbol({
        color: [200, 200, 200, 0.4],
        outline: new SimpleLineSymbol({ color: [255, 255, 255], width: 1 }),
      }),
      uniqueValueInfos: [
        { value: "Pacific", symbol: fillSymbol([0, 180, 216, 0.5]) },
        { value: "Mountain", symbol: fillSymbol([168, 218, 220, 0.5]) },
        { value: "West North Central", symbol: fillSymbol([144, 190, 109, 0.5]) },
        { value: "East North Central", symbol: fillSymbol([67, 170, 139, 0.5]) },
        { value: "New England", symbol: fillSymbol([87, 117, 144, 0.5]) },
        { value: "Middle Atlantic", symbol: fillSymbol([39, 125, 161, 0.5]) },
        { value: "South Atlantic", symbol: fillSymbol([249, 132, 74, 0.5]) },
        { value: "East South Central", symbol: fillSymbol([248, 150, 30, 0.5]) },
        { value: "West South Central", symbol: fillSymbol([243, 114, 44, 0.5]) },
      ],
    }),
  });
}

function fillSymbol([r, g, b, a]) {
  return new SimpleFillSymbol({
    color: [r, g, b, a],
    outline: new SimpleLineSymbol({ color: [255, 255, 255], width: 0.8 }),
  });
}

// ── Feature Query ────────────────────────────────────────────
// Queries a FeatureLayer for features matching a where clause.
// Returns an array of { name, population, region } objects.

export async function queryStates(featureLayer, whereClause) {
  const query = {
    where: whereClause,
    outFields: ["STATE_NAME", "POPULATION", "SUB_REGION"],
    returnGeometry: true,
  };

  const result = await featureLayer.queryFeatures(query);
  return result.features.map((f) => ({
    name: f.attributes.STATE_NAME,
    population: f.attributes.POPULATION,
    region: f.attributes.SUB_REGION,
    geometry: f.geometry,
  }));
}
