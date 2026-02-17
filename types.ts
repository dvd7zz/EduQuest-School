
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum Subject {
  MATH = 'Matematika',
  ENGLISH = 'Ingliz tili',
  PHYSICS = 'Fizika',
  BIOLOGY = 'Biologiya',
  CHEMISTRY = 'Kimyo',
  ONATILI = 'Ona tili',
  ADABIYOT = 'Adabiyot'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index in options
}

export interface Test {
  id: string;
  title: string;
  subject: Subject;
  grade: number;
  questions: Question[];
  durationMinutes: number;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  fullName: string;
  grade?: number;
  avatar?: string;
  points?: number; // Accumulated points
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  subject: Subject;
  score: number;
  totalQuestions: number;
  completedAt: string;
}
