import { messagingBackendService } from '@/lib/api/services/messaging-backend.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useConversations(userId: string) {
  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => messagingBackendService.getConversations(userId),
  });
}


export function useMessages(conversationId: string, { limit = 30, skip = 0 } = {}) {
  return useQuery({
    queryKey: ['messages', conversationId, limit, skip],
    queryFn: () => messagingBackendService.getMessages(conversationId, { limit, skip }),
  });
}

export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, userId }: { conversationId: string; userId: string }) =>
      messagingBackendService.markAsRead(conversationId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { conversationId: string; from: string; to: string; text: string }) =>
      messagingBackendService.sendMessage(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', variables.from] });
      queryClient.invalidateQueries({ queryKey: ['conversations', variables.to] });
    },
  });
}
