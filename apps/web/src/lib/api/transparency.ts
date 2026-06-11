// apps/web/src/lib/api/transparency.ts
import axios from 'axios'
import type {
  TransparencySnapshot,
  PublicMetrics,
  FlagRateByCategory,
  DisputeOutcomeByMonth,
  DeletionComplianceRecord,
  ModelDriftDetail,
  TransparencyLogDetail,
} from '@/types/transparency'

// Public endpoints — no auth required
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  timeout: 10_000,
})

/**
 * Fetch the full transparency snapshot in one request.
 * All data is anonymised and aggregated — no student PII.
 */
export async function getTransparencySnapshot(): Promise<TransparencySnapshot> {
  const { data } = await client.get<TransparencySnapshot>('/api/transparency/snapshot')
  return data
}

/**
 * Fetch top-level public metrics only (for lightweight embeds / widgets).
 */
export async function getPublicMetrics(): Promise<PublicMetrics> {
  const { data } = await client.get<PublicMetrics>('/api/transparency/metrics')
  return data
}

/**
 * Fetch flag rates broken down by category (flag type).
 */
export async function getFlagRateByCategory(): Promise<FlagRateByCategory[]> {
  const { data } = await client.get<FlagRateByCategory[]>('/api/transparency/flag-rates')
  return data
}

/**
 * Fetch monthly dispute outcome data for the rolling 12-month window.
 */
export async function getDisputeOutcomes(): Promise<DisputeOutcomeByMonth[]> {
  const { data } = await client.get<DisputeOutcomeByMonth[]>('/api/transparency/dispute-outcomes')
  return data
}

/**
 * Fetch evidence deletion compliance records.
 */
export async function getDeletionCompliance(): Promise<DeletionComplianceRecord[]> {
  const { data } = await client.get<DeletionComplianceRecord[]>('/api/transparency/deletion-compliance')
  return data
}

/**
 * Fetch model drift status and detail.
 */
export async function getModelDrift(): Promise<ModelDriftDetail> {
  const { data } = await client.get<ModelDriftDetail>('/api/transparency/model-drift')
  return data
}

/**
 * Fetch transparency log health and chain detail.
 */
export async function getLogHealth(): Promise<TransparencyLogDetail> {
  const { data } = await client.get<TransparencyLogDetail>('/api/transparency/log-health')
  return data
}

// ── Mock data for development / Storybook ───────────────────────

export function getMockTransparencySnapshot(): TransparencySnapshot {
  return {
    metrics: {
      totalExamsProtected:             18_432,
      credentialsIssued:               17_890,
      flagRate:                        12.4,
      disputesFiled:                   341,
      disputesAutoResolved:            198,
      disputesOverturned:              67,
      avgResolutionTimeDays:           2.3,
      accommodationAdjustedSessions:   2_104,
      systemicEvents:                  2,
      evidenceDeletionComplianceRate:  99.6,
      modelDriftStatus:                'stable',
      transparencyLogHealth:           'healthy',
      lastUpdatedAt:                   new Date().toISOString(),
      snapshotPeriod: {
        from: new Date(Date.now() - 90 * 86400_000).toISOString(),
        to:   new Date().toISOString(),
      },
    },
    flagRateByCategory: [
      { category: 'Gaze Deviation',     rate: 4.1, count: 755,  period: 'Last 90 days' },
      { category: 'Tab Switch',         rate: 3.2, count: 589,  period: 'Last 90 days' },
      { category: 'Audio Anomaly',      rate: 2.0, count: 368,  period: 'Last 90 days' },
      { category: 'Face Absence',       rate: 1.5, count: 276,  period: 'Last 90 days' },
      { category: 'Copy / Paste',       rate: 0.9, count: 166,  period: 'Last 90 days' },
      { category: 'Multiple Faces',     rate: 0.5, count: 92,   period: 'Last 90 days' },
      { category: 'Phone Detected',     rate: 0.2, count: 37,   period: 'Last 90 days' },
    ],
    disputeOutcomes: [
      { month: 'Oct',  filed: 28, autoResolved: 16, overturned: 6,  upheld: 6  },
      { month: 'Nov',  filed: 31, autoResolved: 18, overturned: 7,  upheld: 6  },
      { month: 'Dec',  filed: 22, autoResolved: 14, overturned: 4,  upheld: 4  },
      { month: 'Jan',  filed: 35, autoResolved: 21, overturned: 8,  upheld: 6  },
      { month: 'Feb',  filed: 40, autoResolved: 24, overturned: 9,  upheld: 7  },
      { month: 'Mar',  filed: 38, autoResolved: 22, overturned: 9,  upheld: 7  },
      { month: 'Apr',  filed: 44, autoResolved: 26, overturned: 10, upheld: 8  },
      { month: 'May',  filed: 33, autoResolved: 19, overturned: 7,  upheld: 7  },
      { month: 'Jun',  filed: 29, autoResolved: 17, overturned: 7,  upheld: 5  },
    ],
    deletionCompliance: [
      { period: 'Jan', scheduled: 420, completed: 420, complianceRate: 100,  lateCompletions: 0 },
      { period: 'Feb', scheduled: 384, completed: 382, complianceRate: 99.5, lateCompletions: 2 },
      { period: 'Mar', scheduled: 510, completed: 509, complianceRate: 99.8, lateCompletions: 1 },
      { period: 'Apr', scheduled: 468, completed: 467, complianceRate: 99.8, lateCompletions: 1 },
      { period: 'May', scheduled: 392, completed: 391, complianceRate: 99.7, lateCompletions: 1 },
      { period: 'Jun', scheduled: 445, completed: 443, complianceRate: 99.5, lateCompletions: 2 },
    ],
    modelDrift: {
      status:                   'stable',
      lastCheckedAt:            new Date().toISOString(),
      falsePositiveRateDelta:   0.002,
      falseNegativeRateDelta:   -0.001,
      baselineVersion:          'v2.1.0',
      currentVersion:           'v2.1.0',
      flagsAuditedThisCycle:    1_200,
      description:              'No significant change from baseline. False positive rate delta within normal variance.',
    },
    logDetail: {
      health:          'healthy',
      lastEntryAt:     new Date().toISOString(),
      totalEntries:    18_432,
      verifiedEntries: 18_425,
      integrityRate:   99.96,
      latestBlockHash: '0x4a8f2c9b1d3e6f7a…',
      chainLength:     18_432,
    },
  }
}