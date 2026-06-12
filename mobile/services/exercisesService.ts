import { apiGet, apiPost } from './api';

export interface ExerciseOption {
  id: string;
  text: string;
}

export interface Exercise {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false';
  options: ExerciseOption[];
}

export interface AnswerResponse {
  isCorrect: boolean;
  correctOptionId: string;
  xp: number;
  level: number;
  streak: number;
  message: string;
}

export function getExercisesByLesson(lessonId: string) {
  return apiGet<Exercise[]>(`/exercises/by-lesson/${lessonId}`);
}

// RF22/RF23 — Revisão inteligente
export function getRevisionExercises() {
  return apiGet<Exercise[]>('/exercises/revision');
}

export function submitAnswer(exerciseId: string, selectedOptionId: string) {
  return apiPost<AnswerResponse>('/exercises/answer', { exerciseId, selectedOptionId }, true);
}

export function completeLesson(lessonId: string) {
  return apiPost<{ message: string; streak: number }>('/progress', { lessonId }, true);
}
