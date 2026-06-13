// apps/web/src/lib/wallet/walletPassLinks.ts
import type { VerifiableCredentialExport, LinkedInSharePayload } from '@/types/credentialBridge'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.examidentity.app'
const API_URL  = process.env.NEXT_PUBLIC_API_URL  ?? 'http://localhost:3001'

/**
 * Build the Apple Wallet .pkpass download URL.
 * The API generates and signs the pass, this just constructs the redirect URL.
 */
export function buildAppleWalletUrl(credentialId: string): string {
  return `${API_URL}/api/credential-bridge/${credentialId}/apple-pass`
}

/**
 * Build the Google Wallet JWT save URL.
 * Opens the Google Wallet "add pass" flow directly.
 */
export function buildGoogleWalletUrl(credentialId: string): string {
  return `${API_URL}/api/credential-bridge/${credentialId}/google-wallet`
}

/**
 * Build the LinkedIn Add Credential URL.
 * Prepopulates the LinkedIn certification form with credential metadata.
 */
export function buildLinkedInShareUrl(
  credential: VerifiableCredentialExport
): string {
  const subject   = credential.payload.credentialSubject
  const issueDate = new Date(credential.issuedAt)
  const certUrl   = `${BASE_URL}/verify/${credential.credentialId}`

  const params = new URLSearchParams({
    startTask:      'CERTIFICATION_NAME',
    name:           subject.examTitle ?? 'Exam Integrity Credential',
    issueYear:      issueDate.getFullYear().toString(),
    issueMonth:     (issueDate.getMonth() + 1).toString(),
    certUrl,
    certId:         credential.credentialId,
  })

  return `https://www.linkedin.com/profile/add?${params.toString()}`
}

/**
 * Build an OID4VCI credential offer deep-link.
 * Compatible with Lissi, Wallet.io, and other OID4VCI wallets.
 */
export function buildOID4VCIDeepLink(credentialId: string): string {
  const offerUri = encodeURIComponent(
    `${API_URL}/api/credential-bridge/${credentialId}/oid4vci-offer`
  )
  return `openid-credential-offer://?credential_offer_uri=${offerUri}`
}

/**
 * Build a time-limited public verification URL.
 * Anyone with this URL can verify the credential's validity without seeing personal data.
 */
export function buildPublicVerifyUrl(credentialId: string, shortCode?: string): string {
  if (shortCode) return `${BASE_URL}/verify/${shortCode}`
  return `${BASE_URL}/verify/${credentialId}`
}

/**
 * Assemble a complete LinkedInSharePayload from a VC export.
 */
export function buildLinkedInPayload(credential: VerifiableCredentialExport): LinkedInSharePayload {
  const subject = credential.payload.credentialSubject
  return {
    title:        subject.examTitle ?? 'ExamIdentity Credential',
    description:  `Integrity-verified exam credential from ${subject.institutionName ?? 'institution'}, issued via ExamIdentity.`,
    certUrl:      buildPublicVerifyUrl(credential.credentialId),
    credentialId: credential.credentialId,
    issuedAt:     credential.issuedAt,
  }
}