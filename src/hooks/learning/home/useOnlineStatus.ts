import { useEffect, useState, useMemo } from "react";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const onlineStatus = useMemo(() => ({
    text: isOnline ? "🛠️ En Ligne" : "❌ Hors Ligne",
    color: isOnline ? "orange" : "red"
  }), [isOnline]);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return onlineStatus;
}