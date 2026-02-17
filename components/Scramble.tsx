
import React, { useState, useEffect } from 'react';
import { GripVertical, CheckCircle, RefreshCcw, Info, Globe, Loader2, Sparkles, AlertCircle, Home } from 'lucide-react';
import { AcademicPassage, ScramblePart } from '../types';
import { fetchAcademicPassage } from '../services/geminiService';

interface ScrambleProps {
  onHome?: () => void;
}

const Scramble: React.FC<ScrambleProps> = ({ onHome }) => {
  const [passage, setPassage] = useState<AcademicPassage | null>(null);
  const [items, setItems] = useState<ScramblePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const loadPassage = async () => {
    setLoading(true);
    setError(null);
    setChecked(false);
    setScore(null);
    setShowExplanation(false);
    try {
      const data = await fetchAcademicPassage();
      setPassage(data);
      const shuffled = [...data.parts].sort(() => Math.random() - 0.5);
      setItems(shuffled);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("429") || err.message?.includes("RESOURCE_EXHAUSTED")) {
        setError("APIの利用制限に達しました。しばらく待ってから再度お試しください。");
      } else {
        setError("パッセージの取得中にエラーが発生しました。接続を確認してください。");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPassage();
  }, []);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleCheck = () => {
    if (!passage) return;
    let correctCount = 0;
    items.forEach((item, index) => {
      if (item.id === passage.parts[index].id) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / passage.parts.length) * 100);
    setScore(finalScore);
    setChecked(true);

    const savedStats = JSON.parse(localStorage.getItem('lv_stats') || '{"quizScore": 0, "quizzesCompleted": 0, "scrambleCompleted": 0}');
    localStorage.setItem('lv_stats', JSON.stringify({
      ...savedStats,
      scrambleCompleted: savedStats.scrambleCompleted + 1
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-amber-500" size={48} />
        <p className="text-slate-400 font-serif italic">学術的な文脈を構成中...</p>
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
          <button onClick={loadPassage} className="flex-1 px-6 py-3 bg-slate-100 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2">
            <RefreshCcw size={18} /> 再試行
          </button>
        </div>
      </div>
    );
  }

  if (!passage) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold">Logic & Structure</span>
        <h2 className="text-3xl font-serif font-bold text-slate-100">{passage.topic}</h2>
        <p className="text-slate-400 italic">ドラッグ＆ドロップで論理構成を復元してください</p>
      </div>

      <div className="space-y-3">
        {items.map((part, index) => {
          const isCorrectPos = checked && passage.parts[index].id === part.id;
          const isWrongPos = checked && !isCorrectPos;

          return (
            <div
              key={part.id}
              draggable={!checked}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-start gap-4 p-4 glass-card rounded-xl border-l-4 transition-all duration-300 ${
                checked ? (isCorrectPos ? 'border-emerald-500 bg-emerald-500/5' : 'border-rose-500 bg-rose-500/5') : 'border-slate-700 hover:border-amber-500 cursor-grab active:cursor-grabbing'
              } ${draggedIndex === index ? 'opacity-40' : ''}`}
            >
              {!checked && <GripVertical className="text-slate-600 mt-1 flex-shrink-0" size={18} />}
              <div className="flex-1">
                <p className="text-slate-200 leading-relaxed">{part.text}</p>
              </div>
              {checked && isCorrectPos && <CheckCircle className="text-emerald-500 flex-shrink-0" size={20} />}
              {checked && isWrongPos && <AlertCircle className="text-rose-500 flex-shrink-0" size={20} />}
            </div>
          );
        })}
      </div>

      {!checked ? (
        <button
          onClick={handleCheck}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-4 rounded-xl transition-all active:scale-95 shadow-xl shadow-amber-500/10"
        >
          論理構造を検証する
        </button>
      ) : (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="text-center py-6 glass-card rounded-2xl border border-slate-700">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Logical Precision</div>
            <div className={`text-6xl font-serif font-bold ${score === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {score}%
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
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center justify-center gap-2 p-4 glass-card border-slate-700 hover:border-slate-500 rounded-xl transition-colors font-bold"
            >
              <Info size={20} /> 解析を表示
            </button>
            <button
              onClick={loadPassage}
              className="flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-900 hover:bg-white rounded-xl transition-colors font-bold shadow-lg"
            >
              <RefreshCcw size={20} /> 次の文章へ
            </button>
          </div>

          {showExplanation && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="glass-card p-6 rounded-2xl border border-slate-700 space-y-4">
                <h3 className="flex items-center gap-2 text-xl font-serif font-bold text-amber-500">
                  <Sparkles size={18} /> 文脈の解析
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {passage.explanation}
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-slate-700 space-y-4">
                <h3 className="flex items-center gap-2 text-xl font-serif font-bold text-slate-300">
                  <Globe size={18} /> 日本語訳
                </h3>
                <p className="text-slate-400 leading-relaxed italic">
                  {passage.translation}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scramble;
