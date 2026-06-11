'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMetricTimeseries, useTransparencyMetrics } from '@/lib/api/transparency'
import { PublicMetricCard } from './PublicMetricCard'
import { FlagRateByCategoryChart } from './FlagRateByCategoryChart'
import { DisputeOutcomesChart } from './DisputeOutcomesChart'
import { DeletionCompliancePanel } from './DeletionCompliancePanel'
import { ModelDriftPanel } from './ModelDriftPanel'
import { TransparencyLogHealthPanel } from './TransparencyLogHealthPanel'

function TrendChart() {
  const { data } = useMetricTimeseries()
  const examsSeries = data?.find((s) => s.key === 'exams_protected')

  if (!examsSeries) return null

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {examsSeries.label} over time
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={examsSeries.points} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function PublicMetricsDashboard() {
  const { data: metrics, isLoading, isError } = useTransparencyMetrics()

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading transparency metrics…</p>
  }

  if (isError || !metrics) {
    return (
      <p className="text-sm text-red-600">
        Could not reach the API. Start the API service on port 3001.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.headlineMetrics.map((metric) => (
          <PublicMetricCard key={metric.key} metric={metric} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FlagRateByCategoryChart data={metrics.flagRateByCategory} />
        <DisputeOutcomesChart data={metrics.disputes} />
      </section>

      <section>
        <TrendChart />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DeletionCompliancePanel data={metrics.deletionCompliance} />
        <ModelDriftPanel data={metrics.modelDrift} />
        <TransparencyLogHealthPanel data={metrics.logHealth} />
      </section>

      <p className="text-xs text-zinc-400">
        Period {new Date(metrics.periodStart).toLocaleDateString()} –{' '}
        {new Date(metrics.periodEnd).toLocaleDateString()} · generated{' '}
        {new Date(metrics.generatedAt).toLocaleString()} · all figures are
        aggregated and anonymized (k-anonymity ≥ 5).
      </p>
    </div>
  )
}
