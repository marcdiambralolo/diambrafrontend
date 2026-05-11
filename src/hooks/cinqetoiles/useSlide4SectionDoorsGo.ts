"use client";
import { api } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDoorsFormStore } from "./doorsFormStore";

export const STAGES = [
  { key: 'idle', label: 'Préparation', hint: 'Initialisation du traitement' },
  { key: 'done', label: 'Terminé', hint: 'Votre analyse est prête' },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export type ProgressStage = "idle" | "update_user" | "sky_chart" | "finalizing" | "done" | "error";

export type ProgressState = {
  updatedAt: number;
  error: string;
  stage: ProgressStage;
  message: string;
  percent: number;
  startedAt: number;
  lastUpdatedAt: number;
  total: number;
  done: number;
  logs: string[];
};

const makeProgress = (): ProgressState => ({
  stage: "idle",
  message: "Prêt.",
  percent: 0,
  startedAt: Date.now(),
  lastUpdatedAt: Date.now(),
  error: "",
  updatedAt: Date.now(),
  total: 100,
  done: 0,
  logs: [],
});

export function useSlide4SectionDoorsGo() {
  const router = useRouter();
  const doorsForm = useDoorsFormStore((s) => s.form);

  const [progress, setProgress] = useState<ProgressState>(() => makeProgress());
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (!doorsForm) return;
    setProgress((prev) => ({
      ...prev,
      stage: "update_user",
      message: "Traitement en cours...",
      percent: 50,
      logs: [],
      startedAt: Date.now(),
      lastUpdatedAt: Date.now(),
      updatedAt: Date.now(),
    }));
    api.post<{ success: boolean; error?: string }>("/users/me/doors-job", { formData: doorsForm })
      .then((res) => {
        if (res.data.success) {
          setProgress((prev) => ({
            ...prev,
            stage: "done",
            message: "Traitement terminé !",
            percent: 100,
            lastUpdatedAt: Date.now(),
            updatedAt: Date.now(),
          }));
          router.push("/star/profil/done");
        } else {
          setProgress((prev) => ({
            ...prev,
            stage: "error",
            error: res.data.error || "Erreur inconnue",
            message: "Le traitement a échoué.",
            lastUpdatedAt: Date.now(),
            updatedAt: Date.now(),
          }));
        }
      })
      .catch((err) => {
        setProgress((prev) => ({
          ...prev,
          stage: "error",
          error: err?.message || "Erreur inconnue",
          message: "Le traitement a échoué.",
          lastUpdatedAt: Date.now(),
          updatedAt: Date.now(),
        }));
      });
  }, [doorsForm, router]);

  const percent = clamp(Number.isFinite(progress.percent) ? progress.percent : 0, 0, 100);

  const isDone = progress.stage === "done";
  const isError = progress.stage === "error";

  return { progress, percent, isDone, isError, particles };
}