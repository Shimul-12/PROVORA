import { useQuery } from '@tanstack/react-query'
import { apiClient } from './client'
import type { AccommodationType, SessionFlagExplanations } from '@/types/explanations'

/** Fetch explainable flag cards for a session. */
export async function fetchSessionExplanations(
  sessionId: string,
  accommodation?: AccommodationType,
): Promise<SessionFlagExplanations> {
  const { data } = await apiClient.get<SessionFlagExplanations>(
    `/api/sessions/${encodeURIComponent(sessionId)}/explanations`,
    { params: accommodation ? { accommodation } : undefined },
  )
  return data
}

/** React Query hook for a session's explanations. */
export function useSessionExplanations(
  sessionId: string,
  accommodation?: AccommodationType,
) {
  return useQuery({
    queryKey: ['explanations', sessionId, accommodation ?? 'DEFAULT'],
    queryFn: () => fetchSessionExplanations(sessionId, accommodation),
    enabled: Boolean(sessionId),
  })
}
