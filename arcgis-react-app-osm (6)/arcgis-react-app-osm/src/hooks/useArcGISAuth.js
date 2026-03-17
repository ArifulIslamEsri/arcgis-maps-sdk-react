// src/hooks/useArcGISAuth.js
// API key is OPTIONAL — basemaps work without it (OpenStreetMap).
// OAuth is still available for accessing private ArcGIS data.

import { useState, useEffect } from "react";
import esriConfig from "@arcgis/core/config";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import esriId from "@arcgis/core/identity/IdentityManager";

const PORTAL_URL = "https://www.arcgis.com/sharing";

export function useArcGISAuth() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // API key is optional — only needed for Esri basemaps/geocoding
    // We're using OSM tiles so this can be left blank
    if (process.env.REACT_APP_ARCGIS_API_KEY) {
      esriConfig.apiKey = process.env.REACT_APP_ARCGIS_API_KEY;
    }

    // Register OAuth only if a client ID is provided
    if (process.env.REACT_APP_ARCGIS_CLIENT_ID) {
      const oauthInfo = new OAuthInfo({
        appId: process.env.REACT_APP_ARCGIS_CLIENT_ID,
        popup: false,
      });
      esriId.registerOAuthInfos([oauthInfo]);

      esriId.checkSignInStatus(PORTAL_URL)
        .then((credential) => setUser(credential))
        .catch(() => setUser(null))
        .finally(() => setAuthReady(true));
    } else {
      setAuthReady(true); // no OAuth configured, mark ready immediately
    }
  }, []);

  const signIn = () => {
    esriId.getCredential(PORTAL_URL).then((credential) => setUser(credential));
  };

  const signOut = () => {
    esriId.destroyCredentials();
    setUser(null);
  };

  return { user, authReady, signIn, signOut };
}
