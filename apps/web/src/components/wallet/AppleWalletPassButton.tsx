'use client'

import { Wallet } from 'lucide-react'
import type { WalletPassLink } from '@/types/credentialBridge'
import { openPassLink } from '@/lib/wallet/walletPassLinks'

export function AppleWalletPassButton({ link }: { link: WalletPassLink }) {
  return (
    <button
      type="button"
      disabled={!link.available}
      onClick={() => openPassLink(link)}
      title={link.note}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Wallet className="h-4 w-4" aria-hidden />
      {link.label}
      {!link.available ? <span className="text-xs opacity-70">(soon)</span> : null}
    </button>
  )
}
