export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  brideName: string;
  groomName: string;
  coupleInitials: string;
  weddingDate: string;
  weddingDateISO?: string;
  location: string;
  role: 'couple' | 'admin';
  status: 'active' | 'suspended';
  hasBooking: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  userEmail: string;
}

export type AuditEventType =
  | 'REGISTER'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'PASSWORD_RESET'
  | 'LOGOUT'
  | 'UPDATE_PROFILE';

export interface AuditLogRecord {
  id: string;
  userId?: string;
  userEmail?: string;
  event: AuditEventType;
  details: string;
  timestamp: string;
}

export interface DatabaseDump {
  version: number;
  exportedAt: string;
  tables: {
    users: UserRecord[];
    sessions: SessionRecord[];
    auditLogs: AuditLogRecord[];
  };
}
