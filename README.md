# 🗺️ ArcGIS Maps SDK for JavaScript — React Sample

A fully interactive learning app built with **React** that covers all major concepts of the **ArcGIS Maps SDK for JavaScript** across 3 phases — from basic map rendering to 3D digital twins and immersive XR experiences.

> **No API key required to run.** Uses free CARTO tiles for basemaps. Add an optional ArcGIS API key to unlock satellite imagery and 3D terrain.

---

## 🚀 Live Demo

Deployed on GitHub Codespaces — open in your browser, no software installation needed.

---

## 📸 What It Looks Like

3-column layout:
- **Left** — navigation sidebar with all 12 topics
- **Middle** — interactive demo panel (resizable, collapsible)
- **Right** — live map or 3D scene

---

## 🧠 What You'll Learn

### Phase 1 — JS SDK Fundamentals
| Topic | Concepts Covered |
|---|---|
| 📍 Markers & Popups | `Graphic`, `GraphicsLayer`, `SimpleMarkerSymbol`, `PopupTemplate` |
| 📦 Layers & Renderers | `FeatureLayer`, `UniqueValueRenderer`, `ClassBreaksRenderer`, layer ordering |
| 🔍 Query Features | `queryFeatures()`, SQL `where` clause, `FeatureSet`, spatial queries, `view.goTo()` |

### Phase 2 — Advanced Concepts
| Topic | Concepts Covered |
|---|---|
| 🌐 SceneView 3D | `SceneView`, camera, tilt, altitude, `view.goTo()`, atmosphere, lighting |
| 🗂️ Vector Tiles | `VectorTileLayer`, `urlTemplate`, `subDomains`, opacity, WebGL rendering |
| 🧩 Widgets | `Sketch`, `Legend`, `LayerList`, `ScaleBar`, `view.ui.add()`, widget lifecycle |
| 📶 Offline Maps | `OfflineMapTask`, tile packages `.tpkx`, `MobileMapPackage`, `GeodatabaseSyncTask` |
| 📡 REST API | Direct `fetch()` calls, `where` clause, `f=json` vs `f=geojson`, token auth |

### Phase 3 — 3D & Immersive
| Topic | Concepts Covered |
|---|---|
| 🏔️ Globe & Terrain | `ElevationLayer`, `map.ground`, atmosphere, Z altitude, camera tilt |
| 🏙️ Digital Twins | `SceneLayer`, `BuildingSceneLayer`, `StreamLayer`, `Slice` widget, feature filters |
| 🥽 Immersive / XR | Fly-through animation, ArcGIS Maps SDK for Unity, ArcGIS Indoors, WebXR |

### 📚 SDK Reference
Full interactive reference panel — all 12 topics with syntax-highlighted code examples, key concepts, and beginner tips. No switching tabs needed.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| `@arcgis/core` 4.29 | ArcGIS Maps SDK for JavaScript (ESM) |
| CARTO tile services | Free basemaps (no API key needed) |
| GitHub Codespaces | Zero-install cloud development environment |
| Create React App | Build tooling |

---

## ⚡ Quick Start

### Option A — GitHub Codespaces (recommended, no installs)

1. Click the green **`<> Code`** button on this repo
2. Click **Codespaces** → **Create codespace on main**
3. Wait ~60 seconds for the environment to load
4. In the terminal:
```bash
cd arcgis-react-app
npm install
npm start
```
5. Click **Open in Browser** when prompted

### Option B — Run locally

```bash
# Prerequisites: Node.js 18+
git clone https://github.com/YOUR_USERNAME/arcgis-maps-sdk-react.git
cd arcgis-maps-sdk-react/arcgis-react-app
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Optional: Add an ArcGIS API Key

The app works fully without an API key. Adding one unlocks:
- ✅ Satellite imagery basemap
- ✅ Real 3D terrain (mountains, canyons, elevation)
- ✅ Full SceneView zoom into street level
- ✅ Esri geocoding / Search widget

**Get a free key at [developers.arcgis.com](https://developers.arcgis.com) (2 minutes)**

```bash
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_ARCGIS_API_KEY=YOUR_KEY_HERE
```

Restart `npm start` — satellite imagery and terrain load automatically.

---

## 📁 Project Structure

```
arcgis-react-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AuthBar.jsx            ← API Key + OAuth UI
│   │   ├── DigitalTwinPanel.jsx   ← Phase 3: Digital Twins concepts + code
│   │   ├── GlobeTerrainPanel.jsx  ← Phase 3: Globe & Terrain + live SceneView
│   │   ├── ImmersivePanel.jsx     ← Phase 3: XR / Unity / fly-through
│   │   ├── LayersInfoPanel.jsx    ← Phase 1: Layers & Renderers concepts + code
│   │   ├── LayersPanel.jsx        ← Interactive layers demo on the map
│   │   ├── MapPanel.jsx           ← 2D MapView + CARTO basemap switcher
│   │   ├── MarkersPanel.jsx       ← Interactive markers demo on the map
│   │   ├── OfflinePanel.jsx       ← Phase 2: Offline Maps workflow
│   │   ├── QueryInfoPanel.jsx     ← Phase 1: Query concepts + code
│   │   ├── QueryPanel.jsx         ← Interactive query demo on the map
│   │   ├── RestApiPanel.jsx       ← Phase 2: Live REST API requests
│   │   ├── SceneInfoPanel.jsx     ← Phase 2: SceneView concepts + code
│   │   ├── ScenePanel.jsx         ← Live 3D SceneView with fly-to
│   │   ├── SdkReference.jsx       ← Full SDK reference with syntax highlighting
│   │   ├── Sidebar.jsx            ← Navigation tab list
│   │   ├── VectorTilePanel.jsx    ← Interactive vector tile demo
│   │   └── WidgetsPanel.jsx       ← Interactive widgets demo
│   ├── hooks/
│   │   ├── useArcGISAuth.js       ← API Key + OAuth initialisation
│   │   └── useMapView.js          ← MapView lifecycle hook
│   ├── utils/
│   │   └── mapUtils.js            ← Shared marker/layer/renderer helpers
│   ├── App.jsx                    ← Root layout: sidebar + middle panel + map
│   ├── index.js
│   └── index.css
├── .env.example
├── .gitignore
└── package.json
```

---

## 🗺️ App Layout

```
┌──────────────┬──────────────────────────┬─────────────────────────┐
│              │                          │                         │
│  Navigation  │   Middle Panel           │   Map / 3D Scene        │
│  Sidebar     │   (resizable)            │                         │
│              │   • Concepts             │   Live ArcGIS MapView   │
│  12 topics   │   • Code examples        │   or SceneView          │
│              │   • Interactive demos    │                         │
│              │                          │                         │
└──────────────┴──────────────────────────┴─────────────────────────┘
```

- **Drag** the divider between middle panel and map to resize
- **✕** collapses the middle panel for a full-width map
- **▶** reopens it

---

## 🌍 Basemaps (No API Key)

All basemaps use free **CARTO** tile services:

| Name | Style |
|---|---|
| Streets | Voyager — detailed road map |
| Light | Minimal light background |
| Dark | Dark background |
| Minimal | No labels, clean base |

---

## 🔐 Authentication

Two auth methods are supported:

**API Key** — for public apps accessing Esri basemaps and location services:
```js
esriConfig.apiKey = "YOUR_API_KEY";
```

**OAuth 2.0** — for user login to access private ArcGIS Online data:
```js
const oauthInfo = new OAuthInfo({ appId: "YOUR_CLIENT_ID", popup: false });
esriId.registerOAuthInfos([oauthInfo]);
```

---

## 📚 Resources

- [ArcGIS Maps SDK JS Docs](https://developers.arcgis.com/javascript/latest/)
- [API Reference](https://developers.arcgis.com/javascript/latest/api-reference/)
- [Esri Samples Gallery](https://developers.arcgis.com/javascript/latest/sample-code/)
- [ArcGIS Developers](https://developers.arcgis.com)
- [ArcGIS Maps SDK for Unity](https://developers.arcgis.com/unity/)
- [ArcGIS Maps SDK for Unreal Engine](https://developers.arcgis.com/unreal-engine/)

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Built as a learning portfolio project covering ArcGIS Maps SDK concepts from beginner to advanced.*
