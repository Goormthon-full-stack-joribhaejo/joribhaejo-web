import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/api'
import { User } from '@/lib/types'

export function useCurrentUser() {
  return useQuery<User, Error>({
    queryKey: ['currentUser'],
    queryFn: () => userApi.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}
