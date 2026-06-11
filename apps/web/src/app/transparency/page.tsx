import Link from 'next/link'
import { PublicMetricsDashboard } from '@/components/transparency/PublicMetricsDashboard'

export const metadata = {
  title: 'Transparency · ExamIdentity',
  description: 'Public accountability metrics for the ExamIdentity platform.',
}

export default function TransparencyPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← Home
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Public Transparency Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Aggregate accountability metrics. No personal data — only counts,
          rates, and cryptographic hashes.
        </p>
      </div>

      <PublicMetricsDashboard />
    </main>
  )
}
