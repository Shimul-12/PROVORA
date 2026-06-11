// Postgres-backed repository implementations.
//
// Queries the schema from infrastructure/db/init.sql (+ the columns added by
// infrastructure/db/seed.sql: exam_sessions.exam_name and
// exam_sessions.accommodation). Maps rows to the shared record types.

import type { ExamCredential } from '@examidentity/shared-types'
import { query } from './db'
import type {
  CredentialRecord,
  CredentialRepository,
  NewSession,
  NewStudent,
  SessionRecord,
  SessionRepository,
  StudentRecord,
  StudentRepository,
  UniversityRecord,
  UniversityRepository,
} from './types'

interface SessionRow {
  session_id: string
  exam_id: string
  exam_name: string | null
  student_did: string
  university_id: string
  state: string
  accommodation: string | null
  score_band: string | null
  started_at: Date | null
  completed_at: Date | null
}

function toIso(d: Date | null | undefined): string {
  return d ? new Date(d).toISOString() : ''
}

function mapSession(row: SessionRow): SessionRecord {
  return {
    sessionId: row.session_id,
    examId: row.exam_id,
    examName: row.exam_name ?? row.exam_id,
    studentDid: row.student_did,
    universityId: row.university_id,
    state: row.state,
    accommodation: row.accommodation ?? 'NONE',
    integrityScoreBand: (row.score_band as SessionRecord['integrityScoreBand']) ?? undefined,
    startedAt: row.started_at ? toIso(row.started_at) : undefined,
    completedAt: row.completed_at ? toIso(row.completed_at) : undefined,
  }
}

const SESSION_SELECT = `
  SELECT s.session_id, s.exam_id, s.exam_name, s.student_did, s.university_id,
         s.state, s.accommodation, s.score_band, s.started_at, s.completed_at
  FROM exam_sessions s
`

export const pgSessionRepository: SessionRepository = {
  async list() {
    const rows = await query<SessionRow>(`${SESSION_SELECT} ORDER BY s.created_at`)
    return rows.map(mapSession)
  },
  async findById(sessionId) {
    const rows = await query<SessionRow>(`${SESSION_SELECT} WHERE s.session_id = $1`, [
      sessionId,
    ])
    return rows[0] ? mapSession(rows[0]) : undefined
  },
  async create(input: NewSession) {
    const rows = await query<SessionRow>(
      `INSERT INTO exam_sessions
         (session_id, exam_id, exam_name, student_did, university_id, state, accommodation)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING session_id, exam_id, exam_name, student_did, university_id,
                 state, accommodation, score_band, started_at, completed_at`,
      [
        input.sessionId,
        input.examId,
        input.examName,
        input.studentDid,
        input.universityId,
        input.state,
        input.accommodation,
      ],
    )
    return mapSession(rows[0])
  },
  async updateState(sessionId, state, stamps) {
    const rows = await query<SessionRow>(
      `UPDATE exam_sessions
         SET state = $2,
             started_at = COALESCE($3, started_at),
             completed_at = COALESCE($4, completed_at)
       WHERE session_id = $1
       RETURNING session_id, exam_id, exam_name, student_did, university_id,
                 state, accommodation, score_band, started_at, completed_at`,
      [sessionId, state, stamps?.startedAt ?? null, stamps?.completedAt ?? null],
    )
    return rows[0] ? mapSession(rows[0]) : undefined
  },
}

interface CredentialRow {
  credential_json: ExamCredential
  credential_hash: string
  status: string
}

function mapCredential(row: CredentialRow): CredentialRecord {
  return {
    credential: row.credential_json,
    credentialHash: row.credential_hash,
    status: row.status === 'REVOKED' ? 'REVOKED' : 'ACTIVE',
  }
}

export const pgCredentialRepository: CredentialRepository = {
  async list() {
    const rows = await query<CredentialRow>(
      `SELECT credential_json, credential_hash, status FROM credentials ORDER BY issued_at`,
    )
    return rows.map(mapCredential)
  },
  async findById(credentialId) {
    // The credential id lives inside the JSONB document.
    const rows = await query<CredentialRow>(
      `SELECT credential_json, credential_hash, status
       FROM credentials
       WHERE credential_json->>'id' = $1
       LIMIT 1`,
      [credentialId],
    )
    return rows[0] ? mapCredential(rows[0]) : undefined
  },
}

// ---- Universities ---------------------------------------------------------

interface UniversityRow {
  university_id: string
  name: string
  did: string
  created_at: Date
}

export const pgUniversityRepository: UniversityRepository = {
  async list() {
    const rows = await query<UniversityRow>(
      `SELECT university_id, name, did, created_at FROM universities ORDER BY name`,
    )
    return rows.map((r) => ({
      universityId: r.university_id,
      name: r.name,
      did: r.did,
      createdAt: toIso(r.created_at),
    }))
  },
  async findById(universityId) {
    const rows = await query<UniversityRow>(
      `SELECT university_id, name, did, created_at FROM universities WHERE university_id = $1`,
      [universityId],
    )
    const r = rows[0]
    return r
      ? { universityId: r.university_id, name: r.name, did: r.did, createdAt: toIso(r.created_at) }
      : undefined
  },
}

// ---- Students -------------------------------------------------------------

interface StudentRow {
  did: string
  university_id: string
  university_did: string
  public_key: string
  encrypted_key: string | null
  custody_tier: string
  accommodation: string
  created_at: Date
  updated_at: Date
}

function mapStudent(row: StudentRow): StudentRecord {
  return {
    did: row.did,
    universityId: row.university_id,
    universityDid: row.university_did,
    publicKey: row.public_key,
    encryptedKey: row.encrypted_key,
    custodyTier: row.custody_tier === 'STANDARD' ? 'STANDARD' : 'SELF_CUSTODY',
    accommodation: row.accommodation,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  }
}

export const pgStudentRepository: StudentRepository = {
  async create(input: NewStudent) {
    const rows = await query<StudentRow>(
      `INSERT INTO students
         (did, university_id, university_did, encrypted_key, public_key, custody_tier, accommodation)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING did, university_id, university_did, public_key, encrypted_key,
                 custody_tier, accommodation, created_at, updated_at`,
      [
        input.did,
        input.universityId,
        input.universityDid,
        input.encryptedKey,
        input.publicKey,
        input.custodyTier,
        input.accommodation,
      ],
    )
    return mapStudent(rows[0])
  },
  async findByDid(did) {
    const rows = await query<StudentRow>(
      `SELECT did, university_id, university_did, public_key, encrypted_key,
              custody_tier, accommodation, created_at, updated_at
       FROM students WHERE did = $1`,
      [did],
    )
    return rows[0] ? mapStudent(rows[0]) : undefined
  },
}
