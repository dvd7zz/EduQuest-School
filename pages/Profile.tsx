
import React, { useState } from 'react';
import { User } from '../types';
import { firebaseService } from '../store/firebaseService';
import { UI_ICONS } from '../constants';

const Profile: React.FC<{ user: User | null; onUpdate: (u: User) => void }> = ({ user, onUpdate }) => {
  if (!user) return null;
  const [formData, setFormData] = useState({ fullName: user.fullName, grade: user.grade || 1, avatar: user.avatar || '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const updatedUser = { ...user, ...formData };
    await firebaseService.saveUserProfile(updatedUser);
    onUpdate(updatedUser);
    setSuccess(true);
    setLoading(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="glass-card p-10 rounded-[3rem] shadow-2xl space-y-10">
        <header className="text-center space-y-4">
          <div className="w-32 h-32 bg-indigo-50 rounded-full mx-auto flex items-center justify-center text-5xl">
            {formData.avatar || '👨‍🎓'}
          </div>
          <h1 className="text-3xl font-extrabold">Profilni Tahrirlash</h1>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input className="w-full p-4 border rounded-2xl" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="To'liq ism" />
          <select className="w-full p-4 border rounded-2xl" value={formData.grade} onChange={e => setFormData({...formData, grade: Number(e.target.value)})}>
             {[...Array(11)].map((_, i) => <option key={i+1} value={i+1}>{i+1}-sinf</option>)}
          </select>
          {success && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-center font-bold">Saqlandi!</div>}
          <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg">
            {loading ? 'Saqlanmoqda...' : 'Ma\'lumotlarni Saqlash'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
