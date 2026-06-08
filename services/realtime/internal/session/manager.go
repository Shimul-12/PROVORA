package session

// SessionManager manages active exam sessions
type SessionManager struct {
    sessions map[string]*ExamSession
}

// ExamSession represents an active exam
type ExamSession struct {
    SessionID  string
    StudentDID string
    ExamID     string
    State      string
}

func NewSessionManager() *SessionManager {
    return &SessionManager{
        sessions: make(map[string]*ExamSession),
    }
}
