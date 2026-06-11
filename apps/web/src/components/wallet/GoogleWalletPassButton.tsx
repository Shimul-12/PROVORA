'use client'

import { Wallet } from 'lucide-react'
import type { WalletPassLink } from '@/types/credentialBridge'
import { openPassLink } from '@/lib/wallet/walletPassLinks'

export function GoogleWalletPassButton({ link }: { link: WalletPassLink }) {
  return (
    <button
      type="button"
      disabled={!link.available}
      onClick={() => openPassLink(link)}
      title={link.note}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
    >
      <Wallet className="h-4 w-4 text-[#4285f4]" aria-hidden />
      {link.label}
      {!link.available ? <span className="text-xs opacity-70">(soon)</span> : null}
    </button>
  )
}
