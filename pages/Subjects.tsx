
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Subject, Test } from '../types';
import { firebaseService } from '../store/firebaseService';
import { SUBJECT_ICONS, UI_ICONS } from '../constants';

const Subjects: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>((searchParams.get('subject') as Subject) || 'All');
  const [selectedGrade, setSelectedGrade] = useState<number | 'All'>('All');

  useEffect(() => {
    firebaseService.getTests().then(data => {
      setTests(data);
      setLoading(false);
    });
  }, []);

  const filteredTests = tests.filter(t => {
    const subMatch = selectedSubject === 'All' || t.subject === selectedSubject;
    const gradeMatch = selectedGrade === 'All' || t.grade === selectedGrade;
    return subMatch && gradeMatch;
  });

  if (loading) return <div className="py-20 text-center font-bold text-slate-400">Testlar yuklanmoqda...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900">Bilimlar Xazinasi</h1>
        <p className="text-slate-500 text-lg">O'zingizga mos testni tanlang</p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedSubject('All')} className={`px-6 py-2.5 rounded-2xl font-semibold ${selectedSubject === 'All' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Barchasi</button>
          {Object.values(Subject).map(sub => (
            <button key={sub} onClick={() => setSelectedSubject(sub)} className={`px-6 py-2.5 rounded-2xl font-semibold flex items-center gap-2 ${selectedSubject === sub ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
              {SUBJECT_ICONS[sub]} {sub}
            </button>
          ))}
        </div>
        <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value === 'All' ? 'All' : Number(e.target.value))} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl outline-none">
          <option value="All">Barcha sinflar</option>
          {[...Array(11)].map((_, i) => <option key={i+1} value={i+1}>{i+1}-sinf</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTests.map((test) => (
          <div key={test.id} className="group glass-card p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all flex flex-col h-full">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">{SUBJECT_ICONS[test.subject]}</div>
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-full">{test.grade}-sinf</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{test.title}</h3>
            <p className="text-slate-500 text-sm mb-6 flex-grow">Jami {test.questions.length * 5} ballgacha to'plashingiz mumkin.</p>
            <button onClick={() => navigate(`/test/${test.id}`)} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100">Testni boshlash</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
