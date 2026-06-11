import type { ExamCredential } from '@/types/credentialBridge'

export interface VerifiablePresentation {
  '@context': string[]
  type: string[]
  holder: string
  verifiableCredential: ExamCredential[]
  proof?: Record<string, unknown>
}

/**
 * Build an (unsigned) W3C Verifiable Presentation around a credential on the
 * client. Signing happens server-side via the credential bridge API; this is a
 * convenience for previewing the presentation shape before export.
 */
export function buildPresentation(
  credential: ExamCredential,
  holderDid?: string,
): VerifiablePresentation {
  return {
    '@context': [
      'https://www.w3.org/ns/credentials/v2',
      'https://www.w3.org/2018/credentials/v1',
    ],
    type: ['VerifiablePresentation'],
    holder: holderDid ?? credential.credentialSubject.id,
    verifiableCredential: [credential],
  }
}
