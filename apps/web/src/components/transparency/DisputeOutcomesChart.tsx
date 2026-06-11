'use client'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { DisputeOutcomes } from '@/types/transparency'

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#a1a1aa']

export function DisputeOutcomesChart({ data }: { data: DisputeOutcomes }) {
  const slices = [
    { name: 'Overturned', value: data.overturned },
    { name: 'Auto-resolved', value: data.autoResolved },
    { name: 'Upheld', value: data.upheld },
    { name: 'Pending', value: data.pending },
  ].filter((s) => s.value > 0)

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Dispute outcomes
        </h3>
        <span className="text-xs text-zinc-500">
          {data.filed} filed · avg {data.averageResolutionHours}h to resolve
        </span>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {slices.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
