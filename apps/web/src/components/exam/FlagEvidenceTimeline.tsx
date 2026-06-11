import { cn } from '@/lib/utils'
import type { FlagEvidencePoint } from '@/types/explanations'

function formatTime(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

/** Vertical timeline of the per-sample evidence behind a flag. */
export function FlagEvidenceTimeline({
  points,
  className,
}: {
  points: FlagEvidencePoint[]
  className?: string
}) {
  if (points.length === 0) {
    return <p className="text-sm text-zinc-500">No evidence samples recorded.</p>
  }

  return (
    <ol className={cn('relative ml-3 border-l border-zinc-200 dark:border-zinc-800', className)}>
      {points.map((point, i) => (
        <li key={`${point.timestamp}-${i}`} className="mb-4 ml-4 last:mb-0">
          <span
            className={cn(
              'absolute -left-1.5 mt-1 h-3 w-3 rounded-full ring-2 ring-white dark:ring-zinc-950',
              point.exceeded ? 'bg-red-500' : 'bg-emerald-500',
            )}
            aria-hidden
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {point.label}
            </span>
            <time className="text-xs tabular-nums text-zinc-500">
              {formatTime(point.timestamp)}
            </time>
          </div>
          <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
            Observed {point.observedValue} vs threshold {point.thresholdValue}
            {point.exceeded ? ' — exceeded' : ' — within limit'}
          </p>
          {point.detail ? (
            <p className="mt-0.5 text-xs text-zinc-500">{point.detail}</p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
