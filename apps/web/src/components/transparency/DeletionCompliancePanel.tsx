import { Trash2 } from 'lucide-react'
import type { DeletionCompliance } from '@/types/transparency'

export function DeletionCompliancePanel({ data }: { data: DeletionCompliance }) {
  const onTime = data.evidenceDeletedOnTime
  const due = data.evidenceDueForDeletion
  const overdue = Math.max(0, due - onTime)

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-zinc-400" aria-hidden />
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Evidence deletion compliance
        </h3>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {data.compliancePct}%
        </span>
        <span className="text-xs text-zinc-500">
          deleted on time ({data.retentionDays}-day retention)
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${Math.min(100, data.compliancePct)}%` }}
        />
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div>
          <dt className="text-zinc-400">Due</dt>
          <dd className="font-medium text-zinc-700 dark:text-zinc-300">{due.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-zinc-400">Overdue</dt>
          <dd className="font-medium text-zinc-700 dark:text-zinc-300">{overdue}</dd>
        </div>
        <div>
          <dt className="text-zinc-400">Oldest undeleted</dt>
          <dd className="font-medium text-zinc-700 dark:text-zinc-300">
            {data.oldestUndeletedDays}d
          </dd>
        </div>
      </dl>
    </div>
  )
}
