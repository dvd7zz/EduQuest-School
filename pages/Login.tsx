
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, UserRole } from '../types';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseService } from '../store/firebaseService';
import { UI_ICONS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSignUp = searchParams.get('mode') === 'signup';

  const [formData, setFormData] = useState({
    email: '', // Firebase uchun email kerak
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // 1. Firebase Auth orqali akkaunt yaratish
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // 2. Firestore-da profil yaratish
        const newUser: User = {
          id: userCredential.user.uid,
          username: formData.email.split('@')[0],
          fullName: formData.fullName,
          role: UserRole.USER,
          points: 0,
          grade: 1
        };
        await firebaseService.saveUserProfile(newUser);
        onLogin(newUser);
      } else {
        // Login qilish
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const profile = await firebaseService.getUserProfile(userCredential.user.uid);
        if (profile) onLogin(profile);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message.includes('auth/user-not-found') ? 'Foydalanuvchi topilmadi' : 'Xatolik yuz berdi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full glass-card p-10 rounded-[2.5rem] shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-lg">
            {UI_ICONS.GraduationCap}
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {isSignUp ? "Ro'yxatdan o'tish" : 'Xush kelibsiz'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Ism-familiya</label>
              <input
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                placeholder="Ali Valiyev"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email (Login uchun)</label>
            <input
              required
              type="email"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              placeholder="misol@mail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Parol</label>
            <input
              required
              type="password"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">{error}</div>}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Kuting...' : (isSignUp ? "Ro'yxatdan o'tish" : 'Tizimga kirish')}
          </button>
        </form>
        
        <div className="text-center">
          <button onClick={() => navigate(isSignUp ? '/login' : '/login?mode=signup')} className="text-indigo-600 font-semibold hover:underline">
            {isSignUp ? 'Hisobingiz bormi? Kirish' : "Hisobingiz yo'qmi? Ro'yxatdan o'tish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
