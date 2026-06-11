// apps/web/src/lib/api/credentialBridge.ts
import axios from 'axios'
import type {
  ExportFormat,
  VerifiableCredentialExport,
  QRVerificationLink,
  WalletPassLink,
  OID4VCICredentialOffer,
} from '@/types/credentialBridge'

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  withCredentials: true,
  timeout: 15_000,
})

client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('ei_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Export a credential in the requested format.
 * For vc_json: returns the signed W3C VC payload.
 * For wallet formats: returns the VC payload + a pass generation URL.
 */
export async function exportCredential(
  credentialId: string,
  format: ExportFormat
): Promise<VerifiableCredentialExport> {
  const { data } = await client.post<VerifiableCredentialExport>(
    `/api/credential-bridge/${credentialId}/export`,
    { format }
  )
  return data
}

/**
 * Generate a time-limited QR verification URL for a credential.
 * The URL points to a public verifier endpoint — no auth required to verify.
 */
export async function getQRLink(credentialId: string): Promise<QRVerificationLink> {
  const { data } = await client.post<QRVerificationLink>(
    `/api/credential-bridge/${credentialId}/qr-link`
  )
  return data
}

/**
 * Generate an Apple or Google Wallet pass link for a credential.
 */
export async function getWalletPassLink(
  credentialId: string,
  platform: 'apple' | 'google'
): Promise<WalletPassLink> {
  const { data } = await client.post<WalletPassLink>(
    `/api/credential-bridge/${credentialId}/wallet-pass`,
    { platform }
  )
  return data
}

/**
 * Generate an OID4VCI credential offer URI.
 * The returned URI can be encoded as a QR code or deep-linked to a compatible wallet.
 */
export async function getOID4VCIOffer(credentialId: string): Promise<OID4VCICredentialOffer> {
  const { data } = await client.post<OID4VCICredentialOffer>(
    `/api/credential-bridge/${credentialId}/oid4vci-offer`
  )
  return data
}

/**
 * Publicly accessible endpoint — verify a credential by its ID.
 * Does not require auth. Returns verification result only, no personal data.
 */
export async function verifyCredentialPublic(
  credentialId: string
): Promise<{ valid: boolean; reason?: string; checkedAt: string }> {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/api/credential-bridge/verify/${credentialId}`
  )
  return data
}