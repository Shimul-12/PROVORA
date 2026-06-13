// apps/web/src/components/transparency/ModelDriftPanel.tsx
import type { ModelDriftDetail } from '@/types/transparency'
import { DRIFT_STATUS_CONFIG } from '@/types/transparency'

interface ModelDriftPanelProps {
  drift: ModelDriftDetail
}

function DeltaRow({
  label,
  delta,
  unit = 'pp',
}: {
  label: string
  delta: number
  unit?: string
}) {
  const isPositive = delta > 0
  const isNeutral  = Math.abs(delta) < 0.001
  const color = isNeutral
    ? 'var(--color-taupe)'
    : isPositive
    ? 'var(--color-terracotta)'
    : 'var(--color-sage)'
  const sign = isNeutral ? '≈' : isPositive ? '+' : ''

  return (
    <div className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: '1px solid var(--color-cedar)' }}>
      <span className="text-xs" style={{ color: 'var(--color-ceramic)', fontSize: 13 }}>{label}</span>
      <span className="text-sm font-semibold font-mono" style={{ color, fontSize: 13 }}>
        {sign}{(delta * 100).toFixed(2)} {unit}
      </span>
    </div>
  )
}

export function ModelDriftPanel({ drift }: ModelDriftPanelProps) {
  const cfg = DRIFT_STATUS_CONFIG[drift.status]

  return (
    <div className="space-y-4">
      {/* Status header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label mb-1">Model version</p>
          <div className="flex items-center gap-2">
            <span className="mono-value">{drift.currentVersion}</span>
            {drift.currentVersion !== drift.baselineVersion && (
              <span className="text-xs" style={{ color: 'var(--color-taupe)', fontSize: 11 }}>
                (baseline: {drift.baselineVersion})
              </span>
            )}
          </div>
        </div>
        <span className={`badge ${cfg.bg} ${cfg.color}`} style={{ fontWeight: 600 }}>
          <span
            className="inline-block rounded-full"
            style={{ width: 5, height: 5, background: cfg.dot }}
          />
          {cfg.label}
        </span>
      </div>

      {/* Delta metrics */}
      <div>
        <p className="label mb-2">Change from baseline</p>
        <DeltaRow label="False positive rate Δ" delta={drift.falsePositiveRateDelta} />
        <DeltaRow label="False negative rate Δ" delta={drift.falseNegativeRateDelta} />
      </div>

      {/* Description */}
      <div
        className="rounded-md px-3 py-2.5 text-xs leading-relaxed"
        style={{
          background: 'var(--color-mahogany)',
          border: '1px solid var(--color-cedar)',
          color: 'var(--color-ceramic)',
          fontSize: 12,
        }}
      >
        {drift.description}
      </div>

      {/* Audit meta */}
      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-taupe)', fontSize: 11 }}>
        <span>{drift.flagsAuditedThisCycle.toLocaleString()} flags audited this cycle</span>
        <span>Checked {new Date(drift.lastCheckedAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}