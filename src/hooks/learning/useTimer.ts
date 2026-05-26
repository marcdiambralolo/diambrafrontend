import { useEffect, useState } from "react";

const useTimer = (start: boolean) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!start) {
      setTimeElapsed(0);
      return;
    }

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [start]);

  return timeElapsed;
};

export default useTimer;