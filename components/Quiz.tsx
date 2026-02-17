
import React, { useState, useEffect } from 'react';
import { Check, X, ArrowRight, Loader2, Home, AlertCircle, RefreshCcw, Sparkles } from 'lucide-react';
import { QuizQuestion } from '../types';
import { fetchQuizQuestion } from '../services/geminiService';

interface QuizProps {
  onHome?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ onHome }) => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const loadQuestion = async () => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
    try {
      const data = await fetchQuizQuestion();
      setQuestion(data);
    } catch (err: any) {
      console.error(err);
      setError("問題の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, []);

  const handleSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const correct = option === question?.correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    const savedStats = JSON.parse(localStorage.getItem('lv_stats') || '{"quizScore": 0, "quizzesCompleted": 0, "scrambleCompleted": 0}');
    localStorage.setItem('lv_stats', JSON.stringify({
      ...savedStats,
      quizScore: savedStats.quizScore + (correct ? 1 : 0),
      quizzesCompleted: savedStats.quizzesCompleted + 1
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-10 fade-up">
        <Loader2 className="animate-spin text-amber-500" size={40} />
        <p className="text-amber-500/80 font-serif italic text-lg tracking-[0.3em]">Preparing Inquiry...</p>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-8 text-center fade-up">
        <AlertCircle className="text-rose-500" size={40} />
        <p className="text-slate-400 font-academic">{error}</p>
        <button onClick={loadQuestion} className="text-xs uppercase tracking-widest text-amber-500 border-b border-amber-500/20 pb-1">
          Retry Dissection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-20 fade-up pb-32">
      <div className="text-center space-y-8">
        <div className="text-[10px] uppercase tracking-[0.5em] text-amber-500/60 font-bold">Lexical Inquiry</div>
        <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight italic font-bold text-shadow-elegant">
          {question.word}
        </h2>
        <div className="w-12 h-[1px] bg-amber-500/20 mx-auto"></div>
        <p className="text-slate-300 font-academic text-base md:text-lg font-medium">
          文脈に最も適した意味を以下より選択してください。
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isTargetCorrect = option === question.correctAnswer;
          
          let itemClass = "w-full text-left py-5 px-8 rounded-xl transition-all duration-500 flex items-center justify-between group gold-border ";
          if (!selectedOption) {
            itemClass += "bg-slate-950/40 hover:bg-slate-900 hover:gold-border-focus";
          } else {
            if (isTargetCorrect) itemClass += "bg-emerald-500/10 border-emerald-500/50 text-emerald-100";
            else if (isSelected) itemClass += "bg-rose-500/10 border-rose-500/50 text-rose-100";
            else itemClass += "opacity-10 grayscale pointer-events-none";
          }

          return (
            <button
              key={idx}
              disabled={!!selectedOption}
              onClick={() => handleSelect(option)}
              className={itemClass}
            >
              <span className="text-sm md:text-base font-academic font-medium tracking-wide leading-relaxed">
                {option}
              </span>
              <div className="shrink-0 ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                {selectedOption && isTargetCorrect && <Check className="text-emerald-500" size={20} />}
                {selectedOption && isSelected && !isTargetCorrect && <X className="text-rose-500" size={20} />}
                {!selectedOption && <ArrowRight size={16} className="text-amber-500/60" />}
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="space-y-16 fade-up max-w-2xl mx-auto">
          <div className="pt-20 space-y-12 border-t border-amber-500/10">
            <h3 className="flex items-center justify-center gap-3 text-center text-xs uppercase tracking-[0.4em] text-amber-500 font-bold">
              <Sparkles size={16} /> Etymological Anatomy
            </h3>
            
            <div className="flex justify-center gap-12 text-center">
              {[
                { label: 'Prefix', value: question.etymology.prefix },
                { label: 'Root', value: question.etymology.root },
                { label: 'Suffix', value: question.etymology.suffix }
              ].map((item) => (
                item.value && (
                  <div key={item.label} className="space-y-2">
                    <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">{item.label}</div>
                    <div className="text-2xl font-serif italic text-amber-200 font-bold">{item.value}</div>
                  </div>
                )
              ))}
            </div>

            <div className="bg-slate-950 p-10 rounded-3xl gold-border-focus space-y-8">
              <p className="text-slate-200 leading-relaxed text-lg font-academic font-medium italic">
                {question.etymology.explanation}
              </p>
              
              <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="text-[10px] uppercase tracking-widest text-amber-500/40 font-bold">Related Words</div>
                <div className="flex flex-wrap gap-4">
                  {question.familyWords.map((family, idx) => (
                    <div key={idx} className="group relative">
                      <span className="px-5 py-2.5 bg-slate-900 rounded-lg text-sm font-serif italic text-amber-200 border border-amber-500/10 transition-all hover:bg-amber-500 hover:text-slate-950">
                        {family.word}
                      </span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 bg-slate-950 gold-border rounded-xl text-[12px] opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                        <p className="text-slate-300 font-academic leading-relaxed">{family.meaning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 flex justify-center gap-10 items-center">
            <button
              onClick={onHome}
              className="text-[11px] uppercase tracking-widest text-slate-500 hover:text-amber-500 transition-colors font-bold"
            >
              Dashboard
            </button>
            <button
              onClick={loadQuestion}
              className="px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-sm font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/20 flex items-center gap-3"
            >
              Next Word <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
