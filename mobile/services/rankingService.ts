import { apiGet } from './api';

export interface RankingEntry {
  position: number;
  userId: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
}

export function getRanking(top = 10) {
  return apiGet<RankingEntry[]>(`/ranking?top=${top}`);
}
