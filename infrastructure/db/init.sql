-- ExamIdentity Database Schema
-- Category A: Student Personal Data
-- Category B: Exam Integrity Evidence  
-- Category C: Institutional Exam Data

-- ==========================================
-- CATEGORY A TABLES (Student Personal Data)
-- ==========================================

CREATE TABLE IF NOT EXISTS students (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    did             VARCHAR(255) UNIQUE NOT NULL,
    university_id   VARCHAR(255) NOT NULL,
    university_did  VARCHAR(255) NOT NULL,
    encrypted_key   TEXT,
    public_key      TEXT NOT NULL,
    custody_tier    VARCHAR(20) NOT NULL DEFAULT 'STANDARD',
    accommodation   VARCHAR(50) NOT NULL DEFAULT 'NONE',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credentials (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_did     VARCHAR(255) NOT NULL REFERENCES students(did),
    credential_type VARCHAR(100) NOT NULL,
    credential_json JSONB NOT NULL,
    credential_hash VARCHAR(64) NOT NULL UNIQUE,
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    revoked_at      TIMESTAMPTZ
);

-- ==========================================
-- CATEGORY B TABLES (Neutral Escrow Evidence)
-- ==========================================

CREATE TABLE IF NOT EXISTS evidence_escrow (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          UUID NOT NULL,
    escrow_id           VARCHAR(100) UNIQUE NOT NULL,
    encrypted_payload   TEXT NOT NULL,
    student_key_ref     VARCHAR(255) NOT NULL,
    platform_key_ref    VARCHAR(255) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ NOT NULL,
    decrypted_at        TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ
);

-- ==========================================
-- CATEGORY C TABLES (Institutional Data)
-- ==========================================

CREATE TABLE IF NOT EXISTS exam_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          VARCHAR(100) UNIQUE NOT NULL,
    exam_id             VARCHAR(255) NOT NULL,
    student_did         VARCHAR(255) NOT NULL REFERENCES students(did),
    university_id       VARCHAR(255) NOT NULL,
    state               VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    integrity_score     INTEGER,
    score_band          VARCHAR(10),
    started_at          TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    device_fingerprint  VARCHAR(255),
    escrow_id           VARCHAR(100),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flags (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_id             VARCHAR(100) UNIQUE NOT NULL,
    session_id          UUID NOT NULL REFERENCES exam_sessions(id),
    flag_type           VARCHAR(50) NOT NULL,
    severity            VARCHAR(20) NOT NULL,
    timestamp_in_exam   TIMESTAMPTZ NOT NULL,
    duration_seconds    DECIMAL(8,2),
    explanation         TEXT NOT NULL,
    auto_resolved       BOOLEAN NOT NULL DEFAULT FALSE,
    dispute_status      VARCHAR(30) NOT NULL DEFAULT 'NOT_DISPUTED',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disputes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id          VARCHAR(100) UNIQUE NOT NULL,
    flag_id             VARCHAR(100) NOT NULL REFERENCES flags(flag_id),
    student_did         VARCHAR(255) NOT NULL,
    reason              VARCHAR(100) NOT NULL,
    context             TEXT,
    tier                INTEGER NOT NULL DEFAULT 1,
    status              VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    ai_recommendation   VARCHAR(20),
    ai_confidence       DECIMAL(4,2),
    reviewer_id         VARCHAR(100),
    reviewer_reasoning  TEXT,
    resolved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- TRANSPARENCY LOG (Public Audit Trail)
-- ==========================================

CREATE TABLE IF NOT EXISTS transparency_log (
    id              BIGSERIAL PRIMARY KEY,
    entry_hash      VARCHAR(64) NOT NULL UNIQUE,
    prev_hash       VARCHAR(64) NOT NULL,
    tree_hash       VARCHAR(64) NOT NULL,
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    entry_type      VARCHAR(50) NOT NULL,
    student_did     VARCHAR(255),
    exam_id         VARCHAR(255),
    escrow_id       VARCHAR(100),
    metadata        JSONB NOT NULL DEFAULT '{}'
    -- NO personal data stored here
    -- Only hashes and non-identifying references
);

-- First entry (genesis)
INSERT INTO transparency_log 
    (entry_hash, prev_hash, tree_hash, entry_type, metadata)
VALUES 
    (
        encode(sha256('EXAMIDENTITY_GENESIS_2024'::bytea), 'hex'),
        '0000000000000000000000000000000000000000000000000000000000000000',
        encode(sha256('EXAMIDENTITY_GENESIS_2024'::bytea), 'hex'),
        'GENESIS',
        '{"version": "1.0", "created": "2024-01-01"}'
    );

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_students_did ON students(did);
CREATE INDEX idx_students_university ON students(university_id);
CREATE INDEX idx_credentials_student ON credentials(student_did);
CREATE INDEX idx_sessions_student ON exam_sessions(student_did);
CREATE INDEX idx_sessions_exam ON exam_sessions(exam_id);
CREATE INDEX idx_flags_session ON flags(session_id);
CREATE INDEX idx_disputes_flag ON disputes(flag_id);
CREATE INDEX idx_log_timestamp ON transparency_log(timestamp);
CREATE INDEX idx_log_entry_type ON transparency_log(entry_type);
CREATE INDEX idx_log_student ON transparency_log(student_did);

-- ==========================================
-- ROW LEVEL SECURITY (Multi-tenancy)
-- ==========================================

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE evidence_escrow IS 'Category B: Neutral exam integrity evidence. Dual-key encrypted. 90-day retention.';
COMMENT ON TABLE transparency_log IS 'Public audit log. Contains hashes only. No personal data.';

SELECT 'ExamIdentity schema initialized successfully' AS status;
