
import React, { useState } from 'react';
import InputForm from './components/InputForm';
import LessonPlanViewer from './components/LessonPlanViewer';
import { FormInputs, GenerationResult } from './types';
import { generateLessonPlan } from './geminiService';

const App: React.FC = () => {
  const [phase, setPhase] = useState<'A' | 'B'>('A');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartGeneration = async (inputs: FormInputs) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateLessonPlan(inputs);
      if (!data || !data.lesson_plan) {
        throw new Error("Dữ liệu nhận được không hợp lệ. Vui lòng thử lại.");
      }
      setResult(data);
      setPhase('B');
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error("Generation Error:", err);
      setError(err.message || 'Có lỗi xảy ra trong quá trình soạn thảo. Thầy/cô hãy thử kiểm tra lại nội dung nhập.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-2xl sticky top-0 z-50 no-print border-b border-blue-400/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-inner">
              <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">MathPlan AI</h1>
              <p className="text-[9px] text-blue-200 uppercase font-bold tracking-widest mt-1 opacity-80">Soạn giáo án 5512 & 3456</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-4">
              <p className="text-[9px] font-bold text-blue-300 uppercase tracking-widest">Model</p>
              <p className="text-xs font-medium text-white">Gemini 3 Pro</p>
            </div>
            
            {phase === 'B' && (
              <button 
                onClick={() => setPhase('A')}
                className="text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/20 transition-all active:scale-95"
              >
                Tạo mới
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        {error && (
          <div className="max-w-4xl mx-auto mb-8 bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-lg flex items-center gap-4 animate-shake" role="alert">
            <div className="bg-red-200 p-2 rounded-full flex-shrink-0">
               <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <strong className="font-black text-lg">Thông báo lỗi: </strong>
              <span className="block text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {phase === 'A' ? (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Soạn giáo án với Gemini 3 Pro</h2>
              <p className="text-slate-600 max-w-2xl mx-auto font-medium">
                Cung cấp thông tin bài học để AI thiết kế kế hoạch dạy học chi tiết, bám sát chuyên môn và công nghệ số.
              </p>
            </div>
            <InputForm onSubmit={handleStartGeneration} isLoading={isLoading} />
          </div>
        ) : (
          result && <LessonPlanViewer data={result} />
        )}
      </main>

      <footer className="bg-white py-10 border-t border-slate-200 mt-auto no-print">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-black text-slate-800 text-lg uppercase tracking-tight">MathPlan AI 2025</p>
            <p className="text-slate-500 text-xs mt-1 italic">Tuân thủ Công văn 5512 và 3456/BGDĐT-GDPT</p>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">v3.0 Pro Powered</p>
          </div>
        </div>
      </footer>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .lesson-document { width: 100% !important; margin: 0 !important; box-shadow: none !important; }
          @page { size: A4; margin: 0; }
        }
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-shake { animation: shake 0.5s linear; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default App;
