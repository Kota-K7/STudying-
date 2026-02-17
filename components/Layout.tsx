
import React from 'react';
import { BookOpen, Trophy, Layout as LayoutIcon, Home } from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      <header className="sticky top-0 z-50 glass-card px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-amber-500/20">
            <span className="text-slate-950 font-bold">LV</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight font-serif italic text-amber-500">Linguist Vibe</h1>
        </div>
        <nav className="flex items-center gap-4">
          <button 
            onClick={() => setView('stats')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${currentView === 'stats' ? 'bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/50' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Trophy size={18} />
            <span className="text-xs font-bold hidden sm:inline">学習記録</span>
          </button>
        </nav>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>

      <footer className="sticky bottom-0 glass-card border-t border-slate-800 px-6 py-4 flex justify-around md:hidden">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-amber-500' : 'text-slate-400'}`}>
          <Home size={20} />
          <span className="text-[10px] font-bold tracking-wider">ホーム</span>
        </button>
        <button onClick={() => setView('quiz')} className={`flex flex-col items-center gap-1 ${currentView === 'quiz' ? 'text-amber-500' : 'text-slate-400'}`}>
          <BookOpen size={20} />
          <span className="text-[10px] font-bold tracking-wider">語源クイズ</span>
        </button>
        <button onClick={() => setView('scramble')} className={`flex flex-col items-center gap-1 ${currentView === 'scramble' ? 'text-amber-500' : 'text-slate-400'}`}>
          <LayoutIcon size={20} />
          <span className="text-[10px] font-bold tracking-wider">並び替え</span>
        </button>
      </footer>
    </div>
  );
};

export default Layout;
