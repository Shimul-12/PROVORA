// Cross-Platform Credential Bridge — web types.
// Mirrors packages/shared-types/src/credentialBridge.ts (+ the credential shape).

export type ExportFormat = 'VC_JSON' | 'VC_JWT' | 'VP_JSON' | 'QR' | 'PDF'

export type WalletTarget =
  | 'DOWNLOAD_JSON'
  | 'QR_LINK'
  | 'APPLE_WALLET'
  | 'GOOGLE_WALLET'
  | 'LINKEDIN'
  | 'OID4VCI'

export interface ExamCredentialSubject {
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

export interface ExamCredential {
  id: string
  type: string[]
  issuer: string
  issuanceDate: string
  credentialSubject: ExamCredentialSubject
  proof?: Record<string, unknown>
}

export interface CredentialExportResult {
  credentialId: string
  format: ExportFormat
  filename: string
  mimeType: string
  payload: string
  createdAt: string
}

export interface QrVerificationLink {
  credentialId: string
  verificationUrl: string
  qrPayload: string
  qrImageDataUrl?: string
  expiresAt: string
  oneTime: boolean
}

export type VerificationStatus = 'VALID' | 'EXPIRED' | 'REVOKED' | 'TAMPERED' | 'UNKNOWN'

export interface QrVerificationResult {
  credentialId: string
  verified: boolean
  status: VerificationStatus
  issuer: string
  subjectSummary: string
  issuedAt: string
  checkedAt: string
  privacyProofVerified: boolean
}

export interface WalletPassLink {
  target: WalletTarget
  label: string
  url: string
  available: boolean
  note?: string
}

export interface CredentialBridgeOptions {
  credentialId: string
  credentialType: string
  examName: string
  issuingInstitution: string
  supportedFormats: ExportFormat[]
  passLinks: WalletPassLink[]
  qr: QrVerificationLink
}
