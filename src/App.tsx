import * as React from 'react';
import { useState, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Zap, 
  Flame, 
  Trophy, 
  User, 
  Home as HomeIcon, 
  ClipboardList, 
  ChevronLeft, 
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Microscope,
  BookOpen,
  History,
  Calculator,
  Lock,
  WifiOff
} from 'lucide-react';
import { Screen, AppState, Question, UserData } from './types';
import { QUESTIONS_BY_SUBJECT, NIVEL_QUESTIONS, AVATARS } from './constants';
import { generateQuestions, isAIAvailable } from './services/geminiService';
import { auth, db, isFirebaseEnabled } from './firebase';
import { 
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // Only throw if it's a critical error that should trigger the Error Boundary
  if (error instanceof Error && (error.message.includes('permission-denied') || error.message.includes('Missing or insufficient permissions'))) {
    console.warn("Firestore Permission Denied - App will continue but data might not sync.");
  }
}

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, errorInfo: '' };
  }

  static getDerivedStateFromError(error: any) {
    // Ignore the external search analyzer error that sometimes triggers in iframe environments
    if (error?.message?.includes('Search engine null') || error?.toString()?.includes('Search engine null')) {
      return { hasError: false, errorInfo: '' };
    }
    return { hasError: true, errorInfo: error.message || String(error) };
  }

  render() {
    if (this.state.hasError) {
      let details: any = null;
      try {
        details = JSON.parse(this.state.errorInfo);
      } catch (e) {}

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg p-10 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-black mb-4">Ops! Algo deu errado</h1>
          <p className="text-muted text-sm mb-8 max-w-xs mx-auto">
            Ocorreu um erro de conexão com o banco de dados. Por favor, tente recarregar a página.
          </p>
          {details && (
            <div className="bg-card border border-border rounded-xl p-4 mb-8 text-left w-full max-w-md overflow-hidden">
              <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Detalhes do Erro</div>
              <pre className="text-[10px] text-danger whitespace-pre-wrap break-all">
                {details.error}
              </pre>
            </div>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary w-full max-w-xs"
          >
            Recarregar Aplicativo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('Search engine null') || event.error?.message?.includes('Search engine null')) {
        event.preventDefault();
        console.warn('Ignored external search analyzer error.');
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <ErrorBoundary>
      <EduApp />
    </ErrorBoundary>
  );
}

function EduApp() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [user, setUser] = useState<any>(null);
  const [globalRanking, setGlobalRanking] = useState<UserData[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const initialAppState: AppState = {
    xp: 0,
    level: 1,
    streak: 0,
    correct: 0,
    difficulty: 1,
    recentResults: [],
    nivelScore: 0,
    nivelIndex: 0,
    exIndex: 0,
    exCorrect: 0,
    exWrong: 0,
    lastWrongQ: null,
    currentSubject: '',
    currentTopic: '',
    currentYear: '',
    currentCourse: '',
    profileName: '',
    profileAvatar: '🦁',
    dailyUsage: {},
    subjectLevels: {
      'Matemática': 1,
      'Português': 1,
      'Ciências': 1,
      'História': 1
    },
    currentLevel: 1
  };

  const [state, setState] = useState<AppState>(initialAppState);

  const [authError, setAuthError] = useState<string | null>(null);
  const [isLocalMode, setIsLocalMode] = useState(false);
  
  // Auth Listener
  useEffect(() => {
    if (!isFirebaseEnabled) {
      setAuthError("Configuração do Firebase ausente. Por favor, configure as variáveis de ambiente no Vercel.");
      setIsAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setAuthError(null);
        // Load user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setState(prev => ({
              ...prev,
              xp: data.xp,
              level: data.level,
              streak: data.streak,
              correct: data.correct,
              difficulty: data.difficulty,
              profileName: data.username,
              profileAvatar: data.profileAvatar,
              currentYear: data.currentYear,
              subjectLevels: data.subjectLevels || prev.subjectLevels,
            }));
            setScreen('home');
          } else {
            setScreen('onboarding');
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
        // Auto-sign in anonymously to skip login screen
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.error("Erro ao entrar anonimamente:", e);
          setIsLocalMode(true);
          setScreen('onboarding');
        }
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateUser = async () => {
    if (state.profileName.length < 3 || !state.currentCourse) return;
    
    setLoginError(null);
    
    try {
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          username: state.profileName,
          xp: 0,
          level: 1,
          streak: 0,
          correct: 0,
          difficulty: 1,
          profileAvatar: state.profileAvatar,
          currentYear: state.currentCourse,
          lastActive: new Date().toISOString(),
          subjectLevels: state.subjectLevels
        });
        setScreen('home');
      }
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      setLoginError('Erro ao salvar perfil: ' + error.message);
    }
  };

  // Global Ranking Listener
  useEffect(() => {
    if (!user || isLocalMode) {
      setGlobalRanking([]);
      return;
    }

    const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ranking = snapshot.docs.map(doc => doc.data() as UserData);
      setGlobalRanking(ranking);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });
    return () => unsubscribe();
  }, [user]);

  // Sync state to Firestore when it changes (debounced or on specific events)
  const syncToFirestore = useCallback(async (newState: AppState) => {
    if (isLocalMode) {
      localStorage.setItem('edu_local_data', JSON.stringify({
        ...newState,
        lastActive: new Date().toISOString()
      }));
      return;
    }

    if (user) {
      const userData: UserData = {
        uid: user.uid,
        username: newState.profileName,
        xp: newState.xp,
        level: newState.level,
        streak: newState.streak,
        correct: newState.correct,
        difficulty: newState.difficulty,
        profileAvatar: newState.profileAvatar,
        currentYear: newState.currentYear,
        lastActive: new Date().toISOString(),
        subjectLevels: newState.subjectLevels,
      };
      try {
        await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    }
  }, [user, isLocalMode]);

  // Sync on state changes
  useEffect(() => {
    if ((user || isLocalMode) && screen !== 'onboarding') {
      const timer = setTimeout(() => syncToFirestore(state), 2000);
      return () => clearTimeout(timer);
    }
  }, [state, user, isLocalMode, screen, syncToFirestore]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfileName, setTempProfileName] = useState(state.profileName);

  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [algoMsg, setAlgoMsg] = useState<{ text: string, type: 'up' | 'down' | 'reinforce' } | null>(null);
  const [exQuestions, setExQuestions] = useState<Question[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval: number;
    if (isTimerActive && timer > 0) {
      interval = window.setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && isTimerActive) {
      handleAnswer(-1);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const startTimer = useCallback((sec: number) => {
    setTimer(sec);
    setIsTimerActive(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTimerActive(false);
  }, []);

  const handleAnswer = (idx: number) => {
    stopTimer();
    setSelectedOption(idx);
    
    // Safety check for questions array
    if (!exQuestions || exQuestions.length === 0) {
      setScreen('home');
      return;
    }

    let currentQ = exQuestions[state.exIndex % exQuestions.length];
    if (!currentQ) {
      setScreen('home');
      return;
    }

    const correct = idx === currentQ.ans;
    setFeedbackCorrect(correct);
    setShowFeedback(true);

    const xpGain = correct ? (state.difficulty * 30) : 0;
    const newRecent = [correct, ...state.recentResults].slice(0, 5);
    
    const today = new Date().toISOString().split('T')[0];
    const currentUsage = state.dailyUsage[state.currentSubject] || { count: 0, lastDate: today };
    
    setState(prev => ({
      ...prev,
      xp: prev.xp + xpGain,
      correct: correct ? prev.correct + 1 : prev.correct,
      exCorrect: correct ? prev.exCorrect + 1 : prev.exCorrect,
      exWrong: !correct ? prev.exWrong + 1 : prev.exWrong,
      recentResults: newRecent,
      lastWrongQ: correct ? prev.lastWrongQ : currentQ,
      dailyUsage: {
        ...prev.dailyUsage,
        [state.currentSubject]: {
          count: currentUsage.lastDate === today ? currentUsage.count + 1 : 1,
          lastDate: today
        }
      }
    }));

    checkAdaptiveAlgo(newRecent);
    
    checkLevelUp();
  };

  const checkAdaptiveAlgo = (recent: boolean[]) => {
    if (recent.length >= 3 && recent[0] && recent[1] && recent[2]) {
      if (state.difficulty < 3) {
        setState(prev => ({ ...prev, difficulty: prev.difficulty + 1 }));
        setAlgoMsg({ 
          text: `🚀 3 acertos seguidos! Dificuldade aumentada para ${['', 'Fácil', 'Médio', 'Difícil'][state.difficulty + 1]}!`, 
          type: 'up' 
        });
        // Refresh questions for new difficulty
        const subjectQs = QUESTIONS_BY_SUBJECT[state.currentSubject] || QUESTIONS_BY_SUBJECT["Matemática"];
        const newQs = [...(subjectQs[state.difficulty + 1] || subjectQs[2])];
        setExQuestions(shuffleArr(newQs));
        setState(prev => ({ ...prev, exIndex: -1 })); // Will be incremented in nextQuestion
      }
    } else if (recent.length >= 2 && !recent[0] && !recent[1]) {
      if (state.difficulty > 1) {
        setState(prev => ({ ...prev, difficulty: prev.difficulty - 1 }));
        setAlgoMsg({ 
          text: `📚 Vamos reforçar a base! Dificuldade ajustada para ${['', 'Fácil', 'Médio', 'Difícil'][state.difficulty - 1]}.`, 
          type: 'down' 
        });
        const subjectQs = QUESTIONS_BY_SUBJECT[state.currentSubject] || QUESTIONS_BY_SUBJECT["Matemática"];
        const newQs = [...(subjectQs[state.difficulty - 1] || subjectQs[1])];
        setExQuestions(shuffleArr(newQs));
        setState(prev => ({ ...prev, exIndex: -1 }));
      } else {
        setAlgoMsg({ text: "💡 Vamos reforçar este tema antes de avançar!", type: 'reinforce' });
      }
    }
  };

  const checkLevelUp = () => {
    // Level up every 10 correct answers
    if (state.correct > 0 && state.correct % 10 === 0) {
      setState(prev => ({ ...prev, level: prev.level + 1 }));
      setShowLevelUp(true);
    }
  };

  const nextQuestion = (skipReview = false) => {
    setShowFeedback(false);
    setSelectedOption(null);
    setAlgoMsg(null);

    // Check if level finished (10 questions)
    if (state.exIndex >= 9) {
      const pass = state.exCorrect >= 7;
      if (pass) {
        const nextLvl = state.currentLevel + 1;
        setState(prev => {
          const newLevels = { ...prev.subjectLevels };
          if (nextLvl > (newLevels[prev.currentSubject] || 1)) {
            newLevels[prev.currentSubject] = nextLvl;
          }
          return {
            ...prev,
            subjectLevels: newLevels,
            xp: prev.xp + 500 // Bonus for level completion
          };
        });
        alert(`🎉 Nível ${state.currentLevel} concluído com sucesso! (+500 XP)`);
      } else {
        alert(`📚 Você acertou ${state.exCorrect}/10. Precisa de pelo menos 7 para passar!`);
      }
      setScreen('levels');
      return;
    }

    if (!feedbackCorrect && state.lastWrongQ && !skipReview) {
      setScreen('review');
    } else {
      setState(prev => ({ ...prev, exIndex: prev.exIndex + 1 }));
      setScreen('exercicio');
      startTimer(30);
    }
  };

  const prevQuestion = () => {
    if (state.exIndex > 0) {
      setShowFeedback(false);
      setSelectedOption(null);
      setAlgoMsg(null);
      setState(prev => ({ ...prev, exIndex: prev.exIndex - 1 }));
      startTimer(30);
    }
  };

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isGeneratingOffline, setIsGeneratingOffline] = useState(false);

  const generateOfflineBank = async () => {
    if (!isAIAvailable) {
      alert("IA não configurada. Verifique sua conexão e chave de API.");
      return;
    }
    
    setIsGeneratingOffline(true);
    setLoadingProgress(0);
    
    const subjects = ["Matemática", "Português", "Ciências", "História"];
    const totalSteps = subjects.length * 3; // 4 subjects * 3 difficulties
    let currentStep = 0;

    try {
      for (const subject of subjects) {
        for (let diff = 1; diff <= 3; diff++) {
          const qs = await generateQuestions(
            subject, 
            `Tópicos fundamentais para ${state.currentYear}`, 
            diff, 
            50, // Generate 50 per difficulty to reach 150-200 per subject
            `offline-bank-${subject}-${diff}-${state.currentYear}`, 
            state.currentYear
          );
          
          if (qs.length > 0) {
            const key = `offline_bank_${subject}_${diff}`;
            localStorage.setItem(key, JSON.stringify(qs));
          }
          
          currentStep++;
          setLoadingProgress(Math.round((currentStep / totalSteps) * 100));
        }
      }
      alert("Banco de 200 questões por matéria gerado e salvo offline com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar banco offline:", error);
      alert("Erro ao gerar banco offline. Verifique sua conexão.");
    } finally {
      setIsGeneratingOffline(false);
      setLoadingProgress(0);
    }
  };

  const startExercicio = async (subject: string, topic: string, diff: number, isDaily: boolean = false, levelNum?: number, forceAI: boolean = false) => {
    const today = new Date().toISOString().split('T')[0];
    const usage = state.dailyUsage[subject];
    if (usage && usage.lastDate === today && usage.count >= 200) {
      alert(`Você já atingiu o limite de 200 perguntas para ${subject} hoje! Tente novamente amanhã.`);
      return;
    }

    setIsLoadingQuestions(true);
    setLoadingProgress(0);
    setScreen('exercicio'); 
    
    try {
      let qs: Question[] = [];
      const levelDiff = levelNum ? (levelNum <= 30 ? 1 : levelNum <= 70 ? 2 : 3) : diff;
      
      // Diversify subjects if it's a general exercise or high level
      const subjects = ["Matemática", "Português", "Ciências", "História"];
      const targetSubject = subject === "Geral" ? subjects[Math.floor(Math.random() * subjects.length)] : subject;

      // 1. Try to find local questions first (Strictly Offline First)
      if (!forceAI) {
        const levelDiff = levelNum ? (levelNum <= 30 ? 1 : levelNum <= 70 ? 2 : 3) : diff;
        const offlineKey = `offline_bank_${targetSubject}_${levelDiff}`;
        const offlineData = localStorage.getItem(offlineKey);
        
        if (offlineData) {
          const offlinePool = JSON.parse(offlineData);
          const countNeeded = levelNum ? 10 : 5;
          qs = shuffleArr([...offlinePool]).slice(0, countNeeded);
          console.log(`Usando ${qs.length} questões do banco offline para ${targetSubject}`);
        } else {
          // Fallback to constants if no offline bank generated yet
          const subjectQs = QUESTIONS_BY_SUBJECT[targetSubject] || QUESTIONS_BY_SUBJECT["Matemática"];
          const localPool = subjectQs[levelDiff] || subjectQs[2] || [];
          if (localPool.length > 0) {
            const countNeeded = levelNum ? 10 : 5;
            qs = shuffleArr([...localPool]).slice(0, countNeeded);
            console.log(`Usando ${qs.length} questões das constantes para ${targetSubject}`);
          }
        }
      }

      // 2. If no local questions found OR forced AI, use Gemini
      if (qs.length === 0 || forceAI) {
        if (levelNum) {
          qs = await generateQuestions(targetSubject, `Nível ${levelNum} de progressão para ${state.currentYear}`, levelDiff, 10, `level-${targetSubject}-${levelNum}-${state.currentYear}`, state.currentYear);
        } else if (isDaily) {
          const cacheKey = `daily_${targetSubject}_${today}_${state.currentYear}`;
          const cached = localStorage.getItem(cacheKey);
          
          if (cached && !forceAI) {
            qs = JSON.parse(cached);
          } else {
            for (let i = 1; i <= 4; i++) {
              setLoadingProgress(i * 25);
              const batch = await generateQuestions(targetSubject, `Tópicos variados do currículo de ${state.currentYear}`, diff, 25, `${today}-batch-${i}-${state.currentYear}`, state.currentYear);
              qs.push(...batch);
            }
            localStorage.setItem(cacheKey, JSON.stringify(qs));
          }
        } else {
          qs = await generateQuestions(targetSubject, `${topic} para ${state.currentYear}`, diff, 5, undefined, state.currentYear);
        }
      }

      // 3. Final Fallback
      if (qs.length === 0) {
        const subjectQs = QUESTIONS_BY_SUBJECT[targetSubject] || QUESTIONS_BY_SUBJECT["Matemática"];
        qs = shuffleArr([...(subjectQs[levelDiff] || subjectQs[2])]).slice(0, 10);
      }

      setExQuestions(qs);

      setState(prev => ({
        ...prev,
        currentSubject: targetSubject,
        currentTopic: levelNum ? `Nível ${levelNum}` : (isDaily ? 'Desafio 100 Questões' : topic),
        currentLevel: levelNum || 1,
        difficulty: levelNum ? (levelNum <= 30 ? 1 : levelNum <= 70 ? 2 : 3) : diff,
        exIndex: 0,
        exCorrect: 0,
        exWrong: 0,
        recentResults: [],
      }));
      startTimer(30);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingQuestions(false);
      setLoadingProgress(0);
    }
  };

  const shuffleArr = <T,>(arr: T[]): T[] => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const renderOnboarding = () => (
    <div className="flex flex-col items-center justify-center text-center p-10 min-h-screen bg-gradient-to-br from-bg2 to-bg3 animate-fade-in">
      <div className="text-8xl mb-5 drop-shadow-[0_0_30px_rgba(212,185,150,0.4)]">🎓</div>
      <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-text to-primary bg-clip-text text-transparent">Bem-vindo!</h1>
      <p className="text-muted text-sm mb-8 leading-relaxed">
        Crie seu perfil para começar sua jornada.<br/>
        <span className="font-bold text-primary">Seu progresso será salvo automaticamente!</span>
      </p>
      
      <div className="w-full max-w-xs flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-left">
          <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Seu Nome</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Como quer ser chamado?" 
              value={state.profileName}
              onChange={(e) => {
                const val = e.target.value;
                setState(prev => ({ ...prev, profileName: val }));
              }}
              className="bg-card border border-border rounded-xl pl-10 pr-4 py-3 w-full outline-none focus:border-primary text-sm font-bold"
            />
          </div>
          {state.profileName.length < 3 && <span className="text-[10px] text-danger ml-1">Mínimo 3 caracteres</span>}
        </div>

        <div className="flex flex-col gap-2 text-left">
          <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Curso Desejado</label>
          <div className="grid grid-cols-2 gap-2">
            {['Matemática', 'Português', 'Ciências', 'História', 'Geral'].map(course => (
              <button 
                key={course}
                onClick={() => setState(prev => ({ ...prev, currentCourse: course }))}
                className={`bg-card border rounded-lg py-2.5 text-[10px] font-bold transition-all ${state.currentCourse === course ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-border text-muted hover:border-primary/50'}`}
              >
                {course}
              </button>
            ))}
          </div>
          {!state.currentCourse && <span className="text-[10px] text-danger ml-1">Selecione um curso</span>}
        </div>

        <div className="flex flex-col gap-2 text-left">
          <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Escolha seu Avatar</label>
          <div className="flex justify-between bg-card border border-border rounded-xl p-2">
            {AVATARS.slice(0, 5).map(avatar => (
              <button 
                key={avatar.id}
                onClick={() => setState(prev => ({ ...prev, profileAvatar: avatar.emoji }))}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${state.profileAvatar === avatar.emoji ? 'bg-primary/20 scale-110' : 'hover:bg-white/5'}`}
              >
                {avatar.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {loginError && <div className="text-[10px] text-danger font-bold mt-4">{loginError}</div>}

      <button 
        disabled={!state.currentCourse || state.profileName.length < 3}
        onClick={async () => { 
          await handleCreateUser();
        }}
        className="btn-primary w-full max-w-xs mt-10 disabled:opacity-50 disabled:grayscale relative group"
      >
        Começar a Estudar →
        {(!state.currentCourse || state.profileName.length < 3) && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-danger text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
            Preencha todos os campos corretamente
          </div>
        )}
      </button>
    </div>
  );

  const renderHome = () => (
    <div className="flex flex-col min-h-screen bg-bg animate-fade-in pb-20">
      <div className="overflow-y-auto flex-1">
        <div className="p-6 bg-gradient-to-br from-bg2 to-bg3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">EduAdaptive</div>
              {isLocalMode && (
                <span className="text-[8px] bg-warning/20 text-warning px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter">Offline</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={generateOfflineBank}
                disabled={isGeneratingOffline}
                className={`w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted hover:text-primary transition-colors ${isGeneratingOffline ? 'animate-spin text-primary' : ''}`}
                title="Gerar Banco Offline (IA)"
              >
                <WifiOff size={14} />
              </button>
              <button 
                onClick={() => {
                  // Clear daily cache to allow "update" when online
                  const today = new Date().toISOString().split('T')[0];
                  Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('daily_')) localStorage.removeItem(key);
                  });
                  alert("Banco de questões atualizado! Novas perguntas serão geradas ao iniciar um desafio.");
                }}
                className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted hover:text-primary transition-colors"
                title="Sincronizar Questões"
              >
                <Zap size={14} />
              </button>
              <div className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3.5 py-1.5 text-xs font-bold text-warning">
                <Zap size={14} /> {state.xp.toLocaleString()} XP
              </div>
            </div>
          </div>
          
          {isGeneratingOffline && (
            <div className="mt-4 bg-card border border-primary/30 rounded-xl p-3 animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-bold text-primary uppercase tracking-widest">IA Gerando Banco Offline...</div>
                <div className="text-[10px] font-bold text-primary">{loadingProgress}%</div>
              </div>
              <div className="w-full bg-card2 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
              </div>
            </div>
          )}

          <div className="text-2xl font-extrabold mt-5">Olá, {state.profileName}! {state.profileAvatar}</div>
          <div className="text-muted text-sm">Você está no Nível {state.level} · Continue sua sequência!</div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 bg-card2 rounded-xl px-3.5 py-2 text-xs font-semibold">
              <Flame size={14} className="text-orange-500" /> {state.streak} dias
            </div>
            <div className="flex items-center gap-1.5 bg-card2 rounded-xl px-3.5 py-2 text-xs font-semibold">
              <CheckCircle2 size={14} className="text-success" /> {state.correct} acertos
            </div>
            <div className="flex items-center gap-1.5 bg-card2 rounded-xl px-3.5 py-2 text-xs font-semibold">
              <Trophy size={14} className="text-warning" /> Liga Ouro
            </div>
          </div>
        </div>

        <div 
          onClick={() => startExercicio('Matemática', 'Desafio do Dia', 2, true)}
          className="mx-6 my-3 bg-gradient-to-br from-primary to-primary-dark border border-primary/20 rounded-xl p-5 flex items-center justify-between cursor-pointer hover:translate-y-[-2px] transition-transform shadow-lg shadow-primary/10"
        >
          <div>
            <div className="font-extrabold text-base text-white">⚡ Desafio de 100 Questões</div>
            <div className="text-white/70 text-xs">Matemática · Tópicos Variados · Nível 2</div>
          </div>
          <div className="bg-white/20 rounded-xl px-3.5 py-2 text-xs font-bold text-white whitespace-nowrap">5× XP</div>
        </div>

        <div className="px-6 text-sm font-bold text-muted tracking-widest uppercase mt-6 mb-3 flex items-center justify-between">
          <span>Matérias</span>
          <button 
            onClick={() => {
              const subject = state.currentSubject || "Matemática";
              startExercicio(subject, "Reforço IA", 2, false, undefined, true);
            }}
            className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded-md hover:bg-primary/20 transition-colors flex items-center gap-1"
          >
            <Zap size={10} /> Gerar Novas (IA)
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 px-6">
          <SubjectCard 
            title="Matemática" icon={<Calculator size={28} className="text-primary" />} 
            mastery="Frações" progress={63} color="primary"
            onClick={() => { setState(prev => ({ ...prev, currentSubject: 'Matemática' })); setScreen('levels'); }}
            onDaily={() => startExercicio('Matemática', 'Desafio Diário', 2, true)}
          />
          <SubjectCard 
            title="Português" icon={<BookOpen size={28} className="text-secondary" />} 
            mastery="Gramática" progress={52} color="secondary"
            onClick={() => { setState(prev => ({ ...prev, currentSubject: 'Português' })); setScreen('levels'); }}
            onDaily={() => startExercicio('Português', 'Desafio Diário', 2, true)}
          />
          <SubjectCard 
            title="Ciências" icon={<Microscope size={28} className="text-success" />} 
            mastery="Biologia" progress={56} color="success"
            onClick={() => { setState(prev => ({ ...prev, currentSubject: 'Ciências' })); setScreen('levels'); }}
            onDaily={() => startExercicio('Ciências', 'Biologia Celular', 3)}
          />
          <SubjectCard 
            title="História" icon={<History size={28} className="text-warning" />} 
            mastery="Brasil" progress={45} color="warning"
            onClick={() => { setState(prev => ({ ...prev, currentSubject: 'História' })); setScreen('levels'); }}
            onDaily={() => startExercicio('História', 'Brasil Colonial', 2)}
          />
        </div>

        <div className="px-6 text-sm font-bold text-muted tracking-widest uppercase mt-6 mb-3">Progresso Semanal</div>
        <div className="px-6 mb-3">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-muted">Questões respondidas</span>
            <span className="text-xs font-bold">47 / 70</span>
          </div>
          <div className="h-2 bg-card2 rounded-full overflow-hidden">
            <div className="w-[67%] h-full bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
          <div className="grid grid-cols-7 gap-1 mt-3">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
              <div key={i} className="text-center">
                <div className="text-[10px] text-muted mb-1">{day}</div>
                <div className={`rounded-sm ${i < 6 ? 'bg-success' : 'bg-card2'}`} style={{ height: `${[32, 24, 40, 20, 36, 28, 10][i]}px`, opacity: [0.9, 0.7, 1, 0.6, 0.8, 0.8, 1][i] }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NavBar active="home" onNavigate={setScreen} onExercise={() => startExercicio('Matemática', 'Frações', 2)} />
    </div>
  );

  const renderExercicio = () => {
    const q = exQuestions[state.exIndex % exQuestions.length];
    
    if (isLoadingQuestions) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg animate-fade-in p-10 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-black mb-2">Preparando seu Desafio</h2>
          <p className="text-muted text-sm mb-8">Gerando 100 questões personalizadas via IA...</p>
          
          {loadingProgress > 0 && (
            <div className="w-full max-w-xs bg-card2 h-3 rounded-full overflow-hidden border border-border">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                className="h-full bg-gradient-to-r from-primary to-secondary"
              />
            </div>
          )}
          <p className="text-[10px] text-muted mt-4 uppercase tracking-widest font-bold">Progresso: {loadingProgress}%</p>
        </div>
      );
    }

    if (!q) return null;
    return (
      <div className="flex flex-col min-h-screen bg-bg animate-fade-in">
        <div className="p-6 bg-card border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-text" onClick={() => setScreen('home')}>
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="text-[10px] text-muted uppercase tracking-wider">{state.currentSubject}</div>
              <div className="text-lg font-extrabold">{state.currentTopic}</div>
            </div>
            <div className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold ${state.difficulty === 1 ? 'bg-success/15 text-success' : state.difficulty === 2 ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'}`}>
              {['', 'Fácil', 'Médio', 'Difícil'][state.difficulty]}
            </div>
          </div>
          <div className="text-xl font-bold text-text mb-2">{q.q}</div>
          <div className="text-xs text-muted">Matéria: {state.currentSubject}</div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < state.exIndex ? 'bg-success' : i === state.exIndex ? 'bg-primary' : 'bg-card2'}`}></div>
          ))}
        </div>

        <AnimatePresence>
          {algoMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mx-6 mb-4 p-3 px-4 rounded-lg text-xs flex items-center gap-2 border ${algoMsg.type === 'up' ? 'bg-success/10 border-success/30 text-success' : algoMsg.type === 'down' ? 'bg-danger/10 border-danger/30 text-danger' : 'bg-warning/10 border-warning/30 text-warning'}`}
            >
              {algoMsg.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted">Questão {state.exIndex + 1}</div>
            <div className="flex items-center gap-1.5 text-muted text-xs">
              ⏱ <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${timer <= 10 ? 'text-danger border-danger' : 'text-primary border-primary'}`}>{timer}</div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border leading-relaxed text-lg">{q.q}</div>
          <div className="flex flex-col gap-3">
            {q.opts.map((opt, i) => (
              <button
                key={i}
                disabled={showFeedback}
                onClick={() => handleAnswer(i)}
                className={`option-btn ${selectedOption === i ? (feedbackCorrect ? 'correct' : 'wrong') : (showFeedback && i === q.ans ? 'correct' : '')}`}
              >
                <div className="option-letter">{'ABCD'[i]}</div>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showFeedback && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg to-transparent z-50"
            >
              <div className={`rounded-xl p-5 flex flex-col gap-3 border ${feedbackCorrect ? 'bg-success/15 border-success/40' : 'bg-danger/15 border-danger/40'}`}>
                <div className="flex items-center justify-between">
                  <div className={`text-lg font-extrabold ${feedbackCorrect ? 'text-success' : 'text-danger'}`}>
                    {feedbackCorrect ? '✅ Resposta Correta!' : '❌ Resposta Incorreta'}
                  </div>
                  {feedbackCorrect && <div className="text-2xl font-black text-warning animate-xp-pop">+{state.difficulty * 30} XP</div>}
                </div>
                <div className="text-sm text-muted">
                  {feedbackCorrect ? `Excelente! ${['Fácil', 'Médio', 'Difícil'][state.difficulty - 1]} resolvido.` : `A resposta correta era: ${q.opts[q.ans]}`}
                </div>
                <div className="flex flex-col gap-2">
                  <button className="btn-next" onClick={() => nextQuestion(false)}>
                    {!feedbackCorrect && state.lastWrongQ ? '📖 Ver Explicação →' : 'Próxima →'}
                  </button>
                  
                  {!feedbackCorrect && (
                    <div className="flex gap-2">
                      {state.exIndex > 0 && (
                        <button 
                          className="btn-next bg-card border border-border flex-1 text-[10px]" 
                          onClick={prevQuestion}
                        >
                          ← Voltar Anterior
                        </button>
                      )}
                      <button 
                        className="btn-next bg-card border border-border flex-1 text-[10px]" 
                        onClick={() => nextQuestion(true)}
                      >
                        Pular Questão →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderReview = () => {
    const q = state.lastWrongQ;
    if (!q) return null;
    return (
      <div className="flex flex-col min-h-screen bg-bg animate-fade-in">
        <div className="p-5 px-6 flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-text" onClick={() => setScreen('home')}>
            <ChevronLeft size={20} />
          </button>
          <div className="text-lg font-extrabold">Revisão de Erro</div>
        </div>
        <div className="overflow-y-auto flex-1 pb-6">
          <div className="flex items-center gap-4 p-6">
            <div className="text-6xl">😅</div>
            <div className="flex-1">
              <h2 className="text-xl font-black">Ops! Vamos revisar</h2>
              <p className="text-muted text-sm mt-1 max-w-[200px]">{q.q}</p>
            </div>
          </div>
          
          <div className="mx-6 bg-card rounded-xl p-5 border border-border">
            <div className="text-xs font-bold text-muted uppercase tracking-widest mb-3.5">📖 Resolução Passo a Passo</div>
            <div className="flex flex-col gap-4">
              {q.explanation?.map((step, i) => (
                <div key={i} className="flex gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</div>
                  <div className="text-sm leading-relaxed text-text pt-1">{step}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-6 mt-4 bg-danger/10 border border-danger/25 rounded-lg p-4 px-5">
            <div className="text-[10px] font-bold text-danger uppercase tracking-widest mb-1.5">⚠️ Erro Comum</div>
            <div className="text-sm leading-relaxed">{q.mistake}</div>
          </div>

          <div className="p-5 px-6 flex flex-col gap-3">
            <button className="btn-primary w-full max-w-none" onClick={() => nextQuestion(true)}>Próxima Questão →</button>
            <button 
              className="btn-primary w-full max-w-none bg-card shadow-none border border-border" 
              onClick={() => {
                setShowFeedback(false);
                setSelectedOption(null);
                setAlgoMsg(null);
                setScreen('exercicio');
              }}
            >
              Tentar Novamente
            </button>
            <button 
              className="btn-primary w-full max-w-none bg-transparent shadow-none text-muted text-xs" 
              onClick={() => setScreen('home')}
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLevels = () => {
    const currentSubject = state.currentSubject || 'Matemática';
    const unlockedLevel = state.subjectLevels[currentSubject] || 1;
    
    return (
      <div className="flex flex-col min-h-screen bg-bg animate-fade-in pb-20">
        <div className="p-5 px-6 flex items-center justify-between bg-card border-b border-border sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-card2 flex items-center justify-center text-text" onClick={() => setScreen('home')}>
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="text-lg font-extrabold">{currentSubject}</div>
              <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Jornada de Conhecimento</div>
            </div>
          </div>
          <button 
            onClick={() => startExercicio(currentSubject, "Desafio Aleatório", 2, false, unlockedLevel, true)}
            className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-bold border border-primary/20 hover:bg-primary/20 transition-all"
          >
            <Zap size={12} className="fill-primary" />
            GERAR COM IA
          </button>
        </div>

        <div className="bg-primary/5 p-4 mx-6 mt-6 rounded-xl border border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <WifiOff size={18} />
            </div>
            <div>
              <div className="text-xs font-bold">Modo Offline Pronto</div>
              <div className="text-[10px] text-muted">Questões locais disponíveis sem internet.</div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 100 }).map((_, i) => {
              const levelNum = i + 1;
              const isLocked = levelNum > unlockedLevel;
              const isCurrent = levelNum === unlockedLevel;
              
              return (
                <div 
                  key={levelNum}
                  onClick={() => !isLocked && startExercicio(currentSubject, `Nível ${levelNum}`, 2, false, levelNum)}
                  className={`
                    aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer
                    ${isLocked ? 'bg-card/50 border-border opacity-50 grayscale' : 
                      isCurrent ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(108,99,255,0.3)]' : 
                      'bg-card border-border hover:border-primary/50'}
                  `}
                >
                  {isLocked ? (
                    <Lock size={16} className="text-muted" />
                  ) : (
                    <>
                      <div className={`text-lg font-black ${isCurrent ? 'text-primary' : 'text-white'}`}>{levelNum}</div>
                      <div className="flex gap-0.5 mt-1">
                        <Star size={6} className="fill-warning text-warning" />
                        <Star size={6} className="fill-warning text-warning" />
                        <Star size={6} className="fill-warning text-warning" />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  const renderPerfil = () => {
    const saveProfile = () => {
      setState(prev => ({ ...prev, profileName: tempProfileName }));
      setIsEditingProfile(false);
    };

    return (
      <div className="flex flex-col min-h-screen bg-bg animate-fade-in pb-20">
        <div className="overflow-y-auto flex-1">
          <div className="bg-gradient-to-br from-bg2 to-bg3 p-8 px-6 text-center">
            <div className="flex items-center justify-between mb-5">
              <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-white" onClick={() => setScreen('home')}>
                <ChevronLeft size={20} />
              </button>
              <div className="text-base font-bold">Perfil</div>
              <button 
                onClick={() => {
                  if (isEditingProfile) {
                    saveProfile();
                  } else {
                    setTempProfileName(state.profileName);
                    setIsEditingProfile(true);
                  }
                }}
                className="text-xs font-bold text-primary"
              >
                {isEditingProfile ? 'Salvar' : 'Editar'}
              </button>
            </div>
            
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl mx-auto mb-3.5 border-3 border-white/20">
                {state.profileAvatar}
              </div>
              {isEditingProfile && (
                <div className="absolute -bottom-2 -right-2 bg-card border border-border rounded-full p-1.5 shadow-lg">
                  <User size={12} className="text-primary" />
                </div>
              )}
            </div>

            {isEditingProfile ? (
              <div className="flex flex-col gap-4 items-center">
                <input 
                  type="text" 
                  value={tempProfileName}
                  onChange={(e) => setTempProfileName(e.target.value)}
                  className="bg-card border border-border rounded-lg px-4 py-2 text-center text-lg font-black focus:border-primary outline-none"
                />
                <div className="flex gap-2 flex-wrap justify-center">
                  {AVATARS.map(avatar => (
                    <button 
                      key={avatar.id}
                      onClick={() => setState(prev => ({ ...prev, profileAvatar: avatar.emoji }))}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 transition-all ${state.profileAvatar === avatar.emoji ? 'border-primary bg-primary/10 scale-110' : 'border-border bg-card'}`}
                    >
                      {avatar.emoji}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-black">{state.profileName}</div>
                <div className="text-muted text-sm mt-1">
                  Nível {state.level} · Liga Ouro 🏆
                  {isLocalMode && <span className="ml-2 text-[10px] bg-warning/20 text-warning px-2 py-0.5 rounded-full uppercase">Modo Local</span>}
                </div>
              </>
            )}

            <div className="mt-4">
              <div className="text-[10px] text-muted mb-1.5">Progresso para o próximo nível</div>
              <div className="h-2 bg-card2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
                  style={{ width: `${(state.correct % 10) * 10}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-muted mt-1">{state.correct % 10} / 10 acertos para subir</div>
            </div>
          </div>

        <div className="grid grid-cols-3 gap-3 mx-6 mt-5">
          <StatCard val={state.correct} label="Acertos" />
          <StatCard val={state.streak} label="Dias seguidos" />
          <StatCard val="87%" label="Taxa acerto" />
        </div>

        <div className="px-6 text-sm font-bold text-muted tracking-widest uppercase mt-6 mb-3">Conquistas</div>
        <div className="grid grid-cols-3 gap-3 px-6">
          <BadgeItem emoji="⭐" name="Primeiros Passos" />
          <BadgeItem emoji="🔥" name="Semana Perfeita" />
          <BadgeItem emoji="🧮" name="Mestre das Frações" />
          <BadgeItem emoji="⚡" name="Velocista" />
          <BadgeItem emoji="💎" name="100 Acertos" locked />
          <BadgeItem emoji="🦁" name="Liga Diamante" locked />
        </div>

        <div className="px-6 text-sm font-bold text-muted tracking-widest uppercase mt-6 mb-3">Ranking Global</div>
        <div className="px-6 flex flex-col gap-2.5">
          {isLocalMode ? (
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-2xl mb-2">🌐</div>
              <div className="text-sm font-bold mb-1 text-muted">Ranking Indisponível</div>
              <div className="text-[10px] text-muted leading-relaxed">
                Você está no Modo Local. Conecte-se ao Firebase para ver o ranking global.
              </div>
            </div>
          ) : globalRanking.map((u, i) => (
            <RankingItem 
              key={u.uid}
              pos={i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}º`} 
              emoji={u.profileAvatar} 
              name={u.username} 
              xp={`${(u.xp/1000).toFixed(1)}k XP`}
              me={u.uid === user?.uid}
            />
          ))}
        </div>
        
        <div className="px-6 mt-8">
          <p className="text-[10px] text-muted text-center italic">
            Seu progresso é salvo automaticamente neste dispositivo.
          </p>
        </div>
        <div className="h-6"></div>
      </div>
      <NavBar active="perfil" onNavigate={setScreen} onExercise={() => startExercicio('Matemática', 'Frações', 2)} />
    </div>
  );
};

  const startLocalMode = () => {
    setIsLocalMode(true);
    setAuthError(null);
    const localData = localStorage.getItem('edu_local_data');
    if (localData) {
      try {
        const data = JSON.parse(localData);
        setState(prev => ({
          ...prev,
          xp: data.xp || 0,
          level: data.level || 1,
          streak: data.streak || 0,
          correct: data.correct || 0,
          difficulty: data.difficulty || 1,
          profileName: data.profileName || '',
          profileAvatar: data.profileAvatar || '🦁',
          currentYear: data.currentYear || '',
          subjectLevels: data.subjectLevels || prev.subjectLevels,
        }));
        setScreen('home');
      } catch (e) {
        setScreen('onboarding');
      }
    } else {
      setScreen('onboarding');
    }
    setIsAuthLoading(false);
  };

  return (
    <ErrorBoundary>
      <div className="max-w-md mx-auto bg-bg min-h-screen shadow-2xl relative overflow-hidden">
        {authError ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center">
            <div className="text-6xl mb-6">🔓</div>
            <h1 className="text-xl font-black mb-4 text-danger">Acesso Restrito</h1>
            <p className="text-muted text-sm mb-8 leading-relaxed">
              {authError}
              <br /><br />
              Para resolver isso no Vercel, adicione as variáveis de ambiente (VITE_FIREBASE_API_KEY, etc.) nas configurações do seu projeto.
            </p>
            
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={startLocalMode}
                className="btn-primary w-full bg-gradient-to-r from-primary to-secondary"
              >
                Continuar no Modo Offline
              </button>
              
              <button 
                onClick={() => window.location.reload()}
                className="text-xs font-bold text-muted hover:text-primary transition-colors"
              >
                Tentar reconectar
              </button>
            </div>
          </div>
        ) : isAuthLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {screen === 'onboarding' && renderOnboarding()}
            {screen === 'home' && renderHome()}
            {screen === 'levels' && renderLevels()}
            {screen === 'exercicio' && renderExercicio()}
            {screen === 'review' && renderReview()}
            {screen === 'perfil' && renderPerfil()}
          </>
        )}

        <AnimatePresence>
          {showLevelUp && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] p-6"
            >
              <motion.div 
                initial={{ scale: 0.5, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                className="bg-gradient-to-br from-bg2 to-bg3 border-2 border-primary rounded-3xl p-10 px-8 text-center max-w-[300px]"
              >
                <div className="text-8xl mb-4">🎉</div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-warning to-secondary bg-clip-text text-transparent mb-2">LEVEL UP!</h2>
                <p className="text-muted text-sm mb-6">Você subiu para o <strong>Nível {state.level}</strong>!<br />Continue assim, {state.profileName}!</p>
                <button className="btn-primary w-full max-w-[200px]" onClick={() => setShowLevelUp(false)}>Continuar →</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

// Sub-components
function SubjectCard({ title, icon, mastery, progress, color, onClick, onDaily }: any) {
  const strokeColor = color === 'primary' ? '#6C63FF' : color === 'secondary' ? '#FF6584' : color === 'success' ? '#43D787' : '#FFB347';
  return (
    <div className="bg-card rounded-xl border border-border cursor-pointer hover:translate-y-[-4px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-250 relative overflow-hidden flex flex-col">
      <div onClick={onClick} className="p-5 flex-1">
        <div className={`absolute -top-7 -right-7 w-20 h-20 rounded-full opacity-10 ${color === 'primary' ? 'bg-primary' : color === 'secondary' ? 'bg-secondary' : color === 'success' ? 'bg-success' : 'bg-warning'}`}></div>
        <div className="text-3xl mb-2.5">{icon}</div>
        <div className="text-sm font-bold mb-1.5">{title}</div>
        <div className="text-[10px] text-muted mb-2.5">Maestria em {mastery}</div>
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-muted leading-tight">
            {title === 'Matemática' ? 'Geometria: 40%\nFrações: 85%' : title === 'Português' ? 'Gramática: 72%\nRedação: 55%' : title === 'Ciências' ? 'Biologia: 78%\nQuímica: 30%' : 'Brasil: 68%\nGeral: 45%'}
          </div>
          <div className="relative w-10 h-10">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle className="fill-none stroke-card2 stroke-[5]" cx="18" cy="18" r="15.5" />
              <circle 
                className="fill-none stroke-[5] stroke-linecap-round transition-all duration-1000" 
                cx="18" cy="18" r="15.5" 
                stroke={strokeColor}
                strokeDasharray={`${(progress / 100) * 97} 97`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">{progress}%</div>
          </div>
        </div>
      </div>
      <div 
        onClick={(e) => { e.stopPropagation(); onDaily(); }}
        className="bg-white/5 border-t border-border p-2.5 text-center text-[9px] font-black uppercase tracking-widest hover:bg-primary/20 transition-colors text-primary"
      >
        ⚡ Desafio 100 Qs
      </div>
    </div>
  );
}

function NavBar({ active, onNavigate, onExercise }: { active: string, onNavigate: (s: Screen) => void, onExercise: () => void }) {
  return (
    <nav className="flex bg-card border-t border-border p-3 pb-[max(12px,env(safe-area-inset-bottom))] fixed bottom-0 left-0 right-0 max-w-md mx-auto">
      <NavItem active={active === 'home'} icon={<HomeIcon size={20} />} label="Home" onClick={() => onNavigate('home')} />
      <NavItem active={active === 'exercicio'} icon={<ClipboardList size={20} />} label="Exercícios" onClick={onExercise} />
      <NavItem active={active === 'ranking'} icon={<Trophy size={20} />} label="Ranking" onClick={() => onNavigate('perfil')} />
      <NavItem active={active === 'perfil'} icon={<User size={20} />} label="Perfil" onClick={() => onNavigate('perfil')} />
    </nav>
  );
}

function NavItem({ active, icon, label, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex-1 flex flex-col items-center gap-1 cursor-pointer text-[10px] font-semibold transition-colors duration-200 p-1 ${active ? 'text-primary' : 'text-muted'}`}>
      <div className="text-xl">{icon}</div>
      {label}
    </div>
  );
}

function StatCard({ val, label }: any) {
  return (
    <div className="bg-card rounded-lg p-4 px-3 text-center border border-border">
      <div className="text-2xl font-black text-primary">{val}</div>
      <div className="text-[10px] text-muted mt-1">{label}</div>
    </div>
  );
}

function BadgeItem({ emoji, name, locked }: any) {
  return (
    <div className={`bg-card rounded-lg p-4 px-3 text-center border border-border ${locked ? 'opacity-35 grayscale' : ''}`}>
      <div className="text-3xl mb-1.5">{emoji}</div>
      <div className="text-[10px] font-semibold">{name}</div>
    </div>
  );
}

function RankingItem({ pos, emoji, name, xp, me }: any) {
  return (
    <div className={`flex items-center gap-3.5 bg-card rounded-lg p-3.5 px-4 border border-border ${me ? 'border-primary bg-primary/10' : ''}`}>
      <div className={`text-base font-extrabold w-6 ${me ? 'text-primary' : ''}`}>{pos}</div>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg">{emoji}</div>
      <div className="flex-1 text-sm font-semibold">{name}</div>
      <div className="text-sm font-bold text-warning">{xp}</div>
    </div>
  );
}
