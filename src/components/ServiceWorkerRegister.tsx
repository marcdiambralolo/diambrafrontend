"use client";

import { useEffect } from "react";

/**
 * Enregistre le SW en production uniquement (évite les effets de cache en dev).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch(() => {
        /* ignore */
      });
  }, []);

  return null;
}
