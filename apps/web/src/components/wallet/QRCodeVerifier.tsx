'use client'

import { useState } from 'react'
import { BadgeCheck, Copy, QrCode, ShieldCheck, ShieldX } from 'lucide-react'
import type {
  QrVerificationLink,
  QrVerificationResult,
} from '@/types/credentialBridge'
import { fetchQrLink, verifyCredential } from '@/lib/api/credentialBridge'
import { copyToClipboard } from '@/lib/wallet/credentialExport'

export function QRCodeVerifier({ credentialId }: { credentialId: string }) {
  const [link, setLink] = useState<QrVerificationLink | null>(null)
  const [result, setResult] = useState<QrVerificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const l = await fetchQrLink(credentialId)
      setLink(l)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  async function runVerify() {
    setLoading(true)
    try {
      setResult(await verifyCredential(credentialId))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center gap-2">
        <QrCode className="h-4 w-4 text-zinc-400" aria-hidden />
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          QR verification link
        </h3>
      </div>

      {!link ? (
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {loading ? 'Generating…' : 'Generate verification link'}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center rounded-lg border border-dashed border-zinc-300 p-6 dark:border-zinc-700">
            {/* Placeholder QR. The encoded payload is the verification URL. */}
            <QrCode className="h-32 w-32 text-zinc-800 dark:text-zinc-200" aria-hidden />
          </div>

          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              {link.verificationUrl}
            </code>
            <button
              type="button"
              onClick={async () => {
                const ok = await copyToClipboard(link.verificationUrl)
                setCopied(ok)
                setTimeout(() => setCopied(false), 1500)
              }}
              className="rounded-md border border-zinc-300 p-1.5 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              aria-label="Copy verification URL"
            >
              <Copy className="h-4 w-4" aria-hidden />
            </button>
          </div>
          {copied ? <span className="text-xs text-emerald-600">Copied!</span> : null}
          <p className="text-xs text-zinc-500">
            Expires {new Date(link.expiresAt).toLocaleTimeString()}
          </p>

          <button
            type="button"
            onClick={runVerify}
            disabled={loading}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            {loading ? 'Verifying…' : 'Simulate verifier scan'}
          </button>
        </div>
      )}

      {result ? (
        <div className="mt-4 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {result.verified ? (
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden />
            ) : (
              <ShieldX className="h-5 w-5 text-red-600" aria-hidden />
            )}
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {result.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {result.subjectSummary}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Issuer: {result.issuer}</p>
          {result.privacyProofVerified ? (
            <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              Privacy proof verified (zero-knowledge — evidence not revealed)
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
