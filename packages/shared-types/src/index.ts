// Credential Types
export interface ExamCredential {
  id: string
  type: string[]
  issuer: string
  issuanceDate: string
  credentialSubject: {
    id: string
    examName: string
    issuingInstitution: string
    institutionDid: string
    completedAt: string
    integrityScoreBand: 'HIGH' | 'MEDIUM' | 'LOW'
    flagCount: number
    disputeStatus: string
    sessionReference: string
  }
  proof?: object
}

// Session Types
export interface ExamSession {
  sessionId: string
  examId: string
  studentDid: string
  state: SessionState
  startedAt: string
  completedAt?: string
  integrityScore?: number
  flags: ExamFlag[]
}

export type SessionState =
  | 'PENDING'
  | 'IDENTITY_VERIFIED'
  | 'IN_PROGRESS'
  | 'FLAGGED'
  | 'COMPLETED'
  | 'INCOMPLETE'

// Flag Types
export interface ExamFlag {
  flagId: string
  sessionId: string
  type: FlagType
  severity: FlagSeverity
  timestamp: string
  durationSeconds?: number
  explanation: string
  autoResolved: boolean
  disputeStatus?: DisputeStatus
}

export type FlagType =
  | 'GAZE_AWAY'
  | 'TYPING_IDENTITY_DRIFT'
  | 'MULTIPLE_VOICES'
  | 'SYSTEMIC_EVENT'
  | 'DEVICE_INTEGRITY'

export type FlagSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type DisputeStatus =
  | 'NOT_DISPUTED'
  | 'DISPUTED'
  | 'AUTO_RESOLVED'
  | 'TIER2_APPROVED'
  | 'TIER2_REJECTED'
  | 'PANEL_APPROVED'
  | 'PANEL_REJECTED'

// Biometric Types
export interface BehavioralVector {
  timestamp: string
  gazeOnScreen: boolean
  gazeVector: [number, number, number]
  attentionScore: number
  offScreenDurationAccumulated: number
}

export interface KeystrokeBatch {
  batchId: number
  timestamp: string
  typingSimilarityToBaseline: number
  rhythmConsistency: number
  wordsPerMinute: number
}

// Transparency Log Types
export interface TransparencyLogEntry {
  id: number
  entryHash: string
  prevHash: string
  treeHash: string
  timestamp: string
  entryType: LogEntryType
  metadata: Record<string, string>
}

export type LogEntryType =
  | 'ENROLLMENT_CREATED'
  | 'EXAM_ACKNOWLEDGED'
  | 'EXAM_SESSION_STARTED'
  | 'EXAM_SESSION_COMPLETED'
  | 'DISPUTE_SUBMITTED'
  | 'DISPUTE_AUTO_RESOLVED'
  | 'DISPUTE_TIER2_RESOLVED'
  | 'DISPUTE_PANEL_RESOLVED'
  | 'CREDENTIAL_ISSUED'
  | 'CREDENTIAL_REVOKED'
