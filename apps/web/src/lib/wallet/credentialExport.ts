import type { CredentialExportResult } from '@/types/credentialBridge'

/** Trigger a browser download for an export result payload. */
export function downloadExport(result: CredentialExportResult): void {
  if (typeof window === 'undefined') return
  const blob = new Blob([result.payload], { type: result.mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = result.filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/** Copy a string to the clipboard, resolving to whether it succeeded. */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
