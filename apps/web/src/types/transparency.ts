export type ModelDriftStatus = 'stable' | 'minor_drift' | 'significant_drift' | 'critical'
export type TransparencyLogHealth = 'healthy' | 'degraded' | 'critical'

export interface PublicMetrics {
  totalExamsProtected:          number
  credentialsIssued:            number
  flagRate:                     number   // percentage of sessions with ≥1 flag
  disputesFiled:                number
  disputesAutoResolved:         number
  disputesOverturned:           number
  avgResolutionTimeDays:        number
  accommodationAdjustedSessions:number
  systemicEvents:               number
  evidenceDeletionComplianceRate: number // 0–100
  modelDriftStatus:             ModelDriftStatus
  transparencyLogHealth:        TransparencyLogHealth
  lastUpdatedAt:                string
  snapshotPeriod: {
    from: string
    to:   string
  }
}

export interface ModelDriftDetail {
  status:                  ModelDriftStatus
  lastCheckedAt:           string
  falsePositiveRateDelta:  number   // change from baseline (positive = worse)
  falseNegativeRateDelta:  number
  baselineVersion:         string   // e.g. 'v2.1.0'
  currentVersion:          string
  flagsAuditedThisCycle:   number
  description:             string
}

export interface TransparencyLogDetail {
  health:           TransparencyLogHealth
  lastEntryAt:      string
  totalEntries:     number
  verifiedEntries:  number
  integrityRate:    number   // 0–100
  latestBlockHash:  string
  chainLength:      number
}

export interface FlagRateByCategory {
  category:    string    // flag type label
  rate:        number    // percentage
  count:       number
  period:      string
}

export interface DisputeOutcomeByMonth {
  month:        string   // e.g. "Jan 2025"
  filed:        number
  autoResolved: number
  overturned:   number
  upheld:       number
}

export interface DeletionComplianceRecord {
  period:          string
  scheduled:       number
  completed:       number
  complianceRate:  number   // 0–100
  lateCompletions: number
}

export interface TransparencySnapshot {
  metrics:            PublicMetrics
  flagRateByCategory: FlagRateByCategory[]
  disputeOutcomes:    DisputeOutcomeByMonth[]
  deletionCompliance: DeletionComplianceRecord[]
  modelDrift:         ModelDriftDetail
  logDetail:          TransparencyLogDetail
}

/** Display helpers */
export const DRIFT_STATUS_CONFIG: Record<ModelDriftStatus, {
  label: string; color: string; bg: string; dot: string
}> = {
  stable:             { label: 'Stable',             color: 'text-sage',       bg: 'bg-sage-dim',    dot: '#4a9b6a' },
  minor_drift:        { label: 'Minor Drift',         color: 'text-amber',      bg: 'bg-amber-surface', dot: '#d4952a' },
  significant_drift:  { label: 'Significant Drift',   color: 'text-terracotta', bg: 'bg-terracotta-dim', dot: '#c05030' },
  critical:           { label: 'Critical',            color: 'text-[#e05050]',  bg: 'bg-crimson-dim', dot: '#e05050' },
}

export const LOG_HEALTH_CONFIG: Record<TransparencyLogHealth, {
  label: string; color: string; bg: string
}> = {
  healthy:  { label: 'Healthy',  color: 'text-sage',       bg: 'bg-sage-dim'    },
  degraded: { label: 'Degraded', color: 'text-amber',      bg: 'bg-amber-surface' },
  critical: { label: 'Critical', color: 'text-[#e05050]',  bg: 'bg-crimson-dim' },
}