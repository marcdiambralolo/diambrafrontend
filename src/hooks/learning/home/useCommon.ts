import { imagesPub } from "@/lib/learning/data";
import { useEffect, useState } from "react";
import { useOnlineStatus } from "./useOnlineStatus";

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