import { useQuery } from '@tanstack/react-query';
import { boardApi } from '@/lib/api';
import { Board } from '@/lib/types';

export function useBoards() {
  return useQuery<Board[], Error>({
    queryKey: ['boards'],
    queryFn: boardApi.getBoards,
  });
}
