export type FlagType =
  | 'gaze_deviation'
  | 'face_absence'
  | 'multiple_faces'
  | 'audio_anomaly'
  | 'tab_switch'
  | 'copy_paste'
  | 'phone_detected'
  | 'unusual_keystroke_pattern'
  | 'head_pose_violation'
  | 'screen_share_detected'

export type FlagSeverity = 'low' | 'medium' | 'high' | 'critical'

export type RecommendedAction =
  | 'auto_resolved'
  | 'note_for_review'
  | 'flag_for_manual_review'
  | 'escalate_to_institution'

export type FlagReviewStatus =
  | 'pending'
  | 'reviewed'
  | 'disputed'
  | 'resolved'
  | 'overturned'

export interface AccommodationInfo {
  applied: boolean
  type?: string        // e.g. "Extended Time", "Low Light Mode"
  description?: string
  adjustmentFactor?: number
}

export interface ExplainableFlag {
  id: string
  sessionId: string
  type: FlagType
  severity: FlagSeverity
  timeRange: {
    start: number   // Unix ms
    end: number     // Unix ms
  }
  observedValue: string | number
  baselineValue: string | number
  policyThreshold: string | number
  adjustedThreshold: string | number
  accommodation: AccommodationInfo
  confidence: number     // 0–1
  explanation: string
  recommendedAction: RecommendedAction
  evidenceHashes?: string[]   // content-addressed hashes (Category B, never raw data)
  createdAt: string
}

export interface FlagExplanationResponse {
  sessionId: string
  studentDid: string
  examId: string
  examTitle: string
  institutionName: string
  sessionDate: string
  flags: ExplainableFlag[]
  totalFlags: number
  highSeverityCount: number
  reviewStatus: FlagReviewStatus
  disputeDeadline?: string
}

/** Human-readable display labels */
export const FLAG_TYPE_LABELS: Record<FlagType, string> = {
  gaze_deviation:             'Gaze Deviation',
  face_absence:               'Face Not Detected',
  multiple_faces:             'Multiple Faces',
  audio_anomaly:              'Audio Anomaly',
  tab_switch:                 'Tab / Window Switch',
  copy_paste:                 'Copy / Paste Event',
  phone_detected:             'Phone Detected',
  unusual_keystroke_pattern:  'Unusual Keystroke Pattern',
  head_pose_violation:        'Head Pose Violation',
  screen_share_detected:      'Screen Share Detected',
}

export const RECOMMENDED_ACTION_LABELS: Record<RecommendedAction, string> = {
  auto_resolved:            'Auto-resolved',
  note_for_review:          'Noted for review',
  flag_for_manual_review:   'Flagged for manual review',
  escalate_to_institution:  'Escalated to institution',
}