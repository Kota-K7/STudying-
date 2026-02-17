
import React, { useState, useEffect } from 'react';
import { Check, X, ArrowRight, Share2, Sparkles, Loader2, Home, AlertCircle, RefreshCcw } from 'lucide-react';
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
      if (err.message?.includes("429") || err.message?.includes("RESOURCE_EXHAUSTED")) {
        setError("APIの利用制限に達しました。しばらく待ってから再度お試しください。");
      } else {
        setError("問題の取得中にエラーが発生しました。接続を確認してください。");
      }
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

  const handleShare = () => {
    const text = `Linguist Vibeで「${question?.word}」を解剖。系譜を辿り、深淵へ。 🚀 #LinguistVibe #Academic`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-amber-500" size={48} />
        <p className="text-slate-400 font-serif italic">言語の構成要素を解剖中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 animate-in fade-in duration-500 max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold font-serif">通信エラー</h3>
          <p className="text-slate-400 leading-relaxed">{error}</p>
        </div>
        <div className="flex gap-4 w-full">
          <button onClick={onHome} className="flex-1 px-6 py-3 glass-card border-slate-700 rounded-xl font-bold text-slate-300">
            ホームへ
          </button>
          <button onClick={loadQuestion} className="flex-1 px-6 py-3 bg-slate-100 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2">
            <RefreshCcw size={18} /> 再試行
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold">Etymology Challenge</span>
        <h2 className="text-5xl font-serif font-bold text-slate-100">{question.word}</h2>
        <p className="text-slate-400 italic">最も適切な定義を選択してください</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isTargetCorrect = option === question.correctAnswer;
          
          let btnClass = "p-5 glass-card rounded-xl text-left transition-all duration-300 border-l-4 ";
          if (!selectedOption) {
            btnClass += "hover:bg-slate-800 border-slate-700 hover:border-amber-500";
          } else {
            if (isTargetCorrect) btnClass += "bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/50";
            else if (isSelected && !isTargetCorrect) btnClass += "bg-rose-500/10 border-rose-500 text-rose-400 ring-1 ring-rose-500/50";
            else btnClass += "opacity-50 border-slate-800";
          }

          return (
            <button
              key={idx}
              disabled={!!selectedOption}
              onClick={() => handleSelect(option)}
              className={btnClass}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-base md:text-lg leading-snug">{option}</span>
                <div className="flex-shrink-0 mt-1">
                  {selectedOption && isTargetCorrect && <Check size={18} />}
                  {selectedOption && isSelected && !isTargetCorrect && <X size={18} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="glass-card rounded-2xl p-8 border border-slate-700">
            <h3 className="flex items-center gap-2 text-xl font-serif font-bold text-amber-500 mb-6">
              <Sparkles size={20} />
              語源の解剖
            </h3>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {question.etymology.prefix && (
                <div className="flex-1 min-w-[100px] p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Prefix</div>
                  <div className="text-lg font-bold text-amber-200">{question.etymology.prefix}</div>
                </div>
              )}
              {question.etymology.root && (
                <div className="flex-1 min-w-[100px] p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Root</div>
                  <div className="text-lg font-bold text-amber-200">{question.etymology.root}</div>
                </div>
              )}
              {question.etymology.suffix && (
                <div className="flex-1 min-w-[100px] p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Suffix</div>
                  <div className="text-lg font-bold text-amber-200">{question.etymology.suffix}</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed text-lg">
                {question.etymology.explanation}
              </p>
              
              <div className="pt-6 border-t border-slate-800">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">同じ語源を持つ仲間</h4>
                <div className="flex flex-wrap gap-3">
                  {question.familyWords.map((family, idx) => (
                    <div key={idx} className="group relative">
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-sm border border-slate-700 cursor-help hover:border-amber-500 transition-colors">
                        {family.word}
                      </span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-2xl">
                        {family.meaning}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={onHome}
              className="flex items-center justify-center gap-2 p-4 glass-card border-slate-700 hover:border-slate-500 rounded-xl transition-colors font-bold text-slate-300"
            >
              <Home size={20} /> ホームへ
            </button>
            <button
              onClick={loadQuestion}
              className="sm:col-span-2 flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
            >
              次の単語へ <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              <Share2 size={16} /> 成果を記録する
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
