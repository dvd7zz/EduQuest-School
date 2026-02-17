
import React from 'react';
import { 
  Calculator, 
  BookOpen, 
  Zap, 
  Dna, 
  FlaskConical, 
  GraduationCap, 
  Trophy, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Languages,
  Library,
  User,
  Camera,
  Award,
  Download,
  Instagram,
  Facebook,
  Send
} from 'lucide-react';
import { Subject } from './types';

export const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  [Subject.MATH]: <Calculator className="w-6 h-6 text-blue-500" />,
  [Subject.ENGLISH]: <BookOpen className="w-6 h-6 text-purple-500" />,
  [Subject.PHYSICS]: <Zap className="w-6 h-6 text-orange-500" />,
  [Subject.BIOLOGY]: <Dna className="w-6 h-6 text-green-500" />,
  [Subject.CHEMISTRY]: <FlaskConical className="w-6 h-6 text-red-500" />,
  [Subject.ONATILI]: <Languages className="w-6 h-6 text-cyan-500" />,
  [Subject.ADABIYOT]: <Library className="w-6 h-6 text-amber-500" />,
};

export const UI_ICONS = {
  GraduationCap: <GraduationCap />,
  Trophy: <Trophy />,
  Settings: <Settings />,
  LogOut: <LogOut />,
  LayoutDashboard: <LayoutDashboard />,
  Clock: <Clock />,
  Check: <CheckCircle2 />,
  Cross: <XCircle />,
  Chart: <BarChart3 />,
  User: <User />,
  Camera: <Camera />,
  Award: <Award />,
  Download: <Download />,
  Instagram: <Instagram />,
  Facebook: <Facebook />,
  Telegram: <Send />
};
