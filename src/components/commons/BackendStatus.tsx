"use client";

import { useEffect, useState } from "react";
import { fetchApiHealth } from "@/lib/api/client";

type State =
  | { kind: "loading" }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

export function BackendStatus() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetchApiHealth()
      .then((data) => {
        if (cancelled) return;
        setState({
          kind: "ok",
          message: data.message ?? data.status ?? "OK",
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          kind: "error",
          message:
            "Impossible de joindre l’API. Vérifiez que le backend tourne et NEXT_PUBLIC_API_URL.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "loading") {
    return (
      <p className="mt-2 text-[11px] text-foreground/35">
        Connexion à l’API…
      </p>
    );
  }

  if (state.kind === "error") {
    return (
      <p className="mt-2 text-[11px] text-red-600/90 dark:text-red-400/90">
        {state.message}
      </p>
    );
  }

  return (
    <p className="mt-2 text-[11px] text-emerald-600/90 dark:text-emerald-400/85">
      API connectée · {state.message}
    </p>
  );
}
