import { CheckCircle2, Link2, ShieldX } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LogHealthStatus, TransparencyLogHealth } from '@/types/transparency'

const STATUS_STYLES: Record<LogHealthStatus, string> = {
  HEALTHY: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  DEGRADED: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  BROKEN: 'bg-red-50 text-red-700 ring-red-600/20',
}

function truncateHash(hash: string): string {
  return hash.length > 20 ? `${hash.slice(0, 10)}…${hash.slice(-8)}` : hash
}

export function TransparencyLogHealthPanel({ data }: { data: TransparencyLogHealth }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-zinc-400" aria-hidden />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Transparency log health
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

      <div className="flex items-center gap-2 text-sm">
        {data.chainVerified ? (
          <span className="inline-flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Hash chain verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-red-600">
            <ShieldX className="h-4 w-4" aria-hidden />
            Chain broken at entry {data.brokenAtIndex}
          </span>
        )}
      </div>

      <dl className="mt-4 flex flex-col gap-2 text-xs">
        <div className="flex justify-between">
          <dt className="text-zinc-400">Entries</dt>
          <dd className="font-medium tabular-nums text-zinc-700 dark:text-zinc-300">
            {data.totalEntries.toLocaleString()}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-400">Last entry</dt>
          <dd className="text-zinc-700 dark:text-zinc-300">
            {new Date(data.lastEntryAt).toLocaleString()}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-400">Merkle root</dt>
          <dd className="font-mono text-zinc-700 dark:text-zinc-300">
            {truncateHash(data.merkleRoot)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-400">Last hash</dt>
          <dd className="font-mono text-zinc-700 dark:text-zinc-300">
            {truncateHash(data.lastEntryHash)}
          </dd>
        </div>
      </dl>
    </div>
  )
}
