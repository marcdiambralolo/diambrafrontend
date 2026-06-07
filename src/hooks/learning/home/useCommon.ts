import { imagesPub } from "@/lib/learning/data";
import { useOnlineStatus } from "./useOnlineStatus";
import { useEffect, useState } from "react";

export function useCommon() {
  const onlineStatus = useOnlineStatus();
  const [randomImage, setRandomImage] = useState<string>("/splashone.jpg");

  useEffect(() => {
    if (imagesPub.length > 0) {
      setRandomImage(imagesPub[Math.floor(Math.random() * imagesPub.length)]);
    }
  }, []);

  return { randomImage, onlineStatus };
}