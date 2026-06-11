'use client'

import { useState } from 'react'
import type { QRVerificationLink } from '@/types/credentialBridge'

interface QRCodeVerifierProps {
  qr: QRVerificationLink
}

const STATUS_CONFIG = {
  valid:   { label: 'Valid', cls: 'badge badge-low', icon: '✓' },
  expired: { label: 'Expired', cls: 'badge badge-high', icon: '✗' },
  revoked: { label: 'Revoked', cls: 'badge badge-critical', icon: '✗' },
  pending: { label: 'Pending', cls: 'badge badge-neutral', icon: '◌' },
}

export function QRCodeVerifier({ qr }: QRCodeVerifierProps) {
  const [copied, setCopied] = useState(false)
  const cfg = STATUS_CONFIG[qr.verificationStatus]

  async function handleCopy() {
    await navigator.clipboard.writeText(qr.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* QR visual — SVG placeholder grid (real impl would use qrcode.react) */}
      <div
        className="rounded-card p-4 flex items-center justify-center"
        style={{
          background: 'var(--color-ivory)',
          width: 180,
          height: 180,
          border: '1px solid var(--color-bark)',
        }}
      >
        {/* Placeholder QR grid */}
        <svg width="148" height="148" viewBox="0 0 148 148" aria-label="QR code">
          {/* Top-left finder pattern */}
          <rect x="0"  y="0"  width="42" height="42" rx="4" fill="#1f150b" />
          <rect x="6"  y="6"  width="30" height="30" rx="2" fill="var(--color-ivory)" />
          <rect x="12" y="12" width="18" height="18" rx="1" fill="#1f150b" />
          {/* Top-right finder */}
          <rect x="106" y="0"  width="42" height="42" rx="4" fill="#1f150b" />
          <rect x="112" y="6"  width="30" height="30" rx="2" fill="var(--color-ivory)" />
          <rect x="118" y="12" width="18" height="18" rx="1" fill="#1f150b" />
          {/* Bottom-left finder */}
          <rect x="0"  y="106" width="42" height="42" rx="4" fill="#1f150b" />
          <rect x="6"  y="112" width="30" height="30" rx="2" fill="var(--color-ivory)" />
          <rect x="12" y="118" width="18" height="18" rx="1" fill="#1f150b" />
          {/* Data modules (simplified) */}
          {[48,56,64,72,80,88,96].map(x =>
            [0,6,12,18,24,30,36].map(y => (
              Math.sin(x * y) > 0.2 ? (
                <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="#1f150b" />
              ) : null
            ))
          )}
          {[0,6,12,18,24,30,36,48,56,64,72].map(x =>
            [48,56,64,72,80,88,96,104,112,120,128,136].map(y => (
              Math.cos(x + y) > 0.1 ? (
                <rect key={`d-${x}-${y}`} x={x} y={y} width="4" height="4" fill="#1f150b" />
              ) : null
            ))
          )}
          {/* Center amber seal mark */}
          <rect x="62" y="62" width="24" height="24" rx="4" fill="var(--color-amber)" opacity={0.9} />
          <text x="74" y="78" textAnchor="middle" fontSize="12" fill="#0e0906" fontWeight="bold">EI</text>
        </svg>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <span className={cfg.cls}>{cfg.icon} {cfg.label}</span>
        <span className="text-xs" style={{ color: 'var(--color-taupe)', fontSize: 11 }}>
          Expires {new Date(qr.expiresAt).toLocaleDateString()}
        </span>
      </div>

      {/* URL + copy */}
      <div className="w-full space-y-2">
        <p className="label">Verification URL</p>
        <div className="flex items-center gap-2">
          <div
            className="flex-1 rounded-md px-3 py-2 text-xs truncate"
            style={{
              background: 'var(--color-espresso)',
              border: '1px solid var(--color-cedar)',
              color: 'var(--color-ceramic)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
            }}
          >
            {qr.url}
          </div>
          <button className="btn-subtle shrink-0" onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-taupe)', fontSize: 11 }}>
          Anyone with this link can verify the credential without accessing your personal data.
        </p>
      </div>
    </div>
  )
}