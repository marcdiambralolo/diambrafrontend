import { api } from "@/lib/api/client";
import { LearningConfiguration } from "@/lib/interfaces";
import { useQuery } from "@tanstack/react-query";

// hooks/game/useGame.ts
export function useGameConfig() {
  return useQuery<LearningConfiguration>({
    queryKey: ['game', 'config'],
    queryFn: async (): Promise<LearningConfiguration> => {
      const response = await api.get('learning-configurations/current-config');
      return response.data as LearningConfiguration;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}