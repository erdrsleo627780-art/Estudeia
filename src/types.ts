export interface Question {
  q: string;
  opts: string[];
  ans: number;
  explanation?: string[];
  mistake?: string;
}

export interface SubjectQuestions {
  [difficulty: number]: Question[];
}

export interface QuestionDatabase {
  [subject: string]: SubjectQuestions;
}

export type Screen = 'onboarding' | 'home' | 'exercicio' | 'review' | 'perfil';

export interface UserData {
  uid: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  correct: number;
  difficulty: number;
  profileAvatar: string;
  currentYear: string;
  lastActive: string;
}

export interface AppState {
  xp: number;
  level: number;
  streak: number;
  correct: number;
  difficulty: number;
  recentResults: boolean[];
  nivelScore: number;
  nivelIndex: number;
  exIndex: number;
  exCorrect: number;
  exWrong: number;
  lastWrongQ: Question | null;
  currentSubject: string;
  currentTopic: string;
  currentYear: string;
  profileName: string;
  profileAvatar: string;
  dailyUsage: { [subject: string]: { count: number; lastDate: string } };
}
