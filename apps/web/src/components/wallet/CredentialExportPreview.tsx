import type { VerifiableCredentialExport } from '@/types/credentialBridge'

interface CredentialExportPreviewProps {
  credential: VerifiableCredentialExport
}

export function CredentialExportPreview({ credential }: CredentialExportPreviewProps) {
  const { payload } = credential
  const prettyJson = JSON.stringify(payload, null, 2)
  const truncated = prettyJson.length > 1400
  const display = truncated ? prettyJson.slice(0, 1400) + '\n…' : prettyJson

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div
        className="rounded-card px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-3"
        style={{ background: 'var(--color-mahogany)', border: '1px solid var(--color-cedar)' }}
      >
        {[
          { label: 'Credential Type',  val: payload.type.filter(t => t !== 'VerifiableCredential').join(', ') },
          { label: 'Issued',           val: new Date(payload.issuanceDate).toLocaleDateString() },
          { label: 'Subject',          val: payload.credentialSubject.id.slice(0, 30) + '…' },
          { label: 'Exam',             val: payload.credentialSubject.examTitle },
          { label: 'Institution',      val: payload.credentialSubject.institutionName },
          { label: 'Proof Type',       val: payload.proof.type },
        ].map(({ label, val }) => (
          <div key={label}>
            <p className="label mb-0.5">{label}</p>
            <p className="text-sm truncate" style={{ color: 'var(--color-ceramic)', fontSize: 13 }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Raw JSON */}
      <div>
        <p className="label mb-2">Signed credential payload</p>
        <div
          className="rounded-card overflow-auto"
          style={{
            background: 'var(--color-espresso)',
            border: '1px solid var(--color-cedar)',
            maxHeight: 320,
          }}
        >
          <pre
            className="p-4 text-xs leading-relaxed whitespace-pre"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-ceramic)', fontSize: 12 }}
          >
            {display}
          </pre>
        </div>
        {truncated && (
          <p className="text-xs mt-1" style={{ color: 'var(--color-taupe)', fontSize: 11 }}>
            Showing first 1400 chars. Download the file to view the full credential.
          </p>
        )}
      </div>
    </div>
  )
}