import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { messageApi, ApiError } from '@/lib/api';
import { Message } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export const useInboxMessages = (options?: UseQueryOptions<Message[], Error>) => {
  return useQuery<Message[], Error>({
    queryKey: ['inboxMessages'],
    queryFn: async () => {
      const response = await messageApi.getInboxMessages();
      return response || [];
    },
    ...options,
  });
};

export const useSentMessages = (options?: UseQueryOptions<Message[], Error>) => {
  return useQuery<Message[], Error>({
    queryKey: ['sentMessages'],
    queryFn: async () => {
      const response = await messageApi.getSentMessages();
      return response || [];
    },
    ...options,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<Message, Error, { recipientUsername: string; content: string }>({
    mutationFn: ({ recipientUsername, content }) =>
      messageApi.sendMessage(recipientUsername, content).then(res => res),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inboxMessages'] });
      queryClient.invalidateQueries({ queryKey: ['sentMessages'] });
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 404) {
        toast({
          title: "메시지 전송 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "메시지 전송 실패",
          description: "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (messageId) => messageApi.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inboxMessages'] });
      queryClient.invalidateQueries({ queryKey: ['sentMessages'] });
    },
  });
};