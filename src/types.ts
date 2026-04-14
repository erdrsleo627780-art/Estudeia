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
  [year: string]: {
    [subject: string]: SubjectQuestions;
  };
}

export type Screen = 'onboarding' | 'home' | 'levels' | 'exercicio' | 'review' | 'perfil' | 'level-complete';

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
  currentCourse: string;
  password?: string;
  lastActive: string;
  subjectLevels?: { [subject: string]: number };
  weeklyStats?: { [date: string]: number };
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
  currentCourse: string;
  profileName: string;
  profileAvatar: string;
  password?: string;
  dailyUsage: { [subject: string]: { count: number; lastDate: string } };
  weeklyStats: { [date: string]: number };
  subjectLevels: { [subject: string]: number };
  currentLevel: number;
}
