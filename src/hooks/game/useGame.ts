import { api } from "@/lib/api/client";
import { GameConfiguration } from "@/lib/interfaces";
import { useQuery } from "@tanstack/react-query";
 
export function useGameConfig() {
  return useQuery<GameConfiguration>({
    queryKey: ['game', 'config'],
    queryFn: async (): Promise<GameConfiguration> => {
      const response = await api.get('game-configurations/current-config');
      return response.data as GameConfiguration;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}