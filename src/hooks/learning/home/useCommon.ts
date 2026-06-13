import { useOnlineStatus } from "./useOnlineStatus";

export function useCommon() {
  const onlineStatus = useOnlineStatus();
  return { onlineStatus };
}