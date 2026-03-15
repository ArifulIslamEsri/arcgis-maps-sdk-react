// src/hooks/useArcGISAuth.js
// ─────────────────────────────────────────────────────────────
// Handles two auth strategies for ArcGIS:
//   1. API Key  — simple token for public basemaps/services
//   2. OAuth 2.0 — user login for private data access
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import esriConfig from "@arcgis/core/config";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import esriId from "@arcgis/core/identity/IdentityManager";

const PORTAL_URL = "https://www.arcgis.com/sharing";

export function useArcGISAuth() {
  const [user, setUser] = useState(null);       // signed-in ArcGIS user object
  const [authReady, setAuthReady] = useState(false); // true once auth is initialised

  useEffect(() => {
    // ── Step 1: Set the API Key globally ──────────────────────
    // This is all you need for public basemaps and Esri location
    // services. Store the key in .env as REACT_APP_ARCGIS_API_KEY.
    esriConfig.apiKey = process.env.REACT_APP_ARCGIS_API_KEY || "";

    // ── Step 2: Register OAuth info (for user-login flow) ─────
    // Required only when accessing private hosted data or
    // performing operations on behalf of an ArcGIS user account.
    const oauthInfo = new OAuthInfo({
      appId: process.env.REACT_APP_ARCGIS_CLIENT_ID || "YOUR_CLIENT_ID",
      popup: false, // redirect-based login (simpler for SPAs)
    });
    esriId.registerOAuthInfos([oauthInfo]);

    // ── Step 3: Check for an existing session ─────────────────
    esriId
      .checkSignInStatus(PORTAL_URL)
      .then((credential) => {
        setUser(credential);
      })
      .catch(() => {
        // No active session — user is anonymous (API Key still works)
        setUser(null);
      })
      .finally(() => {
        setAuthReady(true);
      });
  }, []);

  // Trigger OAuth login redirect
  const signIn = () => {
    esriId.getCredential(PORTAL_URL).then((credential) => {
      setUser(credential);
    });
  };

  // Destroy the session and reset state
  const signOut = () => {
    esriId.destroyCredentials();
    setUser(null);
  };

  return { user, authReady, signIn, signOut };
}
