import Link from 'next/link'
import { CredentialBridgePanel } from '@/components/wallet/CredentialBridgePanel'

export const metadata = {
  title: 'Export credential · ExamIdentity',
  description: 'Export or share your ExamIdentity verifiable credential.',
}

export default async function WalletExportPage({
  params,
}: {
  params: Promise<{ credentialId: string }>
}) {
  const { credentialId } = await params

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← Home
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Cross-Platform Credential Bridge
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Your credential is portable. Export it as a W3C Verifiable Credential,
          share a QR verification link, or add it to a wallet.
        </p>
      </div>

      <CredentialBridgePanel credentialId={credentialId} />
    </main>
  )
}
