import Link from 'next/link'
import { Award, BarChart3, Eye } from 'lucide-react'

const FEATURES = [
  {
    href: '/exam',
    title: 'Explainable Flag Cards',
    description:
      'Transparent proctoring flags with observed vs. baseline values, accommodation-adjusted thresholds, and an evidence timeline.',
    icon: Eye,
  },
  {
    href: '/wallet/export/cred-001',
    title: 'Cross-Platform Credential Bridge',
    description:
      'Export your integrity credential as a W3C Verifiable Credential, share a QR verification link, or add it to a wallet.',
    icon: Award,
  },
  {
    href: '/transparency',
    title: 'Public Transparency Dashboard',
    description:
      'Aggregate, anonymized accountability metrics: flag rates, dispute outcomes, deletion compliance, and log health.',
    icon: BarChart3,
  },
]

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          ExamIdentity
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          A self-sovereign, privacy-preserving exam integrity platform. Students
          own their identity, neutral escrow holds evidence, and institutions
          receive transparent integrity reports.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="group rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 group-hover:bg-white dark:bg-zinc-900 dark:text-zinc-300">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {feature.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </Link>
          )
        })}
      </div>

      <p className="mt-10 text-xs text-zinc-400">
        Demo data is served by the API on port 3001. Run{' '}
        <code className="font-mono">pnpm dev</code> from the repo root to start
        all services.
      </p>
    </main>
  )
}
