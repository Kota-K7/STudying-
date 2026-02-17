
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Quiz from './components/Quiz';
import Scramble from './components/Scramble';
import { View, UserStats } from './types';
import { BookOpen, Layout as LayoutIcon, Award, Trophy, ChevronRight, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [stats, setStats] = useState<UserStats>({ quizScore: 0, quizzesCompleted: 0, scrambleCompleted: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('lv_stats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, [view]);

  const renderHome = () => (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="text-center space-y-6 pt-10">
        <h2 className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-white leading-tight">
          知の<span className="text-amber-500">解剖。</span>
        </h2>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-light leading-relaxed font-serif italic">
          An intellectual sanctuary dedicated to the genesis of language. <br/>
          Master the hidden architecture of thought through etymological dissection and logical reconstruction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <button 
          onClick={() => setView('quiz')}
          className="group glass-card p-8 rounded-2xl border border-slate-800 hover:border-amber-500 transition-all text-left space-y-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
            <BookOpen size={120} />
          </div>
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold">語源学クイズ</h3>
            <p className="text-slate-400 text-sm mt-1">接頭辞・接尾辞・語根から英単語を解剖し、言葉の系譜を紐解きます。</p>
          </div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest pt-4">
            探求を開始する <ChevronRight size={16} />
          </div>
        </button>

        <button 
          onClick={() => setView('scramble')}
          className="group glass-card p-8 rounded-2xl border border-slate-800 hover:border-sky-500 transition-all text-left space-y-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
            <LayoutIcon size={120} />
          </div>
          <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
            <LayoutIcon size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold">文章再構築</h3>
            <p className="text-slate-400 text-sm mt-1">断片化された思考を論理的に繋ぎ合わせ、文章の真髄を捉えます。</p>
          </div>
          <div className="flex items-center gap-2 text-sky-500 font-bold text-xs uppercase tracking-widest pt-4">
            論理を構築する <ChevronRight size={16} />
          </div>
        </button>
      </div>

      <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-8 max-w-3xl mx-auto opacity-60">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-serif font-bold">{stats.quizzesCompleted}</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Dissected</div>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div className="text-center">
            <div className="text-2xl font-serif font-bold">{stats.scrambleCompleted}</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Constructed</div>
          </div>
        </div>
        <div className="text-slate-500 text-sm font-serif italic">
          "The limit of your language is the limit of your world."
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <Trophy className="mx-auto text-amber-500 mb-4" size={48} />
        <h2 className="text-4xl font-serif font-bold text-slate-100">学習ポートフォリオ</h2>
        <p className="text-slate-400 italic">アカデミック・マスターへの軌跡</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center">
          <Award className="mx-auto text-amber-400 mb-4" size={32} />
          <div className="text-4xl font-bold mb-1">{stats.quizScore}</div>
          <div className="text-xs uppercase tracking-widest text-slate-500">正確性</div>
        </div>
        <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center">
          <BookOpen className="mx-auto text-sky-400 mb-4" size={32} />
          <div className="text-4xl font-bold mb-1">{stats.quizzesCompleted}</div>
          <div className="text-xs uppercase tracking-widest text-slate-500">合計セッション</div>
        </div>
        <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center">
          <LayoutIcon className="mx-auto text-emerald-400 mb-4" size={32} />
          <div className="text-4xl font-bold mb-1">{stats.scrambleCompleted}</div>
          <div className="text-xs uppercase tracking-widest text-slate-500">完了タスク</div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={() => {
            const text = `Linguist Vibeで ${stats.quizzesCompleted} 回の言語探求を完了しました。🎓✨ #LinguistVibe #AcademicEnglish`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
          }}
          className="flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-950 font-bold rounded-xl hover:bg-white transition-all active:scale-95 shadow-xl"
        >
          <Share2 size={20} /> 学習成果をシェアする
        </button>
      </div>
    </div>
  );

  return (
    <Layout currentView={view} setView={setView}>
      {view === 'home' && renderHome()}
      {view === 'quiz' && <Quiz onHome={() => setView('home')} />}
      {view === 'scramble' && <Scramble onHome={() => setView('home')} />}
      {view === 'stats' && renderStats()}
    </Layout>
  );
};

export default App;
