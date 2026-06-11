import { cn } from '@/lib/utils'
import type { FlagReason } from '@/types/explanations'

/** Lists the contributing reasons for a flag, with observed vs baseline. */
export function FlagReasonList({
  reasons,
  className,
}: {
  reasons: FlagReason[]
  className?: string
}) {
  if (reasons.length === 0) {
    return <p className="text-sm text-zinc-500">No contributing reasons recorded.</p>
  }

  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {reasons.map((reason) => (
        <li
          key={reason.code}
          className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {reason.title}
            </span>
            <span className="text-xs text-zinc-500">
              weight {Math.round(reason.weight * 100)}%
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {reason.description}
          </p>
          <div className="mt-2 flex gap-4 text-xs text-zinc-500">
            <span>
              Observed:{' '}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {reason.observedValue}
              </span>
            </span>
            <span>
              Baseline:{' '}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {reason.baselineValue}
              </span>
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
