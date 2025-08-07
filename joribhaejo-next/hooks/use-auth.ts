import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/lib/api'
import { User } from '@/lib/types'

export function useCurrentUser() {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  return useQuery<User, Error>({
    queryKey: ['currentUser'],
    queryFn: () => userApi.getCurrentUser(),
    staleTime: 0, // 5분
    gcTime: 0, // 10분
    enabled: !!accessToken, // accessToken이 있을 때만 쿼리 실행
  })
}

export function useLikedPostIds() {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  return useQuery<number[], Error>({
    queryKey: ['likedPostIds'],
    queryFn: () => userApi.getLikedPostIds(),
    staleTime: 0, // 5분
    gcTime: 0, // 10분
    enabled: !!accessToken, // accessToken이 있을 때만 쿼리 실행
  })
}
