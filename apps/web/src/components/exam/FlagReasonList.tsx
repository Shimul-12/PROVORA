import type { ExplainableFlag } from '@/types/explanations'

interface FlagReasonListProps {
  flag: ExplainableFlag
}

function Row({ label, value, mono = false }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-cedar last:border-0">
      <span className="text-xs text-taupe font-medium uppercase tracking-wider min-w-0 shrink-0" style={{ fontSize: 11, letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span
        className={`text-sm text-right min-w-0 truncate ${mono ? 'font-mono text-ceramic' : 'text-parchment'}`}
        style={{ fontSize: 13 }}
      >
        {value}
      </span>
    </div>
  )
}

export function FlagReasonList({ flag }: FlagReasonListProps) {
  const durationSec = Math.round((flag.timeRange.end - flag.timeRange.start) / 1000)
  const confidencePct = Math.round(flag.confidence * 100)

  return (
    <div className="space-y-0">
      <Row label="Observed" value={flag.observedValue} mono />
      <Row label="Your Baseline" value={flag.baselineValue} mono />
      <Row label="Policy Threshold" value={flag.policyThreshold} mono />
      {flag.accommodation.applied && (
        <Row
          label="Adjusted Threshold"
          value={`${flag.adjustedThreshold} (${flag.accommodation.type ?? 'Accommodation'})`}
          mono
        />
      )}
      <Row label="Duration" value={`${durationSec}s`} />
      <Row label="Model Confidence" value={`${confidencePct}%`} />

      {/* Accommodation notice */}
      {flag.accommodation.applied && (
        <div
          className="mt-3 rounded-md px-3 py-2 text-xs flex items-start gap-2"
          style={{
            background: 'var(--color-amber-surface)',
            border: '1px solid color-mix(in srgb, var(--color-amber) 25%, transparent)',
          }}
        >
          <span style={{ color: 'var(--color-amber-glow)' }}>⚑</span>
          <span style={{ color: 'var(--color-ceramic)' }}>
            <span className="font-semibold" style={{ color: 'var(--color-amber)' }}>
              Accommodation applied:
            </span>{' '}
            {flag.accommodation.description ?? flag.accommodation.type}
          </span>
        </div>
      )}

      {/* Evidence hashes */}
      {flag.evidenceHashes && flag.evidenceHashes.length > 0 && (
        <div className="mt-3">
          <p className="label mb-2">Evidence references</p>
          <div className="space-y-1">
            {flag.evidenceHashes.map((hash) => (
              <div key={hash} className="mono-value text-xs truncate" style={{ maxWidth: '100%' }}>
                {hash}
              </div>
            ))}
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--color-taupe)', fontSize: 11 }}>
            Hashes reference encrypted evidence in neutral escrow. Raw data is never exposed here.
          </p>
        </div>
      )}
    </div>
  )
}