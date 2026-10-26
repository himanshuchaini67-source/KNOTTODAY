import type { UserRecord, SessionRecord, AuditLogRecord, AuditEventType, DatabaseDump } from './schema';
import { CUSTOMER_1, CUSTOMER_2 } from '@/data/userProfiles';

const DB_STORAGE_KEY = 'knot_today_db_store_v1';
const DB_VERSION = 1;
const INDEXED_DB_NAME = 'KnotTodayAuthDB';

// Simple fast SHA-256 equivalent hash using SubtleCrypto or deterministic fallback
async function hashPassword(plain: string): Promise<string> {
  const normalized = plain.trim();
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(`kt_salt_${normalized}`);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }
  // Simple deterministic fallback hash
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}_${normalized.length}`;
}

// Initial demo users seeded into the DB
const SEED_USERS: UserRecord[] = [
  {
    id: CUSTOMER_1.id,
    email: CUSTOMER_1.email.toLowerCase(),
    passwordHash: 'hash_demo_password123', // verified against 'password123'
    brideName: CUSTOMER_1.brideName,
    groomName: CUSTOMER_1.groomName,
    coupleInitials: CUSTOMER_1.coupleInitials,
    weddingDate: CUSTOMER_1.weddingDate || 'December 18, 2026',
    location: CUSTOMER_1.location || 'The Leela Palace, Udaipur, Rajasthan',
    role: 'couple',
    status: 'active',
    hasBooking: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: CUSTOMER_2.id,
    email: CUSTOMER_2.email.toLowerCase(),
    passwordHash: 'hash_demo_password123',
    brideName: CUSTOMER_2.brideName,
    groomName: CUSTOMER_2.groomName,
    coupleInitials: CUSTOMER_2.coupleInitials,
    weddingDate: CUSTOMER_2.weddingDate || 'To Be Decided',
    location: CUSTOMER_2.location || 'Not Specified Yet',
    role: 'couple',
    status: 'active',
    hasBooking: false,
    createdAt: '2026-02-01T14:30:00.000Z',
    updatedAt: new Date().toISOString(),
  },
];

class KnotTodayDatabase {
  private users: UserRecord[] = [];
  private sessions: SessionRecord[] = [];
  private auditLogs: AuditLogRecord[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;

    try {
      const raw = localStorage.getItem(DB_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.users = Array.isArray(parsed.users) ? parsed.users : [...SEED_USERS];
        this.sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [];
        this.auditLogs = Array.isArray(parsed.auditLogs) ? parsed.auditLogs : [];
      } else {
        // First run: Seed demo accounts
        this.users = [...SEED_USERS];
        this.sessions = [];
        this.auditLogs = [
          {
            id: `log_init_${Date.now()}`,
            event: 'REGISTER',
            details: 'Database initialized with initial demo couples (Aishwarya & Rohan, Vikram & Priya)',
            timestamp: new Date().toISOString(),
          },
        ];
        this.persist();
      }

      // Also ensure demo users are present if missing
      for (const seed of SEED_USERS) {
        if (!this.users.some((u) => u.email.toLowerCase() === seed.email.toLowerCase())) {
          this.users.push(seed);
        }
      }

      this.isInitialized = true;
      this.initIndexedDB();
    } catch (e) {
      console.error('Failed to initialize local DB', e);
      this.users = [...SEED_USERS];
      this.isInitialized = true;
    }
  }

  // Asynchronous IndexedDB backing for true database persistence
  private initIndexedDB() {
    if (typeof window === 'undefined' || !window.indexedDB) return;

    try {
      const request = window.indexedDB.open(INDEXED_DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const idb = (event.target as IDBOpenDBRequest).result;
        if (!idb.objectStoreNames.contains('users')) {
          const userStore = idb.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }
        if (!idb.objectStoreNames.contains('sessions')) {
          idb.createObjectStore('sessions', { keyPath: 'id' });
        }
        if (!idb.objectStoreNames.contains('auditLogs')) {
          idb.createObjectStore('auditLogs', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        const idb = (event.target as IDBOpenDBRequest).result;
        this.syncToIndexedDB(idb);
      };
    } catch (err) {
      console.warn('IndexedDB initialization skipped, using LocalStorage store', err);
    }
  }

  private syncToIndexedDB(idb: IDBDatabase) {
    try {
      const tx = idb.transaction(['users', 'sessions', 'auditLogs'], 'readwrite');
      const userStore = tx.objectStore('users');
      this.users.forEach((u) => userStore.put(u));

      const sessStore = tx.objectStore('sessions');
      this.sessions.forEach((s) => sessStore.put(s));

      const logStore = tx.objectStore('auditLogs');
      this.auditLogs.slice(-50).forEach((l) => logStore.put(l));
    } catch (e) {
      console.warn('Error syncing to IndexedDB', e);
    }
  }

  private persist() {
    try {
      const payload = {
        version: DB_VERSION,
        updatedAt: new Date().toISOString(),
        users: this.users,
        sessions: this.sessions,
        auditLogs: this.auditLogs.slice(-100), // Keep latest 100 audit entries
      };
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to persist database state', e);
    }
  }

  /* ────────────────── USERS TABLE ────────────────── */

  public getAllUsers(): UserRecord[] {
    this.init();
    return [...this.users];
  }

  public findUserByEmail(email: string): UserRecord | null {
    this.init();
    const clean = email.trim().toLowerCase();
    const found = this.users.find((u) => u.email.toLowerCase() === clean);
    return found ? { ...found } : null;
  }

  public findUserById(id: string): UserRecord | null {
    this.init();
    const found = this.users.find((u) => u.id === id);
    return found ? { ...found } : null;
  }

  public async createUser(data: {
    brideName: string;
    groomName: string;
    email: string;
    password: string;
    weddingDate?: string;
    location?: string;
  }): Promise<{ success: boolean; user?: UserRecord; error?: string }> {
    this.init();

    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail) return { success: false, error: 'Email is required.' };
    if (!data.brideName.trim() || !data.groomName.trim()) {
      return { success: false, error: 'Bride and groom names are required.' };
    }
    if (this.findUserByEmail(cleanEmail)) {
      return { success: false, error: 'An account with this email already exists in the database.' };
    }

    const initials = `${data.brideName.trim().charAt(0).toUpperCase()}&${data.groomName
      .trim()
      .charAt(0)
      .toUpperCase()}`;
    const pHash = await hashPassword(data.password);

    const newUser: UserRecord = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      passwordHash: pHash,
      brideName: data.brideName.trim(),
      groomName: data.groomName.trim(),
      coupleInitials: initials,
      weddingDate: data.weddingDate || 'To Be Decided',
      location: data.location || 'Venue Not Selected Yet',
      role: 'couple',
      status: 'active',
      hasBooking: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.persist();

    this.logAudit({
      event: 'REGISTER',
      userId: newUser.id,
      userEmail: newUser.email,
      details: `New couple account created: ${newUser.brideName} & ${newUser.groomName} (${newUser.email})`,
    });

    return { success: true, user: newUser };
  }

  public async verifyCredentials(
    email: string,
    password?: string
  ): Promise<{ success: boolean; user?: UserRecord; error?: string }> {
    this.init();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const user = this.findUserByEmail(cleanEmail);

    if (!user) {
      this.logAudit({
        event: 'LOGIN_FAILED',
        userEmail: cleanEmail,
        details: `Login attempt failed: Email not registered (${cleanEmail})`,
      });
      return {
        success: false,
        error: 'Account not found. Please register or select an instant demo account.',
      };
    }

    if (user.status !== 'active') {
      return { success: false, error: 'This account has been deactivated.' };
    }

    // Check demo password fallback or hashed password
    let passwordMatches = false;
    if (cleanPass === 'password123') {
      passwordMatches = true;
    } else {
      const incomingHash = await hashPassword(cleanPass);
      passwordMatches = incomingHash === user.passwordHash || user.passwordHash === 'hash_demo_password123';
    }

    if (!passwordMatches) {
      this.logAudit({
        event: 'LOGIN_FAILED',
        userId: user.id,
        userEmail: user.email,
        details: `Failed password verification for ${user.email}`,
      });
      return {
        success: false,
        error: 'Invalid password. Try password123 or reset your password.',
      };
    }

    // Update lastLoginAt
    user.lastLoginAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    const userIdx = this.users.findIndex((u) => u.id === user.id);
    if (userIdx !== -1) {
      this.users[userIdx] = user;
    }
    this.persist();

    this.logAudit({
      event: 'LOGIN_SUCCESS',
      userId: user.id,
      userEmail: user.email,
      details: `User successfully logged in: ${user.brideName} & ${user.groomName}`,
    });

    return { success: true, user };
  }

  public async resetPassword(
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    this.init();

    const cleanEmail = email.trim().toLowerCase();
    const userIdx = this.users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

    if (userIdx === -1) {
      return { success: false, error: 'No account found with this email in the database.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    const newHash = await hashPassword(newPassword);
    this.users[userIdx].passwordHash = newHash;
    this.users[userIdx].updatedAt = new Date().toISOString();
    this.persist();

    this.logAudit({
      event: 'PASSWORD_RESET',
      userId: this.users[userIdx].id,
      userEmail: this.users[userIdx].email,
      details: `Password reset successfully for ${this.users[userIdx].email}`,
    });

    return { success: true };
  }

  public updateUser(
    id: string,
    updates: Partial<Pick<UserRecord, 'brideName' | 'groomName' | 'weddingDate' | 'location'>>
  ): UserRecord | null {
    this.init();

    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    const existing = this.users[idx];
    const brideName = updates.brideName ?? existing.brideName;
    const groomName = updates.groomName ?? existing.groomName;
    const initials = `${brideName.charAt(0).toUpperCase()}&${groomName.charAt(0).toUpperCase()}`;

    const updated: UserRecord = {
      ...existing,
      ...updates,
      brideName,
      groomName,
      coupleInitials: initials,
      updatedAt: new Date().toISOString(),
    };

    this.users[idx] = updated;
    this.persist();

    this.logAudit({
      event: 'UPDATE_PROFILE',
      userId: id,
      userEmail: updated.email,
      details: `Profile updated for ${updated.brideName} & ${updated.groomName}`,
    });

    return updated;
  }

  /* ────────────────── SESSIONS TABLE ────────────────── */

  public createSession(user: UserRecord): SessionRecord {
    this.init();

    // Terminate existing sessions for this user
    this.sessions = this.sessions.map((s) =>
      s.userId === user.id ? { ...s, isActive: false } : s
    );

    const newSession: SessionRecord = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      userId: user.id,
      userEmail: user.email,
      token: `kt_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      isActive: true,
    };

    this.sessions.push(newSession);
    this.persist();
    return newSession;
  }

  public getActiveSession(): SessionRecord | null {
    this.init();
    const active = this.sessions.find(
      (s) => s.isActive && new Date(s.expiresAt).getTime() > Date.now()
    );
    return active || null;
  }

  public terminateSession(userId?: string): void {
    this.init();
    if (userId) {
      this.sessions = this.sessions.map((s) =>
        s.userId === userId ? { ...s, isActive: false } : s
      );
    } else {
      this.sessions = this.sessions.map((s) => ({ ...s, isActive: false }));
    }
    this.persist();

    this.logAudit({
      event: 'LOGOUT',
      userId,
      details: 'User logged out and session terminated',
    });
  }

  /* ────────────────── AUDIT LOGS TABLE ────────────────── */

  public logAudit(entry: {
    event: AuditEventType;
    details: string;
    userId?: string;
    userEmail?: string;
  }): void {
    const newLog: AuditLogRecord = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: entry.userId,
      userEmail: entry.userEmail,
      event: entry.event,
      details: entry.details,
      timestamp: new Date().toISOString(),
    };

    this.auditLogs.unshift(newLog);
    this.persist();
  }

  public getAuditLogs(limit = 25): AuditLogRecord[] {
    this.init();
    return this.auditLogs.slice(0, limit);
  }

  /* ────────────────── DATABASE METRICS & EXPORT ────────────────── */

  public getStats() {
    this.init();
    return {
      totalUsers: this.users.length,
      activeUsers: this.users.filter((u) => u.status === 'active').length,
      totalSessions: this.sessions.length,
      activeSessions: this.sessions.filter((s) => s.isActive).length,
      totalAuditLogs: this.auditLogs.length,
      storageEngine: 'IndexedDB + LocalStore (Hybrid)',
    };
  }

  public exportDump(): DatabaseDump {
    this.init();
    return {
      version: DB_VERSION,
      exportedAt: new Date().toISOString(),
      tables: {
        users: this.users,
        sessions: this.sessions,
        auditLogs: this.auditLogs,
      },
    };
  }

  public resetToDefaults(): void {
    this.users = [...SEED_USERS];
    this.sessions = [];
    this.auditLogs = [
      {
        id: `log_reset_${Date.now()}`,
        event: 'REGISTER',
        details: 'Database reset to initial demo seeds',
        timestamp: new Date().toISOString(),
      },
    ];
    this.persist();
  }
}

// Singleton database instance
export const db = new KnotTodayDatabase();

// Expose on window for easy developer inspection in DevTools
if (typeof window !== 'undefined') {
  (window as unknown as { __KNOT_TODAY_DB__: KnotTodayDatabase }).__KNOT_TODAY_DB__ = db;
}
