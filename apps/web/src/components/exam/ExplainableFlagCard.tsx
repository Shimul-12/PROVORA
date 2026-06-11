'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Eye,
  Keyboard,
  Mic,
  ShieldAlert,
  Monitor,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FlagExplanation, FlagType, RecommendedAction } from '@/types/explanations'
import { FlagSeverityBadge } from './FlagSeverityBadge'
import { FlagReasonList } from './FlagReasonList'
import { FlagEvidenceTimeline } from './FlagEvidenceTimeline'

const FLAG_ICON: Record<FlagType, typeof Eye> = {
  GAZE_AWAY: Eye,
  TYPING_IDENTITY_DRIFT: Keyboard,
  MULTIPLE_VOICES: Mic,
  SYSTEMIC_EVENT: ShieldAlert,
  DEVICE_INTEGRITY: Monitor,
}

const FLAG_LABEL: Record<FlagType, string> = {
  GAZE_AWAY: 'Gaze left screen',
  TYPING_IDENTITY_DRIFT: 'Typing pattern drift',
  MULTIPLE_VOICES: 'Multiple voices detected',
  SYSTEMIC_EVENT: 'Systemic event',
  DEVICE_INTEGRITY: 'Device integrity',
}

const ACTION_LABEL: Record<RecommendedAction, string> = {
  NO_ACTION: 'No action',
  AUTO_RESOLVED: 'Auto-resolved',
  STUDENT_REVIEW: 'Review recommended',
  MONITOR: 'Monitoring',
  MANUAL_REVIEW: 'Manual review',
  ESCALATE: 'Escalated',
}

export interface ExplainableFlagCardProps {
  explanation: FlagExplanation
  onDispute?: (flagId: string) => void
  defaultExpanded?: boolean
  className?: string
}

export function ExplainableFlagCard({
  explanation,
  onDispute,
  defaultExpanded = false,
  className,
}: ExplainableFlagCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const Icon = FLAG_ICON[explanation.type]

  return (
    <article
      className={cn(
        'rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <header className="flex items-start gap-3 p-4">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            explanation.autoResolved
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300',
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {FLAG_LABEL[explanation.type]}
            </h3>
            <FlagSeverityBadge severity={explanation.severity} />
            {explanation.autoResolved ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                {ACTION_LABEL[explanation.recommendedAction]}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                {ACTION_LABEL[explanation.recommendedAction]}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {explanation.summary}
          </p>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-500 sm:grid-cols-4">
            <div>
              <dt className="text-zinc-400">Observed</dt>
              <dd className="font-medium text-zinc-700 dark:text-zinc-300">
                {explanation.observedValue}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-400">Baseline</dt>
              <dd className="font-medium text-zinc-700 dark:text-zinc-300">
                {explanation.baselineValue}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-400">Threshold</dt>
              <dd className="font-medium text-zinc-700 dark:text-zinc-300">
                {explanation.adjustedThreshold}
                {explanation.adjustedThreshold !== explanation.policyThreshold ? (
                  <span className="ml-1 text-zinc-400 line-through">
                    {explanation.policyThreshold}
                  </span>
                ) : null}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-400">Confidence</dt>
              <dd className="font-medium text-zinc-700 dark:text-zinc-300">
                {Math.round(explanation.confidence * 100)}%
              </dd>
            </div>
          </dl>

          {explanation.accommodationApplied !== 'NONE' &&
          explanation.accommodationAdjustment ? (
            <p className="mt-2 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {explanation.accommodationAdjustment}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse evidence' : 'Expand evidence'}
          className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-900"
        >
          <ChevronDown
            className={cn('h-5 w-5 transition-transform', expanded && 'rotate-180')}
            aria-hidden
          />
        </button>
      </header>

      {expanded ? (
        <div className="border-t border-zinc-100 p-4 dark:border-zinc-900">
          <section className="mb-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Why this was flagged
            </h4>
            <FlagReasonList reasons={explanation.reasons} />
          </section>

          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Evidence timeline
            </h4>
            <FlagEvidenceTimeline points={explanation.evidenceTimeline} />
          </section>

          {explanation.disputable && onDispute ? (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onDispute(explanation.flagId)}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Dispute this flag
              </button>
            </div>
          ) : null}

          <p className="mt-4 text-[11px] text-zinc-400">
            Model {explanation.modelVersion} · generated{' '}
            {new Date(explanation.generatedAt).toLocaleString()}
          </p>
        </div>
      ) : null}
    </article>
  )
}
