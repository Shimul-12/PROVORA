// apps/web/src/components/transparency/TransparencyLogHealthPanel.tsx
import type { TransparencyLogDetail } from '@/types/transparency'
import { LOG_HEALTH_CONFIG } from '@/types/transparency'

interface TransparencyLogHealthPanelProps {
  log: TransparencyLogDetail
}

export function TransparencyLogHealthPanel({ log }: TransparencyLogHealthPanelProps) {
  const cfg = LOG_HEALTH_CONFIG[log.health]
  const pendingVerification = log.totalEntries - log.verifiedEntries

  return (
    <div className="space-y-4">
      {/* Status row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="label mb-1">Log integrity</p>
          <p className="text-2xl font-bold font-display" style={{ color: 'var(--color-ivory)', fontFamily: 'var(--font-display)' }}>
            {log.integrityRate.toFixed(2)}%
          </p>
        </div>
        <div className="text-right">
          <span className={`badge ${cfg.bg} ${cfg.color} mb-2 inline-flex`}>{cfg.label}</span>
          <p className="text-xs" style={{ color: 'var(--color-taupe)', fontSize: 11 }}>
            Last entry {new Date(log.lastEntryAt).toLocaleTimeString('en-US', {
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total entries',      value: log.totalEntries.toLocaleString() },
          { label: 'Verified',           value: log.verifiedEntries.toLocaleString() },
          { label: 'Chain length',       value: log.chainLength.toLocaleString() },
          { label: 'Pending verify',     value: pendingVerification > 0 ? String(pendingVerification) : '—' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-md px-3 py-2.5"
            style={{ background: 'var(--color-mahogany)', border: '1px solid var(--color-cedar)' }}
          >
            <p className="text-2xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-taupe)', fontSize: 10, letterSpacing: '0.06em' }}>
              {label}
            </p>
            <p className="font-semibold" style={{ color: 'var(--color-ivory)', fontSize: 15 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Latest block hash */}
      <div>
        <p className="label mb-1.5">Latest block hash</p>
        <div
          className="rounded-md px-3 py-2 text-xs font-mono truncate"
          style={{
            background: 'var(--color-espresso)',
            border: '1px solid var(--color-cedar)',
            color: 'var(--color-ceramic)',
            fontSize: 11,
          }}
        >
          {log.latestBlockHash}
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-taupe)', fontSize: 11 }}>
        The transparency log is an append-only hash chain. Every integrity event is
        logged and independently verifiable. No entry can be deleted or modified
        without breaking the chain.
      </p>
    </div>
  )
}