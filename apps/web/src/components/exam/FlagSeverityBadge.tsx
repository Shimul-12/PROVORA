import { cn } from '@/lib/utils'
import type { FlagSeverity } from '@/types/explanations'

const SEVERITY_STYLES: Record<FlagSeverity, string> = {
  LOW: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  MEDIUM: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  HIGH: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  CRITICAL: 'bg-red-50 text-red-700 ring-red-600/20',
}

export function FlagSeverityBadge({
  severity,
  className,
}: {
  severity: FlagSeverity
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        SEVERITY_STYLES[severity],
        className,
      )}
    >
      {severity}
    </span>
  )
}
