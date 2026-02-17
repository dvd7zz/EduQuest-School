
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { UI_ICONS } from '../constants';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              {UI_ICONS.GraduationCap}
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EduQuest
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">
                  Dashboard
                </Link>
                {user.role === UserRole.ADMIN && (
                  <Link to="/admin" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium flex items-center space-x-1">
                    <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                      {React.cloneElement(UI_ICONS.Settings as React.ReactElement, { size: 18 })}
                    </span>
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
                  <Link to="/profile" className="flex items-center space-x-3 group">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{user.fullName}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl overflow-hidden group-hover:ring-2 group-hover:ring-indigo-200 transition-all">
                      {user.avatar && user.avatar.length < 5 ? (
                        user.avatar
                      ) : user.avatar ? (
                        <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />
                      ) : (
                        <span className="text-indigo-600 font-bold">{user.fullName.charAt(0)}</span>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      navigate('/');
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Chiqish"
                  >
                    {React.cloneElement(UI_ICONS.LogOut as React.ReactElement, { size: 20 })}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                >
                  Kirish
                </Link>
                <Link 
                  to="/login?mode=signup" 
                  className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-95"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
