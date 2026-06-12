import { apiGet } from './api';

export interface Course {
  id: string;
  title: string;
  description: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  order: number;
}

export function getCourses() {
  return apiGet<Course[]>('/courses');
}

export function getModules(courseId: string) {
  return apiGet<Module[]>(`/courses/${courseId}/modules`);
}

export function getLessons(moduleId: string) {
  return apiGet<Lesson[]>(`/modules/${moduleId}/lessons`);
}

export interface CourseProgress {
  courseId: string;
  completed: number;
  total: number;
  percent: number;
}

export function getCourseProgress() {
  return apiGet<CourseProgress[]>('/progress/courses');
}

export interface UserProgressDetail {
  xp: number;
  level: number;
  streak: number;
  lessonsCompleted: number;
  lessonIds: string[];
}

export function getProgress() {
  return apiGet<UserProgressDetail>('/progress');
}

export interface HistoryItem {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  courseTitle: string;
  xpEarned: number;
  totalExercises: number;
  correctAnswers: number;
  completedAt: string;
}

export function getProgressHistory() {
  return apiGet<HistoryItem[]>('/progress/history');
}
