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
