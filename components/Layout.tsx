
import React from 'react';
import { Trophy, Home, BookOpen, Layout as LayoutIcon } from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100">
      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md px-8 py-5 flex items-center justify-between border-b border-amber-500/10">
        <div 
          className="flex items-center gap-6 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="text-4xl font-serif italic text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)] tracking-tighter transition-transform group-hover:scale-110">
            Lp
          </div>
          <div className="h-6 w-[1px] bg-amber-500/20 hidden sm:block"></div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-serif tracking-[0.1em] text-slate-100 font-bold group-hover:text-amber-400 transition-colors">Lingophilia</h1>
          </div>
        </div>
        
        <nav className="flex items-center gap-8">
          <button 
            onClick={() => setView('stats')}
            className={`nav-link-effect text-xs uppercase tracking-[0.2em] font-bold transition-colors ${currentView === 'stats' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-100'}`}
          >
            Records
          </button>
        </nav>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 md:py-16">
        {children}
      </main>

      <footer className="md:hidden sticky bottom-0 bg-[#020617]/95 backdrop-blur-xl border-t border-amber-500/10 px-8 py-5 flex justify-around">
        <button onClick={() => setView('home')} className={`transition-all ${currentView === 'home' ? 'text-amber-400 scale-110' : 'text-slate-500'}`}>
          <Home size={22} strokeWidth={2} />
        </button>
        <button onClick={() => setView('quiz')} className={`transition-all ${currentView === 'quiz' ? 'text-amber-400 scale-110' : 'text-slate-500'}`}>
          <BookOpen size={22} strokeWidth={2} />
        </button>
        <button onClick={() => setView('scramble')} className={`transition-all ${currentView === 'scramble' ? 'text-amber-400 scale-110' : 'text-slate-500'}`}>
          <LayoutIcon size={22} strokeWidth={2} />
        </button>
      </footer>
    </div>
  );
};

export default Layout;
