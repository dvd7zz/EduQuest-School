
import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, TestResult } from '../types';
import { firebaseService } from '../store/firebaseService';
import { SUBJECT_ICONS, UI_ICONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCert, setShowCert] = useState(false);

  useEffect(() => {
    if (user) {
      firebaseService.getUserResults(user.id)
        .then(setResults)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return null;

  const points = user.points || 0;
  const targetPoints = 100;
  const progressPercent = Math.min((points / targetPoints) * 100, 100);
  
  const stats = useMemo(() => {
    const total = results.length;
    const avgScore = total > 0 
      ? Math.round(results.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / total)
      : 0;
    
    const subjectData = results.reduce((acc: any[], r) => {
      const existing = acc.find(item => item.name === r.subject);
      const scorePercent = (r.score / r.totalQuestions) * 100;
      if (existing) {
        existing.total += scorePercent;
        existing.count += 1;
        existing.value = Math.round(existing.total / existing.count);
      } else {
        acc.push({ name: r.subject, total: scorePercent, count: 1, value: Math.round(scorePercent) });
      }
      return acc;
    }, []);

    return { total, avgScore, subjectData };
  }, [results]);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Yuklanmoqda...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900">Salom, {user.fullName}! 👋</h1>
          <p className="text-slate-500 mt-2 text-lg">Sizning natijalaringiz markazi.</p>
        </div>
        <Link to="/subjects" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg">
          Yangi test boshlash
        </Link>
      </header>

      {/* Point Progress System */}
      <div className="glass-card p-8 rounded-[3rem] border border-indigo-100 shadow-xl bg-gradient-to-br from-indigo-50/50 to-white">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-grow space-y-4">
             <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold text-slate-900">Sertifikat progressi</h3>
                <div className="text-right">
                   <span className="text-3xl font-black text-indigo-600">{points}</span>
                   <span className="text-slate-400 font-bold"> / {targetPoints} ball</span>
                </div>
             </div>
             <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
             </div>
             {points >= targetPoints && (
                <button onClick={() => setShowCert(true)} className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 animate-bounce">
                  {UI_ICONS.Award} Sertifikatni ko'rish
                </button>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-white border border-slate-200 rounded-[2rem] flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">{UI_ICONS.Chart}</div>
          <div><p className="text-slate-500">Testlar</p><p className="text-3xl font-bold">{stats.total}</p></div>
        </div>
        <div className="p-8 bg-white border border-slate-200 rounded-[2rem] flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">{UI_ICONS.Check}</div>
          <div><p className="text-slate-500">O'rtacha</p><p className="text-3xl font-bold">{stats.avgScore}%</p></div>
        </div>
        <div className="p-8 bg-white border border-slate-200 rounded-[2rem] flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">{UI_ICONS.Trophy}</div>
          <div><p className="text-slate-500">Ballaringiz</p><p className="text-3xl font-bold">{points}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 border border-slate-200 rounded-[2.5rem] shadow-sm">
          <h3 className="text-xl font-bold mb-6">Fanlar bo'yicha progress</h3>
          <div className="h-[300px] w-full">
            {stats.subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.subjectData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40} fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center py-20 text-slate-400 italic">Hali natijalar yo'q</p>}
          </div>
        </div>

        <div className="bg-white p-8 border border-slate-200 rounded-[2.5rem] shadow-sm">
          <h3 className="text-xl font-bold mb-6">Oxirgi natijalar</h3>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {results.map(res => (
              <div key={res.id} className="p-5 border border-slate-100 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border rounded-xl flex items-center justify-center">{SUBJECT_ICONS[res.subject]}</div>
                  <div><p className="font-bold">{res.subject}</p><p className="text-xs text-slate-500">{new Date(res.completedAt).toLocaleDateString()}</p></div>
                </div>
                <p className="text-lg font-bold text-indigo-600">+{res.score * 5} ball</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Sertifikat Modal (avvalgi koddan foydalanamiz) */}
      {showCert && <div onClick={() => setShowCert(false)} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">...</div>}
    </div>
  );
};

export default Dashboard;
