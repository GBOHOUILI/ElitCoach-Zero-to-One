// Types partagés entre frontend et backend
// Importés dans les deux via le workspace "shared"

export type Role = 'COACH' | 'CLIENT' | 'ADMIN';

export type CoachStatus = 'PENDING' | 'SCREENING' | 'INTERVIEW' | 'TEST' | 'APPROVED' | 'REJECTED';

export type ClientStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AuthUser {
  userId: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: Role;
    firstName: string;
    status: string;
  };
}
