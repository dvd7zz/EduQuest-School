
import { User, Test, TestResult, UserRole, Subject } from '../types';

const KEYS = {
  USERS: 'edu_users',
  TESTS: 'edu_tests',
  RESULTS: 'edu_results',
  CURRENT_USER: 'edu_current_user'
};

const DEFAULT_TESTS: Test[] = [
  {
    id: '1',
    title: 'Sonlar dunyosi',
    subject: Subject.MATH,
    grade: 1,
    durationMinutes: 10,
    questions: [
      { id: 'q1-1', text: '5 + 3 nechaga teng?', options: ['7', '8', '9', '6'], correctAnswer: 1 },
      { id: 'q1-2', text: 'Meva savatida 10 ta olma bor edi, 2 tasini edingiz. Nechta qoldi?', options: ['8', '7', '9', '12'], correctAnswer: 0 }
    ]
  },
  {
    id: '2',
    title: 'Alifbo quvonchi',
    subject: Subject.ONATILI,
    grade: 1,
    durationMinutes: 10,
    questions: [
      { id: 'ot1-1', text: 'O\'zbek alifbosida nechta harf bor?', options: ['29 ta', '26 ta', '30 ta', '32 ta'], correctAnswer: 0 },
      { id: 'ot1-2', text: 'Qaysi so\'zda "o" tovushi bor?', options: ['Olma', 'Anor', 'Besh', 'Uzum'], correctAnswer: 0 }
    ]
  },
  {
    id: '3',
    title: 'Present Simple Quiz',
    subject: Subject.ENGLISH,
    grade: 6,
    durationMinutes: 10,
    questions: [
      { id: 'e1', text: 'He ___ to school every day.', options: ['go', 'goes', 'going', 'went'], correctAnswer: 1 },
      { id: 'e2', text: 'They ___ football on Sundays.', options: ['play', 'plays', 'playing', 'player'], correctAnswer: 0 }
    ]
  }
];

const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  username: 'admin',
  password: 'admin123',
  role: UserRole.ADMIN,
  fullName: 'Tizim Admini',
  avatar: '👨‍🏫',
  points: 100
};

export const storage = {
  init: () => {
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify([DEFAULT_ADMIN]));
    }
    if (!localStorage.getItem(KEYS.TESTS)) {
      localStorage.setItem(KEYS.TESTS, JSON.stringify(DEFAULT_TESTS));
    }
    if (!localStorage.getItem(KEYS.RESULTS)) {
      localStorage.setItem(KEYS.RESULTS, JSON.stringify([]));
    }
  },

  getUsers: (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
  
  saveUser: (user: User) => {
    const users = storage.getUsers();
    localStorage.setItem(KEYS.USERS, JSON.stringify([...users, { ...user, points: 0 }]));
  },

  updateUser: (updatedUser: User) => {
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index >= 0) {
      users[index] = updatedUser;
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      storage.setCurrentUser(updatedUser);
    }
  },

  getTests: (): Test[] => JSON.parse(localStorage.getItem(KEYS.TESTS) || '[]'),
  
  saveTest: (test: Test) => {
    const tests = storage.getTests();
    const index = tests.findIndex(t => t.id === test.id);
    if (index >= 0) {
      tests[index] = test;
    } else {
      tests.push(test);
    }
    localStorage.setItem(KEYS.TESTS, JSON.stringify(tests));
  },

  deleteTest: (id: string) => {
    const tests = storage.getTests().filter(t => t.id !== id);
    localStorage.setItem(KEYS.TESTS, JSON.stringify(tests));
  },

  getResults: (): TestResult[] => JSON.parse(localStorage.getItem(KEYS.RESULTS) || '[]'),
  
  saveResult: (result: TestResult) => {
    const results = storage.getResults();
    localStorage.setItem(KEYS.RESULTS, JSON.stringify([...results, result]));
    
    // Update user points: 5 points per correct answer
    const currentUser = storage.getCurrentUser();
    if (currentUser && currentUser.id === result.userId) {
      const pointsEarned = result.score * 5;
      const updatedUser = { 
        ...currentUser, 
        points: (currentUser.points || 0) + pointsEarned 
      };
      storage.updateUser(updatedUser);
    }
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },

  resetStats: () => {
    localStorage.setItem(KEYS.RESULTS, JSON.stringify([]));
    const users = storage.getUsers().map(u => ({ ...u, points: 0 }));
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    const current = storage.getCurrentUser();
    if (current) storage.setCurrentUser({ ...current, points: 0 });
  }
};
