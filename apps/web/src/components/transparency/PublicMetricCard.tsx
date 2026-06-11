import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PublicMetric } from '@/types/transparency'

function formatValue(metric: PublicMetric): string {
  const v =
    metric.value >= 1000 ? metric.value.toLocaleString() : String(metric.value)
  return metric.unit ? `${v}${metric.unit}` : v
}

export function PublicMetricCard({ metric }: { metric: PublicMetric }) {
  const TrendIcon =
    metric.trend === 'UP'
      ? ArrowUpRight
      : metric.trend === 'DOWN'
        ? ArrowDownRight
        : ArrowRight

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        {metric.label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
          {formatValue(metric)}
        </span>
        {typeof metric.changePct === 'number' ? (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              metric.trend === 'UP'
                ? 'text-emerald-600'
                : metric.trend === 'DOWN'
                  ? 'text-red-600'
                  : 'text-zinc-500',
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" aria-hidden />
            {Math.abs(metric.changePct)}%
          </span>
        ) : null}
      </div>
      {metric.description ? (
        <p className="mt-1 text-xs text-zinc-500">{metric.description}</p>
      ) : null}
    </div>
  )
}
