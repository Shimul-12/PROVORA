// apps/web/src/components/transparency/DeletionCompliancePanel.tsx
import type { DeletionComplianceRecord } from '@/types/transparency'

interface DeletionCompliancePanelProps {
  records: DeletionComplianceRecord[]
  overallRate: number
}

function ComplianceBar({ rate }: { rate: number }) {
  const color =
    rate >= 99.5 ? 'var(--color-sage)'
    : rate >= 98  ? 'var(--color-amber)'
    : 'var(--color-terracotta)'

  return (
    <div
      className="relative w-full rounded-full overflow-hidden"
      style={{ height: 4, background: 'var(--color-cedar)' }}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{ width: `${rate}%`, background: color }}
      />
    </div>
  )
}

export function DeletionCompliancePanel({ records, overallRate }: DeletionCompliancePanelProps) {
  const overallColor =
    overallRate >= 99.5 ? 'var(--color-sage)'
    : overallRate >= 98  ? 'var(--color-amber)'
    : 'var(--color-terracotta)'

  return (
    <div className="space-y-4">
      {/* Overall rate */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="label mb-0.5">Overall compliance</p>
          <p className="text-xs" style={{ color: 'var(--color-taupe)', fontSize: 11 }}>
            Evidence auto-deleted within 90 days of session end
          </p>
        </div>
        <span
          className="font-display font-bold leading-none"
          style={{ color: overallColor, fontSize: 28, fontFamily: 'var(--font-display)' }}
        >
          {overallRate.toFixed(1)}%
        </span>
      </div>

      {/* Per-period table */}
      <div
        className="rounded-card overflow-hidden"
        style={{ border: '1px solid var(--color-cedar)' }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-4 gap-2 px-4 py-2.5"
          style={{ background: 'var(--color-mahogany)', borderBottom: '1px solid var(--color-cedar)' }}
        >
          {['Period', 'Scheduled', 'Completed', 'Rate'].map(h => (
            <span
              key={h}
              className="text-2xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-taupe)', fontSize: 10, letterSpacing: '0.06em' }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {records.map((rec, i) => (
          <div
            key={rec.period}
            className="grid grid-cols-4 gap-2 px-4 py-3 items-center"
            style={{
              background: i % 2 === 0 ? 'var(--color-walnut)' : 'var(--color-mahogany)',
              borderBottom: i < records.length - 1 ? '1px solid var(--color-cedar)' : undefined,
            }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--color-ceramic)', fontSize: 13 }}>
              {rec.period}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-parchment)', fontSize: 13 }}>
              {rec.scheduled.toLocaleString()}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-parchment)', fontSize: 13 }}>
              {rec.completed.toLocaleString()}
              {rec.lateCompletions > 0 && (
                <span className="ml-1" style={{ color: 'var(--color-amber)', fontSize: 10 }}>
                  ({rec.lateCompletions} late)
                </span>
              )}
            </span>
            <div className="space-y-1">
              <span
                className="text-xs font-semibold block"
                style={{
                  color: rec.complianceRate >= 99.5 ? 'var(--color-sage)'
                       : rec.complianceRate >= 98   ? 'var(--color-amber)'
                       : 'var(--color-terracotta)',
                  fontSize: 12,
                }}
              >
                {rec.complianceRate.toFixed(1)}%
              </span>
              <ComplianceBar rate={rec.complianceRate} />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs" style={{ color: 'var(--color-taupe)', fontSize: 11 }}>
        All exam evidence (Category B data) is held in neutral escrow for a maximum of 90 days,
        then permanently deleted in compliance with platform policy and GDPR Article 5(1)(e).
      </p>
    </div>
  )
}