// apps/web/src/lib/api/explanations.ts
import axios from 'axios'
import type { FlagExplanationResponse, ExplainableFlag } from '@/types/explanations'

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  withCredentials: true,
  timeout: 10_000,
})

/** Attach auth token from session storage before every request */
client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('ei_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Fetch all explainable flags for a given exam session.
 * Returns Category-A-safe explanation data — no raw biometric content.
 */
export async function getSessionFlags(sessionId: string): Promise<FlagExplanationResponse> {
  const { data } = await client.get<FlagExplanationResponse>(
    `/api/explanations/session/${sessionId}`
  )
  return data
}

/**
 * Fetch a single flag's full detail by flag ID.
 */
export async function getFlagDetail(flagId: string): Promise<ExplainableFlag> {
  const { data } = await client.get<ExplainableFlag>(
    `/api/explanations/flag/${flagId}`
  )
  return data
}

/**
 * Submit a dispute for a specific flag.
 * Returns the updated flag with reviewStatus set to 'disputed'.
 */
export async function disputeFlag(
  flagId: string,
  reason: string
): Promise<{ disputeId: string; flagId: string; submittedAt: string }> {
  const { data } = await client.post(`/api/explanations/flag/${flagId}/dispute`, { reason })
  return data
}

/**
 * Fetch session flags for multiple sessions — used in the student history view.
 */
export async function getStudentFlagHistory(
  studentDid: string,
  page = 1,
  limit = 10
): Promise<{ items: FlagExplanationResponse[]; total: number; page: number }> {
  const { data } = await client.get(`/api/explanations/student/${encodeURIComponent(studentDid)}`, {
    params: { page, limit },
  })
  return data
}