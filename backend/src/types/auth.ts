export interface AuthUser {
  userId: string;
  schoolId: string;
  sessionId: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}