# ArcGIS Maps SDK for JavaScript — React Sample

A GitHub-ready React application demonstrating the core concepts of the **ArcGIS Maps SDK for JavaScript** — built with Create React App and `@arcgis/core`.

---

## 📁 Project Structure

```
arcgis-react-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AuthBar.jsx        # API Key + OAuth sign-in UI
│   │   ├── LayersPanel.jsx    # FeatureLayer + UniqueValueRenderer
│   │   ├── MapPanel.jsx       # Map, MapView, basemap switcher
│   │   ├── MarkersPanel.jsx   # GraphicsLayer, Graphic, PopupTemplate
│   │   ├── QueryPanel.jsx     # queryFeatures(), SQL where clause
│   │   └── Sidebar.jsx        # Tab navigation
│   ├── hooks/
│   │   ├── useArcGISAuth.js   # API Key + OAuth initialisation
│   │   └── useMapView.js      # MapView lifecycle hook
│   ├── utils/
│   │   └── mapUtils.js        # Reusable layer/marker/renderer helpers
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env.example
├── .gitignore
└── package.json
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/arcgis-maps-sdk-react.git
cd arcgis-maps-sdk-react
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```env
REACT_APP_ARCGIS_API_KEY=YOUR_API_KEY_HERE
REACT_APP_ARCGIS_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

> Get a free API key at [developers.arcgis.com](https://developers.arcgis.com)

### 3. Run the App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗺️ Concepts Covered

### 1. Basic Map + Basemap (`MapPanel.jsx`)
- `Map` — the data model (holds layers + basemap)
- `MapView` — renders the map in a `<div>`, handles pan/zoom/click
- Basemap switcher: streets, satellite, topo, dark gray, oceans
- `Search` widget — address geocoder added to the map UI

### 2. Markers & Popups (`MarkersPanel.jsx`)
- `GraphicsLayer` — client-side layer for temporary graphics
- `Graphic` — combines geometry + symbol + attributes
- `SimpleMarkerSymbol` — styled point marker
- `PopupTemplate` — defines what shows when a marker is clicked

### 3. Layers & Renderers (`LayersPanel.jsx`)
- `FeatureLayer` — loads vector data from a hosted ArcGIS feature service
- `UniqueValueRenderer` — assigns a different symbol per category value
- `SimpleFillSymbol` / `SimpleLineSymbol` — polygon + outline styling
- Layer visibility toggle and removal

### 4. Querying Features (`QueryPanel.jsx`)
- SQL `where` clause — filter features server-side (e.g. `POPULATION >= 5000000`)
- `queryFeatures()` — async call returning a `FeatureSet`
- `returnGeometry: true` — include geometry to highlight and zoom
- `view.goTo()` — animate map to query results
- Highlight layer with `GraphicsLayer` + yellow `SimpleFillSymbol`

### 5. Authentication (`useArcGISAuth.js`, `AuthBar.jsx`)
- **API Key** — `esriConfig.apiKey` for public basemaps and services
- **OAuth 2.0** — `OAuthInfo` + `IdentityManager` for user-login flow
- `checkSignInStatus()` — restore session on page reload
- `destroyCredentials()` — sign out and clear session

---

## 🔑 Auth Setup

### API Key (Simple — public apps)
1. Go to [developers.arcgis.com](https://developers.arcgis.com) → Dashboard → API Keys
2. Create a new key with **Basemaps** and **Geocoding** scopes
3. Paste it into `.env` as `REACT_APP_ARCGIS_API_KEY`

### OAuth 2.0 (User login — private data)
1. Go to [developers.arcgis.com](https://developers.arcgis.com) → Dashboard → OAuth 2.0
2. Create an application
3. Add `http://localhost:3000` to the **Redirect URIs**
4. Copy the **Client ID** into `.env` as `REACT_APP_ARCGIS_CLIENT_ID`

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `@arcgis/core` | ArcGIS Maps SDK for JavaScript (ESM) |
| `react` / `react-dom` | UI framework |
| `react-scripts` | Build tooling (Create React App) |

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run development server at localhost:3000 |
| `npm run build` | Create production build in `/build` |

---

## 📚 Resources

- [ArcGIS Maps SDK JS Docs](https://developers.arcgis.com/javascript/latest/)
- [API Reference](https://developers.arcgis.com/javascript/latest/api-reference/)
- [Esri Samples Gallery](https://developers.arcgis.com/javascript/latest/sample-code/)
- [ArcGIS Developers](https://developers.arcgis.com)
