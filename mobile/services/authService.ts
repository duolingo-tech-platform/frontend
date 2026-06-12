import { apiGet, apiPost, apiPut, apiDelete } from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  showInRanking: boolean;
  bio?: string;
}

interface AuthResponse {
  token: string;
  user: UserProfile;
}

export function login(email: string, password: string) {
  return apiPost<AuthResponse>('/auth/login', { email, password });
}

export function register(name: string, email: string, password: string) {
  return apiPost<AuthResponse>('/auth/register', { name, email, password });
}

export function getProfile() {
  return apiGet<UserProfile>('/auth/profile');
}

export function updateProfile(data: { name?: string; email?: string; bio?: string }) {
  return apiPut<null>('/auth/profile', data);
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiPut<{ message: string }>('/auth/change-password', { currentPassword, newPassword });
}

export function deleteAccount() {
  return apiDelete<{ message: string }>('/auth/account');
}

// RF03 — Recuperação de senha
export function forgotPassword(email: string) {
  return apiPost<{ message: string; code?: string }>('/auth/forgot-password', { email });
}

export function verifyResetCode(email: string, code: string) {
  return apiPost<{ valid: boolean }>('/auth/verify-reset-code', { email, code });
}

export function resetPassword(email: string, code: string, newPassword: string) {
  return apiPost<{ message: string }>('/auth/reset-password', { email, code, newPassword });
}

// RN08 — Opt-out do ranking
export function setRankingVisibility(showInRanking: boolean) {
  return apiPut<{ message: string; showInRanking: boolean }>('/auth/ranking-visibility', { showInRanking });
}

// RF29 — Push token
export function registerPushToken(token: string) {
  return apiPost<{ message: string }>('/auth/push-token', { token }, true);
}

// RF28 — Estatísticas da plataforma
export interface PlatformStats {
  totalUsers: number;
  totalCompletions: number;
  activeToday: number;
  averageXp: number;
  topUser: { name: string; xp: number; level: number } | null;
  mostCompletedCourse: string;
  totalCourses: number;
  totalLessons: number;
  totalExercises: number;
}

export function getAdminStats() {
  return apiGet<PlatformStats>('/admin/stats');
}
