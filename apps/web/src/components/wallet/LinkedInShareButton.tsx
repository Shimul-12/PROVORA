// ── LinkedInShareButton ──────────────────────────────────────────
import type { LinkedInSharePayload } from '@/types/credentialBridge'

interface LinkedInShareButtonProps {
  payload: LinkedInSharePayload
  isStub?: boolean
}

export function LinkedInShareButton({ payload, isStub }: LinkedInShareButtonProps) {
  function handleShare() {
    if (isStub) {
      alert('LinkedIn share is a demo stub in this MVP. The URL would open the LinkedIn Add Credential flow.')
      return
    }
    const params = new URLSearchParams({
      startTask: 'CERTIFICATION_NAME',
      name:      payload.title,
      organizationId: payload.organizationId ?? '',
      issueYear:  new Date(payload.issuedAt).getFullYear().toString(),
      issueMonth: (new Date(payload.issuedAt).getMonth() + 1).toString(),
      certUrl:    payload.certUrl,
      certId:     payload.credentialId,
    })
    window.open(`https://www.linkedin.com/profile/add?${params}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      className="btn-ghost w-full flex items-center justify-center gap-2.5"
      onClick={handleShare}
      style={{ padding: '12px 20px' }}
    >
      {/* LinkedIn icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      Add to LinkedIn
      {isStub && <span className="badge badge-neutral" style={{ fontSize: 9, padding: '1px 5px' }}>Demo</span>}
    </button>
  )
}

// ── AppleWalletPassButton ────────────────────────────────────────
interface AppleWalletPassButtonProps {
  passUrl: string
  isStub?: boolean
}

export function AppleWalletPassButton({ passUrl, isStub }: AppleWalletPassButtonProps) {
  function handleAdd() {
    if (isStub) {
      alert('Apple Wallet pass generation is a demo stub in this MVP.')
      return
    }
    window.location.href = passUrl
  }

  return (
    <button
      className="w-full flex items-center justify-center gap-2.5 rounded-md font-semibold transition-all"
      style={{
        background: 'var(--color-ivory)',
        color: '#000',
        border: '1px solid var(--color-bark)',
        padding: '12px 20px',
        fontSize: 14,
        cursor: 'pointer',
      }}
      onClick={handleAdd}
    >
      {/* Apple icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
      </svg>
      Add to Apple Wallet
      {isStub && <span className="badge badge-neutral" style={{ fontSize: 9, padding: '1px 5px' }}>Demo</span>}
    </button>
  )
}

// ── GoogleWalletPassButton ───────────────────────────────────────
interface GoogleWalletPassButtonProps {
  passUrl: string
  isStub?: boolean
}

export function GoogleWalletPassButton({ passUrl, isStub }: GoogleWalletPassButtonProps) {
  function handleAdd() {
    if (isStub) {
      alert('Google Wallet pass generation is a demo stub in this MVP.')
      return
    }
    window.open(passUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      className="w-full flex items-center justify-center gap-2.5 rounded-md font-semibold transition-all"
      style={{
        background: 'var(--color-slate-dim)',
        color: 'var(--color-ivory)',
        border: '1px solid var(--color-slate-blue)',
        padding: '12px 20px',
        fontSize: 14,
        cursor: 'pointer',
      }}
      onClick={handleAdd}
    >
      {/* Google G icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Add to Google Wallet
      {isStub && <span className="badge badge-neutral" style={{ fontSize: 9, padding: '1px 5px' }}>Demo</span>}
    </button>
  )
}