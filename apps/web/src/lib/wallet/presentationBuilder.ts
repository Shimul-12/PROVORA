// apps/web/src/lib/wallet/presentationBuilder.ts
import type { VerifiableCredentialPayload } from '@/types/credentialBridge'

export interface VerifiablePresentation {
  '@context': string[]
  type: string[]
  id: string
  holder: string
  verifiableCredential: VerifiableCredentialPayload[]
  proof?: {
    type: string
    created: string
    challenge?: string
    domain?: string
    proofPurpose: string
    verificationMethod: string
    proofValue: string
  }
}

export interface PresentationRequestOptions {
  holderDid:   string
  credentials: VerifiableCredentialPayload[]
  challenge?:  string
  domain?:     string
}

/**
 * Assemble an unsigned Verifiable Presentation envelope from one or more credentials.
 * Signing should happen server-side via the Veramo SDK — this just builds the unsigned payload.
 */
export function buildUnsignedPresentation(
  opts: PresentationRequestOptions
): Omit<VerifiablePresentation, 'proof'> {
  return {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://examidentity.app/contexts/v1',
    ],
    type:                  ['VerifiablePresentation'],
    id:                    `urn:uuid:${crypto.randomUUID()}`,
    holder:                opts.holderDid,
    verifiableCredential:  opts.credentials,
  }
}

/**
 * Serialize a presentation to a URL-safe JWT-like string for QR / deep-link transport.
 * NOTE: This is the unsigned envelope only — signing happens via Veramo on the API.
 */
export function serializePresentationForTransport(
  vp: Omit<VerifiablePresentation, 'proof'>
): string {
  const json  = JSON.stringify(vp)
  const bytes = new TextEncoder().encode(json)
  const bin   = Array.from(bytes).map(b => String.fromCharCode(b)).join('')
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Build the deep-link URL for OID4VP (OpenID for Verifiable Presentations) presentation.
 * Used when a verifier requests credential presentation.
 */
export function buildOID4VPResponseUri(
  vp: Omit<VerifiablePresentation, 'proof'>,
  redirectUri: string
): string {
  const vpToken = serializePresentationForTransport(vp)
  const params  = new URLSearchParams({
    vp_token:   vpToken,
    state:      crypto.randomUUID(),
  })
  return `${redirectUri}?${params.toString()}`
}