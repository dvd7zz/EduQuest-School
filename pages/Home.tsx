
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Subject, UserRole, User, TestResult } from '../types';
import { SUBJECT_ICONS, UI_ICONS } from '../constants';
import { firebaseService } from '../store/firebaseService';

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const subjects = Object.values(Subject);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allUsers, activities] = await Promise.all([
          firebaseService.getAllUsers(),
          firebaseService.getRecentResults(5)
        ]);
        setUsers(allUsers);
        
        // Faollikka foydalanuvchi ismlarini biriktirish
        const enrichedActivity = activities.map(act => ({
          ...act,
          user: allUsers.find(u => u.id === act.userId)
        }));
        setRecentActivity(enrichedActivity);
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const leaderboard = useMemo(() => {
    return users
      .filter(u => u.role !== UserRole.ADMIN)
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 5);
  }, [users]);

  if (loading) return (
    <div className="py-20 text-center animate-pulse text-slate-400 font-bold">Yuklanmoqda...</div>
  );

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
          Bilimlar <span className="gradient-text">Maydoni</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Testlarni topshiring, peshqadamlar jadvalida yuqori o'rinlarni egallang!
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/subjects" className="px-10 py-5 bg-indigo-600 text-white rounded-3xl font-bold text-xl hover:bg-indigo-700 shadow-xl transition-all">
            Hozir boshlash
          </Link>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl">{UI_ICONS.Trophy}</div>
            <h2 className="text-3xl font-black text-slate-900">Top O'quvchilar</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">O'rin</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">O'quvchi</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">Jami Ball</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leaderboard.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-all">
                    <td className="px-8 py-6">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                        idx === 0 ? 'bg-amber-400 text-white shadow-lg' : 'text-slate-400'
                      }`}>{idx + 1}</div>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-900">{user.fullName}</td>
                    <td className="px-8 py-6">
                      <span className="text-2xl font-black text-indigo-600">{user.points || 0}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl">{UI_ICONS.LayoutDashboard}</div>
             <h2 className="text-2xl font-black text-slate-900">So'nggi faollik</h2>
          </div>
          <div className="space-y-4">
             {recentActivity.map((activity, i) => (
               <div key={i} className="p-6 bg-white border border-slate-200 rounded-[2rem] flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                    {activity.user?.fullName?.charAt(0) || '?'}
                  </div>
                  <div className="flex-grow">
                     <p className="text-slate-900 font-bold">{activity.user?.fullName || 'Noma\'lum'}</p>
                     <p className="text-xs text-slate-500">{activity.subject} • {activity.score} ball</p>
                  </div>
                  <div className="text-right text-emerald-600 font-black">+{activity.score * 5}</div>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
