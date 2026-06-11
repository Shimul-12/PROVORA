import type { WalletPassLink, WalletTarget } from '@/types/credentialBridge'

/** Split pass links into available (live) vs. stubbed integrations. */
export function partitionPassLinks(links: WalletPassLink[]): {
  available: WalletPassLink[]
  comingSoon: WalletPassLink[]
} {
  return {
    available: links.filter((l) => l.available),
    comingSoon: links.filter((l) => !l.available),
  }
}

/** Open a pass link in a new tab (no-op on the server). */
export function openPassLink(link: WalletPassLink): void {
  if (typeof window === 'undefined') return
  window.open(link.url, '_blank', 'noopener,noreferrer')
}

const TARGET_ORDER: WalletTarget[] = [
  'DOWNLOAD_JSON',
  'QR_LINK',
  'LINKEDIN',
  'APPLE_WALLET',
  'GOOGLE_WALLET',
  'OID4VCI',
]

/** Sort pass links into a stable, sensible display order. */
export function sortPassLinks(links: WalletPassLink[]): WalletPassLink[] {
  return [...links].sort(
    (a, b) => TARGET_ORDER.indexOf(a.target) - TARGET_ORDER.indexOf(b.target),
  )
}
