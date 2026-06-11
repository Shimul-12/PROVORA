// Explainable Flag Cards — web types.
// Mirrors packages/shared-types/src/explanations.ts (kept local so the web app
// has no cross-package build dependency).

export type FlagType =
  | 'GAZE_AWAY'
  | 'TYPING_IDENTITY_DRIFT'
  | 'MULTIPLE_VOICES'
  | 'SYSTEMIC_EVENT'
  | 'DEVICE_INTEGRITY'

export type FlagSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type AccommodationType =
  | 'NONE'
  | 'EXTENDED_TIME'
  | 'SCREEN_READER'
  | 'BREAKS_ALLOWED'
  | 'SEPARATE_ROOM'
  | 'ASSISTIVE_TECH'
  | 'REDUCED_DISTRACTION'

export type RecommendedAction =
  | 'NO_ACTION'
  | 'AUTO_RESOLVED'
  | 'STUDENT_REVIEW'
  | 'MONITOR'
  | 'MANUAL_REVIEW'
  | 'ESCALATE'

export interface TimeRange {
  startedAt: string
  endedAt: string
  durationSeconds: number
}

export interface FlagEvidencePoint {
  timestamp: string
  label: string
  observedValue: number
  thresholdValue: number
  exceeded: boolean
  detail?: string
}

export interface FlagReason {
  code: string
  title: string
  description: string
  weight: number
  observedValue: number
  baselineValue: number
}

export interface FlagExplanation {
  flagId: string
  sessionId: string
  type: FlagType
  severity: FlagSeverity
  timeRange: TimeRange
  observedValue: number
  baselineValue: number
  policyThreshold: number
  adjustedThreshold: number
  accommodationApplied: AccommodationType
  accommodationAdjustment?: string
  confidence: number
  summary: string
  reasons: FlagReason[]
  evidenceTimeline: FlagEvidencePoint[]
  recommendedAction: RecommendedAction
  autoResolved: boolean
  disputable: boolean
  modelVersion: string
  generatedAt: string
}

export interface SessionFlagExplanations {
  sessionId: string
  studentDid: string
  examId: string
  generatedAt: string
  explanations: FlagExplanation[]
}
