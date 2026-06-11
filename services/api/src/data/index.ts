// Repository selection: picks the mock or Postgres implementation based on
// config.dataSource. All feature code imports the repositories from here.

import { config } from '../config'
import {
  mockCredentialRepository,
  mockSessionRepository,
  mockStudentRepository,
  mockUniversityRepository,
} from './mockStore'
import {
  pgCredentialRepository,
  pgSessionRepository,
  pgStudentRepository,
  pgUniversityRepository,
} from './pgRepository'
import type {
  CredentialRepository,
  SessionRepository,
  StudentRepository,
  UniversityRepository,
} from './types'

const usePostgres = config.dataSource === 'postgres'

export const sessionRepository: SessionRepository = usePostgres
  ? pgSessionRepository
  : mockSessionRepository

export const credentialRepository: CredentialRepository = usePostgres
  ? pgCredentialRepository
  : mockCredentialRepository

export const universityRepository: UniversityRepository = usePostgres
  ? pgUniversityRepository
  : mockUniversityRepository

export const studentRepository: StudentRepository = usePostgres
  ? pgStudentRepository
  : mockStudentRepository

export type {
  SessionRecord,
  CredentialRecord,
  StudentRecord,
  UniversityRecord,
  NewStudent,
  NewSession,
  SessionRepository,
  CredentialRepository,
  StudentRepository,
  UniversityRepository,
} from './types'
