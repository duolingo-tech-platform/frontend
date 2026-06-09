import { apiGet, apiPost, apiPut } from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
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

export function updateProfile(data: { name: string; email: string }) {
  return apiPut<null>('/auth/profile', data);
}
