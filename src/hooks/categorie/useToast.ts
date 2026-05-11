import { useCallback } from "react";

export function useToast() {
  return useCallback((msg: string) => {
    if (typeof window !== "undefined") {
      const toast = document.createElement("div");
      toast.textContent = msg;
      toast.style.position = "fixed";
      toast.style.bottom = "32px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.background = "linear-gradient(90deg,#1e193a,#a21caf)";
      toast.style.color = "#fff";
      toast.style.padding = "14px 28px";
      toast.style.borderRadius = "1.5em";
      toast.style.fontWeight = "bold";
      toast.style.fontSize = "1rem";
      toast.style.boxShadow = "0 4px 24px 0 rgba(80,0,120,0.18)";
      toast.style.zIndex = "9999";
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      document.body.appendChild(toast);
      setTimeout(() => { toast.style.opacity = "1"; }, 10);
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => { document.body.removeChild(toast); }, 350);
      }, 2600);
    }
  }, []);
}