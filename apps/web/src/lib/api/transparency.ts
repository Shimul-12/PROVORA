import { useQuery } from '@tanstack/react-query'
import { apiClient } from './client'
import type {
  MetricTimeseries,
  TransparencyLogHealth,
  TransparencyMetrics,
} from '@/types/transparency'

export async function fetchTransparencyMetrics(): Promise<TransparencyMetrics> {
  const { data } = await apiClient.get<TransparencyMetrics>('/api/transparency/metrics')
  return data
}

export async function fetchMetricTimeseries(): Promise<MetricTimeseries[]> {
  const { data } = await apiClient.get<MetricTimeseries[]>('/api/transparency/timeseries')
  return data
}

export async function fetchLogHealth(): Promise<TransparencyLogHealth> {
  const { data } = await apiClient.get<TransparencyLogHealth>('/api/transparency/log-health')
  return data
}

export function useTransparencyMetrics() {
  return useQuery({
    queryKey: ['transparency', 'metrics'],
    queryFn: fetchTransparencyMetrics,
  })
}

export function useMetricTimeseries() {
  return useQuery({
    queryKey: ['transparency', 'timeseries'],
    queryFn: fetchMetricTimeseries,
  })
}
