
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Test, TestResult, User, Question } from '../types';
import { firebaseService } from '../store/firebaseService';
import { UI_ICONS } from '../constants';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const TestPage: React.FC<{ user: User | null }> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState<Test | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    firebaseService.getTests().then(allTests => {
      const t = allTests.find(item => item.id === id);
      if (!t) { navigate('/subjects'); return; }
      
      const randomizedQuestions = shuffleArray(t.questions).map(q => {
        const optionsWithMeta = q.options.map((opt, idx) => ({ text: opt, isCorrect: idx === q.correctAnswer }));
        const shuffledOptionsMeta = shuffleArray(optionsWithMeta);
        return { ...q, options: shuffledOptionsMeta.map(o => o.text), correctAnswer: shuffledOptionsMeta.findIndex(o => o.isCorrect) };
      });
      
      setTest(t);
      setShuffledQuestions(randomizedQuestions);
      setTimeLeft(t.durationMinutes * 60);
      setAnswers(new Array(t.questions.length).fill(-1));
    });
  }, [id, user, navigate]);

  useEffect(() => {
    if (timeLeft <= 0 || isFinished) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleFinish = async () => {
    if (!test || !user || submitting) return;
    setSubmitting(true);
    
    let score = 0;
    shuffledQuestions.forEach((q, idx) => { if (answers[idx] === q.correctAnswer) score++; });

    const result: TestResult = {
      id: '', // Firebase addDoc o'zi yaratadi
      userId: user.id,
      testId: test.id,
      subject: test.subject,
      score,
      totalQuestions: test.questions.length,
      completedAt: new Date().toISOString()
    };

    await firebaseService.saveTestResult(result, user.points || 0);
    setIsFinished(true);
    setSubmitting(false);
  };

  if (!test) return <div className="p-20 text-center font-bold text-slate-400">Yuklanmoqda...</div>;

  if (isFinished) {
    const score = shuffledQuestions.reduce((acc, q, idx) => (answers[idx] === q.correctAnswer ? acc + 1 : acc), 0);
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="glass-card p-10 rounded-[3rem] text-center space-y-8">
          <div className="text-6xl">🎉</div>
          <h2 className="text-4xl font-extrabold">Natija: {score}/{test.questions.length}</h2>
          <p className="text-slate-500">Siz {score * 5} ball jamg'ardingiz!</p>
          <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg">Dashboardga qaytish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Test interfeysi: Progress bar, Savollar... */}
      <div className="bg-white p-10 rounded-[3rem] border shadow-xl space-y-10">
        <h2 className="text-2xl font-bold">{shuffledQuestions[currentQuestionIndex]?.text}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shuffledQuestions[currentQuestionIndex]?.options.map((option, idx) => (
            <button key={idx} onClick={() => { const a = [...answers]; a[currentQuestionIndex] = idx; setAnswers(a); }} className={`p-6 text-left rounded-3xl border-2 transition-all font-semibold ${answers[currentQuestionIndex] === idx ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100'}`}>
              {option}
            </button>
          ))}
        </div>
        <div className="flex justify-between pt-8 border-t">
          <button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(prev => prev - 1)} className="px-8 py-3 bg-slate-100 rounded-2xl font-bold">Orqaga</button>
          {currentQuestionIndex === shuffledQuestions.length - 1 ? (
            <button onClick={handleFinish} disabled={submitting} className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl">{submitting ? 'Saqlanmoqda...' : 'Yakunlash'}</button>
          ) : (
            <button disabled={answers[currentQuestionIndex] === -1} onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl">Keyingisi</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
