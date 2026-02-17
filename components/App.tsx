
import React, { useState, useEffect } from 'react';
import Layout from './Layout.tsx';
import Quiz from './Quiz.tsx';
import Scramble from './Scramble.tsx';
import { View, UserStats } from '../types';
import { BookOpen, Layout as LayoutIcon, Trophy, Sparkles, Target, Zap, Clock, ArrowRight } from 'lucide-react';

const HomeView: React.FC<{ setView: (view: View) => void }> = ({ setView }) => {
  return (
    <div className="space-y-24 fade-up">
      {/* Hero Section */}
      <div className="text-center space-y-12">
        <div className="space-y-6">
          <h2 className="text-6xl md:text-8xl font-serif tracking-tight leading-tight font-bold text-gold-solid text-shadow-vivid italic">
            知の解剖
          </h2>
          <p className="text-amber-500/60 font-serif italic text-lg md:text-xl tracking-[0.5em] uppercase font-bold">Anatomy of Knowledge</p>
        </div>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-academic font-medium">
          最高峰の英語力。言葉の深淵に触れる体験。<br/>学術的語彙と論理を、美しく、スマートに。
        </p>

        <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-8">
          <button 
            onClick={() => setView('quiz')}
            className="group w-full sm:w-72 px-8 py-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-slate-950 font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-amber-500/20"
          >
            <div className="text-[10px] uppercase tracking-widest opacity-80 mb-1">Word</div>
            <div className="text-xl font-serif">単語学習</div>
          </button>
          
          <button 
            onClick={() => setView('scramble')}
            className="group w-full sm:w-72 px-8 py-6 bg-slate-950 gold-border rounded-2xl text-amber-400 font-bold transition-all hover:bg-slate-900 hover:gold-border-focus active:scale-95"
          >
            <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Passage</div>
            <div className="text-xl font-serif">文章並び替え</div>
          </button>
        </div>
      </div>

      {/* Quote */}
      <div className="max-w-2xl mx-auto pt-20 border-t border-amber-500/10 text-center">
        <p className="text-slate-500 font-academic italic text-lg leading-relaxed">
          "The limit of my language means the limit of my world."
        </p>
        <p className="text-[10px] uppercase tracking-[0.5em] text-amber-600/60 mt-6 font-bold">— Ludwig Wittgenstein</p>
      </div>
    </div>
  );
};

const StatsView: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({
    quizScore: 0,
    quizzesCompleted: 0,
    scrambleCompleted: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('lv_stats');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  const accuracy = stats.quizzesCompleted > 0 
    ? Math.round((stats.quizScore / stats.quizzesCompleted) * 100) 
    : 0;

  return (
    <div className="space-y-16 fade-up">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-serif text-slate-100 italic font-bold">探求の記録</h2>
        <p className="text-amber-500 text-xs uppercase tracking-[0.5em] font-bold">Scholarly Achievements</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
        <div className="bg-slate-950 p-10 rounded-3xl gold-border text-center space-y-3">
          <div className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">Accuracy</div>
          <div className="text-5xl font-serif text-white font-bold">{accuracy}%</div>
        </div>
        <div className="bg-slate-950 p-10 rounded-3xl gold-border text-center space-y-3">
          <div className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">Vocabulary</div>
          <div className="text-5xl font-serif text-white font-bold">{stats.quizzesCompleted}</div>
        </div>
        <div className="bg-slate-950 p-10 rounded-3xl gold-border text-center space-y-3">
          <div className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">Logic</div>
          <div className="text-5xl font-serif text-white font-bold">{stats.scrambleCompleted}</div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto pt-10 text-center space-y-6">
         <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000 shadow-[0_0_20px_rgba(251,191,36,0.3)]" 
              style={{ width: `${Math.min(100, (stats.quizzesCompleted / 20) * 100)}%` }}
            />
         </div>
         <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500 font-bold">
           Rank: <span className="text-white italic">Etymology Initiate</span>
         </p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <HomeView setView={setView} />;
      case 'quiz':
        return <Quiz onHome={() => setView('home')} />;
      case 'scramble':
        return <Scramble onHome={() => setView('home')} />;
      case 'stats':
        return <StatsView />;
      default:
        return <HomeView setView={setView} />;
    }
  };

  return (
    <Layout currentView={view} setView={setView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
