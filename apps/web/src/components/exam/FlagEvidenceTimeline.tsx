'use client'

import type { ExplainableFlag } from '@/types/explanations'
import { useState } from 'react'

interface FlagEvidenceTimelineProps {
  flags: ExplainableFlag[]
  sessionStart: number   // Unix ms
  sessionEnd: number     // Unix ms
  durationMs?: number
}

const SEVERITY_COLORS: Record<string, string> = {
  low:      'var(--color-sage)',
  medium:   'var(--color-amber)',
  high:     'var(--color-terracotta)',
  critical: '#e05050',
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function FlagEvidenceTimeline({
  flags,
  sessionStart,
  sessionEnd,
}: FlagEvidenceTimelineProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const duration = sessionEnd - sessionStart
  if (duration <= 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="label mb-0">Session Timeline</span>
        <span className="text-xs" style={{ color: 'var(--color-taupe)', fontSize: 11 }}>
          {formatTime(duration)} total
        </span>
      </div>

      {/* Track */}
      <div
        className="relative h-2 w-full rounded-full overflow-visible"
        style={{ background: 'var(--color-cedar)' }}
      >
        {/* Progress fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: '100%', background: 'var(--color-bark)' }}
        />

        {/* Flag markers */}
        {flags.map((flag) => {
          const startPct = ((flag.timeRange.start - sessionStart) / duration) * 100
          const widthPct = Math.max(
            0.8,
            ((flag.timeRange.end - flag.timeRange.start) / duration) * 100
          )
          const isHovered = hovered === flag.id
          return (
            <div
              key={flag.id}
              className="absolute top-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all"
              style={{
                left:   `${Math.min(startPct, 99)}%`,
                width:  `${Math.max(widthPct, 2)}%`,
                height: isHovered ? 10 : 6,
                background: SEVERITY_COLORS[flag.severity],
                zIndex: isHovered ? 10 : 1,
                boxShadow: isHovered
                  ? `0 0 6px ${SEVERITY_COLORS[flag.severity]}`
                  : 'none',
              }}
              onMouseEnter={() => setHovered(flag.id)}
              onMouseLeave={() => setHovered(null)}
            />
          )
        })}
      </div>

      {/* Time labels */}
      <div className="flex justify-between">
        <span className="text-xs" style={{ color: 'var(--color-taupe)', fontSize: 10 }}>0:00</span>
        <span className="text-xs" style={{ color: 'var(--color-taupe)', fontSize: 10 }}>
          {formatTime(duration)}
        </span>
      </div>

      {/* Hovered flag info */}
      {hovered && (() => {
        const flag = flags.find(f => f.id === hovered)
        if (!flag) return null
        return (
          <div
            className="rounded-md px-3 py-2 text-xs animate-fade-in"
            style={{
              background: 'var(--color-cedar)',
              border: '1px solid var(--color-bark)',
              color: 'var(--color-ceramic)',
            }}
          >
            <span style={{ color: SEVERITY_COLORS[flag.severity] }} className="font-semibold">
              {flag.severity.toUpperCase()}
            </span>
            {' · '}
            {formatTime(flag.timeRange.start - sessionStart)}
            {' – '}
            {formatTime(flag.timeRange.end - sessionStart)}
            {' · '}
            {flag.explanation.slice(0, 80)}{flag.explanation.length > 80 ? '…' : ''}
          </div>
        )
      })()}

      {/* Legend */}
      <div className="flex items-center gap-4 pt-1">
        {(['low', 'medium', 'high', 'critical'] as const).map(s => (
          <div key={s} className="flex items-center gap-1.5">
            <span
              className="inline-block rounded-full"
              style={{ width: 6, height: 6, background: SEVERITY_COLORS[s] }}
            />
            <span className="text-xs capitalize" style={{ color: 'var(--color-taupe)', fontSize: 10 }}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}