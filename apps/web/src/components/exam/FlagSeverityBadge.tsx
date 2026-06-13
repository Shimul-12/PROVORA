import type { FlagSeverity } from '@/types/explanations'

interface FlagSeverityBadgeProps {
  severity: FlagSeverity
  showDot?: boolean
  size?: 'sm' | 'md'
}

const CONFIG: Record<FlagSeverity, { label: string; cls: string; dot: string }> = {
  low:      { label: 'Low',      cls: 'badge badge-low',      dot: 'bg-sage' },
  medium:   { label: 'Medium',   cls: 'badge badge-medium',   dot: 'bg-amber' },
  high:     { label: 'High',     cls: 'badge badge-high',     dot: 'bg-terracotta' },
  critical: { label: 'Critical', cls: 'badge badge-critical', dot: 'bg-[#e05050]' },
}

export function FlagSeverityBadge({
  severity,
  showDot = true,
  size = 'md',
}: FlagSeverityBadgeProps) {
  const cfg = CONFIG[severity]
  return (
    <span
      className={cfg.cls}
      style={size === 'sm' ? { fontSize: '10px', padding: '2px 8px' } : undefined}
    >
      {showDot && (
        <span
          className={`inline-block rounded-full ${cfg.dot}`}
          style={{ width: 5, height: 5 }}
        />
      )}
      {cfg.label}
    </span>
  )
}