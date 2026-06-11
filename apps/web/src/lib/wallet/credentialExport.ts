// apps/web/src/lib/wallet/credentialExport.ts
import type { VerifiableCredentialExport } from '@/types/credentialBridge'

/**
 * Trigger a browser download of the signed VC as a .json file.
 */
export function downloadCredentialJson(credential: VerifiableCredentialExport): void {
  const content  = JSON.stringify(credential.payload, null, 2)
  const blob     = new Blob([content], { type: 'application/json' })
  const url      = URL.createObjectURL(blob)
  const anchor   = document.createElement('a')
  anchor.href     = url
  anchor.download = `examidentity-vc-${credential.credentialId.slice(0, 8)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

/**
 * Encode a credential payload as a base64url string for embedding in QR / deep-links.
 */
export function encodeCredentialBase64(credential: VerifiableCredentialExport): string {
  const json   = JSON.stringify(credential.payload)
  const bytes  = new TextEncoder().encode(json)
  const binary = Array.from(bytes).map(b => String.fromCharCode(b)).join('')
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Decode a base64url credential string back to a payload object.
 * Returns null if decoding fails.
 */
export function decodeCredentialBase64(encoded: string): object | null {
  try {
    const b64    = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(b64)
    const bytes  = Uint8Array.from(binary, c => c.charCodeAt(0))
    const json   = new TextDecoder().decode(bytes)
    return JSON.parse(json)
  } catch {
    return null
  }
}

/**
 * Check whether a credential's expiration date has passed.
 */
export function isCredentialExpired(credential: VerifiableCredentialExport): boolean {
  if (!credential.expiresAt) return false
  return new Date(credential.expiresAt) < new Date()
}

/**
 * Extract a short human-readable summary from a VC export for display in lists.
 */
export function getCredentialSummary(credential: VerifiableCredentialExport): {
  title: string
  institution: string
  issuedAt: string
  expired: boolean
} {
  const subject = credential.payload.credentialSubject
  return {
    title:       subject.examTitle      ?? 'Unknown Exam',
    institution: subject.institutionName ?? 'Unknown Institution',
    issuedAt:    credential.issuedAt,
    expired:     isCredentialExpired(credential),
  }
}