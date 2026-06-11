'use client'

import { Share2 } from 'lucide-react'
import type { WalletPassLink } from '@/types/credentialBridge'
import { openPassLink } from '@/lib/wallet/walletPassLinks'

export function LinkedInShareButton({ link }: { link: WalletPassLink }) {
  return (
    <button
      type="button"
      disabled={!link.available}
      onClick={() => openPassLink(link)}
      title={link.note}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0a66c2] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#004182] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Share2 className="h-4 w-4" aria-hidden />
      {link.label}
    </button>
  )
}
