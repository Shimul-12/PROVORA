// Public Transparency Dashboard — web types.
// Mirrors packages/shared-types/src/transparency.ts.

export type MetricTrend = 'UP' | 'DOWN' | 'FLAT'

export interface PublicMetric {
  key: string
  label: string
  value: number
  unit?: string
  trend?: MetricTrend
  changePct?: number
  description?: string
}

export interface FlagRateByCategory {
  category: string
  flagRatePct: number
  totalFlags: number
  falsePositiveRatePct: number
}

export interface DisputeOutcomes {
  filed: number
  autoResolved: number
  overturned: number
  upheld: number
  pending: number
  averageResolutionHours: number
}

export interface AccommodationStats {
  totalSessions: number
  accommodationAdjustedSessions: number
  adjustedPct: number
}

export type DriftStatus = 'STABLE' | 'WATCH' | 'DRIFTING'

export interface FeatureDrift {
  feature: string
  drift: number
}

export interface ModelDriftStatus {
  modelVersion: string
  status: DriftStatus
  psi: number
  lastEvaluatedAt: string
  featureDrift: FeatureDrift[]
}

export interface DeletionCompliance {
  evidenceDueForDeletion: number
  evidenceDeletedOnTime: number
  compliancePct: number
  oldestUndeletedDays: number
  retentionDays: number
}

export type LogHealthStatus = 'HEALTHY' | 'DEGRADED' | 'BROKEN'

export interface TransparencyLogHealth {
  status: LogHealthStatus
  totalEntries: number
  lastEntryHash: string
  lastEntryAt: string
  chainVerified: boolean
  merkleRoot: string
  brokenAtIndex?: number
}

export interface TransparencyMetrics {
  generatedAt: string
  periodStart: string
  periodEnd: string
  totalExamsProtected: number
  credentialsIssued: number
  flagRatePct: number
  disputes: DisputeOutcomes
  accommodation: AccommodationStats
  systemicEvents: number
  flagRateByCategory: FlagRateByCategory[]
  deletionCompliance: DeletionCompliance
  modelDrift: ModelDriftStatus
  logHealth: TransparencyLogHealth
  headlineMetrics: PublicMetric[]
}

export interface MetricTimeseriesPoint {
  date: string
  value: number
}

export interface MetricTimeseries {
  key: string
  label: string
  unit?: string
  points: MetricTimeseriesPoint[]
}
