import { Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DriftStatus, ModelDriftStatus } from '@/types/transparency'

const STATUS_STYLES: Record<DriftStatus, string> = {
  STABLE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  WATCH: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  DRIFTING: 'bg-red-50 text-red-700 ring-red-600/20',
}

export function ModelDriftPanel({ data }: { data: ModelDriftStatus }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-zinc-400" aria-hidden />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Model drift
          </h3>
        </div>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
            STATUS_STYLES[data.status],
          )}
        >
          {data.status}
        </span>
      </div>

      <p className="text-xs text-zinc-500">
        {data.modelVersion} · PSI {data.psi} · evaluated{' '}
        {new Date(data.lastEvaluatedAt).toLocaleDateString()}
      </p>

      <ul className="mt-3 flex flex-col gap-2">
        {data.featureDrift.map((f) => (
          <li key={f.feature} className="text-xs">
            <div className="mb-1 flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">{f.feature}</span>
              <span className="tabular-nums text-zinc-500">{f.drift.toFixed(2)}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={cn(
                  'h-full rounded-full',
                  f.drift < 0.1 ? 'bg-emerald-500' : f.drift < 0.2 ? 'bg-amber-500' : 'bg-red-500',
                )}
                style={{ width: `${Math.min(100, f.drift * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
