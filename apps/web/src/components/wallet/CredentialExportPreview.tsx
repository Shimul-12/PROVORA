'use client'

import { Download } from 'lucide-react'
import type { CredentialExportResult } from '@/types/credentialBridge'
import { downloadExport } from '@/lib/wallet/credentialExport'

export function CredentialExportPreview({
  result,
  loading,
}: {
  result: CredentialExportResult | null
  loading: boolean
}) {
  if (loading) {
    return <p className="text-sm text-zinc-500">Generating export…</p>
  }
  if (!result) {
    return (
      <p className="text-sm text-zinc-500">
        Choose a format above to preview the export.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          {result.filename} · {result.mimeType}
        </span>
        <button
          type="button"
          onClick={() => downloadExport(result)}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
          Download
        </button>
      </div>
      <pre className="max-h-80 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs leading-relaxed text-zinc-100">
        <code>{result.payload}</code>
      </pre>
    </div>
  )
}
