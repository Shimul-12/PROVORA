// Repository contracts shared by the mock and Postgres implementations.
// Routes and services depend only on these async interfaces, so the data
// source can be swapped via config without touching feature code.

import type { ExamCredential } from '@examidentity/shared-types'

export interface SessionRecord {
  sessionId: string
  examId: string
  examName: string
  studentDid: string
  universityId: string
  state: string
  accommodation: string
  /** Present once scored. */
  integrityScoreBand?: 'HIGH' | 'MEDIUM' | 'LOW'
  /** Present once the exam has started. */
  startedAt?: string
  completedAt?: string
}

export interface NewSession {
  sessionId: string
  examId: string
  examName: string
  studentDid: string
  universityId: string
  accommodation: string
  state: string
}

export interface CredentialRecord {
  credential: ExamCredential
  status: 'ACTIVE' | 'REVOKED'
  credentialHash: string
}

export interface UniversityRecord {
  universityId: string
  name: string
  did: string
  createdAt: string
}

export interface StudentRecord {
  did: string
  universityId: string
  universityDid: string
  publicKey: string
  /** Encrypted private key for STANDARD custody; null for SELF_CUSTODY. */
  encryptedKey: string | null
  custodyTier: 'SELF_CUSTODY' | 'STANDARD'
  accommodation: string
  createdAt: string
  updatedAt: string
}

export interface NewStudent {
  did: string
  universityId: string
  universityDid: string
  publicKey: string
  encryptedKey: string | null
  custodyTier: 'SELF_CUSTODY' | 'STANDARD'
  accommodation: string
}

export interface SessionRepository {
  list(): Promise<SessionRecord[]>
  findById(sessionId: string): Promise<SessionRecord | undefined>
  create(input: NewSession): Promise<SessionRecord>
  /** Update state and optionally stamp started/completed timestamps. */
  updateState(
    sessionId: string,
    state: string,
    stamps?: { startedAt?: string; completedAt?: string },
  ): Promise<SessionRecord | undefined>
}

export interface CredentialRepository {
  list(): Promise<CredentialRecord[]>
  findById(credentialId: string): Promise<CredentialRecord | undefined>
}

export interface UniversityRepository {
  list(): Promise<UniversityRecord[]>
  findById(universityId: string): Promise<UniversityRecord | undefined>
}

export interface StudentRepository {
  create(input: NewStudent): Promise<StudentRecord>
  findByDid(did: string): Promise<StudentRecord | undefined>
}
