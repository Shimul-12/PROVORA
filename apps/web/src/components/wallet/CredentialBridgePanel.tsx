'use client'

import { Award, ExternalLink } from 'lucide-react'
import { useBridgeOptions } from '@/lib/api/credentialBridge'
import { openPassLink, sortPassLinks } from '@/lib/wallet/walletPassLinks'
import type { WalletPassLink } from '@/types/credentialBridge'
import { LinkedInShareButton } from './LinkedInShareButton'
import { AppleWalletPassButton } from './AppleWalletPassButton'
import { GoogleWalletPassButton } from './GoogleWalletPassButton'
import { QRCodeVerifier } from './QRCodeVerifier'
import { WalletExportOptions } from './WalletExportOptions'

function PassButton({ link }: { link: WalletPassLink }) {
  switch (link.target) {
    case 'LINKEDIN':
      return <LinkedInShareButton link={link} />
    case 'APPLE_WALLET':
      return <AppleWalletPassButton link={link} />
    case 'GOOGLE_WALLET':
      return <GoogleWalletPassButton link={link} />
    default:
      return (
        <button
          type="button"
          disabled={!link.available}
          onClick={() => openPassLink(link)}
          title={link.note}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          {link.label}
        </button>
      )
  }
}

export function CredentialBridgePanel({ credentialId }: { credentialId: string }) {
  const { data: options, isLoading, isError } = useBridgeOptions(credentialId)

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading credential…</p>
  }
  if (isError || !options) {
    return (
      <p className="text-sm text-red-600">
        Could not load this credential. Start the API on port 3001 and check the
        credential id.
      </p>
    )
  }

  // Pass links that are not DOWNLOAD/QR (those are handled by dedicated panels).
  const shareLinks = sortPassLinks(
    options.passLinks.filter(
      (l) => l.target !== 'DOWNLOAD_JSON' && l.target !== 'QR_LINK',
    ),
  )

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
            <Award className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {options.examName}
            </h2>
            <p className="text-sm text-zinc-500">{options.issuingInstitution}</p>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              {options.credentialId} · {options.credentialType}
            </p>
          </div>
        </div>
      </header>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Share to a wallet or profile
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {shareLinks.map((link) => (
            <PassButton key={link.target} link={link} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QRCodeVerifier credentialId={credentialId} />
        <WalletExportOptions
          credentialId={credentialId}
          supportedFormats={options.supportedFormats}
        />
      </div>
    </div>
  )
}
