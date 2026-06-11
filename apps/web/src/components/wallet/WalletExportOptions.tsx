'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { CredentialExportResult, ExportFormat } from '@/types/credentialBridge'
import { fetchCredentialExport } from '@/lib/api/credentialBridge'
import { CredentialExportPreview } from './CredentialExportPreview'

const FORMAT_LABELS: Record<ExportFormat, string> = {
  VC_JSON: 'VC JSON',
  VP_JSON: 'Presentation',
  VC_JWT: 'JWT',
  QR: 'QR payload',
  PDF: 'Certificate',
}

export function WalletExportOptions({
  credentialId,
  supportedFormats,
}: {
  credentialId: string
  supportedFormats: ExportFormat[]
}) {
  const [format, setFormat] = useState<ExportFormat | null>(null)
  const [result, setResult] = useState<CredentialExportResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function select(f: ExportFormat) {
    setFormat(f)
    setLoading(true)
    try {
      setResult(await fetchCredentialExport(credentialId, f))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Export format
      </h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {supportedFormats.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => select(f)}
            className={cn(
              'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
              format === f
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900',
            )}
          >
            {FORMAT_LABELS[f]}
          </button>
        ))}
      </div>
      <CredentialExportPreview result={result} loading={loading} />
    </div>
  )
}
