import { useQuery } from '@tanstack/react-query'
import { apiClient } from './client'
import type {
  CredentialBridgeOptions,
  CredentialExportResult,
  ExportFormat,
  QrVerificationLink,
  QrVerificationResult,
} from '@/types/credentialBridge'

export async function fetchBridgeOptions(
  credentialId: string,
): Promise<CredentialBridgeOptions> {
  const { data } = await apiClient.get<CredentialBridgeOptions>(
    `/api/credential-bridge/${encodeURIComponent(credentialId)}/options`,
  )
  return data
}

export async function fetchCredentialExport(
  credentialId: string,
  format: ExportFormat,
): Promise<CredentialExportResult> {
  const { data } = await apiClient.get<CredentialExportResult>(
    `/api/credential-bridge/${encodeURIComponent(credentialId)}/export`,
    { params: { format } },
  )
  return data
}

export async function fetchQrLink(credentialId: string): Promise<QrVerificationLink> {
  const { data } = await apiClient.get<QrVerificationLink>(
    `/api/credential-bridge/${encodeURIComponent(credentialId)}/qr`,
  )
  return data
}

export async function verifyCredential(
  credentialId: string,
): Promise<QrVerificationResult> {
  const { data } = await apiClient.get<QrVerificationResult>(
    `/api/credential-bridge/verify/${encodeURIComponent(credentialId)}`,
  )
  return data
}

export function useBridgeOptions(credentialId: string) {
  return useQuery({
    queryKey: ['bridge', 'options', credentialId],
    queryFn: () => fetchBridgeOptions(credentialId),
    enabled: Boolean(credentialId),
  })
}
