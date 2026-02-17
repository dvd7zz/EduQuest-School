
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { User, UserRole, Test, Subject, Question } from '../types';
import { firebaseService } from '../store/firebaseService';
import { SUBJECT_ICONS, UI_ICONS } from '../constants';
import { Plus, Edit2, Trash2, X, Save, Users, BookCopy } from 'lucide-react';

const Admin: React.FC<{ user: User | null }> = ({ user }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<any>({ title: '', subject: Subject.MATH, grade: 7, durationMinutes: 15, questions: [] });

  const loadData = async () => {
    setLoading(true);
    const [t, u] = await Promise.all([firebaseService.getTests(), firebaseService.getAllUsers()]);
    setTests(t);
    setAllUsers(u);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role === UserRole.ADMIN) loadData();
  }, [user]);

  if (!user || user.role !== UserRole.ADMIN) return <Navigate to="/" />;

  const handleSave = async () => {
    await firebaseService.saveTest(currentTest);
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("O'chirilsinmi?")) {
      await firebaseService.deleteTest(id);
      loadData();
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Admin yuklanmoqda...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <header className="flex justify-between items-center border-b pb-10">
        <h1 className="text-4xl font-extrabold">Admin Panel</h1>
        <button onClick={() => { setCurrentTest({ title: '', subject: Subject.MATH, grade: 7, durationMinutes: 15, questions: [] }); setIsModalOpen(true); }} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2">
          <Plus size={20} /> Yangi Test
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 bg-white border rounded-[2.5rem] p-6 h-fit shadow-sm">
           <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Users /> O'quvchilar</h2>
           <div className="space-y-4">
              {allUsers.filter(u => u.role !== UserRole.ADMIN).map(u => (
                <div key={u.id} className="flex justify-between items-center p-3 border-b">
                   <p className="font-bold">{u.fullName}</p>
                   <p className="text-indigo-600 font-black">{u.points || 0} ball</p>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
           <h2 className="text-xl font-bold flex items-center gap-2"><BookCopy /> Testlar</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tests.map(test => (
                <div key={test.id} className="bg-white p-6 border rounded-[2rem] shadow-sm flex flex-col justify-between">
                   <div>
                     <p className="text-xs text-slate-400 font-black uppercase">{test.subject}</p>
                     <h3 className="text-xl font-bold">{test.title}</h3>
                   </div>
                   <div className="flex gap-2 mt-6">
                      <button onClick={() => { setCurrentTest(test); setIsModalOpen(true); }} className="flex-1 py-2 bg-slate-50 rounded-xl font-bold">Tahrirlash</button>
                      <button onClick={() => handleDelete(test.id)} className="p-2 bg-red-50 text-red-600 rounded-xl"><Trash2 size={18}/></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-4xl h-[90vh] rounded-[3rem] p-10 overflow-y-auto">
              <h2 className="text-3xl font-black mb-8">Test tahrirlash</h2>
              <input type="text" className="w-full p-4 border rounded-2xl mb-4" value={currentTest.title} onChange={e => setCurrentTest({...currentTest, title: e.target.value})} placeholder="Sarlavha" />
              {/* Savollar boshqaruvi (plus, minus) xuddi avvalgidek qoladi */}
              <div className="flex gap-4 mt-10">
                <button onClick={() => setIsModalOpen(false)} className="px-10 py-4 bg-slate-100 rounded-2xl font-bold">Bekor qilish</button>
                <button onClick={handleSave} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold">Saqlash</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
